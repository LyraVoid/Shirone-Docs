---
title: Deploy to a Server
createTime: 2026/08/31 21:55:00
permalink: /en/guide/deploy/server/
---

This guide explains how to set up Shirone on your personal cloud server or VPS.

Shirone outputs static web files (HTML, CSS, images, etc.). Your server only needs web server software such as Nginx to host these files. We recommend running the site build process automatically via GitHub Actions.

:::: card-grid
::: card title="No Node.js Required on Server" icon="ri:cpu-line"
Building runs on GitHub, so you don't need Node.js or pnpm on your server.

Building a static website consumes CPU and memory. Running it directly on small servers may cause memory shortages.
:::

::: card title="Transfer Only Changed Files" icon="ri:speed-up-line"
Uses rsync to compare file differences.

Unchanged photos, fonts, and older posts are skipped during transfer, saving network bandwidth and time.
:::

::: card title="Clean Up Old Web Pages" icon="ri:delete-bin-line"
Synchronization automatically removes stale files on the server.

When you rename or delete an article, old pages are removed automatically to prevent invalid URLs.
:::

::: card title="Automatic Push to Publish" icon="ri:rocket-line"
Pushing posts to your repository automatically triggers building and syncing.

You do not need to log into the server manually for each update.
:::
::::

---

## Automated Deployment: GitHub Actions Build and Server Sync <Badge type="tip" text="Recommended" vertical="middle" />

The workflow works as follows: when you push code or articles to GitHub, GitHub automatically downloads dependencies, builds the website into the `dist/` directory, and transfers the generated files to your server over SSH.

```mermaid
flowchart LR
    A["Push articles or code<br/>(git push)"] --> B["GitHub Automated Processing"]
    subgraph GHA ["GitHub Actions (Cloud Environment)"]
        B --> C["Download dependencies"]
        C --> D["Run pnpm build to generate dist/"]
        D --> E["Read configured SSH key"]
    end
    E -->|Upload changed files via rsync| F["Your Server"]
    subgraph ServerHost ["Server Directory /var/www/shirone/dist"]
        F --> G["Nginx serves web pages"]
    end
```

### Step 1: Prepare a dedicated user and directory on the server

Avoid using the root superuser account for automated uploads. Create a dedicated user named `deploy` to receive uploaded website files:

::: steps

1. **Create the dedicated system user and site directory**

   Run the following commands in your server terminal:

   ```bash
   sudo adduser --disabled-password --gecos "" deploy
   sudo mkdir -p /var/www/shirone/dist
   sudo chown -R deploy:deploy /var/www/shirone
   ```

2. **Generate SSH keys for login**

   Switch to the `deploy` user and generate an SSH key pair (a public key and a private key):

   ```bash
   sudo su - deploy
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_ed25519 -N ""
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Copy the private key text**

   View and copy the private key:

   ```bash
   cat ~/.ssh/id_ed25519
   ```

   Copy the entire output (starting with `-----BEGIN OPENSSH PRIVATE KEY-----` through the end line) to save for GitHub Secrets later.

:::

::: tip Directory Permission Check
Nginx typically runs under the `www-data` or `nginx` user and needs permission to read and enter `/var/www/shirone/dist`.

If visiting the site gives a 403 Forbidden error, fix permissions with:

```bash
sudo chmod 755 /var/www /var/www/shirone /var/www/shirone/dist
```
:::

---

### Step 2: Configure repository Secrets in GitHub

Go to your code repository page on GitHub:

Click **Settings** -> **Secrets and variables** -> **Actions**, click **New repository secret**, and add the following entries:

::: table copy align="center"
| Secret Name | Required | Description | Example Value |
| --- | --- | --- | --- |
| `DEPLOY_HOST` | Yes | Your server public IP address or configured domain name | `123.45.67.89` |
| `DEPLOY_USER` | Yes | The username created on your server in Step 1 | `deploy` |
| `DEPLOY_SSH_KEY` | Yes | The full private key text copied in Step 1 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `DEPLOY_DIR` | Yes | Path to the directory on your server (files sync into the dist folder here) | `/var/www/shirone` |
| `DEPLOY_PORT` | No | Server SSH connection port (only needed if different from port 22) | `22` or custom port |
:::

::: note Content Separation Mode Note
If you separated your blog into a code repository and a content repository, you need two additional access tokens so the content repo can notify the code repo when changes occur. See [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/).
:::

---

### Step 3: Enable the automated deployment workflow

The theme repository includes a ready-to-use template file `.github/workflows/deploy.yml.example`.

In your code repository root directory, copy it without the `.example` suffix:

```bash
cp .github/workflows/deploy.yml.example .github/workflows/deploy.yml
```

#### Synchronization steps in the workflow

In `.github/workflows/deploy.yml`, the following steps build the site and sync it to your server:

```yaml title=".github/workflows/deploy.yml"
      # 1. Build the site to generate files in dist
      - name: Build site
        run: pnpm build

      # 2. Sync the built dist directory to the server
      - name: Deploy to server via rsync
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          DEPLOY_DIR: ${{ secrets.DEPLOY_DIR || '/var/www/shirone' }}
          DEPLOY_PORT: ${{ secrets.DEPLOY_PORT || '22' }}
        run: |
          set -euo pipefail

          # Create SSH directory and write private key
          mkdir -p ~/.ssh && chmod 700 ~/.ssh
          printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key

          # Store server public key to prevent interactive confirmation prompts
          ssh-keyscan -p "$DEPLOY_PORT" -H "$DEPLOY_HOST" >> ~/.ssh/known_hosts

          # Sync changed files using rsync
          rsync -avz --delete \
            -e "ssh -i ~/.ssh/deploy_key -p $DEPLOY_PORT -o StrictHostKeyChecking=accept-new" \
            dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR/dist/"
