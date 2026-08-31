---
title: Deploy to Vercel
createTime: 2026/08/31 21:50:00
permalink: /en/guide/deploy/vercel/
---

Vercel is the most seamless platform for deploying Shirone: automatic builds on Git push, global edge distribution, preview deployments out of the box, and a generous free tier for personal blogs.

## Prerequisites

- Code hosted on GitHub, GitLab, or Bitbucket
- `site` configured in `src/config/siteConfig.ts` with your official domain (e.g., `https://your-domain.com`), keeping `base` as `/`

::: tip Single Repo vs Dual Repo
For single repository setups where content is located directly in `src/content/`, follow this guide directly. For dual repository setups using Shirone-Content, set the `CONTENT_REPO_URL` environment variable in Vercel so `content:sync` can pull content during the build.
:::

## Method 1: Git Integration (Recommended)

::: steps

1. Visit [vercel.com/new](https://vercel.com/new) and import your Shirone repository.

2. Vercel will automatically detect the Astro project. Verify the build settings:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | `Astro` |
   | Build Command | `pnpm build` |
   | Output Directory | `dist` |
   | Install Command | `pnpm install` |

3. Under **Environment Variables**, add `NODE_VERSION = 22` to ensure the build environment meets Node.js ≥ 22.12 requirements.

4. Click **Deploy**. The initial build takes approximately 2-5 minutes, producing a `*.vercel.app` domain.

:::

Every subsequent push to the production branch (`main`) will trigger a production deployment. Pushes to other branches generate preview deployments for reviewing rendered articles before merging.

## Method 2: Vercel CLI

Useful when you prefer not to authorize Git integrations or wish to deploy directly from your local terminal:

```bash
pnpm add -g vercel

vercel          # First run: log in and link project
vercel --prod   # Deploy to production
```

The CLI automatically detects the Astro configuration. When prompted `Want to override the settings? [y/N]`, choose `N`.

::: warning Note
The CLI uploads the source code and runs the build on Vercel servers. If you only want to deploy pre-built local artifacts from `dist/`, refer to the Local Build guide.
:::

## Custom Domains

1. Go to **Settings → Domains** in your Vercel project and add your domain.
2. Add an `A` record pointing to `76.76.21.21` or a `CNAME` record pointing to `cname.vercel-dns.com` at your DNS provider.
3. Once DNS propagates, Vercel automatically provisions an SSL certificate.

## Customizing via vercel.json

The repository root includes `vercel.json` to customize platform behavior, such as caching static assets:

```json title="vercel.json"
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

## Troubleshooting

::: collapse
- Build Failure: Unsupported Node Version
  If the log reports `Unsupported engine` or syntax errors, verify that `NODE_VERSION` is set to `22` in environment variables.

- Build Timeout
  Shirone build includes content synchronization, icon generation, thumbnail rendering, font subsetting, and Pagefind indexing. If builds timeout, enable build cache in Vercel settings or use GitHub Actions to build and deploy artifacts via `vercel deploy dist --prod`.

- Search Unavailable
  Pagefind indices are generated at `dist/pagefind/` at the end of `pnpm build`. Ensure this directory is included in your deployed artifacts.
:::
