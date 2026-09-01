---
title: Server Deployment
createTime: 2026/08/31 21:55:00
permalink: /en/guide/deploy/server/
---

Deploying Shirone on your own VPS or dedicated server provides full control over caching headers, web server configurations, and storage.

## Core Concept

Shirone produces pure static HTML, CSS, JavaScript, and asset files in `dist/`. Server deployment consists of:

1. Copying `dist/` to your server.
2. Serving files using Nginx or Caddy.

## Step 1: Build Locally

```bash
pnpm install
pnpm build
```

The output files are generated in `dist/`. Preview locally to confirm:

```bash
pnpm preview
```

## Step 2: Upload Files to Server

Using `rsync` over SSH:

```bash
rsync -avz --delete dist/ user@your-server-ip:/var/www/shirone/
```

> [!IMPORTANT]
> **Crucial Caching Rule**
> Set `Cache-Control: no-cache` on HTML pages to ensure updates take effect immediately, while setting 1-year immutable caching on hashed assets under `/assets/*`.

## Step 3: Nginx Configuration

Create an Nginx configuration file (e.g., `/etc/nginx/conf.d/shirone.conf`):

```nginx title="/etc/nginx/conf.d/shirone.conf"
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/shirone;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    # Static asset caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA and clean URL routing fallback
    location / {
        try_files $uri $uri/ $uri.html /index.html =404;
    }

    error_page 404 /404.html;
}
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 4: SSL Certificate

Obtain a free Let's Encrypt certificate using Certbot:

```bash
sudo certbot --nginx -d your-domain.com
```

## Advanced: CI Automated Deployment (GitHub Actions)

Configure a GitHub Actions workflow to automatically install dependencies, build the static site, and perform incremental rsync over SSH on every push to `main`.

### 1. Configure GitHub Repository Secrets

In your GitHub repository, navigate to **Settings** -> **Secrets and variables** -> **Actions**, and add the following repository secrets:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `SERVER_HOST` | Server public IP or domain name | `1.2.3.4` or `vps.your-domain.com` |
| `SERVER_PORT` | Server SSH port (optional, default: 22) | `22` |
| `SERVER_USER` | Deployment SSH user (dedicated non-root recommended) | `deploy` |
| `SERVER_SSH_KEY` | SSH Private Key content (`id_ed25519`) | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `SERVER_TARGET` | Absolute path to the web root directory | `/var/www/shirone` |

> [!TIP] Content Separation Setup
> If using a private content repository, also add:
> - `CONTENT_ACCESS_TOKEN`: GitHub Personal Access Token with read permissions to your private content repository.

---

### 2. Server-Side Permissions & SSH Setup

For security, avoid using `root` directly. Set up a dedicated low-privilege `deploy` user:

::: steps
1. **Create Dedicated Deployment User**

   ```bash
   # Create a dedicated deployment user without password login
   sudo adduser --disabled-password --gecos "" deploy

   # Create site directory and grant ownership
   sudo mkdir -p /var/www/shirone
   sudo chown -R deploy:deploy /var/www/shirone
   ```

2. **Generate Dedicated Deployment SSH Key**

   ```bash
   # Switch to deploy user
   sudo su - deploy

   # Generate passwordless Ed25519 key pair
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_ed25519 -N ""

   # Append public key to authorized_keys
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys

   # Copy the private key content to SERVER_SSH_KEY Secret
   cat ~/.ssh/id_ed25519
   ```
:::

---

### 3. Create GitHub Actions Workflow File

#### Mode 1: Dual-Repo Content Separation <Badge text="Recommended" type="tip" />

In the decoupled dual-repo setup, the workflow coordinates between **Content Dispatch** and **Theme Deployment**:

::: tabs
@tab Content Repo Trigger
```yaml title=".github/workflows/trigger-build.yml"
name: Trigger Theme Build

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Dispatch build event to theme repository
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.DISPATCH_TOKEN }}
          repository: YOUR_GITHUB_USERNAME/YOUR_THEME_REPO_NAME
          event-type: content-update
```

@tab Theme Code Repo Deploy
```yaml title=".github/workflows/deploy.yml"
name: Deploy to Server (Decoupled)

on:
  push:
    branches: [main]
  repository_dispatch:
    types: [content-update]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Theme Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Sync Private Content & Build
        env:
          CONTENT_REPO_URL: "https://x-access-token:${{ secrets.CONTENT_ACCESS_TOKEN }}@github.com/${{ github.repository_owner }}/my-blog-content.git"
        run: |
          pnpm content:sync
          pnpm build

      - name: Deploy to Server via rsync
        uses: easingthemes/ssh-deploy@v5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: "-avz --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_PORT: ${{ secrets.SERVER_PORT || '22' }}
          REMOTE_USER: ${{ secrets.SERVER_USER }}
          TARGET: ${{ secrets.SERVER_TARGET }}
```
:::

---

#### Mode 2: Standard Monolithic Repository
If your content and theme code live in the same repository, create `.github/workflows/deploy.yml`:

```yaml title=".github/workflows/deploy.yml"
name: Deploy to Server

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Build Static Site
        run: pnpm build

      - name: Deploy to Server via rsync
        uses: easingthemes/ssh-deploy@v5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: "-avz --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_PORT: ${{ secrets.SERVER_PORT || '22' }}
          REMOTE_USER: ${{ secrets.SERVER_USER }}
          TARGET: ${{ secrets.SERVER_TARGET }}
```

## FAQ

::: collapse
- Visiting old content after update

  Check in sequence: verify rsync upload succeeded, verify Nginx `root` path points to the new `dist`, and clear browser cache (HTML should have `Cache-Control: no-cache`).

- Can I build directly on the server

  Yes (with Node 22 and pnpm installed), but full builds consume significant CPU and memory. Small VPS instances may hit OOM. Building locally or via CI and copying static files to the server is recommended.

- Can I use management panels (1Panel / aaPanel)

  Yes. Create a standard static website and place `dist/` contents into the site root directory. Keep the core rules: no-cache on HTML and 1-year immutable caching on hashed assets.
:::
