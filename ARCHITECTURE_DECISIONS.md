# Architecture Decision Records — Org AI Force

## ADR-001 — Orchestration belongs behind the Angular workspace

**Context:** UI routes need to represent agents, tools, readiness and approvals without becoming the place where enterprise policy is enforced.

**Decision:** Angular renders operator workflows while NestJS owns orchestration, authorization, tool access, retrieval coordination and runtime policy.

**Alternatives:** browser-side orchestration; direct calls from components to every external system.

**Consequences:** more backend structure, but identity, policy and audit have a coherent enforcement boundary.

## ADR-002 — Tool execution is governed and visible

**Context:** agent tools can mutate external systems or launch browser work.

**Decision:** represent tool intent and execution as explicit runtime events, with approval/policy checks before protected actions.

**Alternatives:** hidden tool execution; treating all tools as equally safe.

**Consequences:** users gain inspectability and the platform can apply different policies by tool/risk level.

## ADR-003 — Browser automation is an isolated worker concern

**Context:** Playwright/browser execution is higher-risk and failure-prone compared with pure retrieval or generation.

**Decision:** keep browser automation behind worker/service boundaries with scoped inputs, timeouts and explicit demo/production status.

**Alternatives:** execute automation logic inside the Angular application or general API request path.

**Consequences:** operational complexity increases but failures, permissions and resource usage are easier to contain.

## ADR-004 — Pilot readiness is part of the architecture

**Context:** enterprise AI rollout is not only feature completeness; dependencies, permissions, feedback and operational health determine whether the system is usable.

**Decision:** model pilot, readiness and ops surfaces as first-class product/architecture concerns.

**Alternatives:** treat rollout as external project management documentation only.

**Consequences:** the prototype demonstrates adoption/governance thinking alongside application code.
