# Repository Guidelines

## Project Structure & Module Organization
- `app/`: React + Vite frontend (entry `index.html`, source in `src/`, PWA assets in `public/`).
- `functions/`: Cloudflare Pages Functions (route = file path, e.g., `functions/api/hello.js` → `/api/hello`).
- `wrangler.toml`: Cloudflare config (build output `app/dist`, optional `[vars]`).
- `README.md`: quick start. Design doc: `Casino_Blackjack_Cloudflare_PWA_Design_Doc_v1.1_readable.pdf`.

## Build, Test, and Development Commands
- Install deps: `cd app && npm install`.
- Dev server: `npm run dev` (Vite on http://localhost:5173).
- Build: `npm run build` (outputs to `app/dist`).
- Local preview with functions: from repo root run `wrangler pages dev app/dist` (serves at http://localhost:8788).
- Deploy (Pages): `wrangler pages deploy app/dist` (requires Cloudflare project).

## Coding Style & Naming Conventions
- Language: modern ES modules + React 18, functional components/hooks.
- Indentation: 2 spaces; single quotes; omit semicolons to match current code.
- Components: PascalCase (e.g., `App.jsx`); one component per file; colocate related files.
- Functions routes: export `onRequest` and keep handlers small, pure, and async-safe.
- Assets: place icons/manifest/SW in `app/public/` (e.g., `/icons/logo.svg`).

## Testing Guidelines
- Status: no test tooling configured yet.
- Recommended: add `vitest` and `@testing-library/react` for UI; name tests `*.test.jsx` colocated with sources.
- Functions: consider Miniflare/Wrangler for integration tests hitting `/api/*`.
- Aim for clear unit tests around pure logic and >80% coverage once added.

## Commit & Pull Request Guidelines
- Commits: concise, imperative subject; include scope prefix when helpful (`app:`, `functions:`, `docs:`). Example: `functions: add /api/health with uptime`.
- PRs: include summary, linked issues, test plan/steps, screenshots for UI, and note any config changes. Keep diffs focused.
- Checks: ensure `npm run build` succeeds and `wrangler pages dev app/dist` runs without errors.

## Security & Configuration Tips
- Secrets: never commit; use `wrangler secret put KEY`. Non-secret config in `[vars]` of `wrangler.toml`.
- Repo hygiene: `node_modules/`, `dist/`, `.wrangler/` are ignored via `.gitignore`.
- Avoid direct network calls in UI for secrets—proxy via functions when needed.
