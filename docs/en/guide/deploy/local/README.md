---
title: Local Build
createTime: 2026/08/31 21:57:00
permalink: /en/guide/deploy/local/
---

Local building is the underlying primitive for all deployment methods: once you understand it, build steps on other platforms (Vercel, EdgeOne, servers, Docker) are simply the execution of the same workflow in different environments.

## Why Local Builds Matter

- **Full Control**: Build timing, output contents, and upload destinations are entirely in your hands.
- **Offline Authoring**: Write, preview, and build without an active network connection.
- **Artifact Reusability**: Build once, distribute simultaneously to any number of platforms.
- **Primary Debugging Tool**: When remote platform builds fail, local reproduction is the fastest way to isolate the issue.

::: tip Dual-Repo Mode
If content lives in a separate repository, set `CONTENT_DIR` (local content repo path) or `CONTENT_REPO_URL` (remote repository) in `.env`; `pnpm build` will automatically run `content:sync`. Site configuration should primarily be modified in the content repo's `config/site.yaml`; only single-repo setups edit `src/config/siteConfig.ts`.
:::

## Build Workflow

::: steps

1. **Install Dependencies**

   Lock versions using the lockfile to ensure strict environment consistency:
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Execute Full Production Build**

   Sequentially executes content synchronization, responsive thumbnail generation, Astro static rendering, font subsetting, and Pagefind search index generation:
   ```bash
   pnpm build
   ```

3. **Start Local Production Preview**

   Start a local production HTTP server to verify built artifacts and routes:
   ```bash
   pnpm preview
   ```
   Visit `http://localhost:4321` in your browser for comprehensive verification.

:::

::: info What Happens Inside pnpm build
Shirone's build is more than just `astro build`. The complete pipeline is:

1. `content:sync` — Synchronizes external content / validates frontmatter (content and configuration errors are caught here)
2. Icon generation and Moments thumbnail generation
3. `astro build` — Renders all static pages
4. Font subsetting — Trims font files based on characters actually used
5. Pagefind — Generates full-text search index (`dist/pagefind/`)
6. Font integrity check

Therefore, **do not** replace `pnpm build` with `astro build`, or critical assets like the search index will be missing.
:::

## Artifact Structure

```file-tree title="Local Build Artifacts (dist/)"
dist/
├── index.html          # Homepage and page HTML files
├── pagefind/           # Full-text search index (required)
├── assets/             # Fingerprinted JS/CSS/images/fonts
├── rss.xml             # RSS feed
├── sitemap-index.xml   # Sitemap
└── favicon.ico, etc.
```

When uploading and deploying, the **entire directory must be distributed together**, especially `pagefind/`.

## Ways to Distribute Artifacts

### Upload to Virtual Host / Server

```bash
# rsync (incremental, recommended)
rsync -avz --delete dist/ user@server:/var/www/shirone/

# scp (full copy)
scp -r dist/* user@server:/var/www/shirone/
```

For server-side Nginx configuration, see [Server Deployment](/en/guide/deploy/server/).

### Push to Platform Static Hosting

Taking Wrangler (Cloudflare Pages) as an example, local build artifacts can be uploaded directly without consuming platform build minutes:

```bash
pnpm add -g wrangler
wrangler login
wrangler pages deploy dist --project-name=shirone-blog
```

Vercel supports a similar approach: `vercel deploy dist --prod`.

::: warning Ensure Platform Build is Disabled Before Delivering Artifacts
When uploading pre-built artifacts using `vercel deploy dist` or `wrangler pages deploy`, the target platform must not execute builds again:

- **Vercel**: In project settings (Settings -> Build & Output Settings), change Framework Preset to `Other`, clear Build Command, and disconnect automatic Git builds. Otherwise, the residual `pnpm build` in the cloud will attempt to build `dist/` again, throwing `Command "pnpm build" exited with 1`.

- **Cloudflare Pages**: Cloudflare Pages does not support connecting to Git while also using Wrangler direct uploads. CLI delivery requires creating a separate **Direct Upload** project (created without Git connection and without build commands); running `wrangler pages deploy` against a project already connected to Git will be rejected with an error.

- **Netlify**: For manual delivery, simply run `netlify deploy --prod --dir=dist`; do not add the `--build` flag (which would re-run a build locally according to `netlify.toml`).
:::

### Object Storage + CDN

Alibaba Cloud OSS and Tencent Cloud COS both support static website hosting. Taking COS as an example:

```bash
# Using coscmd (installed via pip)
coscmd upload -rs dist/ /
```

Enable the "Static Website" feature, bind a custom domain, and configure CDN to begin serving traffic.

## Verification Checklist

Before deploying to any target, verify the following checklist:

- [ ] Homepage, posts, archives, and search function normally in `pnpm preview`
- [ ] `dist/pagefind/` directory exists and is non-empty
- [ ] No build warnings in the console (especially frontmatter validation errors)
- [ ] `site` in site config points to the production domain (`siteConfig.ts` for single repo, `config/site.yaml` for dual repo)
- [ ] Links in RSS (`dist/rss.xml`) resolve properly

## FAQ

::: collapse
- Build succeeds but search returns 404

  The output is missing `pagefind/`. This almost always occurs when the build command was replaced with `astro build`. Switch back to `pnpm build`.

- Local preview works but online site fails

  Compare the differences between the two environments: `site` / `base` configuration, whether the hosting platform uploaded the entire `dist/` (including hidden files), or whether upstream CDNs are caching HTML files inappropriately.

- Want to skip certain build steps to speed up previewing

  Use `pnpm dev` for authoring and previewing without running full builds. The complete pipeline of `pnpm build` is only required for the final production release.
:::
