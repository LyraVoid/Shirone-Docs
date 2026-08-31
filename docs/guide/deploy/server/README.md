---
title: 服务器部署
createTime: 2026/08/31 21:55:00
permalink: /guide/deploy/server/
---

将 Shirone 部署到自己的服务器（VPS / 云主机），可以获得最大的控制权：自定义缓存策略、无平台构建额度限制、与现有服务共用资源。

::: tip 适合谁
有一台自己的服务器、能接受少量命令行操作的用户。如果你只想"推代码就有网站"，请回到 [Vercel](/guide/deploy/vercel/) 或 [EdgeOne Pages](/guide/deploy/edgeone/)，它们更省心。
:::

## 核心思路

Shirone 构建产物是**纯静态文件**。服务器部署的本质只有两件事：

1. 把 `dist/` 目录放到服务器上
2. 用 Nginx（或其他 Web 服务器）对外提供访问

构建可以在本地、CI 或服务器上完成，本页以「本地构建 + rsync 上传」为主线路，这是最稳定且服务器压力最小的方案。

## 第一步：本地构建

```bash
pnpm install
pnpm build
```

产物位于 `dist/`。部署前先本地预览确认无误：

```bash
pnpm preview   # http://localhost:4321
```

::: warning 部署前检查
确认 `src/config/siteConfig.ts` 中 `site` 已设置为正式域名（影响 RSS、Sitemap、OG 图），`base` 为 `/`。
:::

## 第二步：上传产物

**rsync（推荐，增量传输）**

```bash
rsync -avz --delete dist/ user@your-server:/var/www/shirone/
```

- `-a` 保留权限与时间戳，`-v` 显示进度，`-z` 压缩传输
- `--delete` 同步删除远端多余文件，保证产物与本地一致

**scp（无 rsync 环境时）**

```bash
scp -r dist/* user@your-server:/var/www/shirone/
```

## 第三步：配置 Nginx

```nginx title="/etc/nginx/conf.d/shirone.conf"
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/shirone;
    index index.html;

    # 静态资源指纹化命名，可长期强缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Pagefind 搜索索引，内容更新才变化
    location /pagefind/ {
        expires 24h;
    }

    # HTML 不缓存，保证内容更新即时可见
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
    }

    # 开启压缩
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

测试并重载：

```bash
nginx -t && systemctl reload nginx
```

::: info 为什么不用 try_files 兜底到 index.html？
Shirone 是纯静态 SSG，每个页面都有对应的物理 HTML 文件，不存在客户端路由回退需求。`try_files $uri $uri/ =404` 让错误链接正确返回 404，对 SEO 更友好。
:::

## 第四步：启用 HTTPS

```bash
# Ubuntu/Debian
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

Certbot 会自动改写 Nginx 配置并设置证书自动续期定时任务。

## 自动化：一键部署脚本

将构建与上传封装为脚本，避免重复敲命令：

```bash title="deploy.sh"
#!/usr/bin/env bash
set -euo pipefail

REMOTE="user@your-server"
DEST="/var/www/shirone"

pnpm install --frozen-lockfile
pnpm build
rsync -avz --delete dist/ "$REMOTE:$DEST/"
echo "Deployed at $(date '+%Y-%m-%d %H:%M:%S')"
```

```bash
chmod +x deploy.sh
./deploy.sh
```

## 进阶：CI 自动部署

把上述流程交给 GitHub Actions，推送 `main` 即自动构建并部署到服务器。主题仓库的 `deploy.yml.example` **变体 C** 给出了生产级写法（rsync over SSH，凭据全部走 Secrets）：

- `DEPLOY_HOST` / `DEPLOY_USER`：服务器地址与用户
- `DEPLOY_SSH_KEY`：专用部署密钥私钥
- `DEPLOY_DIR`：目标目录

建议为部署创建独立的低权限用户与仅能写入站点目录的密钥，不要直接使用 root。

## 常见问题

::: collapse
- 更新后访问到旧内容
  排查顺序：rsync 是否成功（看脚本输出）→ Nginx `root` 路径是否正确 → 浏览器/CDN 缓存（HTML 已设置 `no-cache` 时不该出现）。

- 服务器上直接构建可以吗
  可以（服务器装 Node 22 + pnpm 后 `pnpm build`），但会占用大量 CPU 与内存，小规格 VPS 容易 OOM。推荐本地或 CI 构建，服务器只负责托管静态文件。

- 要不要用面板（宝塔 / 1Panel）
  可以。创建静态站点后把 `dist/` 内容放到站点根目录即可，面板的 SSL 与缓存配置同样适用。核心注意事项不变：根目录指向 `dist` 内容、HTML 不缓存、指纹化资源长缓存。
:::
