<!-- janitor:begin:todo -->
- Maintain dependency compatibility and Node/Railway deployment configurations
- Continue implementation of LA-themed features and UX enhancements
<!-- janitor:end:todo -->

## Current publication acceptance

- [x] Correct the pending fresh-source rule to discover the actual remote default
  branch. Fetched default is `claude/notary-platform-setup-014k1bMk5wVHjNgWABdsridd`,
  source `02bd1f77c4c2ee0eecd916e6fcbe966e86e3422a`. This is documentation only.
- [ ] Merge PR #7 only after trusted exact-head reviewer PASS and passing provider
  checks. Its previous Vercel preview failed while collecting
  `/api/appointments/cancel`: `DATABASE_URL` is missing. Establish the preview
  database role and an authorized credential before any provider setup change;
  do not copy production credentials to preview or bypass the failed check.
