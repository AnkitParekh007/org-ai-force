# Public Proof Screenshots

Wave 3B.2 visual proof is generated from the exact Org AI Force Angular branch running locally in CI.

The protected Operations capture uses the repository's existing development-only mock-agent guard bypass inside the ephemeral runner, verifies that protected routes do not redirect to `/login`, and records deterministic failure/recovery states in the Actions artifact manifest.

For the final asset PR, the same capture job is temporarily exercised inside the repository's existing `CI` workflow so the proof run and artifact are visible on the pull request. The core CI file is restored before merge; the permanent standalone capture workflow remains read-only.

The final recruiter asset is `org-ai-force-demo.gif`. It must remain under 8 MB, use a desktop-width capture, and retain the prototype/mock boundary described in `docs/public-proof.md` and `docs/public-proof-capture.md`.
