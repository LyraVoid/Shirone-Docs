---
title: 部署到服务器
createTime: 2026/08/31 21:55:00
permalink: /guide/deploy/server/
---

本文介绍将 Shirone 部署到个人服务器或 VPS 的设置方法。

Shirone 最终输出的是静态网页文件（HTML、CSS、图片等），服务器只需要通过 Nginx 等软件提供网页访问服务。网站的打包生成过程推荐在 GitHub Actions 中自动完成。

:::: card-grid
::: card title="服务器无需安装 Node.js" icon="ri:cpu-line"
打包工作在 GitHub 运行，服务器不需要安装 Node.js 和 pnpm。

打包网页需要占用一定的计算资源与内存，在配置较低的小型服务器上直接打包容易因内存不足而中断。
:::

::: card title="只传输修改过的文件" icon="ri:speed-up-line"
使用 rsync 工具对比文件。

每次发布时，没有改动的图片、字体和文章不会重复上传，节省服务器的带宽和等待时间。
:::

::: card title="自动清理旧网页" icon="ri:delete-bin-line"
同步时会自动删除服务器上多余的旧文件。

当你修改了文章文件名或删除了文章，服务器上对应的旧网页会被自动清理，避免残留失效页面。
:::

::: card title="推送文章自动发布" icon="ri:rocket-line"
将写好的文章推送到仓库后，GitHub 会自动启动打包并同步到服务器。

不需要每次写完文章都手动登录服务器操作。
:::
::::

---

## 自动化部署：GitHub Actions 打包并同步到服务器 <Badge type="tip" text="推荐" vertical="middle" />

工作流程如下：把代码或文章推送到 GitHub 后，由 GitHub 提供的在线环境自动下载依赖并打包生成网站文件（存放在 `dist/` 文件夹中），然后通过 SSH 密钥把生成好的文件自动同步到你的服务器。

```mermaid
flowchart LR
    A["推送文章或代码<br/>(git push)"] --> B["GitHub 自动处理"]
    subgraph GHA ["GitHub Actions（云端在线运行）"]
        B --> C["下载依赖"]
        C --> D["执行 pnpm build 打包生成 dist/ 目录"]
        D --> E["读取配置好的 SSH 密钥"]
    end
    E -->|通过 rsync 增量上传网页文件| F["你的服务器"]
    subgraph ServerHost ["服务器目录 /var/www/shirone/dist"]
        F --> G["Nginx 提供网页访问"]
    end
```

### 第一步：在服务器准备专用用户与目录

建议不要直接使用 root 最高管理员账号来执行自动化上传。在服务器上单独创建一个名为 `deploy` 的系统用户，专门用来接收上传的网站文件：

::: steps

1. **创建专用的系统用户与网站目录**

   在服务器终端中执行以下命令，创建 `deploy` 用户并建立存放网站文件的目录：

   ```bash
   sudo adduser --disabled-password --gecos "" deploy
   sudo mkdir -p /var/www/shirone/dist
   sudo chown -R deploy:deploy /var/www/shirone
   ```

