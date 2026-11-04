---
title: Local Build
createTime: 2026/08/31 21:57:00
permalink: /en/guide/deploy/local/
---

A local build serves as the foundational base for all static deployment methods: generating the `dist/` directory allows it to be served by any static hosting infrastructure. This page covers building and distributing artifacts; platform configurations are documented in [Deployment Overview](/en/guide/deploy/overview/).

This approach is suitable when requiring absolute control over generated files, writing offline, or reproducing platform build issues locally.

## Build

::: steps

1. **Install dependencies**

   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Execute full build**

   ```bash
   pnpm build
   ```

3. **Preview artifacts**

   ```bash
   pnpm preview
   ```

   Open `http://localhost:4321` in your browser to inspect page rendering, search indexing, and RSS feeds.

:::

In dual-repo mode, define `CONTENT_DIR` or `CONTENT_REPO_URL` in `.env` beforehand; `pnpm build` syncs the content repository automatically. See [Content Sources](/en/guide/content-separation/content-sources/).

## What pnpm build does

| Stage | Core task |
| --- | --- |
| `content:sync` | Syncs content repo files and compiles the configuration bridge |
| Image processing | Generates multi-size thumbnails and optimizes image formats |
| `astro build` | Statically compiles and renders all HTML pages and assets |
| `pagefind` | Indexes content to build offline search assets under `dist/pagefind/` |
| `fonts:check` | Verifies that subsetted fonts cover all characters used on pages |

::: warning
Never replace `pnpm build` with `astro build`, or the offline Pagefind search index will be omitted.
:::

## Output

```file-tree title="dist/"
dist/
├── index.html
├── pagefind/           # search index, must be included in distributions
├── assets/             # fingerprinted JS, CSS, images, and fonts
├── rss.xml
├── sitemap-index.xml
└── favicon.ico
```

Upload and distribute the entire directory without omitting subdirectories.

## Distributing the output

### Self-hosted server

```bash
rsync -avz --delete dist/ user@server:/var/www/shirone/dist/
```

Matching Nginx configuration is documented in [Deploy to a Server](/en/guide/deploy/server/).

### Vercel

```bash
pnpm dlx vercel@latest deploy dist --prod
```

### Cloudflare Pages

```bash
pnpm add -g wrangler
wrangler login
wrangler pages deploy dist --project-name=shirone-blog
```

### Object storage and CDN

Services such as Aliyun OSS and Tencent Cloud COS natively support static website hosting. Using the Tencent Cloud COS CLI as an example:

```bash
coscmd upload -rs dist/ /
```

Enable static website hosting in the cloud dashboard, bind your custom domain, and add CDN acceleration.

::: warning Disable the host build before uploading
Uploaded files are already built; do not allow hosting platforms to re-run builds:

- **Vercel**: set Framework Preset to `Other`, clear Build Command, and disconnect Git auto-deploy to avoid `Error: Command "pnpm build" exited with 1`;
- **Cloudflare Pages**: CLI uploads require creating a standalone Direct Upload project and cannot target Git-connected projects directly;
- **Netlify**: invoke `netlify deploy --prod --dir=dist` without appending `--build`.

Platform-specific setup paths are detailed on each platform guide.
:::

## Checks

- [ ] Verify that the homepage, article pages, archives, and search function properly under `pnpm preview`
- [ ] `dist/pagefind/` exists and contains search index fragments
- [ ] Build logs contain no frontmatter schema errors
- [ ] `site` points to your production URL (single repo: `siteConfig.ts`; dual repo: `config/site.yaml`)
- [ ] Article permalinks in `dist/rss.xml` resolve correctly

## Troubleshooting

::: collapse
- Build succeeds but search returns 404

  The `pagefind/` directory is missing from the output. This usually happens when the build command is changed to `astro build`. Revert to `pnpm build`.

- Local preview works properly but production displays errors

  Check production domain configuration in `site` and `base`, verify that uploaded `dist/` archives include all files (including hidden assets), and ensure intermediate CDNs or proxies do not cache HTML responses.

- How to speed up build iterations

  Use `pnpm dev` for routine writing; full builds are not required for previewing draft content. Reserve `pnpm build` for production deployment.
:::

## Next steps

- [Deployment Overview](/en/guide/deploy/overview/): compare different hosting platforms
- [Build Optimization](/en/guide/optimize-build/): explore build caching and performance tuning
