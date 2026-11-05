---
title: 内容源配置
createTime: 2026/11/03 16:00:00
permalink: /guide/content-separation/content-sources/
---

在双仓分离架构下，你的博客代码存放在主题代码仓，而所有文章、配置、图片等数据存放在独立的内容仓库中。

每次执行构建或本地预览前，Shirone 需要知道从何处读取这些内容。「内容源」就是告诉 Shirone 去哪里拉取你的文章和配置文件。

## 两种核心内容源

根据使用场景，内容源分为**本地目录**与**远程 Git 仓库**两种形式：

### 1. 本地目录（用于本地写作与预览）

在个人电脑上写作时，通常将内容仓库与主题代码仓库克隆在相邻的文件夹中。此时通过 `CONTENT_DIR` 指定本地内容目录：

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

- **路径说明**：支持相对路径或绝对路径。相对路径基于主题代码仓的根目录进行解析；
- **协同工作**：配合 `pnpm content:watch` 监听命令使用，你在本地编辑器保存文章时，改动会实时同步到博客预览中，无需频繁向远端请求或提交代码。

### 2. 远程 Git 仓库（用于云端自动化构建）

当博客部署到托管平台（Cloudflare Pages、Vercel、EdgeOne、Netlify）时，平台的构建机通常只克隆了主题代码仓。此时必须通过 `CONTENT_REPO_URL` 让构建机在打包时自动拉取远程内容仓库：

```ini title="平台环境变量"
CONTENT_REPO_URL=https://github.com/你的用户名/你的内容仓库名.git
CONTENT_REPO_REF=main
GIT_TERMINAL_PROMPT=0
```

关于远程内容源的关键参数说明：

| 环境变量 | 必填 | 说明 |
| --- | --- | --- |
| `CONTENT_REPO_URL` | 是 | 远程内容仓库的 Git 地址（公开仓与私有仓格式见下方） |
| `CONTENT_REPO_REF` | 否 | 指定拉取的分支、标签或 commit SHA，默认值为 `main` |
| `GIT_TERMINAL_PROMPT` | 是 | 固定设置为 `0`，禁止 Git 在权限不足时弹出交互式密码输入，防止云端构建卡死超时 |

**公开仓与私有仓格式说明**：

- **公开内容仓库**：直接填写标准的 HTTPS 仓库地址：
  ```text
  https://github.com/你的用户名/你的内容仓库名.git
  ```
- **私有内容仓库**：需要在 URL 中携带具备读取权限的个人访问令牌（PAT）：
  ```text
  https://x-access-token:<你的TOKEN>@github.com/你的用户名/你的内容仓库名.git
  ```
  令牌仅需内容仓库的 `Contents: Read` 读取权限。同步脚本在输出日志时会自动遮蔽令牌信息，但切勿将带有令牌的地址提交到公开代码或示例文件中。申请令牌流程请参考[申请个人访问令牌](/guide/content-separation/pat/)。

## 变量配置生效位置

根据运行环境的不同，环境变量的配置位置也有所区分：

| 运行环境 | 配置位置 | 说明 |
| --- | --- | --- |
| 本地开发与预览 | 主题仓根目录的 `.env` 或 `.env.local` | 仅在本地终端命令中生效，不会被推送到线上 |
| 云端托管平台 | 托管平台的项目控制台（Environment Variables） | 托管平台构建机不会读取代码里的本地 `.env` 文件，必须在平台后台添加 |
| GitHub Actions | 仓库的 Settings -> Secrets / Variables | 在工作流文件（如 `deploy.yml`）中通过 `env:` 引用 |

环境变量加载优先级为：`系统/进程环境变量` > `.env.local` > `.env`。

## 内容源查找优先级

当系统中同时存在多种配置时，Shirone 会按照以下顺序查找内容源，一旦匹配到第一个有效项即停止后续检索：

