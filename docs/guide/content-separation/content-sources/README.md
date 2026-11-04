---
title: 内容源配置
createTime: 2026/11/03 16:00:00
permalink: /guide/content-separation/content-sources/
---

`pnpm content:sync` 在构建前决定从何处读取内容。单仓模式无需额外配置；双仓模式通过环境变量或主题仓根目录的清单文件指定。

## 解析顺序

系统按以下顺序依次查找，命中首个有效配置即刻停止：

1. `SHIRONE_CONTENT_SYNC=0`：强制关闭同步，回退为单仓模式；
2. `CONTENT_DIR`：读取本地内容仓路径；
3. `CONTENT_REPO_URL`：克隆或拉取远程 Git 仓库；
4. 主题仓根目录 `shirone.content.json` 中的 `source` 声明；
5. 未命中上述任何配置：使用主题仓自带内容。

`CONTENT_DIR` 的优先级高于 `CONTENT_REPO_URL`。本地已指定内容仓路径时，即使同时配置了远程仓库地址，也会优先读取本地目录。

环境变量加载优先级如下：

```text
进程环境变量 > .env.local > .env
```

`.env` 与 `.env.local` 仅对本地命令生效。平台构建机不会读取仓库中的 `.env` 文件，必须在平台控制台中配置对应的环境变量。

## 变量说明

| 变量 | 作用 | 默认值 |
| --- | --- | --- |
| `CONTENT_DIR` | 本地内容仓路径 | 无 |
| `CONTENT_REPO_URL` | 远程内容仓的 Git 地址 | 无 |
| `CONTENT_REPO_REF` | 分支、标签或 commit SHA | `main` |
| `CONTENT_SYNC_PULL` | 设为 `false` 时不联网拉取，直接复用 `.content-src/` | `true` |
| `SHIRONE_CONTENT_SYNC` | 设为 `0`、`false`、`no` 或 `off` 时关闭同步 | 未设置 |
| `GIT_TERMINAL_PROMPT` | 设为 `0` 时禁止 Git 弹出交互式输入提示 | 未设置 |

### CONTENT_DIR

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

相对路径基于主题仓根目录解析。适用于本地预览场景，配合 `pnpm content:watch` 使用时无需频繁请求远端。

### CONTENT_REPO_URL

```ini title=".env"
CONTENT_REPO_URL="https://github.com/OWNER/shirone-content.git"
```

私有仓库需在 URL 中包含访问令牌：

```text
https://x-access-token:<TOKEN>@github.com/OWNER/shirone-content.git
```

同步脚本会在日志输出中自动隐藏凭据信息。即便如此，切勿将包含令牌的地址提交到代码仓或示例配置中。

### CONTENT_REPO_REF

未设置时默认使用清单中的 `source.ref`；若清单未声明则使用 `main`。针对特定提交执行可重现构建时，请填写完整的 commit SHA，避免使用短 SHA 或可变分支名。

### CONTENT_SYNC_PULL

```ini title=".env"
CONTENT_SYNC_PULL="false"
```

设为 `false` 后仅复用本地现有的 `.content-src/`。生效前提是该目录的仓库 URL、ref 与 commit 与当前配置完全一致，且工作区无未提交改动，否则命令将报错中断。

### SHIRONE_CONTENT_SYNC

用于临时回退到单仓模式，排查是否因内容源配置异常导致构建问题。该变量关闭后，`CONTENT_DIR` 与 `CONTENT_REPO_URL` 均不再生效。

## 三种常见场景

### 本地预览

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

```bash
pnpm content:sync
pnpm dev
```

完整操作步骤见[本地预览与调试](/guide/content-separation/local-preview/)。

### GitHub Actions

主题仓的 `deploy.yml.example` 预设步骤会先将内容仓检出至 `.content-src/`，再通过 `CONTENT_DIR` 指向该目录：

```yaml
env:
  CONTENT_DIR: .content-src
```

检出步骤使用 `CONTENT_REPO_TOKEN`。该令牌仅供 checkout 使用，`content:sync` 本身不直接读取：

```yaml
- uses: actions/checkout@v4
  with:
    repository: OWNER/shirone-content
    ref: ${{ github.event.client_payload.sha || 'main' }}
    path: .content-src
    token: ${{ secrets.CONTENT_REPO_TOKEN }}
    persist-credentials: false
```

