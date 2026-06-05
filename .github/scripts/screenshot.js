const { chromium } = require('playwright');
const fs = require('fs');

const url = process.argv[2] || 'http://localhost:3000';
const outDir = '.github/screenshot';

async function waitForUp(url, retries = 30, interval = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res && (res.status === 200 || res.status === 302 || res.status === 301)) return true;
    } catch (e) {}
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error('Server did not respond in time: ' + url);
}

(async () => {
  try {
    await waitForUp(url);

    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle' });
    await fs.promises.mkdir(outDir, { recursive: true });
    const filepath = `${outDir}/screenshot.png`;
    await page.screenshot({ path: filepath, fullPage: true });
    await browser.close();
    console.log('Saved screenshot to', filepath);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
})();
