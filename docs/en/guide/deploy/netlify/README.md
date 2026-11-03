---
title: Deploy to Netlify
createTime: 2026/08/31 21:51:00
permalink: /en/guide/deploy/netlify/
---

Netlify is an established static hosting platform offering Git-based continuous deployment, free SSL certificates, and automated deploy previews for pull requests.

## Prerequisites

- Code hosted on GitHub, GitLab, Bitbucket, or Azure DevOps
- `site` set to your official domain (single repo: `src/config/siteConfig.ts`; dual repo: `config/site.yaml` in the content repo)

::: tip Single repo vs dual repo
For dual-repo mode, set `CONTENT_REPO_URL` (private: `https://x-access-token:<TOKEN>@github.com/...`), optional `CONTENT_REPO_REF`, and `GIT_TERMINAL_PROMPT=0`. `pnpm build` already runs `content:sync`; keep the build command as `pnpm build`.
:::

## Method 1: Netlify Dashboard

::: steps

1. Log in to the [Netlify App](https://app.netlify.com/) and click **Add a new site → Import an existing project**.

2. Select your Git provider, authorize Netlify, and select your Shirone repository.

3. Confirm build settings:

   | Setting | Value |
   | --- | --- |
   | Build command | `pnpm build` |
   | Publish directory | `dist` |

4. Under **Environment variables**, add `NODE_VERSION = 26` (to satisfy Node.js ≥ 26.13.0).

5. Click **Deploy** to start the initial build.

:::

## Method 2: netlify.toml Configuration

Create a `netlify.toml` file in your repository root to version-control build configurations:

```toml title="netlify.toml"
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "26"
```

Commit and push this file; Netlify will automatically detect and apply the configuration.

## Method 3: Netlify CLI

```bash
pnpm add -g netlify-cli

netlify login   # Authenticate via browser
netlify init    # Link Git repo and generate configuration
netlify deploy --build --prod   # Build and deploy to production
```

::: tip Fast upload when dist is already built
Adding the `--build` flag makes the Netlify CLI run a full build locally according to configuration. If you have already executed `pnpm build`, directly uploading the existing artifacts is faster: `netlify deploy --prod --dir=dist` (ensure the output directory contains the `dist/pagefind/` search index).
:::

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

  `NODE_VERSION` controls Node, not pnpm. Netlify reads `package.json` `packageManager` (this repo pins `pnpm@11.28.2`), and newer images may install pnpm via mise. If the log still shows a mismatched pnpm, change the build command:

  ```toml
  [build]
    command = "npm i -g pnpm@11.28.2 && pnpm build"
    publish = "dist"
  ```

  Node.js 26 no longer bundles corepack, so bare `corepack enable` fails. If you must use corepack, run `npm i -g corepack` first.

- Artifact Size Limits

  Netlify limits deployments to 10,000 files. Shirone performs font subsetting and thumbnail compression automatically. If file count remains high, check `public/` for unoptimized raw assets.
:::
