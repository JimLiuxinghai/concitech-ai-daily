import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';

const root = resolve(import.meta.dirname, '..');
const sourceArg = process.argv.find((arg) => arg.startsWith('--source='));
const destinationArg = process.argv.find((arg) => arg.startsWith('--destination='));
const dateArg = process.argv.find((arg) => arg.startsWith('--date='));
const daysArg = process.argv.find((arg) => arg.startsWith('--days='));
const minimumLinksArg = process.argv.find((arg) => arg.startsWith('--minimum-source-links='));
const overwrite = process.argv.includes('--overwrite');
const sourceRoot = resolve(sourceArg?.split('=')[1] ?? '/Users/yangyilin/docs/ai-list');
const destination = resolve(destinationArg?.split('=')[1] ?? resolve(root, 'src/content/daily'));
const requestedDate = dateArg?.split('=')[1];
const days = Number(daysArg?.split('=')[1] ?? 1);
const minimumSourceLinks = Number(minimumLinksArg?.split('=')[1] ?? 0);

if (!Number.isInteger(days) || days < 1) throw new Error('--days must be a positive integer');
if (!Number.isInteger(minimumSourceLinks) || minimumSourceLinks < 0) throw new Error('--minimum-source-links must be a non-negative integer');

function quote(value) {
  return JSON.stringify(String(value));
}

function nextDayCST(date) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return `${value.toISOString().slice(0, 10)}T13:00:00+08:00`;
}

function categoriesFor(content) {
  const rules = {
    models: /模型|model|benchmark|参数|权重/i,
    products: /产品|发布|功能|应用|助手/i,
    research: /研究|论文|猜想|证明|学术/i,
    devtools: /开发|代码|agent|工具|API|SDK|MCP/i,
    business: /商业|融资|价格|收入|估值|资本/i,
    policy: /政策|政府|法规|诉讼|合规/i,
    security: /安全|漏洞|攻击|风险|网络安全/i,
  };
  const matches = Object.entries(rules).filter(([, pattern]) => pattern.test(content)).map(([id]) => id);
  return matches.length ? matches : ['products'];
}

