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

## FAQ

::: collapse
- Visiting old content after update
  Check in sequence: verify rsync upload succeeded, verify Nginx `root` path points to the new `dist`, and clear browser cache (HTML should have `Cache-Control: no-cache`).

- Can I build directly on the server
  Yes (with Node 22 and pnpm installed), but full builds consume significant CPU and memory. Small VPS instances may hit OOM. Building locally or via CI and copying static files to the server is recommended.

- Can I use management panels (1Panel / aaPanel)
  Yes. Create a standard static website and place `dist/` contents into the site root directory. Keep the core rules: no-cache on HTML and 1-year immutable caching on hashed assets.
:::
