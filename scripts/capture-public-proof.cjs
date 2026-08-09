const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseUrl = process.env.CAPTURE_BASE_URL || 'http://localhost:4200/';
const outputDir = process.env.CAPTURE_OUTPUT_DIR || path.join(process.cwd(), 'public-proof-captures');
const storageState = process.env.CAPTURE_STORAGE_STATE;
fs.mkdirSync(outputDir, { recursive: true });

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

  async function open(name, route) {
    const requestedUrl = new URL(route.replace(/^\//, ''), baseUrl).toString();
    const response = await page.goto(requestedUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1000);
    const redirectedToLogin = /login/i.test(page.url());
    if (redirectedToLogin) throw new Error(`${route} redirected to login; protected proof was not captured`);
    return { name, requestedUrl, response };
  }

  async function screenshot(name, requestedUrl, response) {
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

  async function captureRoute(name, route) {
    const opened = await open(name, route);
    await screenshot(name, opened.requestedUrl, opened.response);
  }

  async function captureOpsScenario(name, matcher, retry = false) {
    const opened = await open(name, '/ops');
    const control = page.getByRole('button', { name: matcher }).first();
    if (!(await control.count())) throw new Error(`No Operations scenario button matched ${matcher}`);
    await control.click();
    await page.waitForTimeout(500);
    if (retry) {
      const retryButton = page.getByRole('button', { name: /run deterministic retry/i }).first();
      if (!(await retryButton.count())) throw new Error('Retry button was not available for retryable Operations scenario');
      await retryButton.click();
      await page.waitForTimeout(350);
    }
    await screenshot(name, opened.requestedUrl, opened.response);
  }

  await captureRoute('workspace', '/dashboard');
  await captureRoute('admin', '/admin');
  await captureOpsScenario('operations-rag-unavailable', /rag unavailable/i);
  await captureOpsScenario('operations-policy-denied', /tool denied by policy/i);
  await captureOpsScenario('operations-approval-rejected', /approval rejected/i);
  await captureOpsScenario('operations-browser-timeout', /browser worker timeout/i);
  await captureOpsScenario('operations-browser-timeout-retry', /browser worker timeout/i, true);
  await captureRoute('readiness', '/agent-readiness');

  fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
