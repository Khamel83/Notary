# LLM Overview — Notary
*Updated: 2026-05-10 07:35 UTC | Tier: standard | Auto-updated: daily cron*

## What This Is
**Status**: 🔄 Ready for Vercel Deployment **Current Tier**: Homelab PostgreSQL + Vercel Serverless **Upgrade Trigger**: > 50 appointments/day

## Current State
*Status: 🟢 active from local git history*

**Active work:**
- 4fe2076 chore: bootstrap LLM-OVERVIEW files 2026-05-10
- 8c4a401 Update location from Thai Town to East Side LGBT-friendly area
- 09a8da1 Add LA-themed enhancements with rating system joke and comprehensive validation
- c5098e9 Add LA-themed personality and UX improvements
- bbb0fb9 Fix build errors: Stripe initialization and SSL compatibility
- c9123b7 Fix build error: Move Stripe initialization to runtime

**Known issues:**
- No known issue found in recent commit subjects or local TODO/BLOCKERS docs.

**Recent changes (7 days):**
- `4fe2076 chore: bootstrap LLM-OVERVIEW files 2026-05-10`

## Architecture
- Stack marker: Node/JavaScript
- Stack marker: Docker Compose service
- Stack marker: Vercel deployment
- Top-level entry: `app/`
- Top-level entry: `components/`
- Top-level entry: `COST_OPTIMIZATION.md`
- Top-level entry: `DEPLOY_NOW.md`
- Top-level entry: `DEPLOYMENT.md`
- Top-level entry: `DEPLOYMENT_CHECKLIST.md`
- Top-level entry: `DEPLOYMENT_READY.md`
- Top-level entry: `Dockerfile`

## Key Commands
- `npm run dev  # next dev`
- `npm run build  # prisma generate && next build`
- `npm run start  # next start`
- `npm run lint  # next lint`
- `npm run db:push  # prisma db push`
- `npm run db:studio  # prisma studio`
- `npm run db:generate  # prisma generate`
- `docker compose up -d  # start compose service from the relevant service directory`
- `git status --short`
- `git log --oneline -5`

## Dependencies
- **Runs on:** Not declared in local repo evidence.
- **Calls out to:** See repo docs and config files.
- **Called by:** Not declared in local repo evidence.
- **Env vars required:** `BASE_LOCATION_LAT`, `BASE_LOCATION_LNG`, `BASE_LOCATION_ZIP`, `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NODE_ENV`, `NOTARY_COMMISSION_NUMBER`, `NOTARY_EMAIL`, `NOTARY_NAME`, `NOTARY_PHONE`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

## Critical Rules
- Preserve repo-local instructions in `AGENTS.md`, `CLAUDE.md`, or README when present.
- Do not infer behavior from the repository name alone; verify against local docs and source.

## Gotchas
- Generated from local evidence only: git history, top-level structure, README/CLAUDE/AGENTS/docs, and env examples.