```

#### rsync command parameter explanation

```bash
rsync -avz --delete \
  -e "ssh -i ~/.ssh/deploy_key -p $DEPLOY_PORT -o StrictHostKeyChecking=accept-new" \
  dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR/dist/"
```

- `-a`: Preserves original file permissions, ownership, and modification timestamps;
- `-v`: Displays which files are transferred in the GitHub log;
- `-z`: Compresses data during transfer to reduce bandwidth usage;
- `--delete`: Removes files on the server that no longer exist in the local build, keeping both sides consistent;
- `-e "ssh ..."`: Connects over SSH using the configured private key;
- `dist/`: Note the trailing slash `/`, which synchronizes the contents inside `dist` rather than creating a nested folder.

---

## Server Web Service Setup (Nginx and HTTPS)

After files are transferred to the server, configure Nginx to receive visitors and serve the website.

### Configure Nginx

Create a configuration file on your server, such as `/etc/nginx/conf.d/shirone.conf`:

```nginx title="/etc/nginx/conf.d/shirone.conf"
server {
    listen 80;
    server_name your-domain.com;

    # Point to the directory containing web files
    root /var/www/shirone/dist;
    index index.html;

    # Static assets like images and fonts can have longer cache times
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Search index files can change when content updates
    location /pagefind/ {
        expires 24h;
    }

    # HTML pages should not be cached so visitors see new posts right away
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
    }

    # Enable Gzip compression to speed up page loading
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

Verify that the configuration format is valid, then reload Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

::: info About the try_files rule
Shirone generates a separate HTML file for every post.

When someone accesses a URL that does not exist, Nginx returns a 404 page directly, which helps both visitors and search engines recognize invalid links.
:::

---

### Configure HTTPS Certificates (Certbot)

Use Certbot to request a free Let's Encrypt certificate and enable HTTPS encryption:

```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Follow the prompts to enter your email and accept the terms of service. Certbot updates Nginx automatically and configures automatic renewal.

---

## Fallback: Build Locally and Upload Manually

If you do not want to configure GitHub Actions yet, you can build the site on your computer and upload files manually:

::: steps

1. **Build on your local computer**

   ```bash
   pnpm install --frozen-lockfile
   pnpm build
   pnpm preview   # Open http://localhost:4321 in your browser to preview
   ```

2. **Upload using the rsync command**

   ```bash
   # Upload files in the dist directory to the server
   rsync -avz --delete dist/ deploy@your-server:/var/www/shirone/dist/

   # If rsync is not available on your system, you can use scp instead
   scp -r dist/* deploy@your-server:/var/www/shirone/dist/
   ```

:::

---

## Troubleshooting

::: collapse
- Deployed a new post, but the site still displays old content?

  Check the following in order:
  First view the GitHub Actions log to verify the sync step succeeded and printed the new HTML file names;
  Next check if the `root` path in your Nginx configuration correctly points to `/var/www/shirone/dist`;
  Finally check if your browser cached the old page. Try pressing Ctrl+F5 to force refresh, or open a private browsing window.

- Why is running pnpm build directly on the server not recommended?

  Building the site compiles code and generates thumbnails and search indexes, which uses CPU and memory for a short time.
  If your cloud server or VPS has modest hardware (such as 1GB RAM), running the build command on the server can cause memory exhaustion and abort the process. Building on GitHub and sending only the generated web files avoids hardware requirements on your server.

- Receiving Host key verification failed or Permission denied errors?

  If you see `Host key verification failed`, GitHub has not recorded your server information yet; confirm your workflow contains the `ssh-keyscan` command;
  If you see `Permission denied`, authentication failed. Check whether `DEPLOY_SSH_KEY` in GitHub Secrets contains the complete private key, and verify the file permissions for `/home/deploy/.ssh/authorized_keys` on your server.

- How do I set this up with server control panels like BaoTa or 1Panel?

  Add a static website inside the panel, pointing the website directory to `/var/www/shirone/dist` on the server.
  SSL certificates and reverse proxies can be set up in the panel interface. Ensure that the website configuration disables caching on HTML files.
:::

---

## Next Steps

- [CI/CD Workflows](/en/guide/development/workflows/): Learn about workflow design and automated checks in the code repository
- [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/): Configure content repo updates to trigger site rebuilds
- [Deployment Overview](/en/guide/deploy/overview/): Learn about Vercel, Cloudflare, Docker, and other environments
