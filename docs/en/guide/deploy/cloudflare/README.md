---
title: Deploy to Cloudflare Pages
createTime: 2026/08/31 21:53:00
permalink: /en/guide/deploy/cloudflare/
---

This guide covers Cloudflare Pages platform configuration. For decisions on build locations and managing platform build commands, see [Deployment Overview](/en/guide/deploy/overview/).

## Requirements

- Source code is pushed to a GitHub or GitLab repository;
- A Cloudflare account (the free tier is fully sufficient);
- `site` is set to your production domain (edit `src/config/siteConfig.ts` in single-repo mode, or `config/site.yaml` in the content repo).

::: caution
You must create a **Pages** project, not a Worker. Selecting the Worker type causes builds to fail with `__dirname is not defined`.
:::

## Option 1: Git integration

::: steps

1. **Create Pages project**

   Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**.

   ![Workers & Pages entry in the Cloudflare dashboard](/images/content-separation/04-deploy/02-hook/01-cloudflare.png)

2. **Select repository**

   Select your Git provider, grant permissions, and choose the Shirone repository.

   ![Selecting the Git provider and granting access](/images/content-separation/04-deploy/02-hook/03-github-connect.png)

   ![Choosing the Shirone repository from the list](/images/content-separation/04-deploy/02-hook/04-shirone-connect.png)

3. **Configure build parameters**

   Confirm the following build settings:

   ![Build configuration page in Cloudflare Pages](/images/content-separation/04-deploy/02-hook/05-default-build.png)

   | Setting | Value |
   | --- | --- |
   | Project name | Custom name; determines the `<name>.pages.dev` subdomain |
   | Production branch | `main` |
   | Build command | `pnpm build` |
   | Build output directory | `dist` |

4. **Add environment variables**

   Expand the environment variables section and configure the following:

   ![Environment variables section in Cloudflare Pages](/images/content-separation/04-deploy/02-hook/06-env-config.png)

   | Variable | Value | Purpose |
   | --- | --- | --- |
   | `NODE_VERSION` | `26` | Default build images bundle older Node versions |
   | `PNPM_VERSION` | `11.28.2` | Matches the pinned version in `packageManager` |
   | `GIT_TERMINAL_PROMPT` | `0` | Prevents interactive credential prompts from stalling builds |

   Dual-repo setups also require `CONTENT_REPO_URL`, and optionally `CONTENT_REPO_REF` when pinning a branch. See [Content Sources](/en/guide/content-separation/content-sources/).

5. **Deploy**

   Click **Save and Deploy**. Initial site builds take approximately 3 to 6 minutes.

:::

Subsequent pushes to `main` trigger production deployments, while pushes to other branches generate preview deployments with isolated preview URLs.

## Option 2: upload with Wrangler

Suitable when building locally or in external CI pipelines, without consuming Cloudflare Pages build minutes.

```bash
pnpm add -g wrangler
wrangler login
pnpm build
wrangler pages deploy dist --project-name=shirone-blog
```

::: warning A Git project cannot accept CLI uploads
A Pages project can only use one distribution mode: connected Git repository with automatic builds, or Direct Upload for prebuilt files. Running `wrangler pages deploy` against a Git-connected project returns an error.

To upload files via CLI, create a separate **Direct Upload** project in the dashboard (without linking Git or specifying build commands) and point `--project-name` to it.
:::

## Create a Deploy Hook

To rebuild automatically after the content repo pushes, go to **Settings -> Builds & deployments -> Deploy hooks**, fill in a name (for example `content-update`), select the `main` branch, and click **Add hook**:

![Cloudflare Deploy Hook configuration](/images/content-separation/04-deploy/02-hook/07-deploy-hook-config.png)

Copy the generated webhook URL once the hook is created:

![Webhook URL shown after the deploy hook is created](/images/content-separation/04-deploy/02-hook/08-webhook-success.png)

Hand this URL to the [deployment hooks](/en/guide/content-separation/deploy-hooks/) workflow.

## Custom domain

1. Open your project page, navigate to **Custom domains** -> **Set up a custom domain**, and enter your domain;
2. If your domain is managed under the same Cloudflare account, DNS records are added automatically. Otherwise, add a `CNAME` record pointing to `<name>.pages.dev` in your DNS provider;
3. SSL certificates are issued automatically once DNS records propagate.

## Caching

Cloudflare's default caching rules fit static websites well: short caches for HTML to reflect content updates quickly, and long caches for fingerprinted assets. For fine-grained control, place a `_headers` file in `public/`:

```ini title="public/_headers"
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/pagefind/*
  Cache-Control: public, max-age=86400
```

## Troubleshooting

::: collapse
- Build fails with `Unsupported engine`

  The `NODE_VERSION=26` environment variable is missing, or the build command is not using pnpm. Ensure Build Command is set to `pnpm build` and set `PNPM_VERSION=11.28.2`. Node.js 26 no longer bundles corepack; do not use `corepack enable` in place of manual installation.

- Build fails with `__dirname is not defined`

  The project was accidentally created as a Cloudflare Worker. Delete the Worker, create a Pages project instead, and reconnect the Git repository.

- Monthly build quota exceeded

  Cloudflare's free plan provides 500 build minutes per month. GitHub Actions and Pages builds count separately. For frequent minor post revisions, batch commits or use Wrangler to upload prebuilt files directly.

- High latency from mainland China

  Cloudflare network routing from mainland China can fluctuate. If most of your readership is located there, consider evaluating [EdgeOne Pages](/en/guide/deploy/edgeone/).
:::

## Next steps

- [Deployment Overview](/en/guide/deploy/overview/): compare other hosting providers
- [Deployment Hooks](/en/guide/content-separation/deploy-hooks/): trigger rebuilds via webhook after content updates