function descriptionFor(content, fallbackTitle) {
  const body = content.replace(/^# .*$/m, '').replace(/\n#+ .*$/s, '').replace(/\s+/g, ' ').trim();
  const value = body || fallbackTitle;
  return value.length > 180 ? `${value.slice(0, 177).trim()}…` : value;
}

function itemCountFor(content) {
  const numbered = [...content.matchAll(/^##\s+(?:[一二三四五六七八九十]+、|\d+[.、])/gm)].length;
  return numbered || Math.max(1, [...content.matchAll(/^##\s+/gm)].length);
}

function readSource(file, fallbackTitle) {
  if (!existsSync(file)) return undefined;
  const raw = readFileSync(file, 'utf8');
  if (!raw.trim()) return undefined;

  const parsed = matter(raw);
  const title = parsed.data.title ?? parsed.content.match(/^\s*#\s+(.+)$/m)?.[1] ?? fallbackTitle;
  const body = parsed.content.replace(/^\s*#\s+.+(?:\r?\n+|$)/, '').trim();
  if (!body) return undefined;
  return { file, parsed, title, body };
}

function sourcePairFor(directory) {
  const date = directory.slice(0, 10);
  const fallbackTitle = `Concitech AI Daily — ${date}`;
  const zh = readSource(resolve(sourceRoot, directory, 'daily.md'), fallbackTitle);
  const en = readSource(resolve(sourceRoot, directory, 'daily.en.md'), fallbackTitle);
  if (!zh || !en) return undefined;
  return { directory, date, zh, en };
}

function renderEdition(pair, language, sharedCategories) {
  const source = language === 'zh' ? pair.zh : pair.en;
  const author = language === 'zh' ? 'Concitech AI 编辑部' : 'Concitech AI Editorial';
  const sourceName = language === 'zh' ? 'daily.md' : 'daily.en.md';
  const frontmatter = [
    '---',
    `title: ${quote(source.title)}`,
    `description: ${quote(descriptionFor(source.body, source.title))}`,
    `datePT: ${quote(pair.date)}`,
    `publishedAtCST: ${quote(nextDayCST(pair.date))}`,
    `language: ${language}`,
    `author: ${quote(author)}`,
    `categories: [${sharedCategories.join(', ')}]`,
    `cover: ${quote(`/covers/${pair.date}-${language}.webp`)}`,
    `sourceFile: ${quote(`ai-list/${pair.directory}/${sourceName}`)}`,
    `itemCount: ${itemCountFor(source.body)}`,
    'draft: false',
    '---',
    '',
  ].join('\n');
  return `${frontmatter}${source.body}\n`;
}

function replacePairAtomically(outputs) {
  mkdirSync(destination, { recursive: true });
  const stageDir = mkdtempSync(resolve(destination, '.daily-import-'));
  const originals = outputs.map(({ target }) => existsSync(target) ? readFileSync(target) : undefined);
  const staged = outputs.map(({ language, content }) => {
    const path = resolve(stageDir, `${language}.md`);
    writeFileSync(path, content, { encoding: 'utf8', flag: 'wx' });
    return path;
  });

  try {
    for (let index = 0; index < outputs.length; index += 1) renameSync(staged[index], outputs[index].target);
  } catch (error) {
    for (let index = 0; index < outputs.length; index += 1) {
      const { target, language } = outputs[index];
      const original = originals[index];
      if (original === undefined) {
        if (existsSync(target)) unlinkSync(target);
        continue;
      }
      const rollback = resolve(stageDir, `${language}.rollback.md`);
      writeFileSync(rollback, original, { flag: 'wx' });
      renameSync(rollback, target);
    }
    throw error;
  } finally {
    rmSync(stageDir, { recursive: true, force: true });
  }
}

const candidateDirectories = readdirSync(sourceRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}-pt$/.test(entry.name))
  .map((entry) => entry.name)
  .filter((name) => !requestedDate || name === `${requestedDate}-pt`)
  .sort()
  .reverse();

const pairs = [];
for (const directory of candidateDirectories) {
  const pair = sourcePairFor(directory);
  if (!pair) {
    console.warn(`Waiting for complete, non-empty daily.md + daily.en.md in ${resolve(sourceRoot, directory)}`);
    continue;
  }
  if (minimumSourceLinks > 0) {
    const sourceLinks = pair.zh.body.match(/https?:\/\/[^\s)>]+/g) ?? [];
    if (sourceLinks.length < minimumSourceLinks) continue;
  }
  pairs.push(pair);
  if (pairs.length >= days) break;
}

if (pairs.length === 0) {
  console.error('No complete, non-empty bilingual PT daily directories found.');
  process.exit(1);
}

let imported = 0;
for (const pair of pairs) {
  const targets = {
    zh: resolve(destination, `${pair.date}.zh.md`),
    en: resolve(destination, `${pair.date}.en.md`),
  };
  const targetExists = { zh: existsSync(targets.zh), en: existsSync(targets.en) };
  if (!overwrite && (targetExists.zh || targetExists.en)) {
    const state = targetExists.zh && targetExists.en ? 'existing bilingual pair' : 'incomplete existing target pair';
    console.log(`Skipped ${pair.date}: ${state}; use --overwrite to replace both files together.`);
    continue;
  }

  const sharedCategories = categoriesFor(`${pair.zh.body}\n${pair.en.body}`);
  const outputs = [
    { language: 'zh', target: targets.zh, content: renderEdition(pair, 'zh', sharedCategories) },
    { language: 'en', target: targets.en, content: renderEdition(pair, 'en', sharedCategories) },
  ];
  replacePairAtomically(outputs);
  imported += outputs.length;
  console.log(`Imported bilingual pair ${pair.directory} -> ${destination}`);
}

console.log(`Import complete: ${imported} file(s).`);
