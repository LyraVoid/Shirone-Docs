---
title: Deploy to Netlify
createTime: 2026/08/31 21:51:00
permalink: /en/guide/deploy/netlify/
---

Netlify is an established static hosting platform offering Git-based continuous deployment, free SSL certificates, and automated deploy previews for pull requests.

## Prerequisites

- Code hosted on GitHub, GitLab, Bitbucket, or Azure DevOps
- `site` configured in `src/config/siteConfig.ts` with your official domain

## Method 1: Netlify Dashboard

::: steps

1. Log in to the [Netlify App](https://app.netlify.com/) and click **Add a new site → Import an existing project**.

2. Select your Git provider, authorize Netlify, and select your Shirone repository.

3. Confirm build settings:

   | Setting | Value |
   | --- | --- |
   | Build command | `pnpm build` |
   | Publish directory | `dist` |

4. Under **Environment variables**, add `NODE_VERSION = 22`.

5. Click **Deploy** to start the initial build.

:::

## Method 2: netlify.toml Configuration

Create a `netlify.toml` file in your repository root to version-control build configurations:

```toml title="netlify.toml"
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

Commit and push this file; Netlify will automatically detect and apply the configuration.

## Method 3: Netlify CLI

```bash
pnpm add -g netlify-cli

netlify login   # Authenticate via browser
netlify init    # Link Git repo and generate configuration
netlify deploy --build --prod   # Build and deploy to production
```

## Preview Deployments

Every push to non-production branches and every pull request generates an isolated deploy preview URL (`<branch>--<site-name>.netlify.app`), allowing you to review article rendering before merging to `main`.

## Custom Domains

::: steps

1. Navigate to **Site settings → Domain management → Add a domain** and enter your domain name.
2. Configure DNS records according to the instructions (Netlify DNS or external CNAME).
3. SSL certificates are automatically provisioned and renewed via Let's Encrypt.

:::

## Troubleshooting

::: collapse
- Build Failure: Package Manager Mismatch
  Ensure `NODE_VERSION = 22` is defined in environment variables. If necessary, update the build command to explicitly enable corepack: `corepack enable && pnpm build`.

- Artifact Size Limits
  Netlify limits deployments to 10,000 files. Shirone performs font subsetting and thumbnail compression automatically. If file count remains high, check `public/` for unoptimized raw assets.
:::
