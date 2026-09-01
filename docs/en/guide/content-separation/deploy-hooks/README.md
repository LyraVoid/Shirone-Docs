---
title: Deploy Hooks on Cloud Platforms
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/deploy-hooks/
---

# Deploy Hooks on Cloud Platforms

If you host your theme repository on Cloudflare Pages, Vercel, Tencent EdgeOne, or Netlify and rely on their native builders, you can trigger deployments via Deploy Hooks.

```mermaid
sequenceDiagram
    autonumber
    actor Author as Author
    participant ContentRepo as Content Repository
    participant Hosting as Hosting Platform Builder
    participant ThemeRepo as Theme Repository

    Author->>ContentRepo: git push new changes
    ContentRepo->>ContentRepo: Validate syntax & structure
    ContentRepo->>Hosting: Send POST request to Deploy Hook
    Hosting->>ThemeRepo: Clone theme repository
    Hosting->>ContentRepo: Fetch content via CONTENT_REPO_URL
    Hosting->>Hosting: Build static site with overlays
    Hosting->>Hosting: Deploy to global CDN nodes
```

---

## 1. Cloudflare Pages

::: steps
1. **Import Project & Build Settings**

   - In Cloudflare Dashboard, go to **Compute (Workers & Pages)** -> **Create** -> **Pages**;
   - Connect your GitHub account and select your theme repository;
   - Set build configuration:
     - **Framework preset**: None or Astro
     - **Build command**: `pnpm run build`
     - **Build output directory**: `dist`

   ![Cloudflare Pages Setup](/images/content-separation/04-deploy/02-hook/02-pages-deploy.png)

2. **Configure Environment Variables**

   Add environment variables under **Settings** -> **Environment variables**:

   | Variable | Recommended Value | Description |
   | :--- | :--- | :--- |
   | `NODE_VERSION` | `22` | Node.js 22 runtime |
   | `GIT_TERMINAL_PROMPT` | `0` | Disable interactive git prompts |
   | `CONTENT_REPO_URL` | `https://x-access-token:TOKEN@github.com/USER/REPO.git` | Clone URL with token for private repos |

   ![Cloudflare Environment Variables](/images/content-separation/04-deploy/02-hook/06-env-config.png)

3. **Create Deploy Hook**

   - Go to **Settings** -> **Builds & deployments**;
   - Under **Deploy hooks**, click **Add deploy hook**;
   - Name it `content-update`, branch `main`, and copy the webhook URL.

   ![Cloudflare Deploy Hook](/images/content-separation/04-deploy/02-hook/07-deploy-hook-config.png)

4. **Add Secret to Content Repository**

   In your content repository's **Settings** -> **Secrets and variables** -> **Actions**:
   - **Name**: `CLOUDFLARE_DEPLOY_HOOK`
   - **Secret**: Paste the webhook URL.
:::

---

## 2. Vercel

::: steps
1. **Import Project & Configure Build**

   - Import your theme repository in Vercel;
   - Set Build Command to `pnpm run build` and Output Directory to `dist`.

2. **Add Environment Variables**

   Under **Environment Variables**, configure:
   - `NODE_VERSION`: `22`
   - `GIT_TERMINAL_PROMPT`: `0`
   - `CONTENT_REPO_URL`: `https://x-access-token:TOKEN@github.com/USER/REPO.git`

3. **Create Deploy Hook**

   - Under **Settings** -> **Git** -> **Deploy Hooks**, create a hook for `main`;
   - Copy the generated Webhook URL.

4. **Add Secret to Content Repository**

   Add the URL as `VERCEL_DEPLOY_HOOK` in your content repository's Actions secrets.
:::

---

## 3. Tencent Cloud EdgeOne Pages

::: steps
1. **Create Pages Application**

   - Create a Pages application linked to your theme repository;
   - Set build command to `pnpm run build` and output directory to `dist`.

2. **Add Environment Variables**

   Add `NODE_VERSION`, `GIT_TERMINAL_PROMPT`, and `CONTENT_REPO_URL`.

3. **Create Deploy Hook Trigger**

   - Under **Triggers**, create a Deploy Hook for `main`;
   - Copy the trigger URL.

   ![EdgeOne Deploy Hook](/images/content-separation/04-deploy/02-hook/12-edgeone-deploy-hook.png)

4. **Add Secret to Content Repository**

   Add the URL as `EDGEONE_DEPLOY_HOOK` in your content repository's Actions secrets.
:::

---

## 4. Netlify

::: steps
1. **Import Project & Configure Build**

   - Import theme repo in Netlify;
   - Set build command to `pnpm run build` and publish directory to `dist`.

2. **Configure Environment Variables**

   In **Site configuration** -> **Environment variables**, add `NODE_VERSION`, `GIT_TERMINAL_PROMPT`, and `CONTENT_REPO_URL`.

3. **Create Build Hook**

   - Under **Build & deploy** -> **Continuous deployment** -> **Build hooks**, click **Add build hook**;
   - Name it and choose branch `main`, then save and copy the URL.

4. **Add Secret to Content Repository**

   Add the URL as `NETLIFY_DEPLOY_HOOK` in your content repository's Actions secrets.
:::

---

## Secret Reference Summary

| Platform | GitHub Secret Name | Trigger Mechanism |
| :--- | :--- | :--- |
| **CI Dispatch (Recommended)** | `DISPATCH_TOKEN` | Dispatches repository event to theme repo GitHub Actions |
| **Cloudflare Pages** | `CLOUDFLARE_DEPLOY_HOOK` | Sends HTTP POST request to Cloudflare deploy hook |
| **Vercel** | `VERCEL_DEPLOY_HOOK` | Sends HTTP POST request to Vercel deploy hook |
| **Tencent EdgeOne** | `EDGEONE_DEPLOY_HOOK` | Sends HTTP POST request to EdgeOne trigger hook |
| **Netlify** | `NETLIFY_DEPLOY_HOOK` | Sends HTTP POST request to Netlify build hook |

---

## Next Steps

- Head to [Troubleshooting & FAQ](/en/guide/content-separation/faq/): Solutions for authentication errors, draft filtering, and schema mismatches
