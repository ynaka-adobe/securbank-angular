/**
 * Builds `data-aue-resource` for an AEM Content Fragment (CF root DAM path + variation).
 * Uses `urn:aemconnection:` so the reference matches
 * `<meta name="urn:adobe:aue:system:aemconnection" content="aem:…">` (Experience League — UE getting started).
 */
export function ueCfResourceUrn(
  cfRootPath: string,
  variation: string | null | undefined = 'master'
): string {
  const trimmed = (cfRootPath || '').trim();
  if (!trimmed) {
    return '';
  }
  const base = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const v = (variation || 'master').trim() || 'master';
  if (base.includes('/jcr:content/data/')) {
    return `urn:aemconnection:${base}`;
  }
  return `urn:aemconnection:${base}/jcr:content/data/${v}`;
}
