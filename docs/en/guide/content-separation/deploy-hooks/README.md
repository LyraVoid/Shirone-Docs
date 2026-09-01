---
title: Cloud Deploy Hook Integrations
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/deploy-hooks/
---

# Cloud Deploy Hook Integrations

If you host your theme repository on Cloudflare Pages, Vercel, Tencent Cloud EdgeOne, or Netlify, you can utilize ==Deploy Hook Trigger Mode==.

In this setup, pushing updates to your private content repository triggers an HTTP POST request to your cloud provider's Deploy Hook endpoint, automatically initiating a remote build and sync.

```mermaid
sequenceDiagram
    autonumber
    actor Author as Author (Content Repo)
    participant ContentRepo as Private Content Repo
    participant Cloudflare as Cloudflare Pages / Vercel
    participant CDN as Production Edge

    Author->>ContentRepo: 1. git push new posts or config changes
    ContentRepo->>Cloudflare: 2. POST Trigger Deploy Hook Webhook
    Cloudflare->>ContentRepo: 3. Cloud runner pulls private content repo (via Token)
    Cloudflare->>Cloudflare: 4. Execute pnpm content:sync && pnpm build
    Cloudflare->>CDN: 5. Auto global edge distribution
```

---

## 1. Cloudflare Pages Setup <Badge text="Recommended" type="tip" />

::: steps
1. **Create Deploy Hook in Cloudflare Pages**

   - Log in to Cloudflare Dashboard -> **Workers & Pages**;
   - Select your project -> **Settings** -> **Builds & deployments**;
   - Scroll to **Deploy hooks** and click **Add deploy hook**;
   - **Deploy hook name**: e.g., `content-push`;
   - **Branch to build**: Select ==main==;
   - Click **Add hook** and **copy the generated URL**.

   ![Cloudflare Pages Create Deploy Hook](/images/content-separation/04-deploy/02-hook/07-deploy-hook-config.png)

2. **Configure Environment Variables in Cloudflare Pages**

   Go to **Settings** -> **Environment variables**:
   - **CONTENT_REPO_URL**: ==Private Git URL with Token=={.error}:
     ```text title="CONTENT_REPO_URL Format"
     https://x-access-token:YOUR_ACCESS_TOKEN@github.com/YOUR_USERNAME/my-blog-content.git
     ```
   - **Build command**: `pnpm content:sync && pnpm build`

3. **Configure Secret in Private Content Repository**

   - In your content repository, go to **Settings** -> **Secrets and variables** -> **Actions**;
   - Click **New repository secret**;
   - **Name**: ==CLOUDFLARE_DEPLOY_HOOK=={.tip};
   - **Secret**: Paste the Cloudflare Deploy Hook URL;
   - Click **Add secret**.

   ![Configure Cloudflare Secret](/images/content-separation/04-deploy/02-hook/11-actions-repository-secrets.png)

4. **Add Trigger Workflow in Content Repository**

   Create `.github/workflows/trigger-cloudflare.yml`:

   ```yaml title=".github/workflows/trigger-cloudflare.yml"
   name: Trigger Cloudflare Pages Build

   on:
     push:
       branches: [main]
     workflow_dispatch:

   jobs:
     deploy-hook:
       runs-on: ubuntu-latest
       steps:
         - name: Call Cloudflare Deploy Hook
           run: |
             curl -X POST "${{ secrets.CLOUDFLARE_DEPLOY_HOOK }}"
   ```
:::

---

## 2. Vercel Setup <Badge text="Popular" type="info" />

::: steps
1. **Create Deploy Hook in Vercel**

   - Log in to Vercel -> Select project -> **Settings** -> **Git**;
   - Scroll to **Deploy Hooks**;
   - **Hook Name**: `content-update`;
   - **Branch**: `main`;
   - Click **Create Hook** and copy the URL.

2. **Configure Environment Variables in Vercel**

   Go to **Settings** -> **Environment Variables**:
   - **CONTENT_REPO_URL**: `https://x-access-token:YOUR_TOKEN@github.com/YOUR_USERNAME/my-blog-content.git`
   - **Build Command**: `pnpm content:sync && pnpm build`

3. **Configure Secret in Content Repository**

   Under **Settings** -> **Secrets and variables** -> **Actions**:
   - **Name**: ==VERCEL_DEPLOY_HOOK=={.tip}
   - **Secret**: Paste the Vercel Webhook URL.
:::

---

## 3. Tencent Cloud EdgeOne Setup <Badge text="Fast" type="tip" />

::: steps
1. **Create Deploy Trigger in EdgeOne**

   - Log in to EdgeOne Pages -> Project Settings -> **Build & Deploy** -> **Deploy Hooks**;
   - Add hook for `main` branch and copy URL.

2. **Configure Environment Variables in EdgeOne**

   - **CONTENT_REPO_URL**: Git URL with Access Token;
   - **Build Command**: `pnpm content:sync && pnpm build`.

3. **Configure Secret in Content Repository**

   Under **Settings** -> **Secrets and variables** -> **Actions**:
   - **Name**: ==EDGEONE_DEPLOY_HOOK=={.tip}
   - **Secret**: Paste the EdgeOne Webhook URL.
:::

---

## 4. Netlify Setup

::: steps
1. **Create Build Hook in Netlify**

   - Go to **Site configuration** -> **Build & deploy** -> **Continuous deployment**;
   - Under **Build hooks**, click **Add build hook**;
   - Select `main` branch and copy the Webhook URL.

2. **Configure Secret in Content Repository**

   Under **Settings** -> **Secrets and variables** -> **Actions**:
   - **Name**: ==NETLIFY_DEPLOY_HOOK=={.tip}
   - **Secret**: Paste the Netlify Webhook URL.
:::

---

## Deploy Secret Reference Table

| Platform | GitHub Secret Name (Strict Match) | Trigger Type |
| :--- | :--- | :--- |
| **Cross-Repo CI (Recommended)** | `DISPATCH_TOKEN` <Badge text="Recommended" type="tip" /> | Dispatches GitHub Actions in theme repo for full build & font subsetting |
| **Cloudflare Pages** | `CLOUDFLARE_DEPLOY_HOOK` <Badge text="Edge" type="info" /> | Sends POST request to Cloudflare Deploy Hook |
| **Vercel** | `VERCEL_DEPLOY_HOOK` <Badge text="Global" type="info" /> | Sends POST request to Vercel Deploy Hook |
| **Tencent Cloud EdgeOne** | `EDGEONE_DEPLOY_HOOK` <Badge text="APAC" type="tip" /> | Sends POST request to EdgeOne Deploy Hook |
| **Netlify** | `NETLIFY_DEPLOY_HOOK` <Badge text="General" type="info" /> | Sends POST request to Netlify Build Hook |

---

## Next Steps

- Head to [Troubleshooting & FAQ](/en/guide/content-separation/faq/): View permission diagnosis, config overrides, and build error resolutions
