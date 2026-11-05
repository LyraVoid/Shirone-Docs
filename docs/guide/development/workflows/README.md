---
title: 自动打包与部署工作流
createTime: 2026/09/01 04:00:00
permalink: /guide/development/workflows/
---

如果你使用了双仓模式（一个仓库放主题代码，另一个仓库放文章内容），或者希望每次推送代码后让 GitHub 自动打包并发布网站，需要用到 GitHub Actions 工作流。

整个自动发布过程主要包含三个工作流文件：

1. **`deploy.yml.example`**（在主题代码仓）：负责拉取文章、安装依赖、打包网页，并把生成的文件复制到服务器；
2. **`trigger-build.yml.example`**（在内容仓）：在你推送新文章后，通知主题代码仓开始打包；
3. **`content-validate.yml`**（在主题代码仓）：在开始打包之前，先检查文章和配置文件格式是否正确。

::: info 提示
主题代码仓库中还有一个 `ci.yml` 文件，那是修改主题代码时用来做自动化测试的，写文章和部署网站不需要用到它。
:::

---

## 1. 自动打包与部署：`deploy.yml.example`

这个文件位于主题代码仓库的 `.github/workflows/deploy.yml.example`。使用时把它复制一份并重命名为 `.github/workflows/deploy.yml`（去掉结尾的 `.example`）。

### 完整文件内容

```yaml title=".github/workflows/deploy.yml.example"
name: Deploy

on:
  # 代码更新时触发（修改文档文件除外）
  push:
    branches: [main]
    paths-ignore:
      - "docs/**"
      - "rules/**"
      - "*.md"
  # 内容仓库发来更新通知时触发
  repository_dispatch:
    types: [content-updated]
  # 允许在 GitHub 网页上手动点击运行
  workflow_dispatch:
    inputs:
      content_ref:
        description: "内容仓 ref 或 commit SHA（留空使用 main）"
        required: false
        default: ""
  # 每天定时运行一次，防止漏掉更新
  schedule:
    - cron: "17 4 * * *"

# 同时只运行一个任务，新的推送会自动取消正在运行的旧任务
concurrency:
  group: deploy
  cancel-in-progress: true

permissions:
  contents: read

env:
  CONTENT_REPOSITORY: OWNER/shirone-content
  CONTENT_WORKING_COPY: .content-src

jobs:
  deploy:
    name: Build and deploy
    runs-on: ubuntu-latest
    timeout-minutes: 20
    env:
      CI: true
      CONTENT_DIR: .content-src

    steps:
      # 找出本次需要拉取的内容版本号
      - name: Resolve content ref
        id: target
        env:
          PAYLOAD_SHA: ${{ github.event.client_payload.sha }}
          INPUT_REF: ${{ github.event.inputs.content_ref }}
        run: |
          set -euo pipefail
          ref="${PAYLOAD_SHA:-}"
          [ -n "$ref" ] || ref="${INPUT_REF:-}"
          [ -n "$ref" ] || ref="main"
          echo "ref=$ref" >> "$GITHUB_OUTPUT"

      # 下载主题代码
      - name: Checkout theme
        uses: actions/checkout@v4

      # 下载文章内容
      - name: Checkout content
        uses: actions/checkout@v4
        with:
          repository: ${{ env.CONTENT_REPOSITORY }}
          ref: ${{ steps.target.outputs.ref }}
          path: ${{ env.CONTENT_WORKING_COPY }}
          token: ${{ secrets.CONTENT_REPO_TOKEN }}
          persist-credentials: false

      # 记录本次拉取到的文章版本号
      - name: Record content commit
        id: content
        run: |
          set -euo pipefail
          echo "sha=$(git -C '${{ env.CONTENT_WORKING_COPY }}' rev-parse HEAD)" >> "$GITHUB_OUTPUT"

      # 安装 Node.js 与 pnpm 工具
      - name: Set up pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: false

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 26.13.0
          cache: pnpm
          cache-dependency-path: pnpm-lock.yaml

      # 缓存已有图片的缩略图，避免重复处理
      - name: Restore build caches
        uses: actions/cache@v4
        with:
          path: public/assets/moments/thumbnails
          key: ${{ runner.os }}-shirone-thumbnails-${{ hashFiles('pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-shirone-thumbnails-

      # 安装项目依赖包
      - name: Install dependencies
        run: pnpm install --frozen-lockfile --prefer-offline

      # 把文章内容和配置文件复制到主题对应的目录中
      - name: Materialize content and config
        run: pnpm content:sync

      # 打包生成网页文件，存放在 dist/ 目录中
      - name: Build site
        run: pnpm build

      # 把 dist/ 目录中的网页文件同步到服务器
      - name: Deploy to server
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          DEPLOY_DIR: /var/www/shirone
        run: |
          set -euo pipefail
          mkdir -p ~/.ssh && chmod 700 ~/.ssh
          printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H "$DEPLOY_HOST" >> ~/.ssh/known_hosts
          rsync -az --delete -e "ssh -i ~/.ssh/deploy_key" \
            dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR/dist/"

      # 在 GitHub 网页上显示本次部署的结果说明
      - name: Summarize
        if: always()
        run: |
          set -euo pipefail
          {
            echo "### Shirone deploy"
            echo "- 内容仓：\`${CONTENT_REPOSITORY}\`"
            echo "- 内容 ref：\`${{ steps.target.outputs.ref }}\`"
            echo "- 内容 commit：\`${{ steps.content.outputs.sha }}\`"
          } >> "$GITHUB_STEP_SUMMARY"
```

