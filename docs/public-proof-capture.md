# Public Proof Capture Harness

Wave 3B.2 uses a repeatable Playwright capture harness instead of treating screenshots as one-off manual artifacts.

This repository intentionally does **not** claim a public hosted application. Run the capture harness against a local development or Docker frontend after authentication.

## Capture prerequisites

1. Start Org AI Force locally and verify the workspace is usable.
2. Authenticate with a development/demo user that is allowed to view the surfaces you intend to capture.
3. Save a Playwright-compatible browser storage state to a local JSON file if authentication is required.
4. Install Playwright in an isolated temporary directory so the repository lockfile does not change.

Example:

```bash
mkdir -p /tmp/public-proof-playwright
cd /tmp/public-proof-playwright
npm init -y
npm install --no-audit --no-fund playwright@1.54.2
npx playwright install chromium

cd /path/to/org-ai-force
NODE_PATH=/tmp/public-proof-playwright/node_modules \
CAPTURE_BASE_URL=http://localhost:4200/ \
CAPTURE_STORAGE_STATE=/path/to/auth-storage-state.json \
CAPTURE_OUTPUT_DIR=public-proof-captures \
node scripts/capture-public-proof.cjs
```

For the Docker frontend, use `CAPTURE_BASE_URL=http://localhost:8080/`.

## Captured surfaces

The harness requests:

- `/dashboard`
- `/agents`
- `/admin`
- `/pilot`
- `/agent-readiness`
- `/ops`

It writes a `manifest.json` alongside the screenshots. The manifest records the requested URL, final URL, HTTP status, and whether the route redirected to login. A redirected capture should **not** be used as proof that the protected surface was captured successfully.

## Resilience asset acceptance

Issue #12 should ultimately produce `docs/assets/screenshots/org-ai-force-demo.gif` or a clearly named replacement that shows:

1. healthy workspace/admin context;
2. governed tool or approval state;
3. the Operations resilience surface;
4. one deterministic dependency failure;
5. an explicit blocked/degraded state;
6. retry or readiness recovery.

Keep mock/prototype boundaries visible in the final asset. Frontend visibility must never be presented as execution authorization.
