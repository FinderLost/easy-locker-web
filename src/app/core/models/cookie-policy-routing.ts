export const COOKIE_POLICY_SLUGS: Record<string, string> = {
  es: 'politica-cookies',
  en: 'cookie-policy',
  fr: 'politique-cookies',
  de: 'cookie-richtlinie',
  it: 'politica-cookie',
};

export const COOKIE_POLICY_LANG_BY_SLUG: Record<string, string> = Object.entries(
  COOKIE_POLICY_SLUGS
).reduce((acc, [lang, slug]) => {
  acc[slug] = lang;
  return acc;
}, {} as Record<string, string>);

export function findCookiePolicyLanguage(pathname: string): string | null {
  const normalized = pathname.replace(/^\//, '').split('?')[0].split('#')[0];
  return COOKIE_POLICY_LANG_BY_SLUG[normalized] ?? null;
}

export function getCookiePolicySlug(lang: string): string | null {
  return COOKIE_POLICY_SLUGS[lang] ?? null;
}