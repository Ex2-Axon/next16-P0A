const { chromium } = require('playwright');
const { resolve } = require('path');
const { existsSync, mkdirSync } = require('fs');

(async () => {
  const repoRoot = resolve(__dirname, '..');
  const outIndex = resolve(repoRoot, 'out', 'index.html');

  if (!existsSync(outIndex)) {
    console.error('Missing build output:', outIndex);
    process.exit(1);
  }

  mkdirSync(resolve(repoRoot, '.github', 'screenshot'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const outUrl = `file:///${outIndex.replace(/\\/g, '/')}`;
  await page.goto(outUrl);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: resolve(repoRoot, '.github', 'screenshot', 'homepage.png'), fullPage: false });
  await browser.close();
  console.log('Saved screenshot to', resolve(repoRoot, '.github', 'screenshot'));
})();
