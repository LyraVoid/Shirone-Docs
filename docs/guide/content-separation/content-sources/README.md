---
title: 内容源配置与环境变量
createTime: 2026/11/03 16:00:00
permalink: /guide/content-separation/content-sources/
---

`pnpm content:sync` 在构建前决定从哪里读取内容。单仓模式不需要配置；双仓模式通过环境变量或内容仓的 `shirone.content.json` 指定内容源。

这一页统一说明内容源的优先级、变量含义和常见场景。各托管平台的构建参数仍放在[托管平台部署钩子](/guide/content-separation/deploy-hooks/)。

## 优先级

内容源按以下顺序解析，找到第一个可用项就停止：

1. `SHIRONE_CONTENT_SYNC=0`：强制关闭同步，回到单仓模式
2. `CONTENT_DIR`：本地内容仓路径
3. `CONTENT_REPO_URL`：远程 Git 内容仓地址
4. `shirone.content.json` 中的 `source`
5. 以上都没有：使用主题仓自带内容

`CONTENT_DIR` 的优先级高于 `CONTENT_REPO_URL`。本地已经有内容仓时，即使同时配置了远程地址，也会读取本地目录。

环境变量的来源也有优先级：

```text
进程环境变量 > .env.local > .env
```

`.env` 和 `.env.local` 只对本地命令和读取这些文件的脚本生效。平台构建机不会自动读取仓库里的 `.env`，需要在平台控制台单独配置环境变量。

## 变量说明

| 变量 | 作用 | 默认值 |
| --- | --- | --- |
| `CONTENT_DIR` | 本地内容仓路径，适合本地预览和调试 | 无 |
| `CONTENT_REPO_URL` | 远程内容仓的 Git 地址 | 无 |
| `CONTENT_REPO_REF` | 内容仓分支、标签或 Commit SHA | `main` |
| `CONTENT_SYNC_PULL` | 设为 `false` 时复用 `.content-src/`，不联网拉取 | `true` |
| `SHIRONE_CONTENT_SYNC` | 设为 `0`、`false`、`off` 或 `no` 时关闭同步 | 未设置 |
| `GIT_TERMINAL_PROMPT` | 设为 `0` 时禁止 Git 等待终端输入 | 未设置 |

### CONTENT_DIR

指向已经克隆到本地的内容仓：

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

相对路径按主题仓根目录解析。这个变量适合配合 `pnpm content:watch`，写作时不需要反复拉取远程仓库。

### CONTENT_REPO_URL

指向远程内容仓，通常用于平台构建机：

```ini title=".env"
CONTENT_REPO_URL="https://github.com/OWNER/shirone-content.git"
```

私有仓需要在 URL 中带访问令牌：

```text
https://x-access-token:<TOKEN>@github.com/OWNER/shirone-content.git
```

同步脚本会在日志中隐藏 URL 里的凭据。即使如此，也不要把带令牌的地址写进仓库文件、构建脚本或示例配置。

### CONTENT_REPO_REF

指定内容仓的版本，可以是分支、标签或 Commit SHA：

```ini title=".env"
CONTENT_REPO_REF="main"
```

不设置时使用 `main`；如果内容仓的 `shirone.content.json` 声明了 `source.ref`，则使用清单里的值。`CONTENT_REPO_REF` 同时作用于 `CONTENT_REPO_URL` 和清单中的 Git 内容源。

需要按某次提交精确构建时，填完整的 SHA，不要填短 SHA 或分支名。

### CONTENT_SYNC_PULL

默认会拉取远程内容。设为 `false` 后，同步脚本只复用现有的 `.content-src/`：

```ini title=".env"
CONTENT_SYNC_PULL="false"
```

复用的前提是工作副本的 URL、ref 和 commit 都与当前配置一致，并且没有未提交的改动。不满足时会直接报错，不会悄悄拉取。

### SHIRONE_CONTENT_SYNC

临时关闭双仓同步：

```ini title=".env"
SHIRONE_CONTENT_SYNC="0"
```

