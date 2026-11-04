---
title: Deploy to a Server
createTime: 2026/08/31 21:55:00
permalink: /en/guide/deploy/server/
---

This guide covers server-side static hosting configuration. For decisions on build locations and deployment schedules, see [Deployment Overview](/en/guide/deploy/overview/).

This approach suits users with a dedicated server or VPS who are comfortable with command-line administration. The server functions exclusively as a static file server; site builds run on your local machine or in GitHub Actions.

## Step 1: build

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm preview   # verify locally at http://localhost:4321
```

For dual-repo setups, configure the content source first; see [Content Sources](/en/guide/content-separation/content-sources/).

Before deploying, ensure `site` is set to your production domain and `base` is `/`.

## Step 2: upload the output

The commands below sync artifacts to `/var/www/shirone/dist/`, matching the automated deployment template. Create the directory on your server before initial deployment:

```bash
ssh user@your-server "mkdir -p /var/www/shirone/dist"
```

Sync artifacts:

```bash
# Incremental sync (recommended)
rsync -avz --delete dist/ user@your-server:/var/www/shirone/dist/

# Fallback when rsync is unavailable
scp -r dist/* user@your-server:/var/www/shirone/dist/
```

`--delete` removes extraneous files on the server to ensure consistency with local builds. Uploaded files must include the complete `dist/pagefind/` directory.

## Step 3: configure Nginx

```nginx title="/etc/nginx/conf.d/shirone.conf"
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/shirone/dist;
    index index.html;

    # Fingerprinted static assets: long-term caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Search index: dynamic per content update
    location /pagefind/ {
        expires 24h;
    }

    # HTML files: no caching, ensuring immediate visibility for new posts
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

Test and reload Nginx:

```bash
nginx -t && systemctl reload nginx
```

Shirone is a static site where every route corresponds to a generated physical HTML file; 404 responses do not need single-page application fallback to `index.html`. Using `try_files $uri $uri/ =404` ensures invalid URLs return proper 404 HTTP status codes.

## Step 4: HTTPS

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

Certbot rewrites Nginx configuration to add SSL listeners and sets up automated certificate renewal tasks.

## Automated deployment

Use the theme repo's `deploy.yml.example` workflow template rather than writing custom workflows.

1. Copy the template to `.github/workflows/deploy.yml`;
2. For dual-repo setups, update `CONTENT_REPOSITORY` to your content repo;
3. Uncomment the section corresponding to "Variant C: your own server";
4. Add the following repository secrets under **Settings** -> **Secrets and variables** -> **Actions**:

   | Secret | Value |
   | --- | --- |
   | `DEPLOY_HOST` | Server public IP address or domain |
   | `DEPLOY_USER` | Deployment system user (dedicated non-privileged account recommended) |
   | `DEPLOY_SSH_KEY` | Full private key text |
   | `DEPLOY_DIR` | Server web root, e.g., `/var/www/shirone`. The template syncs into `$DEPLOY_DIR/dist/` |

Dual-repo setups also require two access tokens configured in opposite directions:

- Content repo secret: `DISPATCH_TOKEN`, with `Contents: Read and write` on the theme repo;
- Theme repo secret: `CONTENT_REPO_TOKEN`, with `Contents: Read` on the content repo.

See [Access Tokens](/en/guide/content-separation/pat/) for token generation and configuration.

### Prepare the deploy user and key

::: steps

1. **Create dedicated user and directory**

   ```bash
   sudo adduser --disabled-password --gecos "" deploy
   sudo mkdir -p /var/www/shirone/dist
   sudo chown -R deploy:deploy /var/www/shirone
   ```

2. **Generate SSH key pair**

   ```bash
   sudo su - deploy
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_ed25519 -N ""
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Copy private key**

   ```bash
   cat ~/.ssh/id_ed25519
   ```

   Copy the entire private key output and paste it into the theme repo's `DEPLOY_SSH_KEY` secret.

:::

## Troubleshooting

::: collapse
- Site displays outdated content after updating

  Check the following in order: verify that rsync completed without errors, confirm that Nginx `root` points to the correct directory, and ensure that browsers or intermediate CDNs are not aggressively caching HTML. With `no-cache` configured on HTML, issues usually stem from path configuration or transfer steps.

- Can I build directly on the server?

  Yes, provided that Node 26 and matching pnpm are installed. However, site builds have significant CPU and memory footprints, which frequently trigger out-of-memory errors on smaller VPS instances. We recommend building locally or in CI and uploading only `dist/`.

- How do I configure control panels like BaoTa or 1Panel?

  Create a static website within the panel and set its web root to the uploaded `dist/` directory. SSL certificates and reverse proxies can use standard panel controls. Core rules remain identical: point web root to `dist`, disable caching on HTML, and enable long caching for fingerprinted assets.
:::

## Next steps

- [Deployment Overview](/en/guide/deploy/overview/): compare other hosting providers
- [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/): configure automated dual-repo deployment
