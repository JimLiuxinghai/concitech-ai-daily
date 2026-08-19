import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const failures = [];
const required = [
  'index.html',
  'en/index.html',
  'archive/index.html',
  'articles/index.html',
  'en/archive/index.html',
  'rss.xml',
  'en/rss.xml',
  'sitemap.xml',
  'ads.txt',
  'robots.txt',
  '404.html',
];

function structuredDataFor(html) {
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  return scripts.flatMap((match) => {
    try {
      const value = JSON.parse(match[1]);
      return Array.isArray(value) ? value : [value];
    } catch {
      failures.push('invalid JSON-LD in rendered HTML');
      return [];
    }
  });
}

for (const path of required) {
  if (!existsSync(resolve(dist, path))) failures.push(`missing dist/${path}`);
}

if (existsSync(resolve(dist, 'index.html'))) {
  const home = readFileSync(resolve(dist, 'index.html'), 'utf8');
  for (const marker of ['ca-pub-5950061234063954', 'Concitech AI 日报', 'hreflang="en"']) {
    if (!home.includes(marker)) failures.push(`home is missing ${marker}`);
  }
  const homeTypes = structuredDataFor(home).flatMap((item) => item['@graph'] ?? item).map((item) => item['@type']);
  for (const type of ['WebSite', 'Organization']) {
    if (!homeTypes.includes(type)) failures.push(`home JSON-LD is missing ${type}`);
  }
  if (!home.includes('href="/articles/"')) failures.push('home is missing the long-form article archive link');
}

const contentDir = resolve(root, 'src/content/daily');
const files = readdirSync(contentDir).filter((file) => file.endsWith('.md'));
const zhDates = new Set(files.filter((file) => file.endsWith('.zh.md')).map((file) => file.slice(0, 10)));
const enDates = new Set(files.filter((file) => file.endsWith('.en.md')).map((file) => file.slice(0, 10)));
if (zhDates.size !== enDates.size || [...zhDates].some((date) => !enDates.has(date))) failures.push('content is not a complete bilingual set');

for (const date of zhDates) {
  for (const [language, route] of [['Chinese', resolve(dist, 'daily', date, 'index.html')], ['English', resolve(dist, 'en', 'daily', date, 'index.html')]]) {
    if (!existsSync(route)) {
      failures.push(`missing ${language} route for ${date}`);
      continue;
    }
    const html = readFileSync(route, 'utf8');
    const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
    if (h1Count !== 1) failures.push(`${language} route for ${date} has ${h1Count} H1 elements instead of one`);
    if (!html.includes(`<time datetime="${date}"`)) failures.push(`${language} route for ${date} is missing its exact visible calendar date`);
    if (!structuredDataFor(html).some((item) => item['@type'] === 'NewsArticle')) failures.push(`${language} route for ${date} is missing NewsArticle JSON-LD`);
  }
}

const articleDir = resolve(root, 'src/content/articles');
const articles = readdirSync(articleDir)
  .filter((file) => file.endsWith('.md'))
  .map((file) => matter(readFileSync(resolve(articleDir, file), 'utf8')).data);

for (const article of articles) {
  const route = resolve(dist, 'articles', article.slug, 'index.html');
  if (!existsSync(route)) {
    failures.push(`missing article route for ${article.slug}`);
    continue;
  }
  const html = readFileSync(route, 'utf8');
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
  if (h1Count !== 1) failures.push(`article route for ${article.slug} has ${h1Count} H1 elements instead of one`);
  if (!structuredDataFor(html).some((item) => item['@type'] === 'Article')) failures.push(`article route for ${article.slug} is missing Article JSON-LD`);
  if (!html.includes(`src="${article.cover}"`)) failures.push(`article route for ${article.slug} is missing its cover`);
}

if (failures.length) {
  console.error(`Smoke test failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Smoke test passed: ${zhDates.size} bilingual editions, ${articles.length} long-form articles, and ${required.length} required static assets.`);
