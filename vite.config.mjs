import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { globSync } from 'glob';
import liveReload from 'vite-plugin-live-reload';
import autoprefixer from 'autoprefixer';
import basicSsl from '@vitejs/plugin-basic-ssl';
import browserSync from 'browser-sync';
import { createProxyMiddleware } from 'http-proxy-middleware';
import yaml from 'js-yaml';

/**
 * Custom Vite Plugin: Sync theme.json palette to SCSS
 */
function syncThemeJsonPlugin() {
  function generateSassPalette() {
    try {
      const themeJsonPath = path.resolve(process.cwd(), 'theme.json');
      if (!fs.existsSync(themeJsonPath)) return;
      const themeJson = JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'));
      const palette = themeJson.settings?.color?.palette || [];

      let sassContent = '// This file is auto-generated from theme.json\n';
      sassContent += '$foundation-palette: (\n';
      palette.forEach((color) => {
        sassContent += `  ${color.slug}: var(--wp--preset--color--${color.slug}),\n`;
      });
      sassContent += ');\n';

      const targetPath = path.resolve(process.cwd(), 'src/assets/scss/global/_colors.scss');
      fs.writeFileSync(targetPath, sassContent);
    } catch (e) {
      console.error('Error generating theme.json palette to Sass:', e);
    }
  }

  return {
    name: 'vite-plugin-sync-theme-json',
    buildStart() {
      generateSassPalette();
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('theme.json')) {
        generateSassPalette();
        // Notify browser to perform a full reload so WordPress and CSS pick up the new tokens
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

/**
 * Custom Vite Plugin: Generate _blocks.scss for native Dart Sass @use/@import
 */
function syncBlockStylesPlugin() {
  function generateBlocksScss() {
    const blocksDir = path.resolve(process.cwd(), 'blocks');
    if (!fs.existsSync(blocksDir)) return;

    const scssFiles = globSync('blocks/**/*.scss', { cwd: process.cwd() });
    let content = '// Auto-generated block styles manifest for Dart Sass\n';
    scssFiles.forEach((relPath) => {
      // Calculate relative path from src/assets/scss to the block scss
      const fromDir = path.resolve(process.cwd(), 'src/assets/scss');
      const targetFile = path.resolve(process.cwd(), relPath);
      let relative = path.relative(fromDir, targetFile).replace(/\\/g, '/');
      if (!relative.startsWith('.')) {
        relative = './' + relative;
      }
      content += `@use "${relative}" as *;\n`;
    });

    const targetFile = path.resolve(process.cwd(), 'src/assets/scss/_blocks.scss');
    fs.writeFileSync(targetFile, content);
  }

  return {
    name: 'vite-plugin-sync-blocks-scss',
    buildStart() {
      generateBlocksScss();
    },
    handleHotUpdate({ file }) {
      if (file.includes('/blocks/') && file.endsWith('.scss')) {
        generateBlocksScss();
      }
    },
  };
}

/**
 * Custom Vite Plugin: Copy static images and assets into dist
 */
function copyStaticAssetsPlugin() {
  function copyDirRecursive(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) return;
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      if (entry.isDirectory()) {
        copyDirRecursive(srcPath, destPath);
      } else {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  return {
    name: 'vite-plugin-copy-static-assets',
    closeBundle() {
      const imagesSrc = path.resolve(process.cwd(), 'src/assets/images');
      const imagesDest = path.resolve(process.cwd(), 'dist/assets/images');
      copyDirRecursive(imagesSrc, imagesDest);

      // Copy fontawesome webfonts if present
      const fontAwesomeWebfonts = path.resolve(process.cwd(), 'fontawesome-kit-e0bf342f83/webfonts');
      const fontsDest = path.resolve(process.cwd(), 'dist/assets/webfonts');
      if (fs.existsSync(fontAwesomeWebfonts)) {
        copyDirRecursive(fontAwesomeWebfonts, fontsDest);
      }
    },
  };
}

/**
 * Custom Vite Plugin: Write `.vite-dev` marker file to dist while dev server is running
 * so PHP knows immediately whether to load HMR or compiled production bundles.
 */
function devServerMarkerPlugin() {
  const markerDir = path.resolve(process.cwd(), 'dist');
  const markerFile = path.join(markerDir, '.vite-dev');

  return {
    name: 'vite-plugin-dev-server-marker',
    configureServer(server) {
      if (!fs.existsSync(markerDir)) {
        fs.mkdirSync(markerDir, { recursive: true });
      }
      fs.writeFileSync(markerFile, JSON.stringify({
        port: server.config.server.port || 5173,
        https: !!server.config.server.https,
        host: 'localhost',
        timestamp: Date.now()
      }));

      const cleanup = () => {
        try {
          if (fs.existsSync(markerFile)) {
            fs.unlinkSync(markerFile);
          }
        } catch (_) {}
      };

      process.on('exit', cleanup);
      process.on('SIGINT', () => { cleanup(); process.exit(); });
      process.on('SIGTERM', () => { cleanup(); process.exit(); });
      process.on('SIGHUP', () => { cleanup(); process.exit(); });
    },
  };
}

/**
 * Custom Vite Plugin: BrowserSync proxy for local & Wi-Fi devices on port 3000
 */
function browserSyncProxyPlugin() {
  let bsInstance = null;

  return {
    name: 'vite-plugin-browsersync-proxy',
    configureServer(server) {
      let targetUrl = 'http://localhost';
      const configPath = path.resolve(process.cwd(), 'config.yml');
      const configDefaultPath = path.resolve(process.cwd(), 'config-default.yml');
      if (fs.existsSync(configPath)) {
        targetUrl = yaml.load(fs.readFileSync(configPath, 'utf8'))?.BROWSERSYNC?.url || targetUrl;
      } else if (fs.existsSync(configDefaultPath)) {
        targetUrl = yaml.load(fs.readFileSync(configDefaultPath, 'utf8'))?.BROWSERSYNC?.url || targetUrl;
      }

      const viteProxy = createProxyMiddleware({
        target: 'https://localhost:5173',
        changeOrigin: true,
        secure: false,
        ws: true,
      });

      bsInstance = browserSync.create();
      bsInstance.init({
        proxy: {
          target: targetUrl,
          proxyReq: [
            (proxyReq, req) => {
              if (req.headers.host) {
                proxyReq.setHeader('x-bs-host', req.headers.host);
              }
            },
          ],
        },
        middleware: [
          (req, res, next) => {
            if (
              req.url.startsWith('/@') ||
              req.url.startsWith('/src/') ||
              req.url.startsWith('/blocks/') ||
              req.url.startsWith('/node_modules/')
            ) {
              return viteProxy(req, res, next);
            }
            return next();
          },
        ],
        port: 3000,
        https: true,
        open: false,
        ui: {
          port: 8080,
        },
        notify: false,
        ghostMode: {
          clicks: true,
          forms: true,
          scroll: true,
        },
      });

      const exitBs = () => {
        if (bsInstance) {
          try { bsInstance.exit(); } catch (_) {}
        }
      };

      server.httpServer?.on('close', exitBs);
      process.on('exit', exitBs);
      process.on('SIGINT', () => { exitBs(); process.exit(); });
    },
  };
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    base: isDev ? '/' : './',
    plugins: [
      basicSsl(),
      browserSyncProxyPlugin(),
      syncThemeJsonPlugin(),
      syncBlockStylesPlugin(),
      copyStaticAssetsPlugin(),
      devServerMarkerPlugin(),
      liveReload([
        path.resolve(process.cwd(), '**/*.php'),
        path.resolve(process.cwd(), '**/*.twig'),
      ]),
    ],
    resolve: {
      alias: {
        jquery: path.resolve(process.cwd(), 'src/assets/js/jquery-global.js'),
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
        ],
      },
      preprocessorOptions: {
        scss: {
          loadPaths: [
            path.resolve(process.cwd(), 'node_modules/foundation-sites/scss'),
          ],
          silenceDeprecations: ['global-builtin', 'import', 'if-function', 'color-functions'],
        },
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      emptyOutDir: true,
      manifest: 'manifest.json', // generates dist/manifest.json (not in a hidden .vite/ folder)
      rollupOptions: {
        input: {
          app: path.resolve(process.cwd(), 'src/assets/js/app.js'),
          'app-style': path.resolve(process.cwd(), 'src/assets/scss/app.scss'),
          'editor-style': path.resolve(process.cwd(), 'src/assets/scss/editor.scss'),
        },
        output: {
          entryFileNames: 'assets/js/[name]-[hash:8].js',
          chunkFileNames: 'assets/js/[name]-[hash:8].js',
          assetFileNames: ({ name }) => {
            if (/\.(css)$/.test(name ?? '')) {
              return 'assets/css/[name]-[hash:8][extname]';
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/.test(name ?? '')) {
              return 'assets/fonts/[name]-[hash:8][extname]';
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name ?? '')) {
              return 'assets/images/[name]-[hash:8][extname]';
            }
            return 'assets/[name]-[hash:8][extname]';
          },
        },
      },
      sourcemap: isDev,
      minify: !isDev,
    },
    server: {
      host: true, // Listen on all network addresses (LAN / Wi-Fi)
      strictPort: true,
      port: 5173,
      cors: {
        origin: '*',
      },
    },
  };
});
