const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseUrl = process.env.CAPTURE_BASE_URL || 'http://localhost:4200/';
const outputDir = process.env.CAPTURE_OUTPUT_DIR || path.join(process.cwd(), 'public-proof-captures');
const storageState = process.env.CAPTURE_STORAGE_STATE;
const viewport = { width: 1440, height: 900 };
fs.mkdirSync(outputDir, { recursive: true });
let browser;

(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport, colorScheme: 'light', reducedMotion: 'reduce', ...(storageState ? { storageState } : {}) });
  const page = await context.newPage();
  const manifest = [];

  async function open(name, route) {
    const requestedUrl = new URL(route.replace(/^\//, ''), baseUrl).toString();
    const response = await page.goto(requestedUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(700);
    if (/login/i.test(page.url())) throw new Error(`${route} redirected to login; protected proof was not captured`);
    return { name, requestedUrl, response };
  }

  async function screenshot(name, requestedUrl, response) {
    const file = path.join(outputDir, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    manifest.push({ name, file: path.basename(file), requestedUrl, finalUrl: page.url(), status: response ? response.status() : null, redirectedToLogin: /login/i.test(page.url()), viewport });
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
    await page.waitForTimeout(300);
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
  await captureOpsScenario('operations-rag-unavailable', /^RAG unavailable/i);
  await captureOpsScenario('operations-policy-denied', /^Tool denied by policy/i);
  await captureOpsScenario('operations-approval-rejected', /^Approval rejected/i);
  await captureOpsScenario('operations-browser-timeout', /^Browser worker timeout/i);
  await captureOpsScenario('operations-browser-timeout-retry', /^Browser worker timeout/i, true);
  await captureRoute('readiness', '/agent-readiness');

  fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
});
