---
title: Deployment Overview
createTime: 2026/11/03 10:00:00
permalink: /en/guide/deploy/overview/
---

Shirone builds to a static site output in `dist/`. Choosing a deployment method comes down to two decisions: **who executes the build**, and **how content updates trigger rebuilds**.

## Step 1: choose where to build

| Method | Builder | Primary strength | Notes |
| --- | --- | --- | --- |
| Platform Git integration | Platform build machine | Minimal setup; pushes trigger builds | Limited by platform Node/pnpm support and monthly build quotas |
| Platform Deploy Hook | Platform build machine | Content repo can trigger builds independently | Builds the latest branch HEAD, not guaranteed to match a specific push |
| GitHub Actions | GitHub Actions Runner | Tightly controlled versions; builds specific commit SHAs | Requires cross-repo dispatch secrets and access tokens |
| Local build | Local development machine | Total control over artifacts; works offline | Artifacts must be distributed manually or via scripts |
| Docker | Local machine or CI container | Complete environment isolation; simple rollbacks | Images must bundle matching pnpm and include the `scripts/` folder |

## Step 2: match the host settings

Configuration mismatches are the leading cause of deployment failures, typically occurring when the build runner conflicts with platform expectations.

**The host builds** (Git integration, Deploy Hook, Docker in-image builds):

- Keep the build command as `pnpm build` and output directory as `dist` in the platform dashboard;
- For dual-repo setups, configure `CONTENT_REPO_URL`, `CONTENT_REPO_REF`, and `GIT_TERMINAL_PROMPT=0` as platform environment variables;
- Do not prepend `pnpm content:sync` to build commands; `pnpm build` runs sync internally.

**Actions or a local build delivers `dist/`**:

- The host functions strictly as static asset hosting; disable platform builds;
- In platform settings, change Framework Preset to `Other`, clear Build Command and Output Directory, and disable Git auto-deploy triggers;
- The uploaded `dist/` contains no `package.json`, causing leftover build commands to fail with `Error: Command "pnpm build" exited with 1`.

::: warning
Choose only one of these approaches. After switching, trigger a new deployment for settings to take effect.
:::

## Platform reference

The table below applies to "the host builds" scenarios. If GitHub Actions or local builds deliver artifacts directly, disable platform builds as described above.

| Platform | Node version requirement | Build command | Output directory | Platform notes |
| --- | --- | --- | --- | --- |
| [Vercel](/en/guide/deploy/vercel/) | Select `26.x` in project settings | `pnpm build` | `dist` | Ignores `NODE_VERSION` environment variable |
| [Netlify](/en/guide/deploy/netlify/) | Set `NODE_VERSION=26` | `pnpm build` | `dist` | pnpm version determined by `packageManager` in `package.json` |
| [Cloudflare Pages](/en/guide/deploy/cloudflare/) | Set `NODE_VERSION=26` | `pnpm build` | `dist` | Also set `PNPM_VERSION=11.28.2`; project type must be Pages |
| [EdgeOne Pages](/en/guide/deploy/edgeone/) | Select `24` in console | `pnpm build` | `dist` | Edge hosting from Tencent Cloud; supports up to Node 24 |
| [GitHub Pages](/en/guide/deploy/github/) | Declare `26.13.0` in Actions | `pnpm build` | `dist` | Set `base` configuration when deploying to repository subpaths |
| [Server](/en/guide/deploy/server/) | Unrestricted on host | `pnpm build` | `dist` | Nginx static hosting; HTML should disable caching |
| [Docker](/en/guide/deploy/docker/) | Use `node:26-alpine` | `pnpm build` | `dist` | Never exclude `scripts/` in `.dockerignore` |
| [Local build](/en/guide/deploy/local/) | Use `26.13.0` locally | `pnpm build` | `dist` | Foundational base for all other distribution workflows |

::: info
Node.js 26 no longer bundles corepack. To install pnpm manually, run `npm install -g pnpm@11.28.2`.
:::

## Where dual-repo content comes from

There are two primary methods for syncing dual-repo content:

- **Host builds**: the host uses `CONTENT_REPO_URL` to fetch the remote content repo; see [Content Sources](/en/guide/content-separation/content-sources/#common-scenarios).
- **GitHub Actions builds**: content pushes trigger events, prompting the theme repo to check out content into `.content-src/` before building; see [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/).

To trigger host rebuilds after pushing to the content repo, see [Deployment Hooks](/en/guide/content-separation/deploy-hooks/).

## Pre-flight checklist

- [ ] `site` points to production URL, and `base` matches actual subpath
- [ ] Build command is explicitly set to `pnpm build`, not `astro build` or `npm run build`
- [ ] Output directory is `dist`, containing the complete `dist/pagefind/` folder
- [ ] Platform Node.js version meets requirements (Node 24 on EdgeOne, Node 26 elsewhere)
- [ ] Platform builds are disabled and build commands cleared when Actions or local builds deliver `dist/`
- [ ] Dual-repo setups have `CONTENT_REPO_URL`, `CONTENT_REPO_REF`, and `GIT_TERMINAL_PROMPT=0` configured
- [ ] `DISPATCH_TOKEN` is saved in the content repo, and `CONTENT_REPO_TOKEN` in the theme repo

## Next steps

Pick a target platform:

- [Vercel](/en/guide/deploy/vercel/)
- [Cloudflare Pages](/en/guide/deploy/cloudflare/)
- [EdgeOne Pages](/en/guide/deploy/edgeone/)
- [Netlify](/en/guide/deploy/netlify/)
- [GitHub Pages](/en/guide/deploy/github/)
- [Server](/en/guide/deploy/server/)
- [Docker](/en/guide/deploy/docker/)
- [Local build](/en/guide/deploy/local/)
