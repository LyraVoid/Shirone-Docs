---
title: Cross-Repo CI Dispatch
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/ci-dispatch/
---

# Cross-Repo CI Dispatch

This is the recommended automated deployment workflow.

Each push to your content repository automatically notifies the theme code repository. GitHub Actions in the theme repo fetches your content, validates configuration, subsets fonts, builds static assets, and deploys online.

```mermaid
sequenceDiagram
    autonumber
    actor Author as Author
    participant ContentRepo as Content Repository
    participant ThemeRepo as Theme Repository
    participant DeployHost as Hosting Platform

    Author->>ContentRepo: git push new posts or config
    ContentRepo->>ContentRepo: trigger-build.yml validates syntax
    ContentRepo->>ThemeRepo: Dispatch content-updated event with DISPATCH_TOKEN
    ThemeRepo->>ContentRepo: Fetch latest content & merge config overlays
    ThemeRepo->>ThemeRepo: Subset fonts & build static output
    ThemeRepo->>DeployHost: Deploy artifacts to GitHub Pages / Cloudflare / Vercel
```

---

## Step 1: Create a GitHub Personal Access Token

1. **Go to Settings**: Click your avatar on GitHub and select Settings;

   ![Click Settings](/images/content-separation/04-deploy/01-dispatch/01-settings-click.png)

2. **Developer Settings**: Scroll down the left sidebar to Developer Settings;

   ![Developer Settings](/images/content-separation/04-deploy/01-dispatch/02-developer-settings.png)

   ![Developer Settings Menu](/images/content-separation/04-deploy/01-dispatch/03-developer-settings-menu.png)

3. **Fine-grained Tokens**: Click Personal access tokens -> Fine-grained tokens;

   ![Fine-grained Tokens](/images/content-separation/04-deploy/01-dispatch/04-fine-grained-tokens.png)

4. **Generate Token**: Click Generate new token;

   ![Generate New Token](/images/content-separation/04-deploy/01-dispatch/05-generate-new-token.png)

5. **Configure Permissions**:
   - **Token name**: `DISPATCH_TOKEN`;
   - **Repository access**: Select **Only select repositories**, and choose your **theme code repository**;

     ![Repository Access](/images/content-separation/04-deploy/01-dispatch/06-repository-access.png)

   - **Permissions**: Under Repository permissions, find **Contents** and set it to **Read and write**;

     ![Contents Permission](/images/content-separation/04-deploy/01-dispatch/07-contents-permission.png)

6. **Copy Token**: Click Generate token and copy the string immediately.

   ![Generate PAT Token](/images/content-separation/04-deploy/01-dispatch/08-generate-pat-token.png)

---

## Step 2: Configure Secret in Content Repository

1. In your **content repository**, ensure `.github/workflows/trigger-build.yml` is enabled;
2. Go to **Settings** -> **Secrets and variables** -> **Actions**;
3. Click **New repository secret**;
4. Set **Name** to `DISPATCH_TOKEN` and paste your token in **Secret**;
5. Click **Add secret**.

---

## Step 3: Enable Deploy Workflow in Theme Repository

1. In your **theme code repository**, rename `.github/workflows/deploy.yml.example` to `deploy.yml`;
2. Edit the environment variable:
   ```yaml
   env:
     CONTENT_REPOSITORY: YOUR_USERNAME/my-blog-content
     CONTENT_WORKING_COPY: .content-src
   ```
3. If the content repository is private, add a token named `CONTENT_REPO_TOKEN` with read access to the content repository in the theme repo's Secrets;
4. Commit and push to main.

---

## Step 4: Verify Automation

Push a commit in your content repository:

```bash
git add .
git commit -m "feat: publish new article"
git push origin main
```

Check the Actions tab in both repositories to monitor the dispatch and build progress.

---

## Concurrency Control and Rollback

- **Concurrency Control**: Ongoing builds are automatically cancelled when a new push arrives (`cancel-in-progress: true`), preventing race conditions;
- **Zero-Code Emergency Rollback**: In your theme repo's Actions tab, trigger the Deploy workflow manually and specify any historical commit SHA in `content_ref` to rollback instantly.

---

## Next Steps

- Head to [Deploy Hooks on Cloud Platforms](/en/guide/content-separation/deploy-hooks/): Configure Cloudflare Pages, Vercel, and EdgeOne deploy hooks
