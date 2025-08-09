Caseeno Blackjack — Cloudflare PWA Starter

Overview
- React + Vite frontend in `app/`
- Cloudflare Pages Functions in `functions/` (example: `/api/hello`)
- PWA enabled via `manifest.webmanifest` and `sw.js`
- `wrangler.toml` configured for Pages deploy (build output `app/dist`)

Getting Started
1) Install dependencies
   - cd app
   - npm install

2) Run the frontend dev server
   - npm run dev
   - Vite serves on http://localhost:5173

3) Build for production
   - npm run build (outputs to `app/dist`)

4) Preview locally with Pages Functions (requires Wrangler)
   - From repo root: wrangler pages dev app/dist
   - This serves the built app with `functions/` at http://localhost:8788

Deployment (Cloudflare Pages)
- Create a Pages project and connect your repo.
- Set Build command: `npm --prefix app ci && npm --prefix app run build`
- Set Build output directory: `app/dist`
- Functions directory: `functions` (detected automatically)

API Example
- GET /api/hello → JSON health response.
- POST /api/dealer → proxy to an LLM; send `{ messages: [...] }` and receive `{ reply }`. Requires `OPENAI_API_KEY` secret.
- Add the key with `wrangler secret put OPENAI_API_KEY`.

Local API Key (Wrangler dev)
- Create a file named `.dev.vars` at the repo root (next to `wrangler.toml`) with:
  - `OPENAI_API_KEY=sk-...`
- Run local preview with functions: `wrangler pages dev app/dist` (serves http://localhost:8788)
- Quick test:
  - `curl -X POST -H 'content-type: application/json' -d '{"messages":[{"role":"user","content":"Hello"}]}' http://localhost:8788/api/dealer`
- Notes:
  - Do not commit secrets. `.dev.vars` is git-ignored; use `.dev.vars.example` as a template.
  - For production/preview, set the secret in your Cloudflare Pages project with `wrangler pages secret put OPENAI_API_KEY`.

PWA Notes
- Manifest: `app/public/manifest.webmanifest`
- Service Worker: `app/public/sw.js` (basic cache strategy)
- Icons: `app/public/icons/` (placeholder SVG included)

Project Structure
- app/
  - index.html, src/, public/ (manifest, sw, icons)
  - vite.config.js, package.json
- functions/
  - api/hello.js
- wrangler.toml

Contributing
- Use feature branches and open PRs; `main` is protected. Small changes and clear PR descriptions help reviews.

Next Steps
- Replace placeholder branding/assets.
- Add game UI, state, and network logic.
- Configure environment variables in `wrangler.toml` under `[vars]` if needed.

Features
- Game engine: shuffling/dealing, hit/stand, outcome resolution.
- Basic strategy hints: UI highlights recommended action based on player/dealer up-card.
- Strategy help modal: compact chart (S17, no splits/surrender). Open via Strategy button or press `?`.
- Voice dealer: use the Chat button to speak with the dealer. Dealer replies are powered by an LLM and spoken via Web Speech.
