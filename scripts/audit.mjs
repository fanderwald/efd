import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

function loadUrl() {
  const configPath = path.resolve(process.cwd(), 'config.yml');
  const configDefaultPath = path.resolve(process.cwd(), 'config-default.yml');

  if (fs.existsSync(configPath)) {
    const doc = yaml.load(fs.readFileSync(configPath, 'utf8'));
    return doc?.BROWSERSYNC?.url || doc?.URL || 'http://localhost';
  }
  if (fs.existsSync(configDefaultPath)) {
    const doc = yaml.load(fs.readFileSync(configDefaultPath, 'utf8'));
    return doc?.BROWSERSYNC?.url || doc?.URL || 'http://localhost';
  }
  return 'http://localhost';
}

async function runAudit() {
  const targetUrl = loadUrl();
  console.log(`\nStarting Lighthouse audit on ${targetUrl}...`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--autoplay-policy=no-user-gesture-required',
    ],
  });

  const options = {
    logLevel: 'silent',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    throttlingMethod: 'provided',
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  };

  try {
    const runnerResult = await lighthouse(targetUrl, options);
    await chrome.kill();

    const report = runnerResult.lhr.categories;
    const audits = runnerResult.lhr.audits;

    const lcp = audits['largest-contentful-paint'].displayValue;
    const cls = audits['cumulative-layout-shift'].displayValue;
    const tbt = audits['total-blocking-time'].displayValue;
    const fcp = audits['first-contentful-paint'].displayValue;

    console.log('\nLighthouse Scores:');
    console.log(`  Performance:    ${Math.round(report.performance.score * 100)}`);
    console.log(`  Accessibility:  ${Math.round(report.accessibility.score * 100)}`);
    console.log(`  Best Practices: ${Math.round(report['best-practices'].score * 100)}`);
    console.log(`  SEO:            ${Math.round(report.seo.score * 100)}`);

    console.log('\nCore Web Vitals:');
    console.log(`  LCP: ${lcp} (Main content loaded)`);
    console.log(`  FCP: ${fcp} (First pixel rendered)`);
    console.log(`  TBT: ${tbt} (Input delay/JS load)`);
    console.log(`  CLS: ${cls} (Visual stability)\n`);
  } catch (error) {
    await chrome.kill();
    console.error('Lighthouse audit failed:', error);
    process.exit(1);
  }
}

runAudit();
