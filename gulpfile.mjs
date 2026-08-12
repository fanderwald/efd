'use strict';

import yargs         from 'yargs';
import browser       from 'browser-sync';
import gulp          from 'gulp';
import { rimraf }    from 'rimraf';
import yaml          from 'js-yaml';
import fs            from 'fs';
import dateFormat    from 'dateformat';
import webpackStream from 'webpack-stream';
import webpack2      from 'webpack';
import named         from 'vinyl-named';
import log           from 'fancy-log';
import colors        from 'ansi-colors';
import gulpSassFactory      from 'gulp-sass';
import cleanCSS      from 'gulp-clean-css';
import gulpIf        from 'gulp-if';
import uglify        from 'gulp-uglify';
import phpcs         from 'gulp-phpcs';
import rev           from 'gulp-rev';
import zip           from 'gulp-zip';
import * as dartSass from 'sass'; 
import postcss       from 'gulp-postcss';
import autoprefixer  from 'autoprefixer';
import path          from 'path'; 
import { globSync }  from 'glob';
import lighthouse    from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import sassGlob from 'gulp-sass-glob';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';


const sass = gulpSassFactory(dartSass);

// Check for --production flag
const argv = yargs(process.argv.slice(2)).parseSync();
const PRODUCTION = !!(argv.production);

// Check for --development flag unminified with sourcemaps
const DEV = !!(argv.dev);

// Load settings from settings.yml
const { BROWSERSYNC, COMPATIBILITY, REVISIONING, PATHS } = loadConfig();

// Check if file exists synchronously
function checkFileExists(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch(e) {
    flag = false;
  }
  return flag;
}

// Load default or custom YML config file
function loadConfig() {
  log('Loading config file...');

  if (checkFileExists('config.yml')) {
    // config.yml exists, load it
    log(colors.bold(colors.cyan('config.yml')), 'exists, loading', colors.bold(colors.cyan('config.yml')));
    let ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);

  } else if(checkFileExists('config-default.yml')) {
    // config-default.yml exists, load it
    log(colors.bold(colors.cyan('config.yml')), 'does not exist, loading', colors.bold(colors.cyan('config-default.yml')));
    let ymlFile = fs.readFileSync('config-default.yml', 'utf8');
    return yaml.load(ymlFile);

  } else {
    // Exit if config.yml & config-default.yml do not exist
    log('Exiting process, no config file exists.');
    log('Error Code:', err.code);
    process.exit(1);
  }
}

// Delete the "dist" folder
// This happens every time a build starts
export function clean(done) {
  rimraf(PATHS.dist).then(() => done());
}

// Copy files out of the assets folder
// This task skips over the "images", "js", and "scss" folders, which are parsed separately
export function copy() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist + '/assets'));
}



