# Codename

An npm-workspaces monorepo:

- `app/`: Angular 21, strict TypeScript, Zard UI with Tailwind CSS 4,
  Vitest, and Angular ESLint.
- `server/`: AdonisJS 7 REST API with TypeScript, Japa tests, and ESLint.
  No database is required.

## Setup

Use Node.js 24+ and npm 11+. From the repository root:

```sh
npm ci
cp server/.env.example server/.env
cd server
node ace generate:key
cd ..
```

Keep `.env` private. Generate a separate application key for each deployed
environment; never commit keys.

## Development

Run these commands in separate terminals from the repository root:

```sh
npm run dev:server
npm run dev:app
```

Open <http://localhost:4200>. The Zard button links to the health endpoint.
Angular proxies `/api/**` to <http://localhost:3333> during development.
`GET /api/health` returns `{"status":"ok"}`. Configure your production reverse
proxy to forward `/api/**` to the server as well.

Zard components are checked-in source under `app/src/app/shared`, configured
by `app/components.json`. To add a component, run `npx zard-cli@1.1.1 add <name>`
from `app/`.

## Verification

From the repository root:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Each command runs across both workspaces. To target just one, use, for example,
`npm run test --workspace app` or `npm run test --workspace server`.
Frontend tests use Vitest in non-watch mode; backend tests exercise real HTTP
responses using Japa. Backend commands require the environment setup above.

The root dependency overrides keep transitive `glob` and `minimatch` packages
on patched releases while upstream tools update their dependency ranges.

## Production

The frontend build is written to `app/dist/app/browser`; serve it as static
files with an SPA fallback. The backend build is written to `server/build`.
With the workspace dependencies installed, provide the variables listed in
`server/.env.example` (including `NODE_ENV=production` and a private `APP_KEY`),
and start the compiled API from the repository root with
`node server/build/bin/server.js`. Keep the workspace manifests and root
lockfile when deploying; this project uses one root dependency installation,
not independent installs in the build directories.