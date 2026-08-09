# Enterprise Resilience Lab

The Operations page now includes a deterministic resilience lab for degraded enterprise AI dependencies. It runs inside the existing authenticated `/ops` surface, which is already guarded by the `system.debug.view` permission.

## Scenarios

### RAG unavailable

- visible page context remains inspectable
- trusted retrieval fails
- citation rendering is blocked
- tool execution is blocked
- no grounded answer is claimed

### Tool denied by policy

- the planned tool remains visible
- the server-side authorization decision is shown as authoritative
- the frontend cannot override the denial
- execution remains blocked

### Approval rejected

- grounded plan remains visible
- human rejection is explicit
- the execution state remains blocked
- the UI states that nothing executed

### Browser worker timeout

- browser/Playwright dispatch is visible
- deterministic timeout marks the attempt failed
- available logs/evidence can remain degraded but inspectable
- retry is a new bounded attempt rather than an invented success

### Provider timeout

- the model request starts normally
- deterministic timeout produces an explicit failed state
- no completed assistant message is emitted
- safe user/context state remains usable for retry

### Readiness dependency degraded

- all dependency checks stay visible
- one check is deliberately degraded
- aggregated readiness cannot report fully ready
- the workspace communicates reduced confidence rather than hiding degradation

## Governance boundary

The lab is a frontend deterministic fixture, not a replacement for NestJS authorization. The server remains authoritative for:

- role/permission checks
- tool allowlists and execution
- approval enforcement
- provider credentials and calls
- browser worker dispatch
- readiness aggregation
- audit logging

## Validation

Run the existing frontend checks:

```bash
npm test
npm run typecheck
npm run build
```

The scenario spec covers all six deterministic failure cases and verifies blocked/degraded terminal states.

## Recruiter walkthrough

1. Open Operations.
2. Scroll to **Deterministic enterprise failure lab**.
3. Show **RAG unavailable** and point out blocked citations/tool execution.
4. Show **Tool denied by policy** and highlight the server-authoritative explanation.
5. Show **Approval rejected** and verify the UI never claims success.
6. Show **Browser worker timeout** and the retained evidence state.
7. Show **Provider timeout** and explicit retryability.
8. Show **Readiness dependency degraded** and the non-ready aggregate state.