// Compile Sass into CSS
// In production, the CSS is compressed
export function sassTask() {
  return gulp.src(['src/assets/scss/app.scss', 'src/assets/scss/editor.scss'], { sourcemaps: !PRODUCTION })
    //.pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: PATHS.sass,
      silenceDeprecations: ['global-builtin', 'import','if-function']
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      overrideBrowserslist: COMPATIBILITY
    })]))
    .pipe(cleanCSS())
    .pipe(gulpIf(REVISIONING, rev()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css', { sourcemaps: '.' }))
    .pipe(gulpIf(REVISIONING, rev.manifest()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
    .pipe(browser.reload({ stream: true }));
}


export { sassTask as sass };

// Combine JavaScript into one file
// In production, the file is minified
const webpack = {
  config: {
    plugins: [
      ...(REVISIONING
        ? [
            new WebpackManifestPlugin({
              fileName: 'rev-manifest.json',
              publicPath: '',
              filter: (file) => file.isInitial && file.name.endsWith('.js'),
            }),
          ]
        : []),
    ],
    module: {
      rules: [
        {
          test: /.js$/,
          loader: 'babel-loader',
          exclude: /node_modules(?![\\\/]foundation-sites)/,
        },
      ],
    },
    mode: 'development', // or 'production'
    externals: {
      jquery: 'jQuery',
    },
    output: {
      filename: REVISIONING ? '[name]-[contenthash:8].js' : '[name].js',
      chunkFilename: REVISIONING ? '[id]-[contenthash:8].js' : '[id].js',
    },
    optimization: {
      chunkIds: 'named', // Use descriptive names instead of numbers
    },
    
  },

  changeHandler(err, stats) {
    log('[webpack]', stats.toString({
      colors: true,
    }));

    browser.reload();
  },

  build() {
    const buildConfig = Object.assign({}, webpack.config, {
      mode: 'production',
      devtool: false, // This is the kill-switch for the 400KB bloat
    });
    return gulp.src(PATHS.entries)
      .pipe(named())
      .pipe(webpackStream(buildConfig, webpack2))
      .pipe(gulp.dest(PATHS.dist + '/assets/js'))
  },

  watch() {
    const watchConfig = Object.assign(webpack.config, {
      watch: true,
      devtool: 'source-map',
    });

    return gulp.src(PATHS.entries)
      .pipe(named())
      .pipe(webpackStream(watchConfig, webpack2, webpack.changeHandler)
        .on('error', (err) => {
          log('[webpack:error]', err.toString({
            colors: true,
          }));
        }),
      )
      .pipe(gulp.dest(PATHS.dist + '/assets/js'));
  },
};

gulp.task('webpack:build', webpack.build);
gulp.task('webpack:watch', webpack.watch);



function images(done) {
  const sourceDir = 'src/assets/images';
  const targetDir = path.join(PATHS.dist, 'assets/images');

  const files = globSync(`${sourceDir}/**/*.{png,jpg,jpeg,gif,svg}`);

  for (const file of files) {
    const relativePath = path.relative(sourceDir, file);
    const destPath = path.join(targetDir, relativePath);

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(file, destPath);
    console.log('Copied image:', relativePath);
  }

  done();
}


// Create a .zip archive of the theme
function archive() {
  var time = dateFormat(new Date(), "yyyy-mm-dd_HH-MM");
  var pkg = JSON.parse(fs.readFileSync('./package.json'));
  var title = pkg.name + '_' + time + '.zip';

  return gulp.src(PATHS.package)
    .pipe(zip(title))
    .pipe(gulp.dest('packaged'));
}

// PHP Code Sniffer task
gulp.task('phpcs', function() {
  return gulp.src(PATHS.phpcs)
    .pipe(phpcs({
      bin: 'wpcs/vendor/bin/phpcs',
      standard: './codesniffer.ruleset.xml',
      showSniffCode: true,
    }))
    .pipe(phpcs.reporter('log'));
});


// Start BrowserSync to preview the site in
function server(done) {
  browser.init({
    proxy: BROWSERSYNC.url,

    ui: {
      port: 8080
    },

  });
  done();
}

// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

// Watch for changes to static assets, pages, Sass, Twig, Theme.json, and JavaScript
function watch() {
  gulp.watch(PATHS.assets, copy);
  gulp.watch('src/assets/scss/**/*.scss', sassTask)
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));
  gulp.watch('blocks/**/*.scss', sassTask)
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));
  gulp.watch('**/*.php', reload)
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));
  gulp.watch('**/*.twig', reload)
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));
  gulp.watch('src/assets/images/**/*', gulp.series(images, reload));
  gulp.watch('theme.json',gulp.series(syncThemeJson, reload));
}

/**
 * NEW: Lighthouse Audit Task
 * This runs a headless Chrome instance to audit the local URL defined in your config.
 */
