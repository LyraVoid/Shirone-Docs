---
title: Deploy to Netlify
createTime: 2026/08/31 21:51:00
permalink: /en/guide/deploy/netlify/
---

This guide covers Netlify platform configuration. For decisions on build locations and managing platform build commands, see [Deployment Overview](/en/guide/deploy/overview/).

## Requirements

- Source code is pushed to GitHub, GitLab, Bitbucket, or Azure DevOps;
- `site` is set to your production domain (edit `src/config/siteConfig.ts` in single-repo mode, or `config/site.yaml` in the content repo).

For dual-repo setups, configure `CONTENT_REPO_URL` (with an access token for private repos), optionally `CONTENT_REPO_REF`, and `GIT_TERMINAL_PROMPT=0` as platform environment variables. See [Content Sources](/en/guide/content-separation/content-sources/).

## Option 1: import from the dashboard

::: steps

1. **Import project**

   Log into the [Netlify dashboard](https://app.netlify.com/) and click **Add a new site** -> **Import an existing project**.

2. **Select repository**

   Choose your Git provider, grant permissions, and select the Shirone repository.

3. **Confirm build settings**

   Verify the following parameters:

   | Setting | Value |
   | --- | --- |
   | Build command | `pnpm build` |
   | Publish directory | `dist` |

4. **Add environment variables**

   Add `NODE_VERSION = 26`. For dual-repo mode, configure the three content source variables as well.

5. **Deploy**

   Click **Deploy** to initiate the build.

:::

## Option 2: netlify.toml

Commit build settings to the repository root to avoid relying on manual dashboard setup:

```toml title="netlify.toml"
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "26"
```

Push this file to your repository; Netlify reads and applies these settings on the next build.

## Option 3: CLI

```bash
pnpm add -g netlify-cli
netlify login
netlify init
netlify deploy --build --prod
```

`netlify init` links the repository and installs a deploy key so subsequent `git push` commands trigger automatic builds.

::: tip Already built locally?
`--build` causes the Netlify CLI to re-run the entire build locally. If you already ran `pnpm build`, upload existing artifacts directly:

```bash
netlify deploy --prod --dir=dist
```

The uploaded directory must include the complete `dist/pagefind/` folder.
:::

## Preview deployments

After importing, pushes to non-production branches and Pull Requests automatically generate isolated preview sites. Push drafts to a branch, inspect layouts on the preview URL, and merge into `main` when verified.

## Custom domain

1. Go to **Site settings** -> **Domain management** -> **Add a domain**, and enter your domain;
2. Configure DNS records according to the Netlify console instructions;
3. Let's Encrypt provisions and renews SSL certificates automatically.

## Troubleshooting

::: collapse
- Build fails with a pnpm version mismatch

  `NODE_VERSION` specifies only the Node.js runtime. Netlify prefers reading `packageManager` in `package.json` (this repository locks to `pnpm@11.28.2`). If versions still mismatch, adjust the build command in `netlify.toml`:

  ```toml
  [build]
    command = "npm i -g pnpm@11.28.2 && pnpm build"
    publish = "dist"
  ```

- Build fails because `corepack` is missing

  Node.js 26 no longer bundles corepack. Run `npm i -g corepack && corepack enable` prior to invocation, or install pnpm globally with npm directly.

- Too many files in a single deployment

  Netlify enforces limits on file counts and site size per deployment. Check `public/` to ensure uncompressed high-resolution images are not included inadvertently.

- High latency from mainland China

  Netlify CDN edge routing from mainland China can fluctuate. If most of your readership is in China, consider [EdgeOne Pages](/en/guide/deploy/edgeone/).
:::

## Next steps

- [Deployment Overview](/en/guide/deploy/overview/): compare other hosting providers
- [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/): build using GitHub Actions and deliver
