import { environment } from '../../../environments/environment';

const publishURI = environment.publishUri || environment.hostUri;
const serviceURL = environment.useProxy ? '/' : publishURI;

export function getURI(path = ''): string {
  // When using proxy, route all paths through same origin to avoid CORS
  if (environment.useProxy) {
    if (path && path.startsWith('/')) return path;
    if (path && typeof path === 'string' && path.startsWith('http')) {
      const urlPath = path.replace(/^https?:\/\/[^/]+/, '');
      return urlPath.startsWith('/') ? urlPath : '/' + urlPath;
    }
    return path ? (path.startsWith('/') ? path : '/' + path) : '/';
  }
  // Direct mode: use full AEM URL for dynamic media
  if (path && path.startsWith('/adobe/dynamicmedia/deliver/')) {
    return publishURI + path;
  }
  if (path && typeof path === 'string' && path.startsWith('http')) {
    if (path.includes('/adobe/dynamicmedia/deliver/')) {
      const urlPath = path.replace(/^https?:\/\/[^/]+/, '');
      return publishURI + urlPath;
    }
  }
  return serviceURL + path;
}
