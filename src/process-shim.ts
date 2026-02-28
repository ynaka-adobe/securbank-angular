/**
 * Polyfill for Node.js process global - required by @adobe/aem-headless-client-js and util package
 */
const g = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {}));
const glob = g as Record<string, unknown>;
glob['process'] = glob['process'] || { env: {} };
