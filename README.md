# Saar Davidson — portfolio (Astro)

Personal site: Astro 6, React islands, static output.

## Commands

| Command | Action |
|--------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server at `http://localhost:4321` |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | ESLint on `src/**/*.tsx` (includes jsx-a11y) |
| `pnpm test:e2e` | Playwright: axe (WCAG 2.2 A/AA tags), horizontal overflow, nav breakpoints, hero terminal |
| `pnpm test:e2e:ci` | Same as `test:e2e` with CI-friendly defaults (`CI=1`) |

## E2E / accessibility tests

Tests live in [`e2e/`](e2e/). Playwright starts `astro build` + `astro preview` on `127.0.0.1:4321` (see [`playwright.config.ts`](playwright.config.ts)); locally it can reuse an already-running preview when `CI` is unset.

First-time or after upgrading Playwright, install browser binaries:

```sh
pnpm exec playwright install chromium
```

On Linux CI, system dependencies are installed via `playwright install --with-deps chromium` (see [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml)).

## Project structure

```text
/
├── e2e/              Playwright specs
├── public/
├── src/
│   ├── components/   React (.tsx) islands
│   ├── layouts/
│   ├── pages/
│   └── ...
├── playwright.config.ts
└── package.json
```

## Learn more

[Astro documentation](https://docs.astro.build)
