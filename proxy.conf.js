const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  const result = {};
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
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
  return result;
}

const env = loadEnv();
const user = env.APP_BASIC_AUTH_USER || 'securbank';
const pass = env.APP_BASIC_AUTH_PASS || 'eyJhbGciOiJS';
const BASIC_AUTH = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');

const securbankProxy = {
  target: env.APP_HOST_URI || 'https://author-p18253-e46622.adobeaemcloud.com',
  secure: true,
  changeOrigin: true,
  headers: {
    Authorization: BASIC_AUTH
  }
};

module.exports = {
  '/graphql': securbankProxy,
  '/adobe': securbankProxy
};
