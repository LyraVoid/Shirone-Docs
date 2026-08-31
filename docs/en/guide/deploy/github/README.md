---
title: Deploy to GitHub Pages
createTime: 2026/08/31 21:52:00
permalink: /en/guide/deploy/github/
---

GitHub Pages allows free hosting integrated directly with your GitHub repository.

## Step 1: Configure site and base

Edit `src/config/siteConfig.ts`:

**Scenario A: Deploying to `https://<username>.github.io`**

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  site: 'https://<username>.github.io',
  base: '/',
  // ...
}
```

**Scenario B: Deploying to `https://<username>.github.io/<repo>`**

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  site: 'https://<username>.github.io/<repo>',
  base: '/<repo>',
  // ...
}
```

::: warning Impact of base
When `base` is configured, internal links, RSS, Sitemap, and open graph assets will use this prefix. Always rebuild the project after modifying `base`.
:::

## Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml title=".github/workflows/deploy.yml"
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.14.4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step 3: Enable Pages

1. In repository settings, navigate to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` branch to trigger the deployment.

## Custom Domains

1. Set your domain in **Settings → Pages → Custom domain**.
2. Add a `CNAME` record pointing to `<username>.github.io` at your DNS provider.
3. Enable **Enforce HTTPS**.
4. When using a custom domain at root level, set `base` back to `/` and update `site` in `siteConfig.ts`.
