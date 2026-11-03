---
title: Deployment Overview
createTime: 2026/11/03 10:00:00
permalink: /en/guide/deploy/overview/
---

Shirone builds to a fully static site in `dist/`. Deployment options differ only in **who builds**, **who hosts the output**, and **how a content update triggers a rebuild**.

## Decide two things first

### 1. Single repo or dual repo

| Mode | Content location | Site config | Best for |
| --- | --- | --- | --- |
| Single repo | `src/content/` in the theme repo | `src/config/siteConfig.ts` | Public content, fewer moving parts |
| Dual repo | `content/`, `data/`, `assets/`, `public/` in a content repo | `config/site.yaml` in the content repo (preferred) | Private content, independent theme upgrades |

In dual-repo mode, `content:sync` resolves the content source from `CONTENT_DIR`, `CONTENT_REPO_URL`, or `shirone.content.json`. `pnpm build` already runs this step, so keep the platform build command as `pnpm build`.

### 2. Where to build

| Method | Build location | Pros | Watch out for |
| --- | --- | --- | --- |
| Platform Git integration | Platform builder | Least setup, push to deploy | Platform Node/pnpm limits and build quotas |
| GitHub Actions + platform hook | GitHub runner | Controlled versions, content validation first | Extra dispatch configuration |
| Local build | Your machine | Full control, works offline | Manual upload |
| Docker | Local or CI | Isolated, rollback-friendly | Correct pnpm install; do not exclude `scripts/` |

::: warning Build location and platform settings must match
The choice of where to build directly dictates how the hosting platform should be configured. Mismatched settings will cause build or deployment errors:

- **Using Platform Git integration / Deploy Hook**: The build runs on the platform. The platform must keep the build command `pnpm build` and configure environment variables like `CONTENT_REPO_URL`.

- **Delivering artifacts via GitHub Actions or local build**: The platform serves purely as static hosting. You **must clear the Build Command**, change Framework Preset to `Other`, and disconnect automatic Git builds. Because the uploaded `dist/` directory does not contain `package.json`, any residual build command on the platform will fail and exit (typically `Error: Command "pnpm build" exited with 1`).

Choose one deployment method; trigger a new deployment after updating the settings.
:::

## Platform comparison

The table below serves as a reference when using "platform-managed builds"; if delivering `dist/` directly via Actions or local build, please disable the build command on the platform side as instructed above.

| Platform | Node version | Build command | Output | Notes |
| --- | --- | --- | --- | --- |
| [Vercel](/en/guide/deploy/vercel/) | `26.x` in project settings | `pnpm build` | `dist` | Does not read `NODE_VERSION` |
| [Netlify](/en/guide/deploy/netlify/) | `NODE_VERSION=26` | `pnpm build` | `dist` | pnpm comes from `packageManager`/mise |
| [Cloudflare Pages](/en/guide/deploy/cloudflare/) | `NODE_VERSION=26` | `pnpm build` | `dist` | Also set `PNPM_VERSION=11.28.2`; must be Pages, not Workers |
| [EdgeOne Pages](/en/guide/deploy/edgeone/) | `24` | `pnpm build` | `dist` | 24 is the highest selectable version; it builds fine |
| [GitHub Pages](/en/guide/deploy/github/) | `26.13.0` | `pnpm build` | `dist` | Set `base` for subpath deployments |
| [Server](/en/guide/deploy/server/) | Any | `pnpm build` | `dist` | Nginx; do not cache HTML |
| [Docker](/en/guide/deploy/docker/) | `node:26-alpine` | `pnpm build` | `dist` | Do not exclude `scripts/` in `.dockerignore` |
| [Local build](/en/guide/deploy/local/) | `26.13.0` | `pnpm build` | `dist` | The primitive behind every other method |

> Node.js 26 no longer bundles corepack. To install pnpm manually, use `npm install -g pnpm@11.28.2`; do not rely on bare `corepack enable` on Node 26.

## Dual-repo update flow

The recommended flow is "content repo validates → dispatch → theme repo builds":

1. The content repo receives a push under `content/`, `config/`, `data/`, `assets/`, `public/`, etc.;
2. Its `trigger-build.yml` calls `content-validate.yml`;
3. On success it sends `repository_dispatch` with event `content-updated` and a `sha` payload;
4. The theme repo checks out that content revision and runs `pnpm build`;
5. The selected option deploys to Vercel, GitHub Pages, a server, or a platform deploy hook.

Use the official `.github/workflows/deploy.yml.example` in the theme repo and `.github/workflows/trigger-build.yml.example` in the content repo instead of hand-written simplified workflows. See [Cross-repo CI dispatch](/en/guide/content-separation/ci-dispatch/).

If the platform builds directly, use a [Deploy Hook](/en/guide/content-separation/deploy-hooks/): the content repo POSTs to the platform, which checks out the theme repo and builds. Hooks normally build the branch HEAD, not necessarily the exact triggering commit; use Actions dispatch when exact SHA builds matter.

## Pre-deploy checklist

- [ ] `site` is the production domain and `base` matches the real path
- [ ] Build command is `pnpm build`, not `astro build`
- [ ] If delivering `dist/` via Actions or locally: Platform builds are disabled (Framework Preset = `Other`, Build Command cleared, Git auto-build disconnected)
- [ ] Output is `dist` and includes `dist/pagefind/`
- [ ] Platform Node version is supported: 24 on EdgeOne, 26 elsewhere
- [ ] pnpm matches `pnpm@11.28.2`
- [ ] Dual repo sets `CONTENT_REPO_URL`, `CONTENT_REPO_REF`, and `GIT_TERMINAL_PROMPT=0`
- [ ] `CONTENT_REPO_TOKEN` lives in the **theme repo**; `DISPATCH_TOKEN` lives in the **content repo**
