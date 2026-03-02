# SecurBank Angular

Angular port of the [SecurBank](https://github.com/ynakagawa/SecurBank) sample app - a banking demo that connects to Adobe AEM Headless CMS.

## Features

- **AEM Headless Integration**: Fetches content from Adobe Experience Manager via GraphQL persisted queries
- **Pages**: Home, Articles, Services, Article Detail
- **Authentication**: Supports service token auth and Okta SSO for Sign In / Sign Out (configure in environment)
- **AEM Embed**: Optional header/footer embedding from AEM Edge Delivery projects via [aem-embed](https://www.aem.live/docs/aem-embed)

## Prerequisites

- Node.js 18+
- Adobe AEM Cloud Service instance (or use the demo endpoint)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `env.example` to `.env` and set your values:

   - `APP_HOST_URI`: Your AEM author URL
   - `APP_PUBLISH_URI`: Your AEM publish URL
   - `APP_ENDPOINT`: GraphQL endpoint (e.g. `securbank`)
   - `APP_AUTH_METHOD`: `service-token` | `basic` | `none`
   - `APP_BASIC_AUTH_USER` / `APP_BASIC_AUTH_PASS`: For basic auth
   - `APP_SERVICE_TOKEN`: For service token auth
   - **Okta SSO** (for Sign In/Sign Out): `APP_OKTA_ISSUER`, `APP_OKTA_CLIENT_ID`, `APP_OKTA_REDIRECT_URI` (e.g. `http://localhost:4200/login/callback` for local, or your deployed URL), `APP_OKTA_SCOPES` (default: `openid profile email`)

3. **Start development server**

   ```bash
   npm start
   ```

   Open http://localhost:4200

## Project Structure

```
src/
├── app/
│   ├── core/services/     # AEM, Auth, API services
│   ├── shared/           # Reusable components, utils
│   ├── features/         # Feature modules (home, articles, services)
│   └── pages/            # Route components
├── environments/         # Environment config
└── styles/               # Global SCSS variables
```

## Build

```bash
npm run build
```

## Environment Variables

Environment files are generated from `.env` before `npm start` and `npm run build`. See `env.example` for all `APP_*` variables.

### Vercel Deployment

Set these in **Vercel Project Settings → Environment Variables** (for Production):

- `APP_HOST_URI`: AEM author URL
- `APP_PUBLISH_URI`: AEM publish URL (used for GraphQL in production)
- `APP_AUTH_METHOD`: `basic` or `none` (publish often allows `none` for public content)
- `APP_BASIC_AUTH_USER` / `APP_BASIC_AUTH_PASS`: If using basic auth
- `APP_OKTA_ISSUER`, `APP_OKTA_CLIENT_ID`, `APP_OKTA_REDIRECT_URI`: For Okta Sign In

## AEM Embed

Optional: Embed content (e.g. home hero, header, footer) from an [AEM Edge Delivery](https://www.aem.live/docs/aem-embed) or Document Authoring (DA) project using the `<aem-embed>` web component. Set `APP_AEM_EMBED_HEADER_URL` and/or `APP_AEM_EMBED_FOOTER_URL` to AEM.live page URLs. When set, the default Angular header/footer are replaced.

### Configuring CORS on the AEM/DA Project

For the embed to load from a different origin (e.g. `http://localhost:4200` or your deployed app), the AEM project must allow CORS. Per [AEM.live docs](https://www.aem.live/docs/aem-embed):

1. **Using the Configuration Service** (recommended): Add a `headers` entry in your [site configuration](https://www.aem.live/docs/admin.html#tag/siteConfig):

   ```json
   {
     "/fragments/**": [
       {
         "key": "access-control-allow-origin",
         "value": "*"
       }
     ]
   }
   ```

   Or restrict to your app origin(s):
   ```json
   {
     "key": "access-control-allow-origin",
     "value": "https://your-app.vercel.app"
   }
   ```

2. **Apply changes**: Use the [HTTP Headers Editor](https://labs.aem.live/tools/headers-edit/index.html) or update via the [Admin API](https://www.aem.live/docs/config-service-setup#update-custom-headers). For the config service, see [custom headers setup](https://aem.live/docs/custom-headers).

**Security note**: Using `*` can increase CSRF risk. Prefer listing specific origins when possible.

## Okta SSO

When `APP_OKTA_ISSUER` and `APP_OKTA_CLIENT_ID` are set, the header shows Sign In / Sign Out buttons using Okta. This mirrors the [SecurBank React app](https://github.com/ynakagawa/SecurBank) behavior. Configure your Okta application to allow the redirect URI (e.g. `http://localhost:4200/login/callback` for local development).
