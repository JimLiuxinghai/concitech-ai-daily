# Concitech AI Daily

A bilingual, source-grounded daily AI news publication and Chinese long-form archive built with Astro and deployed as static files on Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run check
npm run test:semantics
npm run build
npm run test:smoke
```

`npm run build` refuses to publish when a date is missing either language, metadata is invalid, fewer than three source links are present, unsafe markup is detected, or a cover is missing.

## Content flow

The source pipeline writes paired files to `/Users/yangyilin/docs/ai-list/YYYY-MM-DD-pt/`:

- `daily.md` — Chinese editorial source
- `daily.en.md` — faithful English edition

Import the most recent 30 editions:

```bash
npm run import -- --source=/Users/yangyilin/docs/ai-list --days=30
npm run covers
```

The site stores deployable copies under `src/content/daily/`. `scripts/publish-daily.mjs` imports the latest complete bilingual pair, generates branded WebP covers, validates content, builds the site, commits only that edition and pushes `main`. Re-running the same date is idempotent.

Chinese WeChat long-form articles live under `src/content/articles/`, with 1200 x 630 WebP covers under `public/article-covers/`. Their frontmatter and generated routes are checked by `scripts/validate-articles.mjs` and `scripts/smoke-test.mjs` during production verification.

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22`
- Custom domain: `ai.concitech.org`
- Optional environment variable: `PUBLIC_CF_WEB_ANALYTICS_TOKEN`

Google AdSense Auto Ads uses publisher `ca-pub-5950061234063954`. The root `ads.txt` is copied unchanged to production. Configure the consent message in AdSense Privacy & Messaging before enabling personalized ads in regulated regions.

## Daily schedule

Hermes runs the model-free `ai-list-site-publish` Cron under the `ai-list` profile at 13:00, 14:00, and 15:00 CST (`0 13-15 * * *`). The Cron invokes the deterministic site-publish script with `--no-agent`; that script executes:

```bash
npm run publish:daily
```

A publish is allowed only after non-empty `daily.md` and `daily.en.md` exist for the same PT date. The hourly window supplies two retries without calling a language model. GitHub push triggers the Cloudflare Pages deployment.