### 核心步骤说明

- **触发条件 (`on`)**：包含四种情况。当你修改主题代码、或者内容仓推送了新文章、或者每天定时检查、或者在网页上手动点击，都会触发运行；
- **防止冲突 (`concurrency`)**：如果你连续保存推送了多次文章，GitHub 会自动取消前面的旧任务，只打包最新一次的内容；
- **下载内容 (`Checkout content`)**：根据传过来的具体提交版本号，把内容仓库里的文章和配置下载到临时文件夹中；
- **复用图片缩略图 (`Restore build caches`)**：网站里的相册或说说照片压缩比较花时间，这里会把已经压缩好的缩略图存起来，下次发新文章时不需要重新压缩老照片；
- **同步文章 (`pnpm content:sync`)**：把下载下来的文章、图片和配置文件放到主题程序对应的位置上；
- **打包网站 (`pnpm build`)**：运行打包命令，把所有 Markdown 文章和主题样式编译成最终的 HTML 网页，输出在 `dist/` 文件夹中；
- **同步到服务器 (`rsync`)**：连接你的服务器，只把这次修改过的网页文件上传上去，并自动删掉服务器上已经过时的旧网页文件。

---

## 2. 内容更新后通知打包：`trigger-build.yml.example`

这个文件位于内容仓库的 `.github/workflows/trigger-build.yml.example`。使用时把它重命名为 `trigger-build.yml`。

它的作用很简单：当你写完文章推送到内容仓库后，先检查文章格式有没有写错；确认没问题后，通知代码仓库开始打包。

### 完整文件内容

```yaml title=".github/workflows/trigger-build.yml.example"
name: Trigger Theme Build

on:
  push:
    branches:
      - main
    # 只有改动了文章、配置、数据或图片时才触发
    paths:
      - "content/**"
      - "config/**"
      - "data/**"
      - "assets/**"
      - "public/**"
      - "shirone.content.json"
  workflow_dispatch: {}

# 如果短时间内多次推送，只保留最新一次
concurrency:
  group: trigger-build
  cancel-in-progress: true

jobs:
  # 步骤一：先检查文章和配置的格式是否正确
  validate:
    uses: LyraVoid/Shirone/.github/workflows/content-validate.yml@main
    with:
      theme_repository: LyraVoid/Shirone
      theme_ref: main

  # 步骤二：检查通过后，通知主题代码仓库开始打包
  dispatch:
    needs: validate
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      # 方式一：向主题代码仓库发送事件通知
      - name: Dispatch build event to theme repository
        env:
          DISPATCH_TOKEN: ${{ secrets.DISPATCH_TOKEN }}
        if: ${{ env.DISPATCH_TOKEN != '' }}
        uses: peter-evans/repository-dispatch@v4
        with:
          token: ${{ env.DISPATCH_TOKEN }}
          repository: LyraVoid/Shirone
          event-type: content-updated
          # 把本次提交的具体版本号发过去，保证打包内容准确
          client-payload: '{"sha": "${{ github.sha }}"}'

      # 方式二：触发托管平台的部署钩子（未配置对应 Secret 时自动跳过）
      - name: Trigger Cloudflare Pages deploy hook
        env:
          CLOUDFLARE_DEPLOY_HOOK: ${{ secrets.CLOUDFLARE_DEPLOY_HOOK }}
        if: ${{ env.CLOUDFLARE_DEPLOY_HOOK != '' }}
        run: |
          curl -s -S -X POST "${{ env.CLOUDFLARE_DEPLOY_HOOK }}"

      - name: Trigger Vercel deploy hook
        env:
          VERCEL_DEPLOY_HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK }}
        if: ${{ env.VERCEL_DEPLOY_HOOK != '' }}
        run: |
          curl -s -S -X POST "${{ env.VERCEL_DEPLOY_HOOK }}"
```

### 核心步骤说明