async function auditTask() {
  log('Starting ' + colors.bold(colors.magenta('Lighthouse')) + ' audit on ' + colors.cyan(BROWSERSYNC.url));

  const chrome = await chromeLauncher.launch({ 
    chromeFlags: [
      '--headless',
      '--no-sandbox', 
      '--disable-gpu', 
      '--disable-dev-shm-usage',
      '--autoplay-policy=no-user-gesture-required' // Crucial for background video audits
    ] 
  });
  
  const options = {
  logLevel: 'silent', // Keep it quiet
  output: 'json',
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  port: chrome.port,
  // ADD THESE:
  throttlingMethod: 'provided', // Use the actual speed of your machine/network
  formFactor: 'desktop',        // If you want to match your 0.9s manual desktop test
  screenEmulation: {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
  }
};

  const runnerResult = await lighthouse(BROWSERSYNC.url, options);
  await chrome.kill();

  const report = runnerResult.lhr.categories;
  const audits = runnerResult.lhr.audits;

  // Extract specific metrics
  const lcp = audits['largest-contentful-paint'].displayValue;
  const cls = audits['cumulative-layout-shift'].displayValue;
  const tbt = audits['total-blocking-time'].displayValue;
  const fcp = audits['first-contentful-paint'].displayValue;
  
  log(colors.bold('Lighthouse Scores:'));
  log(colors.green('Performance:    ') + (report.performance.score * 100));
  log(colors.green('Accessibility:  ') + (report.accessibility.score * 100));
  log(colors.green('Best Practices: ') + (report['best-practices'].score * 100));
  log(colors.green('SEO:            ') + (report.seo.score * 100));

  log(colors.bold('Core Web Vitals:'));
  log(colors.green('LCP: ') + colors.cyan(lcp) + ' (Main content loaded)');
  log(colors.green('FCP: ') + colors.cyan(fcp) + ' (First pixel rendered)');
  log(colors.green('TBT: ') + colors.cyan(tbt) + ' (Input delay/JS load)');
  log(colors.green('CLS: ') + colors.cyan(cls) + ' (Visual stability)');

  // High-Quality Gate: Fail the build if accessibility or performance is too low
  // if (PRODUCTION && (report.accessibility.score < 0.90 || report.performance.score < 0.80)) {
  //   throw new Error(colors.red('Lighthouse scores too low for production build! Check assets and a11y.'));
  //}
}

/**
 * NEW: Sync theme.json palette to Sass
 */
async function syncThemeJson(done) {
  const themeJson = JSON.parse(fs.readFileSync('./theme.json', 'utf8'));
  const palette = themeJson.settings?.color?.palette || [];
  
  let sassContent = '// This file is auto-generated from theme.json\n';
  sassContent += '$foundation-palette: (\n';
  
  palette.forEach((color) => {
    // We use the CSS variable so the browser handles the live updates
    sassContent += `  ${color.slug}: var(--wp--preset--color--${color.slug}),\n`;
  });
  
  sassContent += ');\n';
  
  fs.writeFileSync('src/assets/scss/global/_colors.scss', sassContent);
  log(colors.green('✔ theme.json palette synced to Sass'));
  done();
}

export { syncThemeJson as sync };

// Build the "dist" folder by running all of the below tasks
//gulp.task('build',
//  gulp.series(clean, gulp.parallel(sass, webpack.build, images, copy)));

// Define the build task using gulp.series and gulp.parallel
export const build = gulp.series(clean, syncThemeJson, gulp.parallel(sassTask, webpack.build, images, copy),auditTask);
export const audit = auditTask;

export const watchTask  = gulp.series(build, webpack.watch);
export const packageTask = gulp.series(build, auditTask, archive);
export const defaultTask = gulp.series(build, server, gulp.parallel(webpack.watch, watch));
export { defaultTask as default };

// Build the site, run the server, and watch for file changes
//gulp.task('default',
//  gulp.series('build', server, gulp.parallel(webpack.watch, watch)));

// Package task
//gulp.task('package',
//  gulp.series('build', archive));
