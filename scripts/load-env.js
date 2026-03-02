/**
 * Loads .env and generates environment configuration.
 * Maps APP_* variables to environment structure.
 * Run before ng serve and ng build.
 */
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const result = {};

  // Load from .env file (local dev)
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let value = trimmed.slice(eqIdx + 1).trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          result[key] = value;
        }
      }
    });
  }

  // Merge process.env (Vercel, CI, etc.) - APP_* vars override .env
  Object.keys(process.env || {}).forEach((key) => {
    if (key.startsWith('APP_') && process.env[key]) {
      result[key] = process.env[key];
    }
  });

  return result;
}

function envToEnvironment(env, isProduction) {
  return `// Auto-generated from .env - do not edit manually
export const environment = {
  production: ${isProduction},
  hostUri: '${env.APP_HOST_URI || 'https://author-p18253-e46622.adobeaemcloud.com'}',
  publishUri: '${env.APP_PUBLISH_URI || 'https://publish-p18253-e46622.adobeaemcloud.com'}',
  graphqlEndpoint: '${env.APP_ENDPOINT || 'securbank'}',
  useProxy: ${isProduction ? 'false' : 'true'},
  authMethod: '${env.APP_AUTH_METHOD || 'basic'}',
  basicAuthUser: '${(env.APP_BASIC_AUTH_USER || 'securbank').replace(/'/g, "\\'")}',
  basicAuthPass: '${(env.APP_BASIC_AUTH_PASS || '').replace(/'/g, "\\'")}',
  serviceToken: '${(env.APP_SERVICE_TOKEN || '').replace(/'/g, "\\'")}',
  oktaIssuer: '${(env.APP_OKTA_ISSUER || '').replace(/'/g, "\\'")}',
  oktaClientId: '${(env.APP_OKTA_CLIENT_ID || '').replace(/'/g, "\\'")}',
  oktaRedirectUri: '${(env.APP_OKTA_REDIRECT_URI || '').replace(/'/g, "\\'")}',
  oktaScopes: '${(env.APP_OKTA_SCOPES || 'openid profile email').replace(/'/g, "\\'")}',
  aemEmbedHeaderUrl: '${(env.APP_AEM_EMBED_HEADER_URL || '').replace(/'/g, "\\'")}',
  aemEmbedFooterUrl: '${(env.APP_AEM_EMBED_FOOTER_URL || '').replace(/'/g, "\\'")}'
};
`;
}

const env = loadEnv();
const envDir = path.join(__dirname, '..', 'src', 'environments');

fs.mkdirSync(envDir, { recursive: true });

fs.writeFileSync(
  path.join(envDir, 'environment.ts'),
  envToEnvironment(env, false)
);

fs.writeFileSync(
  path.join(envDir, 'environment.prod.ts'),
  envToEnvironment(env, true)
);

console.log('Environment files generated from .env');
