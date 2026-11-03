---
title: Deploy to Cloudflare Pages
createTime: 2026/08/31 21:53:00
permalink: /en/guide/deploy/cloudflare/
---

Cloudflare Pages provides global CDN acceleration, free SSL certificates, and unlimited bandwidth for personal blogs.

## Prerequisites

- Code hosted on GitHub or GitLab
- A Cloudflare account
- `site` set to your official domain (single repo: `src/config/siteConfig.ts`; dual repo: `config/site.yaml`)

> [!IMPORTANT]
> **Mandatory Node.js Version Variable**
> Cloudflare Pages build runners default to an older Node.js runtime. You must specify `NODE_VERSION = 26` in project Environment variables to meet engine requirements (Node.js ≥ 26.13.0, Node.js 26 LTS).

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

4. Under **Environment variables**, add:

   | Variable | Value | Why |
   | --- | --- | --- |
   | `NODE_VERSION` | `26` | Cloudflare's default image ships an older Node |
   | `PNPM_VERSION` | `11.28.2` | Matches the repo's `packageManager` pin |
   | `GIT_TERMINAL_PROMPT` | `0` | Prevents interactive credential prompts when pulling a private content repo |

   For dual-repo mode, also set `CONTENT_REPO_URL` (private: `https://x-access-token:<TOKEN>@github.com/...`) and optional `CONTENT_REPO_REF=main`.

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

::: tip
CLI deployment skips the platform build step. Running `pnpm build` locally already includes the Pagefind index and font subsetting in the output artifacts, so uploading delivers full functionality.
:::

::: warning Git-integrated projects do not support direct CLI upload
A Cloudflare Pages project **must either connect to Git for automatic builds, or use Direct Upload for artifacts**; the two cannot be mixed. Running `wrangler pages deploy` against a project already connected to Git in Method 1 will fail with an error. For CLI deployment, go to **Workers & Pages -> Create -> Pages -> Upload assets** to create a separate Direct Upload project (no build command needed), and point the `--project-name` argument to it.
:::

## Custom Domains

::: steps

1. Go to your Pages project in Cloudflare Dashboard and select **Custom domains → Set up a custom domain**.
2. If your DNS is managed on Cloudflare, DNS records and SSL are configured automatically.
3. If DNS is hosted externally, add a `CNAME` pointing to `<project>.pages.dev`.

:::

## Troubleshooting

::: collapse
- Build Error: Node Version Unsupported

  Ensure `NODE_VERSION` is set to `26` in project Environment variables (under **Settings → Environment variables**) and `PNPM_VERSION=11.28.2`. Node.js 26 no longer bundles corepack; do not fall back to `corepack enable`. If you must install pnpm manually, use `npm i -g pnpm@11.28.2`.

- Build Error: `__dirname is not defined`

  The project was created as a **Worker**, not a **Pages** project. Workers do not provide Node's `__dirname`, so Shirone's build scripts fail. Delete the Worker project and create a **Pages** project connected to Git instead.

- Dual-repo mode

  Set `CONTENT_REPO_URL`, `CONTENT_REPO_REF=main`, and `GIT_TERMINAL_PROMPT=0`. `pnpm build` already includes `content:sync`; keep the build command as `pnpm build` and do not prepend another sync. Site config belongs in the content repo's `config/site.yaml`.
:::
