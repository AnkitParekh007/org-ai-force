# Public Proof Review Path

`Org AI Force` is the enterprise-operation layer of the portfolio: an Angular 21 workspace plus NestJS orchestration surface for role-aware agents, RAG-ready services, governed tools, approvals, MCP-style integrations, browser workers, pilot readiness, and degraded-dependency operations.

This repository is explicitly a prototype/architecture proof, not a claim of production enterprise adoption.

## 30-second review

![Protected Operations resilience walkthrough](assets/screenshots/org-ai-force-demo.gif)

The animation is deterministic mock-mode public proof: **healthy workspace → tool denied by policy → approval rejected → browser-worker timeout → bounded retry → degraded readiness**. It does not imply public hosting, live provider incidents, or production enterprise adoption.

Then scan the existing screenshots:

- [`workspace.png`](assets/screenshots/workspace.png)
- [`admin-dashboard.png`](assets/screenshots/admin-dashboard.png)
- [`pilot-hub.png`](assets/screenshots/pilot-hub.png)
- [`readiness-report.png`](assets/screenshots/readiness-report.png)
- [`tool-execution-timeline.png`](assets/screenshots/tool-execution-timeline.png)

Then read the resilience rule:

> A frontend may show that a capability exists, but only the backend policy boundary can authorize execution.

The Operations surface includes deterministic degraded scenarios so the workspace can be reviewed when dependencies fail, not only when the demo is healthy.

## 3-minute review

Inspect the six enterprise resilience scenarios:

| Scenario | Expected behavior |
| --- | --- |
| RAG unavailable | answer does not pretend retrieval succeeded; degraded state is explicit |
| tool denied by policy | tool visibility does not become execution permission |
| approval rejected | rejected work remains blocked/non-executed |
| browser worker timeout | browser dependency failure remains visible and recoverable |
| provider timeout | model/provider failure does not become a fabricated completion |
| degraded readiness | operations surface shows partial platform health instead of a binary all-good state |

These scenarios are deterministic and are meant for architecture review, demos, and automated tests.

## 15-minute runnable review

Local Docker path:

```bash
cp .env.docker.example .env
docker compose up --build
```

Frontend development:

```bash
npm install
npm test
npm run typecheck
npm run build
npm start
```

Backend development:

```bash
cd server
npm install
npm run typecheck
npm run build
npm run start:dev
```

Useful review routes:

- `/dashboard`
- `/agents`
- `/admin`
- `/pilot`
- `/pilot/readiness`
- `/agent-readiness`
- `/ops`
- `/mcp-debug`
- `/browser-test-debug`

The resilience lab is embedded in the existing protected Operations surface rather than exposed as an unguarded standalone demo route.

## What this proves

### Enterprise frontend architecture

- role-aware Angular workspace
- agent chat, artifact, approval, tool, readiness, and operations surfaces
- visible runtime state rather than opaque background automation
- protected admin/debug paths

### Agent/application architecture

- NestJS orchestration boundary
- server-side auth/RBAC
- RAG/context services
- governed tool registry and approvals
- MCP-style integrations
- Playwright/browser-worker boundary
- readiness and observability surfaces

### Operational trust

- degraded states are first-class
- backend authorization remains authoritative
- human approvals remain explicit
- browser/provider/retrieval failures are not silently converted to success
- mock/demo behavior is labeled as such

## Completed visual-proof sequence

The checked-in `org-ai-force-demo.gif` follows the final reviewer sequence:

1. healthy workspace context with governed capability visibility;
2. tool denied by backend policy;
3. approval rejection remaining non-executed;
4. browser-worker timeout remaining visibly failed;
5. bounded retry preserving the failed attempt instead of rewriting history;
6. degraded readiness that avoids claiming full platform health.

The asset is deliberately compact for GitHub README loading and keeps **mock-mode** and the backend-authority rule visible inside the animation.

For reproducible protected-route capture guidance, see [`public-proof-capture.md`](public-proof-capture.md).

## CI proof

The repository has PR-triggered CI validating:

- frontend tests
- frontend typecheck
- frontend build
- backend typecheck

This makes the resilience proof reviewable on every change instead of relying on a manual demo only.

## Ecosystem path

This repository is the **enterprise operation/workspace** layer:

[AI Tools Cheatsheets](https://github.com/AnkitParekh007/ai-tools-cheatsheets) → [Frontend AI Patterns](https://github.com/AnkitParekh007/frontend-ai-patterns) → [Angular AI Copilot Starter](https://github.com/AnkitParekh007/angular-ai-copilot-starter) → [ngx-copilot-platform](https://github.com/AnkitParekh007/ngx-copilot-platform) → [Agent Studio](https://github.com/AnkitParekh007/agent-studio) → **Org AI Force**

**Learn → Pattern → Run → Platform → Govern → Operate**