适合排查“内容源配置是否正确”或需要回到单仓模式验证问题。关闭后，`CONTENT_DIR` 和 `CONTENT_REPO_URL` 都不会生效。

## 三种常见场景

### 本地预览

在主题仓根目录创建 `.env`：

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

然后执行：

```bash
pnpm content:sync
pnpm dev
```

需要边写边看时，在第二个终端运行 `pnpm content:watch`。完整步骤见[本地预览与调试](/guide/content-separation/local-preview/)。

### GitHub Actions

主题仓的官方 `deploy.yml.example` 会先把内容仓 checkout 到 `.content-src/`，再用 `CONTENT_DIR` 指向它：

```yaml
env:
  CONTENT_DIR: .content-src
```

checkout 步骤使用 `CONTENT_REPO_TOKEN`：

```yaml
- uses: actions/checkout@v4
  with:
    repository: OWNER/shirone-content
    ref: ${{ github.event.client_payload.sha || 'main' }}
    path: .content-src
    token: ${{ secrets.CONTENT_REPO_TOKEN }}
    persist-credentials: false
```

这种写法不需要 `CONTENT_REPO_URL`。`CONTENT_REPO_TOKEN` 只供 checkout 使用，`content:sync` 本身不读取它。

### Cloudflare Pages / Vercel / EdgeOne / Netlify

平台构建机自己克隆主题仓，无法额外 checkout 内容仓，因此使用 `CONTENT_REPO_URL`：

```text
CONTENT_REPO_URL=https://x-access-token:<TOKEN>@github.com/OWNER/shirone-content.git
CONTENT_REPO_REF=main
GIT_TERMINAL_PROMPT=0
```

平台会执行 `pnpm build`，其中包含 `content:sync`。构建命令不要再加 `pnpm content:sync &&`。

## 私有仓与令牌

- 令牌只需要内容仓的 `Contents: Read` 权限，不需要主题仓权限。
- 细粒度个人访问令牌（Fine-grained PAT）的完整申请图文指引见[申请 GitHub 个人访问令牌（PAT）](/guide/content-separation/ci-dispatch/#第一步-申请-github-个人访问令牌-pat)。
- 带令牌的 URL 使用 HTTPS。SSH 地址需要构建机预置私钥，大多数托管平台不提供这项配置。
- 令牌过期、被撤销或没有内容仓权限时，日志会出现 `Authentication failed`。
- 不要把 `.env`、带令牌的 URL 或令牌本身提交到仓库。
- 平台构建使用平台提供的环境变量或 Secret，不要依赖仓库内的 `.env`。

## 常见问题

::: collapse
- 配置了 `CONTENT_REPO_URL`，构建仍然使用主题仓自带内容

  检查是否同时设置了 `CONTENT_DIR`，它的优先级更高。再确认变量写在构建机实际读取的位置，而不是只写进了本地 `.env`。

- 内容仓分支更新了，构建还是旧内容

  检查 `CONTENT_REPO_REF` 是否写死成了旧分支或旧 SHA；平台构建缓存也可能保留旧的 `.content-src/`。必要时清理缓存后重新构建。

- `CONTENT_SYNC_PULL=false` 报错

  这个设置要求 `.content-src/` 与当前 URL、ref、commit 完全一致，且工作副本干净。先正常同步一次，或删除 `.content-src/` 后重新构建。

- 域名或仓库地址里有特殊字符

  带令牌的 URL 需要做 URL 编码。建议直接使用 `x-access-token:<TOKEN>` 形式，避免在用户名或密码里放特殊字符。

- 公开内容仓还需要令牌吗

  不需要。公开仓可以直接用 `https://github.com/OWNER/REPO.git`。只有私有仓才需要带令牌的地址。
:::

## 相关页面

- [本地预览与调试](/guide/content-separation/local-preview/)
- [跨仓自动构建](/guide/content-separation/ci-dispatch/)
- [托管平台部署钩子](/guide/content-separation/deploy-hooks/)
- [CLI 工具链](/guide/content-separation/cli-workflows/)