1. **`SHIRONE_CONTENT_SYNC=0`**：强制关闭同步功能，直接回退为使用主题仓自带的内置示例内容。适用于排查构建异常时临时排障；
2. **`CONTENT_DIR`**：如果配置了本地目录，且该目录存在，优先从本地目录读取内容（即使同时配置了 `CONTENT_REPO_URL` 也以本地路径为准）；
3. **`CONTENT_REPO_URL`**：从远程 Git 仓库拉取内容至临时工作目录 `.content-src/`；
4. **清单文件中的 `source` 声明**：读取主题仓根目录 `shirone.content.json` 中配置的来源；
5. **主题仓默认内容**：上述配置均未命中时，使用主题自带的内置内容。

## 高级变量

在特定调试或网络受限场景下，还可选用以下辅助控制变量：

| 变量名 | 可选值 | 说明 |
| --- | --- | --- |
| `CONTENT_SYNC_PULL` | `false` / `true`（默认） | 设为 `false` 时不发起网络拉取，直接复用现有的 `.content-src/` 临时目录。要求该目录与当前 URL、ref 完全一致且无未提交修改 |
| `SHIRONE_CONTENT_SYNC` | `0` / `false` / `off` | 关闭内容同步逻辑，用于快速定位是否由于内容源引起构建故障 |

## 清单文件（shirone.content.json）

主题仓根目录下的 `shirone.content.json` 是一个可选的持久化清单文件。如果你希望将内容源的默认地址直接固化在代码仓中，可以使用该文件。代码仓提供了参考模板 `shirone.content.example.json`，复制并重命名即可：

```json title="shirone.content.json"
{
  "schemaVersion": 1,
  "source": {
    "type": "git",
    "url": "https://github.com/你的用户名/你的内容仓库名.git",
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

字段功能简述：

- **`source`**：声明默认的内容源。`type` 可选 `path`（本地路径）或 `git`（远程仓库）；
- **`mounts`**：声明内容仓各目录与主题代码仓的映射挂载关系；
- **`keep`**：文件保护白名单列表，匹配到的文件在同步时不会被删除，支持通配符；
- **`prune`**：同步时是否清理主题仓内多余的废弃文件，默认为 `true`。

::: tip 区分主题仓与内容仓的清单文件
内容仓根目录也包含一个 `shirone.content.json`，该文件仅用于标记内容仓自身的元数据。构建系统读取的是**主题代码仓**中的配置，修改内容源配置请在主题代码仓中操作。
:::

## 常见问题排查

::: collapse
- 配置了 CONTENT_REPO_URL，但构建时依然读取主题自带的示例内容？

  检查本地或环境变量中是否同时配置了 `CONTENT_DIR`。本地目录优先级高于远程仓库，一旦检测到本地路径存在就会优先使用。

  如果是部署到云端托管平台，请检查变量是否添加在平台的控制台环境变量设置中，切勿仅写在本地 `.env` 文件里。

- 内容仓推送了新文章，但打包构建出来的页面依然是旧文章？

  检查托管平台或工作流中的 `CONTENT_REPO_REF` 是否写死了特定的旧 commit SHA 或历史分支。

  若配置无误，可能是托管平台构建机缓存了旧的 `.content-src/` 临时目录，在平台控制台清理构建缓存后重新部署即可。

- 私有内容仓库构建时报错 Authentication failed？

  检查 `CONTENT_REPO_URL` 中的个人访问令牌（PAT）是否已过期，或者是否未勾选 `Contents: Read` 读取权限。

- 拉取私有仓报 `403 Write access to repository not granted`？

  多为细粒度令牌的 Repository access 未勾选内容仓（或未设置 Contents 权限）。该报错文案与写权限无关，排查步骤详见[常见问题](/guide/content-separation/faq/)。

- 拉取报 `couldn't find remote ref main`？

  内容仓还没有推送任何提交，或 `CONTENT_REPO_REF` 与实际分支名不一致，详见[常见问题](/guide/content-separation/faq/)。
:::

## 下一步

- [配置覆盖](/guide/content-separation/config-overlay/)：了解如何在内容仓中修改博客标题、导航栏与侧栏等外观设置
- [本地预览与调试](/guide/content-separation/local-preview/)：在本地电脑上搭配主题代码实时预览文章
- [CLI 工具链](/guide/content-separation/cli-workflows/)：熟悉内容同步与状态检查命令
