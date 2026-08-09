# Contributing to Org AI Force

Org AI Force is an enterprise agent-workspace architecture proof. Contributions should improve clarity, governance, reliability, accessibility, evaluation or implementation depth without overstating production readiness.

## Start here

Read:

- `ARCHITECTURE_REVIEW.md`
- `ARCHITECTURE_DECISIONS.md`
- `docs/system-architecture.md`
- `docs/security-model.md`

## Validation

For frontend changes:

```bash
npm run build
npm run typecheck
```

For backend changes:

```bash
cd server
npm run build
npm run typecheck
```

Also run the most relevant tests/checks for the area you change.

## Pull request expectations

Explain:

- problem and scope
- role/permission impact
- tool/RAG/browser-worker impact
- implemented vs demo behavior
- failure/recovery behavior
- validation performed
- screenshots for visible changes

## Architecture guardrails

- protected operations remain server-authorized
- visible approvals are backed by policy boundaries
- browser workers are treated as isolated execution surfaces
- citations/results preserve provenance
- mock/demo behavior is labelled explicitly
- new enterprise capabilities include failure and readiness considerations