- **忽略无关文件 (`paths`)**：如果你只是修改了内容仓库里的 `README.md` 说明，工作流不会运行，避免无意义的打包；
- **先检查再打包 (`needs: validate`)**：如果某篇文章的头部格式或者 YAML 配置文件写错了，第一步就会报错停下来，不会去通知代码仓库，避免把写错格式的网页发布上线；
- **通知主题仓打包（方式一）**：检查通过后，把这次提交的 Commit 版本号发送给主题代码仓库，让主题仓库精准拉取这次写好的文章；
- **通知平台直接打包（方式二）**：如果你直接使用托管平台打包，可以填入平台给出的部署钩子地址。

::: tip 想跳过校验、加快 Actions 速度？
`validate` 任务每次推送都会克隆主题仓库并安装依赖做完整校验，通常需要一到两分钟。若不需要这层预检，可以注释掉 `validate` 任务，并**同时**注释 `dispatch` 任务里的 `needs: validate`——两处必须一起处理，否则工作流会因引用了不存在的任务而直接报错。

跳过后工作流只剩发送通知一步，通常几十秒内完成。代价是：文章 frontmatter 或 `config/` 配置写错时，问题会推迟到托管平台或主题仓构建中途才暴露——反馈时间从十几秒变成数分钟，且每次失败都会消耗一次完整构建。需要恢复校验时，去掉两处注释即可。
:::

::: tip 部署钩子（Deploy Hook）说明
除了通知主题代码仓库的 Actions 打包之外，如果你使用的是 Cloudflare Pages、Vercel、EdgeOne 或 Netlify 等平台，也可以使用平台提供的部署钩子。

此时内容仓库推送后会直接向平台发送请求，由平台自行拉取并打包网站。具体配置流程与四个平台的设置位置请查看[部署钩子](/guide/content-separation/deploy-hooks/)。
:::

---

## 3. 文章格式检查：`content-validate.yml`

这个文件位于主题代码仓库的 `.github/workflows/content-validate.yml`。

它不需要手动点击运行，而是由上面内容仓库的 `trigger-build.yml` 在第一步时自动调用。

### 核心执行代码

```yaml title=".github/workflows/content-validate.yml"
name: Validate content

on:
  workflow_call:
    inputs:
      theme_repository:
        description: "主题仓路径，例如 OWNER/REPO"
        type: string
        required: true
      theme_ref:
        description: "主题仓分支"
        type: string
        required: false
        default: main
    secrets:
      theme_token:
        description: "私有主题仓访问令牌"
        required: false

jobs:
  validate:
    name: Schema and structure
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      # 下载内容仓库文件
      - name: Checkout content
        uses: actions/checkout@v4
        with:
          path: content

      # 下载主题代码
      - name: Checkout theme
        uses: actions/checkout@v4
        with:
          repository: ${{ inputs.theme_repository }}
          ref: ${{ inputs.theme_ref }}
          path: theme
          token: ${{ secrets.theme_token || github.token }}

      - uses: pnpm/action-setup@v4
        with:
          package_json_file: theme/package.json
          run_install: false

      - uses: actions/setup-node@v4
        with:
          node-version: 26.13.0
          cache: pnpm
          cache-dependency-path: theme/pnpm-lock.yaml

      - run: pnpm install --frozen-lockfile --prefer-offline
        working-directory: theme

      # 检查一：检查文件夹目录是否合规，以及 config 目录中的 yaml 配置文件格式
      - name: Validate content structure and config
        working-directory: theme
        env:
          CONTENT_DIR: ${{ github.workspace }}/content
        run: pnpm content:validate

      # 检查二：检查每篇 Markdown 文章头部的标题、日期、分类等字段格式
      - name: Validate frontmatter schemas
        working-directory: theme
        env:
          CONTENT_DIR: ${{ github.workspace }}/content
        run: |
          set -euo pipefail
          pnpm content:sync
          pnpm exec astro sync
```

### 检查的内容

- **配置文件检查 (`pnpm content:validate`)**：检查 `config/` 目录里的配置文件，如果有配置项名称拼写错误，会直接指出错误位置；
- **文章头部信息检查 (`astro sync`)**：检查每篇文章最上方的标题、分类、标签、日期等信息，确保符合格式要求，防止打包时报错。

---

## 下一步

- [部署到服务器](/guide/deploy/server/)：查看如何使用 GitHub Actions 将打包好的网页自动同步到你的服务器
- [跨仓自动构建](/guide/content-separation/ci-dispatch/)：查看双仓模式下两个仓库的令牌设置步骤
- [部署钩子](/guide/content-separation/deploy-hooks/)：查看如何直接触发托管平台重新构建
- [部署总览](/guide/deploy/overview/)：了解 Vercel、Cloudflare 等其他托管平台的部署方式
