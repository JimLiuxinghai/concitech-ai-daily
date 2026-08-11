import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategoryId } from '../data/site';

export type DailyEntry = CollectionEntry<'daily'>;
export type Language = 'zh' | 'en';

export function dateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function editionPath(language: Language, date: Date | string): string {
  const key = typeof date === 'string' ? date : dateKey(date);
  return language === 'zh' ? `/daily/${key}/` : `/en/daily/${key}/`;
}

export function localizedPath(language: Language, path: string): string {
  if (language === 'zh') return path;
  return path === '/' ? '/en/' : `/en${path}`;
}

export function formatDate(value: Date, language: Language, style: 'long' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: style === 'long' ? 'long' : '2-digit',
    day: '2-digit',
    weekday: style === 'long' ? 'long' : undefined,
  }).format(value);
}

export function formatCST(value: Date, language: Language): string {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value);
}

export async function getDaily(language?: Language): Promise<DailyEntry[]> {
  const entries = await getCollection('daily', ({ data }) => !data.draft && (!language || data.language === language));
  return entries.sort((a, b) => b.data.datePT.getTime() - a.data.datePT.getTime());
}

export async function getEdition(language: Language, date: string): Promise<DailyEntry | undefined> {
  const entries = await getDaily(language);
  return entries.find((entry) => dateKey(entry.data.datePT) === date);
}

export async function getByCategory(language: Language, category: CategoryId): Promise<DailyEntry[]> {
  const entries = await getDaily(language);
  return entries.filter((entry) => entry.data.categories.includes(category));
}
