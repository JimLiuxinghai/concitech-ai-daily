import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const dateArg = process.argv.find((arg) => arg.startsWith('--date='));
const date = dateArg?.split('=')[1];
const sourceArg = process.argv.find((arg) => arg.startsWith('--source='));
const source = sourceArg?.split('=')[1] ?? '/Users/yangyilin/docs/ai-list';
const stateDir = resolve(root, '.publish-state');

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

mkdirSync(stateDir, { recursive: true });
const importArgs = ['scripts/import-daily.mjs', `--source=${source}`];
if (date) importArgs.push(`--date=${date}`);
run(process.execPath, importArgs);

const effectiveDate = date ?? readdirSync(source)
  .filter((name) => /^\d{4}-\d{2}-\d{2}-pt$/.test(name))
  .filter((name) => existsSync(resolve(source, name, 'daily.md')) && existsSync(resolve(source, name, 'daily.en.md')))
  .sort().at(-1)?.slice(0, 10);
if (!effectiveDate) {
  console.error('No bilingual daily.md + daily.en.md source pair is ready; nothing was published.');
  process.exit(2);
}
const stateFile = resolve(stateDir, `${effectiveDate}.json`);
const prior = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf8')) : {};
const zh = resolve(root, `src/content/daily/${effectiveDate}.zh.md`);
const en = resolve(root, `src/content/daily/${effectiveDate}.en.md`);
if (!existsSync(zh) || !existsSync(en)) {
  writeFileSync(stateFile, `${JSON.stringify({ status: 'waiting-for-bilingual-pair', date: effectiveDate, checkedAt: new Date().toISOString(), attempts: (prior.attempts ?? 0) + 1 }, null, 2)}\n`);
  console.error(`Bilingual pair is incomplete for ${effectiveDate}; nothing was published.`);
  process.exit(2);
}

run(process.execPath, ['scripts/generate-covers.mjs', `--date=${effectiveDate}`]);
run(process.execPath, ['scripts/validate-content.mjs']);
run('npm', ['run', 'build']);

const publishPaths = [
  `src/content/daily/${effectiveDate}.zh.md`,
  `src/content/daily/${effectiveDate}.en.md`,
  `public/covers/${effectiveDate}-zh.webp`,
  `public/covers/${effectiveDate}-en.webp`,
];
const status = spawnSync('git', ['status', '--porcelain', '--', ...publishPaths], { cwd: root, encoding: 'utf8' });
if (!status.stdout.trim()) {
  writeFileSync(stateFile, `${JSON.stringify({ status: 'already-current', date: effectiveDate, checkedAt: new Date().toISOString() }, null, 2)}\n`);
  console.log(`No changes for ${effectiveDate}; publish is idempotent.`);
  process.exit(0);
}

run('git', ['add', '--', ...publishPaths]);
run('git', ['commit', '-m', `content: publish ${effectiveDate} daily edition`]);
run('git', ['push', 'origin', 'main']);
writeFileSync(stateFile, `${JSON.stringify({ status: 'published', date: effectiveDate, publishedAt: new Date().toISOString() }, null, 2)}\n`);
console.log(`Published ${effectiveDate}; Cloudflare Pages will deploy from main.`);
