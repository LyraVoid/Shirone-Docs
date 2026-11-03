---
title: Deploy to Vercel
createTime: 2026/08/31 21:50:00
permalink: /en/guide/deploy/vercel/
---

Vercel requires little configuration: it builds on Git push, provides a global edge network and preview deployments, and its free tier is usually enough for a personal blog.

## Prerequisites

- Code hosted on GitHub, GitLab, or Bitbucket
- `site` set to your official domain (e.g., `https://your-domain.com`), keeping `base` as `/`. Single repo: `src/config/siteConfig.ts`; dual repo: `config/site.yaml` in the content repo

::: tip Single Repo vs Dual Repo
For single repository setups where content is located directly in `src/content/`, follow this guide directly. For dual repository setups using Shirone-Content, set these Vercel environment variables:

- `CONTENT_REPO_URL`: private repos use `https://x-access-token:<TOKEN>@github.com/...`
- `CONTENT_REPO_REF`: optional, defaults to `main`
- `GIT_TERMINAL_PROMPT`: `0`

`pnpm build` already runs `content:sync`; keep the build command as `pnpm build`.
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

3. Expand **Environment Variables** and add variables directly on the import screen. For dual-repo mode, set at least `CONTENT_REPO_URL`; add `CONTENT_REPO_REF` if you need to pin a branch, and set `GIT_TERMINAL_PROMPT=0`. You can also use **Import .env** or add them later under **Settings → Environment Variables**.

   | Key | Value |
   | --- | --- |
   | `CONTENT_REPO_URL` | `https://x-access-token:<TOKEN>@github.com/<OWNER>/<CONTENT_REPO>.git` |
   | `CONTENT_REPO_REF` | `main` (optional) |
   | `GIT_TERMINAL_PROMPT` | `0` |

   ![Adding environment variables on the Vercel import screen](/images/deploy/vercel/01-import-environment.png)

4. The Node.js version is not part of the import form. After the project is created, go to **Settings → General → Node.js Version** and select `26.x`. Vercel does **not** read a `NODE_VERSION` environment variable; it selects Node from project settings or `package.json` `engines.node`. This repo requires `>=26.13.0`, so Node 26 is selected automatically in most cases.

5. Click **Deploy**. The initial build takes approximately 2-5 minutes, producing a `*.vercel.app` domain.

   ![Vercel project overview after deployment](/images/deploy/vercel/02-project-overview.png)

:::

Every subsequent push to the production branch (`main`) will trigger a production deployment. Pushes to other branches generate preview deployments for reviewing rendered articles before merging.

## Change environment variables after deployment

If a variable was missed during import, or the token needs to change, open **Deployments** -> **Environments** in the project sidebar, choose the environment to edit (Production, Preview, or Development), and add or update the variables. Redeploy after saving so the new values are available to the build.

![Environments under Vercel Deployments](/images/deploy/vercel/03-environments.png)

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

  If the log reports `Unsupported engine` or syntax errors, check **Settings → General → Node.js Version** and select `26.x`. Setting a `NODE_VERSION` environment variable has no effect on Vercel.

- Build Timeout

  Shirone build includes content synchronization, icon generation, thumbnail rendering, font subsetting, and Pagefind indexing. If builds timeout, enable build cache in Vercel settings or use GitHub Actions to build and deploy artifacts via `vercel deploy dist --prod`.

- Search Unavailable

  Pagefind indices are generated at `dist/pagefind/` at the end of `pnpm build`. Ensure this directory is included in your deployed artifacts.
:::
