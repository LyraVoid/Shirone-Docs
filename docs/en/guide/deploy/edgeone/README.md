---
title: Deploy to EdgeOne Pages
createTime: 2026/08/31 21:54:00
permalink: /en/guide/deploy/edgeone/
---

This guide covers EdgeOne Pages platform configuration. For decisions on build locations and managing platform build commands, see [Deployment Overview](/en/guide/deploy/overview/).

EdgeOne Pages is Tencent Cloud's static hosting platform, providing reduced network latency for readers in mainland China.

## Requirements

- Source code is pushed to a GitHub repository;
- An active Tencent Cloud account;
- `site` is set to your production domain (edit `src/config/siteConfig.ts` in single-repo mode, or `config/site.yaml` in the content repo).

## Deploy

::: steps

1. **Open console**

   Log into the [Tencent Cloud console](https://console.cloud.tencent.com/) and search for **EdgeOne Pages**.

2. **Import repository**

   Click **Create project** -> **Import Git repository**. Initial access redirects to GitHub for authorization.

3. **Select repository and branch**

   Select the Shirone repository and specify the production branch as `main`.

4. **Set build parameters**

   Configure the following parameters:

   | Setting | Value |
   | --- | --- |
   | Framework preset | `Astro` or "Static site" |
   | Build command | `pnpm build` |
   | Output directory | `dist` |
   | Node.js version | `24` |

   Set the build command explicitly to `pnpm build`. The theme's `preinstall` hook enforces pnpm usage; builds attempting to use npm fail during dependency installation.

5. **Execute deployment**

   Click deploy and wait for the build process to finish (approximately 3 to 5 minutes).

:::

Once deployment completes, EdgeOne assigns a domain in the format `<random>.edgeone.app`. Subsequent pushes to `main` automatically trigger new deployments.

## Custom domain

1. Open project management, go to **Domain management** -> **Custom domain**, and add your domain;
2. Follow console prompts to create the corresponding `CNAME` record with your DNS provider;
3. Once DNS records resolve, SSL certificates are issued automatically.

Domains without ICP filing remain usable via overseas or edge nodes. Domains with ICP registration can leverage full mainland acceleration nodes.

## Preview deployments

Pushes to non-production branches generate isolated preview environments with distinct URLs, allowing you to review MDX components, Mermaid diagrams, and complex layouts before merging.

## Troubleshooting

::: collapse
- Build fails with `only-allow pnpm`

  The build command is not using pnpm. Update the build configuration to `pnpm build`. If the image's bundled pnpm version is too old to validate the lockfile, adjust the build command to `npm i -g pnpm@11.28.2 && pnpm build`. EdgeOne does not currently provide a `PNPM_VERSION` variable, and Node.js 24 does not bundle corepack.

- Build fails due to Node version mismatch

  Confirm that the Node.js version is explicitly set to `24`. Node 24 is the current maximum supported version on EdgeOne, and Shirone builds reliably in this environment.

- How to configure the content source in dual-repo mode

  Add `CONTENT_REPO_URL` to project environment variables, and optionally `CONTENT_REPO_REF` when pinning branches. Keep the build command as `pnpm build`; do not prepend `pnpm content:sync &&`. See [Content Sources](/en/guide/content-separation/content-sources/).

- Search is non-functional

  Ensure that deployed artifacts contain the complete `dist/` directory, including the `dist/pagefind/` folder.
:::

## Next steps

- [Deployment Overview](/en/guide/deploy/overview/): compare other hosting providers
- [Deployment Hooks](/en/guide/content-separation/deploy-hooks/): trigger rebuilds via webhook after content updates
