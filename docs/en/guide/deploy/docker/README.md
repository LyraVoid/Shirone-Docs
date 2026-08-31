---
title: Docker Deployment
createTime: 2026/08/31 21:56:00
permalink: /en/guide/deploy/docker/
---

Containerized deployment with Docker isolates build environments, provides version rollback, and simplifies server migration.

## Multi-Stage Build Architecture

Shirone is a static site. Containerization uses a multi-stage Docker build:

- **Build Stage**: Node 22 + pnpm environment executes `pnpm build` (including Pagefind search index generation).
- **Runtime Stage**: Lightweight Nginx Alpine image serves static files from `dist/`, resulting in an image under 50 MB with no Node runtime overhead.

## Setup Files

### .dockerignore

```text title=".dockerignore"
.git
node_modules
dist
.astro
.vscode
.github
```

### Dockerfile

```dockerfile title="Dockerfile"
# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.14.4 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Runtime Stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx title="nginx.conf"
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        try_files $uri $uri/ $uri.html /index.html =404;
    }

    error_page 404 /404.html;
}
```

## Build and Run

::: steps

1. **Build Production Docker Image**

   Leverage multi-stage caching to build the lightweight static image:
   ```bash
   docker build -t shirone:latest .
   ```

2. **Run Container in Background**

   Map container port 80 to host port 8080 with auto-restart policy:
   ```bash
   docker run -d -p 8080:80 --name shirone-blog shirone:latest
   ```

3. **Verify Deployment**

   Open `http://localhost:8080` in your browser to confirm page loading and search indexing.

:::

## FAQ

::: collapse
- Build failure: `only-allow pnpm` or dependency installation error
  Occurs when running `npm install` instead of pnpm, or when corepack is not enabled. Follow the Dockerfile instructions strictly: run `corepack enable` and `pnpm install --frozen-lockfile`.

- Out of Memory (OOM) during build phase
  Shirone performs automated font subsetting and Pagefind search indexing during build, requiring higher peak memory. Allocate at least 4 GB memory to Docker, or pass `--memory=4g` to `docker build`.

- Search feature returns 404 on `/pagefind/*`
  Pagefind indexes are compiled at the end of `pnpm build`. Ensure your build command is `pnpm build` and not bare `astro build` (which bypasses search indexing).

- Should dynamic backend features like comments be embedded in this image
  Not recommended. Keep the static blog container completely stateless. Deploy dynamic backends (Twikoo, Waline) as separate microservice containers behind an Nginx reverse proxy.
:::
