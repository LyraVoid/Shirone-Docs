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

### Step 1: Create Pages Project
1. In Cloudflare Dashboard, go to **Compute (Workers & Pages)** -> **Create** -> **Pages**;
2. Connect your GitHub account and select your theme repository;
3. Set build configuration:
   - **Framework preset**: None or Astro
   - **Build command**: `pnpm run build`
   - **Build output directory**: `dist`

![Cloudflare Pages Setup](/images/content-separation/04-deploy/02-hook/02-pages-deploy.png)

### Step 2: Environment Variables
Add environment variables under **Settings** -> **Environment variables**:

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `NODE_VERSION` | `22` | Node.js 22 runtime |
| `GIT_TERMINAL_PROMPT` | `0` | Disable interactive git prompts |
| `CONTENT_REPO_URL` | `https://x-access-token:TOKEN@github.com/USER/REPO.git` | Clone URL with token for private repos |

![Cloudflare Environment Variables](/images/content-separation/04-deploy/02-hook/06-env-config.png)

### Step 3: Create Deploy Hook
1. Go to **Settings** -> **Builds & deployments**;
2. Under **Deploy hooks**, click **Add deploy hook**;
3. Name it `content-update`, branch `main`, and copy the webhook URL.

![Cloudflare Deploy Hook](/images/content-separation/04-deploy/02-hook/07-deploy-hook-config.png)

### Step 4: Add Secret to Content Repo
In your content repository's **Settings** -> **Secrets and variables** -> **Actions**:
- **Name**: `CLOUDFLARE_DEPLOY_HOOK`
- **Secret**: Paste the webhook URL.

---

## 2. Vercel

1. Import your theme repository in Vercel;
2. Set Build Command to `pnpm run build` and Output Directory to `dist`;
3. Add Environment Variables: `NODE_VERSION` (22), `GIT_TERMINAL_PROMPT` (0), and `CONTENT_REPO_URL`;
4. Under **Settings** -> **Git** -> **Deploy Hooks**, create a hook for `main`;
5. Add the URL as `VERCEL_DEPLOY_HOOK` in your content repository secrets.

---

## 3. Tencent Cloud EdgeOne Pages

1. Create a Pages application linked to your theme repository;
2. Set build command to `pnpm run build` and output directory to `dist`;
3. Add environment variables: `NODE_VERSION`, `GIT_TERMINAL_PROMPT`, and `CONTENT_REPO_URL`;
4. Under **Triggers**, create a Deploy Hook for `main`;

![EdgeOne Deploy Hook](/images/content-separation/04-deploy/02-hook/12-edgeone-deploy-hook.png)

5. Add the URL as `EDGEONE_DEPLOY_HOOK` in your content repository secrets.

---

## 4. Netlify

1. Import theme repo and set build command to `pnpm run build`, publish directory to `dist`;
2. Configure environment variables in Site settings;
3. Under **Build & deploy** -> **Build hooks**, create a hook for `main`;
4. Add the URL as `NETLIFY_DEPLOY_HOOK` in your content repository secrets.

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
