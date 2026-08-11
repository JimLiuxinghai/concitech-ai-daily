export const SITE = {
  origin: 'https://ai.concitech.org',
  zhName: 'Concitech AI 日报',
  enName: 'Concitech AI Daily',
  publisherId: 'ca-pub-5950061234063954',
  email: 'hello@concitech.org',
  timezone: 'America/Los_Angeles',
} as const;

export const CATEGORY_IDS = [
  'models',
  'products',
  'research',
  'devtools',
  'business',
  'policy',
  'security',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORIES: Record<CategoryId, { zh: string; en: string; index: string }> = {
  models: { zh: '模型', en: 'Models', index: '01' },
  products: { zh: '产品', en: 'Products', index: '02' },
  research: { zh: '研究', en: 'Research', index: '03' },
  devtools: { zh: '开发工具', en: 'Dev Tools', index: '04' },
  business: { zh: '商业', en: 'Business', index: '05' },
  policy: { zh: '政策', en: 'Policy', index: '06' },
  security: { zh: '安全', en: 'Security', index: '07' },
};
