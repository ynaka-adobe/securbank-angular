# SecurBank Angular

Angular port of the [SecurBank](https://github.com/ynakagawa/SecurBank) sample app - a banking demo that connects to Adobe AEM Headless CMS.

## Features

- **AEM Headless Integration**: Fetches content from Adobe Experience Manager via GraphQL persisted queries
- **Pages**: Home, Articles, Services, Article Detail
- **Authentication**: Supports service token auth (configure in environment)

## Prerequisites

- Node.js 18+
- Adobe AEM Cloud Service instance (or use the demo endpoint)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy and customize `src/environments/environment.ts` for your AEM instance:

   - `hostUri`: Your AEM publish URL
   - `graphqlEndpoint`: GraphQL endpoint path
   - `authMethod`: `'service-token'` | `'basic'` | `'dev-token'` | `'none'`

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

See `src/environments/environment.ts` for configuration options. For production, create a backend proxy if using service tokens to keep credentials secure.
