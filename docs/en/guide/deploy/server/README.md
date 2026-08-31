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
