---
title: 本地预览与调试
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/local-preview/
---

双仓模式下，主题仓负责构建与渲染，内容仓负责管理文章与配置。本地预览需要让主题仓获知内容仓的存放路径。

## 准备工作

确认满足以下两项前置条件：

1. 主题仓已完成依赖安装（`pnpm install`）；
2. 内容仓已存在于本地磁盘目录。

若内容仓是通过 `content:eject` 迁出的，主题仓根目录的 `shirone.content.json` 已写入该路径，可直接跳转到[启动预览](#启动预览)。

其余情况需要指定内容仓路径，二选一即可：

- 在终端中临时设置环境变量；
- 在主题仓根目录新建 `.env`，适合长期本地开发。

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

`CONTENT_DIR` 的相对路径以主题仓根目录为基准解析，亦可填写绝对路径。

## 启动预览

### 方式一：同步单次后启动

适合仅查看页面渲染效果、无需频繁修改文件内容的场景。

::: tabs
@tab Windows (PowerShell)
```powershell
$env:CONTENT_DIR = "D:\Code\my-blog-content"
pnpm.cmd content:sync
pnpm.cmd dev
```
@tab Linux / macOS
```bash
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"
pnpm content:sync
pnpm dev
```
:::

终端输出 `Local http://localhost:4321/` 后，在浏览器中打开对应地址即可。

`content:sync` 会将内容仓文件复制到主题仓的 `src/content/`、`src/data/`、`src/assets/` 与 `public/`，并编译生成配置桥接文件 `src/user/user-config.ts`。

### 方式二：边写边预览

适合持续编写文章或调整 YAML 配置。分别在两个终端中进入主题仓：

::: tabs
@tab Windows (PowerShell)
```powershell
# 终端 1
$env:CONTENT_DIR = "D:\Code\my-blog-content"
pnpm.cmd dev

# 终端 2
$env:CONTENT_DIR = "D:\Code\my-blog-content"
pnpm.cmd content:watch
```
@tab Linux / macOS
```bash
# 终端 1
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"
pnpm dev

# 终端 2
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"
pnpm content:watch
```
:::

在 Markdown 编辑器中保存文件后，`content:watch` 会自动同步变更，浏览器随之热重载刷新。配置了 `.env` 文件后，两个终端均无需重复设置 `CONTENT_DIR`。

## 确认内容源

不确定当前读取的具体仓库时，在主题仓根目录执行：

```bash
pnpm content:status
```

命令会列出当前内容源类型、解析到的 commit SHA，以及生效的配置文件。若需核对远端分支是否更新，添加 `--remote` 参数发起网络检查。

## 常见问题

::: collapse
- 提示内容目录不存在

  检查 `CONTENT_DIR` 是否指向真实存在的目录，以及该目录下是否包含 `content/` 或 `config/`。路径中带有空格时需用引号包裹。

- 修改了配置但页面未更新

  运行 `pnpm content:validate`，检查 YAML 中是否存在拼错的字段。数组字段采用整体替换策略，仅声明新增项不会生效，必须列出完整的配置列表。详见[配置覆盖](/guide/content-separation/config-overlay/)。

- 添加了新图片但页面未展示

  图片需放置在内容仓的 `assets/` 或 `public/` 目录下。在深层目录中添加文件后，建议重新执行一次 `pnpm content:sync`。

- 修改 `config/anime.yaml` 后页面缺少追番数据

  修改 YAML 不会自动拉取网络数据。在主题仓执行 `pnpm anime:sync --if-stale` 下载追番列表与封面后再行预览。首次配置或需要强制刷新时使用 `pnpm anime:sync`，详见[番剧页](/guide/pages/anime/)。
:::

## 下一步

[内容源配置](/guide/content-separation/content-sources/)：了解本地路径、远程仓库与清单文件的解析优先级。
