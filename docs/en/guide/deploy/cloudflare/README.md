---
title: Deploy to Cloudflare Pages
createTime: 2026/08/31 21:53:00
permalink: /en/guide/deploy/cloudflare/
---

Cloudflare Pages provides global CDN acceleration, free SSL certificates, and unlimited bandwidth for personal blogs.

## Prerequisites

- Code hosted on GitHub or GitLab
- A Cloudflare account
- `site` configured in `src/config/siteConfig.ts` with your official domain

## Method 1: Git Integration

::: steps

1. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages → Create → Pages → Connect to Git**.

2. Select your Git provider, authorize Cloudflare, and choose your Shirone repository.

3. Configure build settings:

   | Setting | Value |
   | --- | --- |
   | Project name | Your project name (determines `<name>.pages.dev`) |
   | Production branch | `main` |
   | Build command | `pnpm build` |
   | Build output directory | `dist` |

4. Under **Environment variables**, add `NODE_VERSION = 22` to satisfy Node.js ≥ 22.12 requirements.

   **Important:** The default Node.js version in Cloudflare build images is older than 22. Adding this variable is required.

5. Click **Save and Deploy**.

:::

## Method 2: Wrangler CLI

```bash
pnpm add -g wrangler

# Build locally
pnpm install
pnpm build

# Deploy output directory
wrangler pages deploy dist --project-name=<your-project-name>
```

## Custom Domains

::: steps

1. Go to your Pages project in Cloudflare Dashboard and select **Custom domains → Set up a custom domain**.
2. If your DNS is managed on Cloudflare, DNS records and SSL are configured automatically.
3. If DNS is hosted externally, add a `CNAME` pointing to `<project>.pages.dev`.

:::

## Troubleshooting

::: collapse
- Build Error: Node Version Unsupported
  Ensure `NODE_VERSION` is set to `22` in project Environment variables (under **Settings → Environment variables**).
:::
