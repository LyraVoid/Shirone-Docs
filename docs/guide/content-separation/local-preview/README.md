---
title: 本地预览与调试
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/local-preview/
---

双仓模式下，主题仓负责构建与渲染，内容仓负责管理文章与配置。

本地预览需要让主题仓获知内容仓的存放路径。

## 准备工作

确认满足以下两项前置条件：

1. 主题仓已完成依赖安装（`pnpm install`）；
2. 内容仓已存在于本地磁盘目录。

若内容仓是通过 `content:eject` 迁出的，主题仓根目录的 `shirone.content.json` 已写入该路径，可直接跳转到[启动预览](#启动预览)。

其余情况需要指定内容仓路径。推荐在主题仓根目录新建 `.env` 文件（适合长期本地开发）：

```ini title=".env"
CONTENT_DIR="../shirone-content"
```

`CONTENT_DIR` 的相对路径以主题仓根目录为基准解析，也可以填写绝对路径。

如果不想创建 `.env` 文件，也可以在每次打开终端时临时设置环境变量：

::: tabs
@tab Windows (PowerShell)
```powershell
$env:CONTENT_DIR = "D:\Code\my-blog-content"
```
@tab Linux / macOS
```bash
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"
```
:::

![设置内容仓路径并执行同步](/images/content-separation/01-quickstart/03-preview/01-local-preview-content.png)

## 启动预览

在主题代码仓根目录下运行启动命令：

```bash
pnpm dev
```

`pnpm dev` 在启动开发服务器前，会自动执行一次内容同步（`content:sync`），将内容仓的文章、图片和数据复制到主题仓，并生成 `src/user/user-config.ts`。

当终端输出 `Local http://localhost:4321/` 时，在浏览器中打开对应网址即可查看博客：

![开发服务器启动后的终端输出](/images/content-separation/01-quickstart/03-preview/02-local-preview-terminal.png)

![本地浏览器预览效果](/images/content-separation/01-quickstart/03-preview/03-local-preview-browser.png)

## 边写边预览（实时监听）

当你需要持续编写新文章或调试 YAML 配置文件时，可以使用 `content:watch` 脚本命令开启实时监听，无需每次改动都手动重启预览。

建议在主题代码仓中开启两个终端窗口协同工作：

1. **终端 1（启动预览）**：运行 `pnpm dev` 保持本地网页服务运行；
2. **终端 2（监听变动）**：运行 `pnpm content:watch` 实时监听内容仓目录。

```bash
# 在终端 2 运行
pnpm content:watch
```

**运作机制**：
你在编辑器中保存任意 Markdown 文章或 YAML 配置后，`content:watch` 会即刻将变动增量同步到主题仓，Astro 开发服务器随即自动热重载，几秒内浏览器就能呈现最新内容。

::: tip 环境变量继承
如果在准备工作中已将 `CONTENT_DIR` 写入了 `.env` 文件，两个终端均会自动读取，无需每次打开新终端重复设置路径。
:::

## 确认内容源

不确定现在读的是哪个内容仓时，在主题仓根目录执行：

```bash
pnpm content:status
```

命令会列出当前内容源类型、解析到的 commit SHA，以及生效的配置文件。

若需核对远端分支是否更新，添加 `--remote` 参数发起网络检查。

## 常见问题

::: collapse
- 提示内容目录不存在

  检查 `CONTENT_DIR` 指向的目录是否存在，以及该目录下是否包含 `content/` 或 `config/`。路径中带有空格时需用引号包裹。

- 修改了配置但页面未更新

  运行 `pnpm content:validate`，检查 YAML 中是否存在拼错的字段。

  数组字段采用整体替换策略，仅声明新增项不会生效，必须列出完整的配置列表。详见[配置覆盖](/guide/content-separation/config-overlay/)。

- 添加了新图片但页面未展示

  图片需放置在内容仓的 `assets/` 或 `public/` 目录下。在深层目录中添加文件后，建议重新执行一次 `pnpm content:sync`。

- 修改 `config/anime.yaml` 后页面缺少追番数据

  修改 YAML 不会自动拉取网络数据。在主题仓执行 `pnpm anime:sync --if-stale` 下载追番列表与封面之后再预览。

  首次配置或需要强制刷新时使用 `pnpm anime:sync`，详见[番剧页](/guide/pages/anime/)。
:::

## 下一步

- [内容源配置](/guide/content-separation/content-sources/)：了解本地路径、远程仓库与清单文件的解析优先级
- [配置覆盖](/guide/content-separation/config-overlay/)：在内容仓中定制站点标题、导航、侧栏等外观设置
