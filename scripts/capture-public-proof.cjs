const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseUrl = process.env.CAPTURE_BASE_URL || 'http://localhost:4200/';
const outputDir = process.env.CAPTURE_OUTPUT_DIR || path.join(process.cwd(), 'public-proof-captures');
const storageState = process.env.CAPTURE_STORAGE_STATE;
fs.mkdirSync(outputDir, { recursive: true });

const routes = [
  ['workspace', '/dashboard'],
  ['agents', '/agents'],
  ['admin', '/admin'],
  ['pilot', '/pilot'],
  ['readiness', '/agent-readiness'],
  ['operations-resilience', '/ops'],
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
    ...(storageState ? { storageState } : {}),
  });
  const page = await context.newPage();
  const manifest = [];

  for (const [name, route] of routes) {
    const requestedUrl = new URL(route.replace(/^\//, ''), baseUrl).toString();
    const response = await page.goto(requestedUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1000);
    const file = path.join(outputDir, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    manifest.push({
      name,
      file: path.basename(file),
      requestedUrl,
      finalUrl: page.url(),
      status: response ? response.status() : null,
      redirectedToLogin: /login/i.test(page.url()),
    });
  }

  fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
