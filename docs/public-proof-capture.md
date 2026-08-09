# Public Proof Capture Harness

Wave 3B.2 uses a repeatable Playwright capture harness instead of treating screenshots as one-off manual artifacts.

This repository intentionally does **not** claim a public hosted application. Run the capture harness against a local development or Docker frontend after authentication, or use the CI-safe mock-agent mode described below.

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

## CI-safe deterministic capture

The final Wave 3B.2 proof job uses the repository's **existing** `enableMockAgents` development guard bypass only inside the ephemeral CI workspace. It never changes the committed production/default environment value and does not create a public authentication exception.

The CI job starts the exact Angular branch on localhost, captures the protected `/ops` UI, records final URLs in `manifest.json`, and fails if a requested protected route redirects to `/login`. This gives the final recruiter asset a reproducible trust boundary without hosting the enterprise prototype publicly.

## Captured surfaces

The harness captures or validates:

- `/dashboard`
- `/admin`
- `/agent-readiness`
- `/ops`
- deterministic Operations states for policy denial, approval rejection, browser-worker timeout, and retry

It writes a `manifest.json` alongside the screenshots. The manifest records the requested URL, final URL, HTTP status, and whether the route redirected to login. A redirected capture should **not** be used as proof that the protected surface was captured successfully.

## Resilience asset acceptance

Issue #12 should ultimately produce `docs/assets/screenshots/org-ai-force-demo.gif` showing:

1. healthy workspace context;
2. governed tool or approval state;
3. the Operations resilience surface;
4. an explicit deterministic failure;
5. a blocked/degraded state that remains truthful;
6. retry/readiness recovery.

Keep mock/prototype boundaries visible in the final asset. Frontend visibility must never be presented as execution authorization.
