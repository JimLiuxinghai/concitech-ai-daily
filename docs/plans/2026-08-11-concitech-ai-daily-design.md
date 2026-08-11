# Concitech AI Daily — Design

Date: 2026-08-11  
Owner: Concitech AI Editorial  
Domain: `ai.concitech.org`

## Summary

Concitech AI Daily is a bilingual AI news digest for general technology readers. It publishes one curated edition per Pacific Time day in Chinese and English. The source material already exists under `/Users/yangyilin/docs/ai-list/YYYY-MM-DD-pt/`; the publishing system turns the paired `daily.md` and `daily.en.md` files into a static editorial website deployed by Cloudflare Pages.

The product is deliberately a daily edition, not a raw hourly feed. Hourly captures remain private source material. Public pages contain edited summaries, explicit source links, uncertainty labels, and a correction path.

## Goals

- Publish one complete bilingual edition every day.
- Make long-form daily reports readable for a general technology audience.
- Preserve PT as the canonical editorial date while showing CST publication time.
- Keep builds deterministic: Cloudflare never calls a model during a build.
- Fail closed when content is incomplete or invalid.
- Launch with the latest 30 days of Chinese and English editions.
- Support SEO, RSS, AdSense Auto Ads, and Cloudflare Web Analytics.

## Non-goals for v1

- No hourly public news feed.
- No database, dynamic CMS, accounts, comments, favorites, or newsletter.
- No runtime translation.
- No third-party news-image hotlinking.
- No free-form AI-generated taxonomy.

## Architecture

The site is a static Astro project in a public GitHub repository named `concitech-ai-daily`. Content is stored in an Astro content collection and compiled into `dist/`. Cloudflare Pages watches the `main` branch and publishes only successful builds.

The local publisher runs on the always-on Mac that already generates the source files:

1. The existing content task creates `daily.md` and `daily.en.md` in the PT date directory.
2. At 13:00 CST, the publisher validates the pair.
3. Valid content is normalized into the site's content collection.
4. A deterministic branded cover is generated for each language.
5. A content hash prevents duplicate commits.
6. Changed content is committed and pushed to `main`.
7. Cloudflare Pages builds and deploys the new static edition.
8. Failed runs retry at 14:00 and 15:00 CST.

No raw capture files, credentials, local absolute paths, or platform-specific publishing artifacts enter the public repository.

## Content Model

Every edition contains:

- `title`
- `description`
- `datePT`
- `publishedAtCST`
- `language` (`zh` or `en`)
- `categories`
- `sourceFiles`
- `sourceCount`
- `cover`
- `translationOf`
- Markdown body

Allowed category identifiers are fixed: `models`, `products`, `research`, `devtools`, `business`, `policy`, and `security`. Chinese and English editions for one date must share the same category identifiers.

## Routes

- Chinese home: `/`
- English home: `/en/`
- Chinese edition: `/daily/YYYY-MM-DD/`
- English edition: `/en/daily/YYYY-MM-DD/`
- Chinese archives: `/archive/`
- English archives: `/en/archive/`
- Category pages: `/topics/{category}/` and `/en/topics/{category}/`
- Trust pages: About, Privacy, Editorial Policy, and Contact in both languages
- Machine-readable output: RSS, sitemap, robots.txt, and ads.txt

Each language pair uses canonical URLs and reciprocal `hreflang` annotations. The PT date appears in routes and archives; the page also displays the CST publication timestamp.

## Editorial Experience

The visual direction is a modern editorial desk: warm paper background, near-black typography, cobalt accents, thin rules, strong date treatment, and generous long-form reading margins. The homepage begins with the current edition rather than a marketing hero.

Homepage sections:

1. Current edition with title, two-paragraph introduction, categories, and reading action.
2. Previous seven editions.
3. Fixed topic navigation.
4. Monthly archive entry points.

Edition pages include the complete article, source links, an AI-assisted editorial disclosure, correction link, language switcher, and previous/next navigation. Mobile layouts are single-column and must not overflow horizontally.

Daily covers are deterministic typographic images containing the publication name, title, date, and category colors. They are generated as WebP and Open Graph assets without external image-generation services.

## Validation and Failure Handling

Publication fails when:

- either language file is missing;
- PT dates do not match;
- titles or descriptions are missing;
- a body is below the minimum useful length;
- source links are missing or malformed;
- categories are outside the fixed taxonomy;
- the Markdown contains executable raw HTML, scripts, iframes, or arbitrary components;
- the same date-language pair already exists with conflicting metadata;
- cover generation fails.

Failures write a local log containing the date, failed rule, and source path. They never delete or overwrite the most recent successful online edition. Retries are idempotent. Corrections create a new content hash and a normal Git commit.

The English edition must preserve names, numeric claims, URLs, and uncertainty markers such as “unverified,” “company-reported,” and “not independently reproduced.”

## Advertising, Privacy, and Analytics

AdSense Auto Ads loads with publisher ID `ca-pub-5950061234063954`. The root-domain ads.txt declaration remains authoritative. Trust pages explain advertising cookies, AI-assisted production, source handling, and corrections. A Google-certified consent management platform must be configured for EEA, UK, and Switzerland traffic.

Cloudflare Web Analytics provides traffic and performance metrics. Google Analytics is not part of v1.

## Testing

Content tests cover bilingual pairing, schema fields, fixed categories, source links, body length, duplicates, and hashes. Build tests verify all expected pages, feeds, sitemap entries, language links, and cover assets. Visual checks cover desktop and mobile widths, long titles, long source lists, navigation, and 404 behavior.

Before production deployment, simulate three sequential publish days and rerun each day twice. The second run must produce no duplicate content or commit.

## Definition of Done

- The latest 30 PT days exist in both languages.
- All public routes, legal pages, feeds, SEO metadata, covers, ads, CMP integration point, and analytics are present.
- The 13:00 publisher and 14:00/15:00 retries complete a real end-to-end run.
- Cloudflare preview and production builds pass.
- `ai.concitech.org` serves the production site.
- Three-day simulation confirms idempotency and failure safety.
