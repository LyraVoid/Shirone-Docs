---
title: Deploy to GitHub Pages
createTime: 2026/08/31 21:52:00
permalink: /en/guide/deploy/github/
---

This guide covers GitHub Pages platform configuration. For decisions on build locations and managing platform build commands, see [Deployment Overview](/en/guide/deploy/overview/).

GitHub Pages can host static websites at zero cost, but involves specific trade-offs when deploying Shirone:

- Deploying to a repository subpath `*.github.io/<repo>` requires setting `base`, which prefixes all internal paths;
- Builds run on GitHub Actions; public runners take noticeably longer than Vercel or EdgeOne;
- Published artifacts are capped at 1 GB total;
- Network performance from mainland China can be unstable.

If your code already resides on GitHub, Pages remains a practical option.

## Step 1: set site and base

Edit `src/config/siteConfig.ts`. In dual-repo mode, edit `config/site.yaml` in the content repo.

**Deploying to root domain `https://<username>.github.io`**

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  site: 'https://<username>.github.io',
  base: '/',
}
```

**Deploying to repository subpath `https://<username>.github.io/<repo>`**

```ts title="src/config/siteConfig.ts"
export const siteConfig = {
  site: 'https://<username>.github.io/<repo>',
  base: '/<repo>',
}
```

`base` must match the repository name exactly (including character casing), and must include leading and trailing slashes.

> Rebuild the site after modifying `base`. This parameter directly determines link paths, RSS feeds, sitemap entries, and social share images.

## Step 2: create the workflow

Create `.github/workflows/deploy.yml` in your repository root:

```yaml title=".github/workflows/deploy.yml"
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 11.28.2

      - uses: actions/setup-node@v4
        with:
          node-version: 26
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Neither `node-version: 26` nor `pnpm/action-setup` can be omitted, as the default GitHub Actions runner Node.js version does not satisfy the theme's minimum engine requirement.

## Step 3: enable Pages

1. Navigate to repository settings, click **Settings** -> **Pages**;
2. Under **Build and deployment**, set **Source** to **GitHub Actions**;
3. Push a commit to `main`, and verify the workflow completes under the **Actions** tab.

Once completed, the site becomes accessible at `https://<username>.github.io/<repo>`.

## Custom domain

1. Enter your custom domain under **Settings** -> **Pages** -> **Custom domain** and save;
2. Add a `CNAME` record in your DNS provider pointing to `<username>.github.io`;
3. Check **Enforce HTTPS** to ensure secure traffic;
4. In your configuration, set `base` back to `/` and update `site` to the custom domain.

## Dual-repo setup

Following content updates, the content repo workflow dispatches an event to the theme repo, which fetches the content commit SHA before running the build. See [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/); use Variant B of `deploy.yml.example` for the deploy configuration.

Required repository secrets:

- Content repo: `DISPATCH_TOKEN`;
- Theme repo: `CONTENT_REPO_TOKEN`.

## Troubleshooting

::: collapse
- Pages render blank or static assets return 404

  `base` does not match the actual deployed subpath. Confirm that `base` matches the repository name exactly, clear build caches, and redeploy.

- Actions builds time out

  Shirone contains extensive optimization steps. Refer to the `actions/cache` configuration in `deploy.yml.example` to cache thumbnails and reduce subsequent build times.

- Search is non-functional

  Ensure that `dist/pagefind/` exists in the output directory, and that `actions/upload-pages-artifact` uploads the complete `dist/` tree.
:::

## Next steps

- [Deployment Overview](/en/guide/deploy/overview/): compare other hosting providers
- [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/): set up automated dual-repo deployment
