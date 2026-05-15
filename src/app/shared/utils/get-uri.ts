import { environment } from '../../../environments/environment';
import { graphqlAemHostUri } from './aem-content-endpoint';

/** Publish (or host fallback) origin for Dynamic Media delivery URLs only. */
function dynamicMediaOrigin(): string {
  return environment.publishUri || environment.hostUri || '';
}

export interface GetURIOptions {
  width?: number;
  height?: number;
}

function appendDynamicMediaParams(url: string, width?: number, height?: number): string {
  if (width == null && height == null) return url;
  const params = new URLSearchParams();
  if (width != null) params.set('wid', String(width));
  if (height != null) params.set('hei', String(height));
  const separator = url.includes('?') ? '&' : '?';
  return url + separator + params.toString();
}

function isDynamicMediaPath(p: string): boolean {
  return p.includes('/adobe/dynamicmedia/deliver/');
}

export function getURI(path = '', options?: GetURIOptions): string {
  const { width, height } = options || {};
  const shouldAppendParams = isDynamicMediaPath(path) && (width != null || height != null);

  // When using proxy, route all paths through same origin to avoid CORS
  if (environment.useProxy) {
    if (path && path.startsWith('/')) {
      return shouldAppendParams ? appendDynamicMediaParams(path, width, height) : path;
    }
    if (path && typeof path === 'string' && path.startsWith('http')) {
      const urlPath = path.replace(/^https?:\/\/[^/]+/, '');
      const basePath = urlPath.startsWith('/') ? urlPath : '/' + urlPath;
      return shouldAppendParams ? appendDynamicMediaParams(basePath, width, height) : basePath;
    }
    const result = path ? (path.startsWith('/') ? path : '/' + path) : '/';
    return shouldAppendParams ? appendDynamicMediaParams(result, width, height) : result;
  }
  // Direct mode: Dynamic Media stays on publish delivery
  if (path && path.startsWith('/adobe/dynamicmedia/deliver/')) {
    return appendDynamicMediaParams(dynamicMediaOrigin() + path, width, height);
  }
  if (path && typeof path === 'string' && path.startsWith('http')) {
    if (path.includes('/adobe/dynamicmedia/deliver/')) {
      const urlPath = path.replace(/^https?:\/\/[^/]+/, '');
      return appendDynamicMediaParams(dynamicMediaOrigin() + urlPath, width, height);
    }
  }
  // Other paths: author when embedded in Universal Editor, else publish (see graphqlAemHostUri)
  const host = graphqlAemHostUri();
  const suffix = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return host + suffix;
}
