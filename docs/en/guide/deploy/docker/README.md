---
title: Docker Deployment
createTime: 2026/08/31 21:56:00
permalink: /en/guide/deploy/docker/
---

Docker deployment fixes the build environment in an image. The same image can run on different servers, and version rollbacks and migrations do not depend on the host's Node version.

## Multi-Stage Build Architecture

Shirone is a static site. Containerization uses a multi-stage Docker build:

- **Build Stage**: Node 26 + pnpm environment executes `pnpm build` (including Pagefind search index generation).
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
FROM node:26-alpine AS builder

WORKDIR /app

# Node.js 25+ no longer bundles corepack; install the pinned pnpm directly
RUN npm install -g pnpm@11.28.2

COPY package.json pnpm-lock.yaml .npmrc ./
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

> [!WARNING]
> **Memory Allocation for Build Stage**
> Shirone runs font subsetting and search indexing during build. Allocate at least 4 GB RAM to Docker or pass `--memory=4g` to prevent out-of-memory (OOM) errors.

::: tip Dual-repo mode
The Dockerfile above builds the current repo only. For Shirone-Content, pass `CONTENT_REPO_URL` to `pnpm build` at build time. Do not bake a token-bearing URL into `ARG`/`ENV`; use a BuildKit secret:

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=content_repo_url \
    CONTENT_REPO_URL="$(cat /run/secrets/content_repo_url)" pnpm build
```

```bash
echo "https://x-access-token:<TOKEN>@github.com/<OWNER>/<CONTENT_REPO>.git" > .content-repo-url
docker build --secret id=content_repo_url,src=.content-repo-url -t shirone:latest .
rm .content-repo-url
```

Keep `scripts/` in the build context: `pnpm build` runs `scripts/content/sync.mjs` and the font checker.
:::

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

  Occurs when running `npm install` instead of pnpm, or when the pinned pnpm is missing. Follow the Dockerfile strictly: run `npm install -g pnpm@11.28.2` and `pnpm install --frozen-lockfile`. Node.js 25+ no longer bundles corepack, so a bare `corepack enable` will fail.

- Out of Memory (OOM) during build phase

  Shirone performs automated font subsetting and Pagefind search indexing during build, requiring higher peak memory. Allocate at least 4 GB memory to Docker, or pass `--memory=4g` to `docker build`.

- Search feature returns 404 on `/pagefind/*`

  Pagefind indexes are compiled at the end of `pnpm build`. Ensure your build command is `pnpm build` and not bare `astro build` (which bypasses search indexing).

- Should dynamic backend features like comments be embedded in this image

  Not recommended. Keep the static blog container completely stateless. Deploy dynamic backends (Twikoo, Waline) as separate microservice containers behind an Nginx reverse proxy.
:::
