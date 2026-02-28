# SecurBank Angular

Angular port of the [SecurBank](https://github.com/ynakagawa/SecurBank) sample app - a banking demo that connects to Adobe AEM Headless CMS.

## Features

- **AEM Headless Integration**: Fetches content from Adobe Experience Manager via GraphQL persisted queries
- **Pages**: Home, Articles, Services, Article Detail
- **Authentication**: Supports service token auth and Okta SSO for Sign In / Sign Out (configure in environment)

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

Environment files are generated from `.env` before `npm start` and `npm run build`. See `env.example` for all `APP_*` variables. For production, create a backend proxy if using service tokens to keep credentials secure.

## Okta SSO

When `APP_OKTA_ISSUER` and `APP_OKTA_CLIENT_ID` are set, the header shows Sign In / Sign Out buttons using Okta. This mirrors the [SecurBank React app](https://github.com/ynakagawa/SecurBank) behavior. Configure your Okta application to allow the redirect URI (e.g. `http://localhost:4200/login/callback` for local development).