### Cloudflare Pages / Vercel / EdgeOne / Netlify

托管平台的构建机仅克隆主题仓，无法直接检出第二个仓库，因此需配置 `CONTENT_REPO_URL`：

```text
CONTENT_REPO_URL=https://x-access-token:<TOKEN>@github.com/OWNER/shirone-content.git
CONTENT_REPO_REF=main
GIT_TERMINAL_PROMPT=0
```

平台执行 `pnpm build` 时会自动执行内容同步，切勿在构建命令前添加 `pnpm content:sync &&`。

## 清单文件

主题仓根目录下的 `shirone.content.json` 为可选配置文件，用于固定内容源信息。仓库提供了示例模板 `shirone.content.example.json`，复制并重命名即可：

```json title="shirone.content.json"
{
  "schemaVersion": 1,
  "source": {
    "type": "git",
    "url": "https://github.com/OWNER/shirone-content.git",
    "ref": "main"
  },
  "mounts": {
    "content": "src/content",
    "data": "src/data",
    "assets": "src/assets",
    "public": "public"
  },
  "keep": [],
  "prune": true
}
```

| 字段 | 说明 |
| --- | --- |
| `schemaVersion` | 清单结构版本，当前为 `1` |
| `source.type` | `path`（本地目录）或 `git`（远程仓库） |
| `source.path` | 本地内容仓路径，相对主题仓根目录 |
| `source.url` / `source.ref` | 远程仓库地址与对应的分支、标签或 commit SHA |
| `mounts` | 挂载映射关系，设为 `null` 可禁用对应挂载点 |
| `keep` | 豁免同步裁剪的文件白名单，支持 `*` 与 `**` 通配符 |
| `prune` | 设为 `false` 时执行增量复制，不删除内容仓已移除的文件 |

执行 `pnpm content:eject` 会自动生成此文件，并将内容源指向迁出目录。

内容仓根目录下虽然也存在 `shirone.content.json`，但该文件仅记录内容仓自身的元数据，构建流程不会读取。如需修改内容源配置，请修改主题仓中的清单文件。

## 私有仓与令牌

- 访问令牌仅需内容仓的 `Contents: Read` 权限，无需主题仓权限。
- 携带令牌的地址必须使用 HTTPS 协议。SSH 协议要求构建机预设私钥，多数托管平台不支持此项配置。
- 令牌过期、被吊销或未授予内容仓读取权限时，构建日志将报错 `Authentication failed`。
- 申请流程详见[申请个人访问令牌](/guide/content-separation/pat/)。
- 切勿将 `.env`、令牌明文或包含令牌的地址提交至公开仓库。

公开内容仓无需配置令牌，直接填写 `https://github.com/OWNER/REPO.git` 即可。

## 常见问题

::: collapse
- 配置了 `CONTENT_REPO_URL`，但构建仍然使用主题仓自带内容

  检查是否同时设置了 `CONTENT_DIR`，其优先级更高。并确认变量已配置在构建平台实际读取的环境变量设置中，而非仅存在于本地 `.env`。

- 内容仓已推送更新，但构建结果仍为旧内容

  检查 `CONTENT_REPO_REF` 是否固定为了旧分支或历史 commit SHA。托管平台的构建缓存亦可能残留旧的 `.content-src/`，清理缓存后重新触发构建。

- `CONTENT_SYNC_PULL=false` 报错失败

  该选项要求 `.content-src/` 必须与当前的 URL、ref 及 commit 完全一致，且工作区无未跟踪修改。建议先执行一次常规同步，或删除 `.content-src/` 后重新构建。

- 仓库地址中含有特殊字符

  包含访问令牌的地址需遵循 URL 编码规范。建议统一采用 `x-access-token:<TOKEN>` 格式，避免在用户名或密码字段中出现特殊字符。
:::

## 相关页面

- [本地预览与调试](/guide/content-separation/local-preview/)
- [跨仓自动构建](/guide/content-separation/ci-dispatch/)
- [部署钩子](/guide/content-separation/deploy-hooks/)
- [CLI 工具链](/guide/content-separation/cli-workflows/)