2. **生成用于登录的 SSH 密钥**

   切换到 `deploy` 用户，生成一对 SSH 密钥（包含一个公钥和一个私钥）：

   ```bash
   sudo su - deploy
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_ed25519 -N ""
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **复制私钥内容**

   查看并复制私钥文本：

   ```bash
   cat ~/.ssh/id_ed25519
   ```

   将终端输出的内容（从 `-----BEGIN OPENSSH PRIVATE KEY-----` 开始，到结尾行全部内容）完整复制下来，稍后需要填入 GitHub 仓库中。

:::

::: tip 目录权限检查
Nginx 软件通常使用 `www-data` 或 `nginx` 用户运行，需要对 `/var/www/shirone/dist` 拥有读取和进入目录的权限。

如果配置好之后访问网站提示 403 Forbidden，可以在服务器运行以下命令修正目录权限：

```bash
sudo chmod 755 /var/www /var/www/shirone /var/www/shirone/dist
```
:::

---

### 第二步：在 GitHub 仓库中填入密钥 (Secrets)

进入你的代码仓库网页：

依次点击 **Settings** -> **Secrets and variables** -> **Actions**，点击 **New repository secret** 按钮，分别添加以下几项信息：

::: table copy align="center"
| 密钥名称 (Name) | 是否必填 | 含义说明 | 示例值 |
| --- | --- | --- | --- |
| `DEPLOY_HOST` | 是 | 你的服务器公网 IP 地址或已解析的域名 | `123.45.67.89` |
| `DEPLOY_USER` | 是 | 刚才在服务器上创建的用户名 | `deploy` |
| `DEPLOY_SSH_KEY` | 是 | 刚才复制的私钥全文（从 BEGIN 到 END） | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `DEPLOY_DIR` | 是 | 服务器上存放网站文件的目录路径（文件会同步到该目录下的 dist 文件夹） | `/var/www/shirone` |
| `DEPLOY_PORT` | 否 | 服务器的 SSH 连接端口（如果服务器修改过默认的 22 端口才需要填） | `22` 或自定义端口 |
:::

::: note 内容分离模式说明
如果你把博客分成了“代码仓库”和“内容仓库”两个仓库，还需要额外配置两个访问令牌，让内容仓库更新时能通知代码仓库开始打包。具体配置步骤请查看[跨仓自动构建](/guide/content-separation/ci-dispatch/)。
:::

---

### 第三步：启用自动部署工作流

主题仓库已经提供好了现成的工作流模板文件 `.github/workflows/deploy.yml.example`。

在你的代码仓库根目录下执行复制命令，去掉结尾的 `.example` 后缀即可启用：

```bash
cp .github/workflows/deploy.yml.example .github/workflows/deploy.yml
```

#### 工作流中的同步步骤说明

在 `.github/workflows/deploy.yml` 文件中，打包完成后会通过以下步骤将文件同步到服务器：

```yaml title=".github/workflows/deploy.yml"
      # 1. 打包网站，生成静态网页文件到 dist 目录
      - name: Build site
        run: pnpm build

      # 2. 将打包好的 dist 目录文件同步到服务器
      - name: Deploy to server via rsync
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          DEPLOY_DIR: ${{ secrets.DEPLOY_DIR || '/var/www/shirone' }}
          DEPLOY_PORT: ${{ secrets.DEPLOY_PORT || '22' }}
        run: |
          set -euo pipefail

          # 创建 SSH 目录并写入私钥
          mkdir -p ~/.ssh && chmod 700 ~/.ssh
          printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key

          # 记录服务器的公钥信息，避免连接时弹出确认提示
          ssh-keyscan -p "$DEPLOY_PORT" -H "$DEPLOY_HOST" >> ~/.ssh/known_hosts

          # 使用 rsync 命令进行文件增量同步
          rsync -avz --delete \
            -e "ssh -i ~/.ssh/deploy_key -p $DEPLOY_PORT -o StrictHostKeyChecking=accept-new" \
            dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR/dist/"
```

#### rsync 同步命令参数说明

```bash
rsync -avz --delete \
  -e "ssh -i ~/.ssh/deploy_key -p $DEPLOY_PORT -o StrictHostKeyChecking=accept-new" \
  dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR/dist/"
```

- `-a`：保留文件的原本属性、权限和修改时间；
- `-v`：在 GitHub 运行日志中显示具体传输了哪些文件；
- `-z`：传输时对数据进行压缩，减少传输数据量；
- `--delete`：如果服务器上存在但本次打包结果里已经没有的文件，自动在服务器上删除，保持两边文件一致；
- `-e "ssh ..."`：指定使用 SSH 协议和刚才配置的私钥文件连接服务器；
- `dist/`：注意末尾必须带斜杠 `/`，表示把 `dist` 目录里面的所有内容同步过去，而不是把 `dist` 文件夹本身作为一个子目录拷贝过去。

---

## 服务器网页服务配置 (Nginx 与 HTTPS)

文件同步到服务器之后，需要配置 Nginx 软件来接收访问并展示网页。

### 配置 Nginx

在服务器上新建一个配置文件，例如 `/etc/nginx/conf.d/shirone.conf`：

```nginx title="/etc/nginx/conf.d/shirone.conf"
server {
    listen 80;
    server_name your-domain.com;

    # 指向存放网页文件的目录
    root /var/www/shirone/dist;
    index index.html;

    # 图片、字体等静态资源，可以设置较长缓存时间
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 搜索索引文件，内容更新时可能会变化
    location /pagefind/ {
        expires 24h;
    }

    # HTML 网页禁止浏览器强行缓存，确保发布新文章后访客刷新就能看到
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
    }

    # 开启 Gzip 网页压缩，加快打开速度
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

