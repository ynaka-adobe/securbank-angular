import { environment } from '../../../environments/environment';

function stripTrailingSlash(u: string): string {
  return u.replace(/\/+$/, '');
}

/**
 * True when the app runs inside the Universal Editor canvas (iframe under Adobe Experience Cloud).
 * In that case persisted queries should hit author so in-context edits persist correctly.
 */
export function isUniversalEditorCanvas(): boolean {
  if (typeof window === 'undefined' || window.self === window.top) {
    return false;
  }
  const ref = document.referrer || '';
  return (
    ref.includes('experience.adobe.com') ||
    ref.includes('experience-assets.adobe.com')
  );
}

/** Escape hatch when referrer is stripped: add `?authorContent=1` to the canvas URL. */
export function isAuthorContentQueryHint(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return new URLSearchParams(window.location.search).get('authorContent') === '1';
  } catch {
    return false;
  }
}

/**
 * When not using the dev proxy, AEM Headless should call this host for GraphQL.
 * Uses author in the UE canvas (or with `?authorContent=1`); otherwise publish (fallback host).
 */
export function graphqlAemHostUri(): string {
  const author = stripTrailingSlash(environment.hostUri || '');
  const publish = stripTrailingSlash(environment.publishUri || environment.hostUri || '');
  const useAuthor =
    (isUniversalEditorCanvas() || isAuthorContentQueryHint()) && Boolean(author);
  return useAuthor ? author : publish;
}
