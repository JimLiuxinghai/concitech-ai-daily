import { CATEGORY_IDS } from '../data/site';
import { dateKey, editionPath, getDaily } from '../lib/content';

const ORIGIN = 'https://ai.concitech.org';

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export async function GET() {
  const entries = await getDaily();
  const fixed = ['', 'archive/', 'about/', 'editorial/', 'privacy/', 'contact/'];
  const paths = [
    ...fixed.map((path) => `/${path}`),
    ...fixed.map((path) => `/en/${path}`),
    ...CATEGORY_IDS.flatMap((id) => [`/topics/${id}/`, `/en/topics/${id}/`]),
    ...entries.map((entry) => editionPath(entry.data.language, entry.data.datePT)),
  ];
  const lastmodByPath = new Map(entries.map((entry) => [editionPath(entry.data.language, entry.data.datePT), dateKey(entry.data.datePT)]));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(paths)].map((path) => `  <url><loc>${escapeXml(new URL(path, ORIGIN).href)}</loc>${lastmodByPath.has(path) ? `<lastmod>${lastmodByPath.get(path)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