测试配置文件格式是否正确，并让 Nginx 重新加载配置：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

::: info 关于 try_files 规则说明
Shirone 打包后会为每一篇文章都生成一个单独的 HTML 文件。

当访问一个不存在的网址时，Nginx 会直接返回 404 错误页面，便于访客和搜索引擎识别无效链接。
:::

---

### 配置 HTTPS 证书 (Certbot)

使用 Certbot 工具可以自动申请免费的 Let's Encrypt 证书并开启 HTTPS 加密访问：

```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

执行后按照屏幕提示输入邮箱并同意使用条款，Certbot 会自动修改 Nginx 配置并设置证书到期自动续约。

---

## 备用方案：在本地电脑打包并手动上传

如果你暂时不想配置 GitHub Actions，也可以直接在自己的电脑上打包生成网页，然后手动传到服务器：

::: steps

1. **在本地电脑打包**

   ```bash
   pnpm install --frozen-lockfile
   pnpm build
   pnpm preview   # 可在浏览器打开 http://localhost:4321 预览打包效果
   ```

2. **使用 rsync 命令上传到服务器**

   ```bash
   # 上传 dist 目录里的文件到服务器
   rsync -avz --delete dist/ deploy@your-server:/var/www/shirone/dist/

   # 如果电脑上没有安装 rsync，也可以使用 scp 命令
   scp -r dist/* deploy@your-server:/var/www/shirone/dist/
   ```

:::

---

## 常见问题排查

::: collapse
- 推送了新文章，但打开网站还是旧内容？

  建议按以下顺序排查：
  首先查看 GitHub Actions 运行记录，确认同步步骤是否成功执行，并且日志里是否输出了新生成的 HTML 文件名；
  其次检查 Nginx 配置文件中的 `root` 路径是否正确指向了 `/var/www/shirone/dist`；
  最后检查是不是浏览器缓存了旧页面。可以尝试在浏览器中按 Ctrl+F5 强制刷新，或使用无痕模式打开。

- 为什么不推荐直接在服务器上运行 pnpm build 打包？

  打包网站时需要编译代码、生成图片缩略图和搜索索引，短时间内会占用较多的计算资源和内存。
  普通云服务器或 VPS 的配置如果较低（比如 1G 内存），直接在服务器上运行打包命令容易因为内存耗尽而导致任务直接中断。使用 GitHub 提供的在线环境打包，只把打包好的网页文件传到服务器，对服务器配置没有要求。

- 提示 Host key verification failed 或 Permission denied 错误？

  若提示 `Host key verification failed`，表示 GitHub 尚未记录你服务器的信息，请确认工作流中是否包含 `ssh-keyscan` 命令；
  若提示 `Permission denied`，表示密钥验证没有通过。请检查 GitHub Secrets 中的 `DEPLOY_SSH_KEY` 是否完整贴入了私钥内容，并确认服务器上 `/home/deploy/.ssh/authorized_keys` 文件的权限设置是否正确。

- 使用宝塔面板或 1Panel 等工具如何设置？

  在面板中添加一个纯静态网站，将网站目录直接指定为服务器上的 `/var/www/shirone/dist` 即可。
  SSL 证书和反向代理可以直接在面板界面中操作，只需要注意在网站配置中对 HTML 文件关闭强制缓存。
:::

---

## 下一步

- [CI/CD 工作流解析](/guide/development/workflows/)：了解代码仓库的工作流设计与自动检查逻辑
- [跨仓自动构建](/guide/content-separation/ci-dispatch/)：配置内容仓库更新后自动通知代码仓库重新打包
- [部署总览](/guide/deploy/overview/)：了解 Vercel、Cloudflare、Docker 等其他托管环境
