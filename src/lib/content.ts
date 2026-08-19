import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategoryId } from '../data/site';

export type DailyEntry = CollectionEntry<'daily'>;
export type ArticleEntry = CollectionEntry<'article'>;
export type Language = 'zh' | 'en';

export function dateKey(value: string): string {
  return value;
}

export function editionPath(language: Language, date: string): string {
  return language === 'zh' ? `/daily/${date}/` : `/en/daily/${date}/`;
}

export function localizedPath(language: Language, path: string): string {
  if (language === 'zh') return path;
  return path === '/' ? '/en/' : `/en${path}`;
}

export function articlePath(slug: string): string {
  return `/articles/${slug}/`;
}

export function formatDate(value: string, language: Language, style: 'long' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: style === 'long' ? 'long' : '2-digit',
    day: '2-digit',
    weekday: style === 'long' ? 'long' : undefined,
  }).format(new Date(`${value}T12:00:00Z`));
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
  return entries.sort((a, b) => b.data.datePT.localeCompare(a.data.datePT));
}

export async function getArticles(): Promise<ArticleEntry[]> {
  const entries = await getCollection('article', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.publishedAtCST.getTime() - a.data.publishedAtCST.getTime());
}

export async function getEdition(language: Language, date: string): Promise<DailyEntry | undefined> {
  const entries = await getDaily(language);
  return entries.find((entry) => dateKey(entry.data.datePT) === date);
}

export async function getByCategory(language: Language, category: CategoryId): Promise<DailyEntry[]> {
  const entries = await getDaily(language);
  return entries.filter((entry) => entry.data.categories.includes(category));
}
