import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const sourceArg = process.argv.find((arg) => arg.startsWith('--source='));
const daysArg = process.argv.find((arg) => arg.startsWith('--days='));
const concurrencyArg = process.argv.find((arg) => arg.startsWith('--concurrency='));
const sourceRoot = resolve(sourceArg?.split('=')[1] ?? '/Users/yangyilin/docs/ai-list');
const days = Number(daysArg?.split('=')[1] ?? 30);
const concurrency = Math.max(1, Math.min(3, Number(concurrencyArg?.split('=')[1] ?? 2)));
const force = process.argv.includes('--force');
const hermes = '/Users/yangyilin/.local/bin/hermes';
const validator = '/Users/yangyilin/.hermes/skills/openclaw-imports/summarize-ai-list-daily/scripts/validate_daily_translation.py';
const workdir = '/Users/yangyilin/.hermes/profiles/ai-list/workspace';
const auditRoot = resolve(root, '.publish-state/translation-audit');

function sourceLinkCount(path) {
  return (readFileSync(path, 'utf8').match(/https?:\/\/[^\s)>]+/g) ?? []).length;
}

function run(command, args, cwd) {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, { cwd, env: process.env });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.on('close', (code) => resolveRun({ code: code ?? 1, output }));
  });
}

const dates = readdirSync(sourceRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}-pt$/.test(entry.name))
  .map((entry) => entry.name.slice(0, 10))
  .filter((date) => {
    try { return sourceLinkCount(resolve(sourceRoot, `${date}-pt/daily.md`)) >= 3; }
    catch { return false; }
  })
  .sort().reverse().slice(0, days);

const jobs = dates.filter((date) => force || !readdirSync(resolve(sourceRoot, `${date}-pt`)).includes('daily.en.md'));
mkdirSync(auditRoot, { recursive: true });
console.log(`English backfill: ${jobs.length} pending of ${dates.length} eligible editions, concurrency ${concurrency}.`);

let cursor = 0;
let completed = 0;
const failures = [];

async function worker(workerId) {
  while (cursor < jobs.length) {
    const date = jobs[cursor++];
    const directory = resolve(sourceRoot, `${date}-pt`);
    const chinese = resolve(directory, 'daily.md');
    const english = resolve(directory, 'daily.en.md');
    const audit = resolve(auditRoot, `${date}.log`);
    console.log(`[${completed + 1}/${jobs.length}] worker ${workerId} translating ${date}`);
    const prompt = [
      'Use summarize-ai-list-daily.',
      `The Chinese source ${chinese} already exists and must not be changed.`,
      `Generate only the paired publication-ready English edition at ${english}.`,
      'Use a refined workflow internally: analyze terminology and evidence boundaries, draft, critically compare against the Chinese source, revise every accuracy issue, then polish for general technology readers.',
      'Preserve every section, fact, number, caveat, table row, and source URL.',
      'Follow the daily.en.md contract and run validate_daily_translation.py before stopping.',
    ].join(' ');
    const result = await run(hermes, [
      '-p', 'ai-list', 'chat', '-Q', '--source', 'tool', '--yolo', '--max-turns', '90',
      '-s', 'summarize-ai-list-daily', '-q', prompt,
    ], workdir);
    writeFileSync(audit, result.output, 'utf8');
    if (result.code !== 0) {
      failures.push(`${date}: Hermes exited ${result.code}`);
      console.error(`[failed] ${date}: Hermes exited ${result.code}`);
      continue;
    }
    const validation = await run('python3', [validator, english, '--source', chinese], workdir);
    writeFileSync(audit, `${result.output}\n\n--- deterministic validation ---\n${validation.output}`, 'utf8');
    if (validation.code !== 0) {
      failures.push(`${date}: validation failed`);
      console.error(`[failed] ${date}: validation failed`);
      continue;
    }
    completed += 1;
    console.log(`[passed] ${date} (${completed}/${jobs.length})`);
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length || 1) }, (_, index) => worker(index + 1)));

if (failures.length) {
  console.error(`Backfill finished with ${failures.length} failure(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`English backfill passed: ${completed} generated, ${dates.length - jobs.length} already present.`);
