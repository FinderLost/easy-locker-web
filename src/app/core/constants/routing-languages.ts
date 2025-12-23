export const ROUTING_LANGS = ['es', 'en', 'fr', 'de', 'it'];
export const DEFAULT_ROUTING_LANG = 'en';

export function isRoutingLanguage(code: string | null | undefined): boolean {
  if (!code) {
    return false;
  }
  return ROUTING_LANGS.includes(code.toLowerCase());
}

export function normalizeRoutingLanguage(code: string | null | undefined): string {
  return (code ?? '').toLowerCase();
}
