---
title: Deploy to EdgeOne Pages
createTime: 2026/08/31 21:54:00
permalink: /en/guide/deploy/edgeone/
---

EdgeOne Pages is a static site hosting platform by Tencent Cloud providing optimized edge delivery for visitors in mainland China.

## Highlights

- Low latency for readers in China via optimized edge nodes
- Generous free tier for personal static blogs
- Direct GitHub integration with build on push
- Automated SSL certificate management

## Prerequisites

- Code hosted on GitHub
- A Tencent Cloud account
- `site` configured in `src/config/siteConfig.ts` with your official domain

## Deployment Steps

::: steps

1. In the [Tencent Cloud Console](https://console.cloud.tencent.com/), search for **EdgeOne Pages**.

2. Click **Create Project → Import Git Repository** and authorize GitHub access.

3. Select your Shirone repository and production branch (`main`).

4. Configure build settings:

   | Setting | Value |
   | --- | --- |
   | Framework | `Astro` |
   | Build Command | `pnpm build` |
   | Output Directory | `dist` |
   | Install Command | `pnpm install` |

5. Under **Environment Variables**, add `NODE_VERSION = 22`.

6. Click **Confirm and Deploy**.

:::

## Custom Domains and ICP

- You can bind custom international domains directly with global acceleration.
- For mainland China edge node acceleration, custom domains require an active ICP filing in China.
