# Security Policy

Org AI Force models an enterprise AI workspace with identity, RAG, tools, approvals and browser workers. Security boundaries should remain explicit even when a capability is demo-safe or mocked.

## Core boundaries

- do not commit provider, database, JWT or connector secrets
- protected API/tool operations require server-side authorization
- a hidden/disabled UI control is not an authorization boundary
- RAG access must respect the data permissions of the requesting identity in a production implementation
- tool and browser execution require scoped inputs, timeouts and auditability
- approvals must block protected work rather than merely notify the user
- demo/mock capabilities must not be described as production integrations

## Reporting

Do not post exposed credentials or sensitive private data in public issues. Revoke/rotate compromised credentials before sharing sanitized reproduction details.

## Pull request security review

Changes to auth, tools, RAG, browser workers, approvals, debug surfaces or deployment should document the trust boundary affected, authorization behavior, data exposure risk, failure mode and validation.

For deeper model information see `docs/security-model.md` and `ARCHITECTURE_REVIEW.md`.
