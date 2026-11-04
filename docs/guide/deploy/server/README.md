---
title: 部署到服务器
createTime: 2026/08/31 21:55:00
permalink: /guide/deploy/server/
---

本文介绍自建服务器的静态托管设置。构建位置选择与发布频率规划，详见[部署总览](/guide/deploy/overview/)。

该方案适合已持有云服务器或 VPS、并具备基础命令行运维习惯的用户。服务器仅负责提供静态资源托管服务，完整的站点构建流程推荐在本地开发机或 GitHub Actions 中执行。

## 第一步：构建

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm preview   # 本地访问 http://localhost:4321 校验产物
```

双仓模式下需预先配置内容源，详见[内容源配置](/guide/content-separation/content-sources/)。

执行正式部署前，确保 `site` 已设置为正式域名，`base` 设定为 `/`。

## 第二步：上传产物

以下示例将产物同步至 `/var/www/shirone/dist/`，与后续的自动部署工作流模板保持一致。首次部署前需先在服务器上创建目标目录：

```bash
ssh user@your-server "mkdir -p /var/www/shirone/dist"
```

执行产物同步：

```bash
# 增量同步（推荐）
rsync -avz --delete dist/ user@your-server:/var/www/shirone/dist/

# 未安装 rsync 时的备用方案
scp -r dist/* user@your-server:/var/www/shirone/dist/
```

`--delete` 参数会自动清理服务器目录中多余的陈旧文件，保证线上文件与本地构建完全一致。上传时必须完整包含 `dist/pagefind/` 目录。

## 第三步：配置 Nginx

```nginx title="/etc/nginx/conf.d/shirone.conf"
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/shirone/dist;
    index index.html;

    # 包含哈希指纹的静态资源，启用长期缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 搜索索引文件，随内容更新动态变动
    location /pagefind/ {
        expires 24h;
    }

    # HTML 文件禁止缓存，确保新发布的文章即刻可见
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

测试并重新加载 Nginx 配置：

```bash
nginx -t && systemctl reload nginx
```

Shirone 为纯静态博客，每个路由页面均有对应的实体 HTML 文件生成，无需像单页应用那样将 404 回退至 `index.html`。`try_files $uri $uri/ =404` 能够确保错误的失效链接返回符合规范的 404 状态码。

## 第四步：HTTPS

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

Certbot 会自动修改 Nginx 配置文件添加 SSL 监听段，并配置自动续期定时任务。

## 自动部署

推荐使用主题仓内置的 `deploy.yml.example` 部署模板，无需自行编写精简工作流。

1. 将模板复制为 `.github/workflows/deploy.yml`；
2. 双仓模式下修改文件开头的 `CONTENT_REPOSITORY` 为个人内容仓；
3. 取消文件末尾“变体 C：自有服务器”相关的注释代码；
4. 在主题仓的 **Settings** -> **Secrets and variables** -> **Actions** 中添加以下密钥：

   | 密钥名称 | 对应内容说明 |
   | --- | --- |
   | `DEPLOY_HOST` | 服务器公网 IP 地址或解析域名 |
   | `DEPLOY_USER` | 用于部署的系统用户，建议创建专用无提权账号 |
   | `DEPLOY_SSH_KEY` | 用于 SSH 认证的私钥全文 |
   | `DEPLOY_DIR` | 服务器站点根路径，例如 `/var/www/shirone`。模板会自动同步至 `$DEPLOY_DIR/dist/` |

双仓模式下还需准备两个方向相反的 GitHub 访问令牌：

- 内容仓密钥：`DISPATCH_TOKEN`，需具备主题仓的 `Contents: Read and write` 权限；
- 主题仓密钥：`CONTENT_REPO_TOKEN`，需具备内容仓的 `Contents: Read` 权限。

具体申请与绑定流程参阅[申请个人访问令牌](/guide/content-separation/pat/)。

### 准备部署用户和密钥

::: steps

1. **创建专用用户与目录**

   ```bash
   sudo adduser --disabled-password --gecos "" deploy
   sudo mkdir -p /var/www/shirone/dist
   sudo chown -R deploy:deploy /var/www/shirone
   ```

2. **生成 SSH 密钥对**

   ```bash
   sudo su - deploy
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_ed25519 -N ""
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **获取私钥内容**

   ```bash
   cat ~/.ssh/id_ed25519
   ```

   将终端输出的私钥字符串完整复制，填入主题仓的 `DEPLOY_SSH_KEY` 仓库密钥中。

:::

## 常见问题

::: collapse
- 更新推送后线上依然展示旧内容

  依次排查：rsync 同步命令是否正常执行完毕、Nginx 的 `root` 指向是否为真实产物目录、客户端浏览器或外部 CDN 是否强缓存了 HTML 响应。在 HTML 明确配置了 `no-cache` 的前提下，原因通常集中在目录指向或传输步骤。

- 是否可以直接在服务器上执行构建

  技术上可行，但服务器必须预装 Node 26 与匹配的 pnpm 版本，且全量构建涉及较多 CPU 与内存开销，在低规格 VPS 上容易触发 OOM 终止。强烈建议在本地机或 CI 环境中构建后仅分发 `dist/`。

- 使用宝塔面板或 1Panel 时如何配置

  在面板中创建静态站点，将站点根目录指定为上传后的 `dist/` 所在路径。SSL 证书与反向代理均可沿用面板内置功能，核心运维规则保持一致：站点目录指向 `dist` 内容、HTML 禁用缓存、哈希静态资源启用长缓存。
:::

## 下一步

- [部署总览](/guide/deploy/overview/)：对比其他托管平台
- [跨仓自动构建](/guide/content-separation/ci-dispatch/)：配置双仓自动化部署
