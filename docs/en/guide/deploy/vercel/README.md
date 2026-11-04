---
title: Deploy to Vercel
createTime: 2026/08/31 21:50:00
permalink: /en/guide/deploy/vercel/
---

This guide covers Vercel platform configuration. For decisions on build locations and managing platform build commands, see [Deployment Overview](/en/guide/deploy/overview/).

Vercel can build directly from Git repositories, or receive prebuilt static `dist/` artifacts. Choose one workflow.

## Requirements

- Source code is pushed to GitHub, GitLab, or Bitbucket;
- `site` is set to your production domain (edit `src/config/siteConfig.ts` in single-repo mode, or `config/site.yaml` in the content repo).

## Option 1: Git integration (the host builds)

::: steps

1. **Import repository**

   Visit [vercel.com/new](https://vercel.com/new) and import the Shirone repository.

2. **Confirm build settings**

   Vercel detects Astro and suggests default settings; confirm the following parameters:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | `Astro` |
   | Build Command | `pnpm build` |
   | Output Directory | `dist` |
   | Install Command | `pnpm install` |

3. **Add environment variables**

   Skip for single-repo mode. For dual-repo mode, expand **Environment Variables** and add:

   | Key | Value |
   | --- | --- |
   | `CONTENT_REPO_URL` | `https://x-access-token:<TOKEN>@github.com/<OWNER>/<CONTENT_REPO>.git` |
   | `CONTENT_REPO_REF` | `main` (optional) |
   | `GIT_TERMINAL_PROMPT` | `0` |

   Public content repos can use `https://github.com/<OWNER>/<CONTENT_REPO>.git` directly without tokens.

4. **Select Node.js version**

   After project initialization, navigate to **Settings** -> **General** -> **Node.js Version** and select `26.x`. Vercel does not read the `NODE_VERSION` environment variable.

5. **Deploy**

   Click **Deploy**. Initial full site builds take approximately 2 to 5 minutes.

:::

![Environment variables on the Vercel import screen](/images/deploy/vercel/01-import-environment.png)

![Vercel project overview after deployment](/images/deploy/vercel/02-project-overview.png)

Subsequent pushes to `main` trigger production deployments, while pushes to other branches generate preview deployments with isolated preview URLs.

### Change environment variables later

If variables were omitted during setup or tokens need rotation, navigate to **Deployments** -> **Environments**, select Production, Preview, or Development, modify the value, and redeploy.

![Environments under Deployments](/images/deploy/vercel/03-environments.png)

## Option 2: deliver dist from Actions or a local build

Build with GitHub Actions or locally, then upload static files directly to Vercel. See [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/) or [Local Build](/en/guide/deploy/local/).

Before uploading, configure the Vercel project as pure static hosting:

1. Go to **Settings** -> **Build & Output Settings**;
2. Change **Framework Preset** to `Other`;
3. Turn off the **Build Command** override switch and clear its text field;
4. Turn off the **Output Directory** override switch and clear its text field;
5. Navigate to **Settings** -> **Git**, and disconnect the repository or disable automatic deployments.

Disconnecting Git alone is not sufficient; build commands remain stored in project settings and must be cleared manually.

Deploy using the CLI:

```bash
pnpm dlx vercel@latest deploy dist --prod
```

Initial runs require logging in and linking your project.

## Custom domain

1. Go to **Settings** -> **Domains** and bind your custom domain;
2. Configure an `A` record pointing to `76.76.21.21`, or a `CNAME` record pointing to `cname.vercel-dns.com`;
3. Once DNS propagation finishes, SSL certificates are issued automatically.

## vercel.json

The repository root includes a default `vercel.json` for configuring asset cache headers:

```json title="vercel.json"
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

## Troubleshooting

::: collapse
- Deployment log reports `Command "pnpm build" exited with 1`

  The project uses artifact upload, but Vercel still attempts to run a build command. Follow Option 2 to clear Build Command and Output Directory, then redeploy. When logs no longer show `Running "vercel build"`, the setting is active.

- Build fails due to outdated Node version

  Go to **Settings** -> **General** -> **Node.js Version** and select `26.x`. Setting `NODE_VERSION` as an environment variable has no effect on Vercel.

- Build times out

  Shirone builds encompass content synchronization, image optimization, font subsetting, and Pagefind search indexing. If builds time out repeatedly, build with GitHub Actions and upload prebuilt output instead; see [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/).

- Search is non-functional

  Ensure that the deployed directory includes the complete `dist/pagefind/` folder. Custom CI configurations often miss this directory due to file filters.
:::

## Next steps

- [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/): build using Actions and deliver to Vercel
- [Deployment Overview](/en/guide/deploy/overview/): compare other hosting providers
