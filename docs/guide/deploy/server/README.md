---
title: 服务器部署
createTime: 2026/08/31 21:55:00
permalink: /guide/deploy/server/
---

将 Shirone 部署到自己的服务器，可以获得最大的控制权：自定义缓存策略、无平台构建额度限制、与现有服务共用资源。

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

> [!IMPORTANT]
> **Nginx 缓存策略关键准则**
> HTML 文件必须配置 `Cache-Control: no-cache`，以便访客能实时拉取最新发布的文章；带哈希指纹的静态资源（`/assets/*`）则配置 1 年永久缓存。

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

通过配置工作流，只要将代码或文章推送到仓库的 `main` 分支，即可全自动完成依赖安装、静态构建并通过 SSH 增量同步到服务器。

### 1. 配置 GitHub 密钥

在 GitHub 仓库中，进入 **Settings** -> **Secrets and variables** -> **Actions**，点击 **New repository secret** 配置以下敏感变量：

| 密钥名 | 说明 | 示例值 |
| :--- | :--- | :--- |
| `SERVER_HOST` | 服务器公网 IP 或域名 | `1.2.3.4` 或 `vps.your-domain.com` |
| `SERVER_PORT` | 服务器 SSH 端口（可选，默认 22） | `22` |
| `SERVER_USER` | 用于部署的系统用户名（建议创建专用非 root 用户） | `deploy` |
| `SERVER_SSH_KEY` | 用于部署的 SSH 私钥文本 | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `SERVER_TARGET` | 服务器站点根目录绝对路径 | `/var/www/shirone` |

> [!TIP] 双仓内容分离架构额外配置
> 若文章存放在私有内容仓库中，还需在内容仓额外添加一个密钥：
> - `CONTENT_ACCESS_TOKEN`：具备私有内容仓读取权限的访问令牌。

---

### 2. 服务器权限与密钥配置

为了保障服务器安全，建议创建专用的低权限 `deploy` 用户并仅授权访问网站目录：

::: steps
1. **创建部署专用用户并授权目录**

   ```bash
   # 1. 创建专门用于部署的系统用户（禁用密码登录）
   sudo adduser --disabled-password --gecos "" deploy

   # 2. 创建站点根目录并分配所有权给 deploy 用户
   sudo mkdir -p /var/www/shirone
   sudo chown -R deploy:deploy /var/www/shirone
   ```

2. **生成专用的部署 SSH 密钥对**

   切换到 `deploy` 用户并生成专属密钥对：

   ```bash
   # 切换为 deploy 用户
   sudo su - deploy

   # 生成无密码 SSH 密钥对
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_ed25519 -N ""

   # 将公钥写入授权列表
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys

   # 查看并复制私钥内容（填入 GitHub Secret: SERVER_SSH_KEY）
   cat ~/.ssh/id_ed25519
   ```
:::

---

### 3. 创建自动化工作流文件

#### 模式一：双仓内容分离架构 <Badge text="官方推荐" type="tip" />

在双仓模式下，由内容仓发送触发信号，主题代码仓执行拉取与部署：

::: tabs
@tab 内容仓库触发流
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
          repository: YOUR_GITHUB_USERNAME/YOUR_THEME_REPO_NAME # 替换为你的主题代码仓路径
          event-type: content-update
```

@tab 主题代码仓部署流
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

#### 模式二：标准单仓架构
如果你的文章与代码存放在同一个仓库中，直接在代码仓库新建 `.github/workflows/deploy.yml`：

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

## 常见问题

::: collapse
- 更新后访问到旧内容

  排查顺序：rsync 是否成功（看脚本输出）→ Nginx `root` 路径是否正确 → 浏览器/CDN 缓存（HTML 已设置 `no-cache` 时不该出现）。

- 服务器上直接构建可以吗

  可以（服务器装 Node 22 + pnpm 后 `pnpm build`），但会占用大量 CPU 与内存，小规格 VPS 容易 OOM。推荐本地或 CI 构建，服务器只负责托管静态文件。

- 要不要用面板（宝塔 / 1Panel）

  可以。创建静态站点后把 `dist/` 内容放到站点根目录即可，面板的 SSL 与缓存配置同样适用。核心注意事项不变：根目录指向 `dist` 内容、HTML 不缓存、指纹化资源长缓存。
:::
