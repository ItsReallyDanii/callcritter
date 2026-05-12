# Prompt 04 — Polish, Docs, Deploy Readiness

Continue CallCritter after core loop works.

Goal:
Make the app contest-ready.

Build/check:
1. Loading states:
   - Reading your scene
   - Designing your companion
   - Painting the critter
   - Preparing the scene card
2. Error states:
   - Camera denied
   - Analysis failed
   - Image generation failed
   - Rate limit reached
3. Rate limiting:
   - one generation/session
   - server-side IP/time-window guard if available
4. Docs:
   - README.md
   - docs/JUDGES.md
   - docs/BUILD_NOTES.md
   - docs/PRIVACY.md
   - docs/COST_CONTROL.md
   - docs/SUBMISSION.md
5. Vercel deployment notes.
6. Final smoke test checklist.

Hard constraints:
- Do not add new feature scope.
- Do not add accounts/auth/database.
- Keep public demo cost-controlled.

Acceptance criteria:
- Fresh incognito test passes.
- Camera denied path works.
- Demo path works.
- Export works.
- Docs are present and accurate.
- Public link is safe to post.
