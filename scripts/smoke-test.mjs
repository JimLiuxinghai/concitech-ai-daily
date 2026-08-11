import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const failures = [];
const required = [
  'index.html',
  'en/index.html',
  'archive/index.html',
  'en/archive/index.html',
  'rss.xml',
  'en/rss.xml',
  'sitemap.xml',
  'ads.txt',
  'robots.txt',
  '404.html',
];

for (const path of required) {
  if (!existsSync(resolve(dist, path))) failures.push(`missing dist/${path}`);
}

if (existsSync(resolve(dist, 'index.html'))) {
  const home = readFileSync(resolve(dist, 'index.html'), 'utf8');
  for (const marker of ['ca-pub-5950061234063954', 'Concitech AI 日报', 'hreflang="en"']) {
    if (!home.includes(marker)) failures.push(`home is missing ${marker}`);
  }
}

const contentDir = resolve(root, 'src/content/daily');
const files = readdirSync(contentDir).filter((file) => file.endsWith('.md'));
const zhDates = new Set(files.filter((file) => file.endsWith('.zh.md')).map((file) => file.slice(0, 10)));
const enDates = new Set(files.filter((file) => file.endsWith('.en.md')).map((file) => file.slice(0, 10)));
if (zhDates.size !== enDates.size || [...zhDates].some((date) => !enDates.has(date))) failures.push('content is not a complete bilingual set');

for (const date of zhDates) {
  if (!existsSync(resolve(dist, 'daily', date, 'index.html'))) failures.push(`missing Chinese route for ${date}`);
  if (!existsSync(resolve(dist, 'en', 'daily', date, 'index.html'))) failures.push(`missing English route for ${date}`);
}

if (failures.length) {
  console.error(`Smoke test failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Smoke test passed: ${zhDates.size} bilingual editions and ${required.length} required static assets.`);
