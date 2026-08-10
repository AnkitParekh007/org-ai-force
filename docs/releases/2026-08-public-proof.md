# Org AI Force — 2026.08 Public Proof Edition

This release packages `org-ai-force` as the **Operate** layer of the public AI frontend and agent-systems ecosystem.

## Positioning

**An enterprise Angular + NestJS agent-workspace architecture proof focused on governed tools, approvals, RAG-ready services, browser workers, pilot readiness, operational visibility, and deterministic degraded-dependency behavior.**

## What is new in this edition

- deterministic Operations resilience scenarios for RAG unavailable, tool-policy denial, approval rejection, browser-worker timeout, provider timeout, and degraded readiness;
- explicit backend-authority rule: frontend capability visibility never grants execution permission;
- an optimized `org-ai-force-demo.gif` embedded in the README and public-proof path;
- a protected-route capture harness that records whether a requested enterprise surface redirected to login;
- stronger reviewer guidance for healthy → governed → degraded → recovery/readiness behavior;
- CI-backed frontend tests/typecheck/build plus backend typecheck;
- clearer public-hosting boundary: this repository does not claim a publicly hosted enterprise application.

## Public proof

- Public proof: `docs/public-proof.md`
- Recruiter review: `docs/recruiter-review-guide.md`
- System architecture: `docs/system-architecture.md`
- Operations visual: `docs/assets/screenshots/org-ai-force-demo.gif`
- Local/Docker run path: documented in the root README

## Suggested GitHub Release title

`2026.08 Public Proof Edition — Enterprise Agent Operations & Resilience`

## Suggested release summary

Org AI Force's 2026.08 edition makes enterprise agent operations visible under failure, not only on the happy path. It adds deterministic degraded-dependency scenarios, backend-authoritative tool/approval boundaries, readiness/recovery proof, protected-route visual capture, and an optimized Operations walkthrough.

This remains a prototype/architecture proof. The release deliberately does not claim public production hosting or enterprise adoption.

## Best launch links

| Audience | Link |
| --- | --- |
| Enterprise architect / recruiter | `docs/public-proof.md` |
| Angular/NestJS engineer | system architecture + local quickstart |
| Operations/reliability reviewer | Operations resilience lab + GIF |
| Security/governance reviewer | security model + backend-authority rule |

## Verification before publishing a GitHub Release

Require frontend tests, frontend typecheck, frontend production build, and backend typecheck to remain green. Re-run the protected-route capture workflow when the Operations UI changes materially.

## Release boundary

This is deterministic mock-safe architecture proof. It does not claim live provider/tool incidents, public production hosting, or production enterprise adoption.

## Release date

2026-08-10
