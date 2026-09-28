import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import dateFormat from 'dateformat';

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
const time = dateFormat(new Date(), 'yyyy-mm-dd_HH-MM');
const outputDir = path.resolve(process.cwd(), 'packaged');
const outputZip = path.join(outputDir, `${pkg.name}_${time}.zip`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const output = fs.createWriteStream(outputZip);
const archive = archiver('zip', {
  zlib: { level: 9 },
});

output.on('close', () => {
  console.log(`\n✔ Package created successfully!`);
  console.log(`  File: ${outputZip}`);
  console.log(`  Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\n`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Files and directories to ignore when packaging theme
const ignorePatterns = [
  'node_modules/**',
  'packaged/**',
  'src/**',
  'scripts/**',
  '.git/**',
  '.github/**',
  'codesniffer.ruleset.xml',
  'composer.json',
  'composer.lock',
  'config.yml',
  'config-default.yml',
  'gulpfile.mjs',
  'package.json',
  'package-lock.json',
  'vite.config.mjs',
  'wpcs/**',
];

archive.glob('**/*', {
  cwd: process.cwd(),
  ignore: ignorePatterns,
  dot: false,
});

archive.finalize();
