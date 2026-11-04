# vuepress-theme-plume 语法参考

本站（Shirone-Docs）基于 `vuepress@2.0.0-rc.30` + `vuepress-theme-plume@1.0.0-rc.205` + `vuepress-plugin-md-power@1.0.0-rc.205`。本文档整理主题支持且**本项目已启用**的 Markdown 语法与组件，供写作和润色时查阅。

关键配置文件：

- `docs/.vuepress/config.ts` — 构建期插件与 markdown 选项
- `docs/.vuepress/plume.config.ts` — 主题配置
- `docs/.vuepress/collections.ts` — 集合与侧边栏
- `docs/.vuepress/client.ts` — 全局组件注册

## 容器

### 提示类容器

`@vuepress/plugin-markdown-hint` 提供，始终可用：

```md
::: info
默认标题「相关信息」。
:::

::: tip 自定义标题
容器名后面直接跟标题，标题支持行内 Markdown。
:::

::: warning
默认标题「注意」。
:::

::: caution
默认标题「警告」。::: danger 是它的旧别名，样式相同。
:::

::: important
默认标题「重要」。
:::

::: note
默认标题「注」。
:::

::: details 点击展开
渲染为原生 <details><summary>。
:::
```

### Obsidian callouts（默认启用）

`> [!TYPE]` 引用块语法会被渲染成提示框，与 `:::` 容器等价：

```md
> [!TIP] 自定义标题
> 内容...

> [!CAUTION]
> 警告样式。
```

类型及别名：`note`(quote/cite)、`tip`(hint)、`info`(todo)、`success`(check/done)、`warning`(question/help/faq)、`caution`(attention/failure/fail/missing/danger/error/bug)、`important`(example)、`details`(abstract/summary/tldr)。

### 结构类容器（vuepress-plugin-md-power）

**步骤 (`steps`)** — 把有序列表包装成分步指南：

```md
::: steps
1. 第一步
2. 第二步
:::
```

::: warning steps 避坑规范
`steps` 依靠 CSS 伪元素选择 `> ol > li` 来渲染数字徽章与连线，必须保证内部仅存在一个连贯的顶级有序列表 `<ol>`：
1. **缩进严禁断流**：步骤项内部包含段落、表格、代码块或图片时，后续每一行必须相对于列表编号行严格缩进 3 个空格。若任意一行回到第 0 列，markdown-it 会立即闭合当前 `<ol>`，使后续步骤被解析为 `<ol start="2">`，导致连线与徽章彻底断裂；
2. **容器嵌套严格遵循冒号规则**：步骤项内部若嵌套 `tabs` 或提示框等容器，外层 `steps` 必须增加冒号（如外层 `:::: steps`，内层 `::: tabs`），且内部容器从声明到闭合的每一行都必须整体缩进 3 个空格；
3. **步骤内细化操作统一使用无序列表**：在某一步骤内部进行多项说明时，使用 `-` 无序列表，避免继续使用 `1. 2. 3.` 导致解析器混淆外层与内层有序列表；
4. **编译结构验证**：构建命令执行通过（退出码 0）并不代表 DOM 渲染正常。修改后需在 `.vuepress/dist/` 对应的 HTML 中检查是否出现 `<ol start="2">` 等断流标签。
:::

**折叠面板** — 列表项即面板项，`+` 默认展开、`-` 默认收起：

```md
::: collapse accordion
- + 默认展开的标题
  内容
- - 默认收起的标题
  内容
:::
```

**字段卡（API 文档）** — 嵌套时外层用四个冒号：

```md
:::: field-group
::: field propertyName
@type string
@required
@default "main"
说明文字。

支持多行。
:::
::::
```

**时间线**：

```md
::: timeline
- 标题
  time="2026-01-01" icon="ri:clockwise-line" type="warning"
  内容
:::
```

**文件树** — 列表语法，`#` 后是注释，`+focus` 聚焦、`--deleted` 删除线、`++added` 新增，`…` 省略：

```md
::: file-tree
- src/
  - content/
    - posts/
      - guide.md  # 文章
  - main.ts
  - +astro.config.mjs  # 聚焦高亮
- …
:::
```

**代码树** — 文件标签页 + 树：

````md
:::: code-tree title="示例项目"
```ts title="src/main.ts"
console.log(1)
```
```json title="package.json"
{}
```
::::
````

**增强表格**：

```md
::: table copy align="center" hl-rows="warning:1,2"
| 列 A | 列 B |
| --- | --- |
| 1 | 2 |
:::
```

**npm 命令多标签** — 单条 npm 命令自动生成 pnpm/yarn/bun 标签组：

```md
::: npm-to
```bash
npm i shirones
```
:::
```

**卡片与卡片网格**：

```md
::: card title="标题" icon="ri:rocket-line"
内容
:::

:::: card-grid
::: card title="A"
:::
::: card title="B"
:::
::::
```

**其他**：`::: center / left / right / justify`（对齐）、`::: flex start gap="8"`（弹性布局）、`::: window`（macOS 风格窗口框）、`::: qrcode`。本项目未启用：`encrypt`、`demo`、`repl`。

**聊天气泡** — `{日期}` 开场，`{名字}` 切换发言人，`{.}` 表示自己：

```md
::: chat
{:2026-01-01}
{Alice}
你好
{.}
你好呀
:::
```

### 嵌套规则

容器嵌套时，外层必须使用更多冒号（外层 `::::`、内层 `:::`；若三层嵌套则最外层 `:::::`）。

若内层冒号数量大于或等于外层，闭合内层时会将外层容器提前切断，破坏外层组件的包裹逻辑。

## 代码块

Shiki 高亮，主题强制启用所有 notation transformer、行高亮、代码块标题：

````md
```ts {1,3-5}
高亮第 1、3-5 行
```

```ts title="src/foo.ts"
文件名栏，图标按扩展名自动匹配
```

```ts :line-numbers        强制显示行号
```ts :line-numbers=5      行号从 5 开始
```ts :no-line-numbers     隐藏行号
```ts :collapsed-lines=5   5 行后折叠
```ts :whitespace=all      显示空白符（本项目全局关闭）

```diff
- 删除的行
+ 新增的行
```

```ts
const a = 1 // [!code highlight]
const b = 2 // [!code ++]
const c = 3 // [!code --]
const d = 4 // [!code focus]
const e = 5 // [!code error]
const f = 6 // [!code warning]
const g = a // [!code word:a]
```
````

### 代码标签组

````md
:::: code-tabs
@tab pnpm
```bash
pnpm add vuepress
```
@tab npm
```bash
npm i vuepress
```
@tab:active YAML
```yaml
key: value
```
::::
````

`@tab:active` 标记默认选中；`@tab 标签#id` 可让多个标签组按 `#id` 联动记忆选择（localStorage）。

### Mermaid（已启用）

```` ```mermaid ```` 围栏，或简写围栏：`sequence`、`state`、`class`、`er`、`gantt`、`git-graph`、`journey`、`mindmap`、`kanban`、`pie`、`quadrant`、`requirement`、`sankey`、`timeline`、`xy`。chartjs / echarts / markmap / flowchart 未启用。

复制按钮默认启用；带 `.vp-copy-ignore` 类的元素和 `.diff.remove` 行不会被复制。

## 行内语法

| 语法 | 效果 | 状态 |
| --- | --- | --- |
| `==高亮==` | mark 高亮（本项目 `mark: 'eager'`） | 启用 |
| `H~2~O` | 下标 | 启用 |
| `x^2^` | 上标 | 启用 |
| `文字[^1]` + `[^1]: 注释` | 脚注 | 启用 |
| `- [x] 已完成` | 任务列表 | 启用 |
| `*[HTML]: HyperText Markup Language` | 缩写：定义后正文中的 `HTML` 悬停显示全称 | 启用 |
| `文字 [+key]` + `[+key]: 解释` | 行内批注：悬浮显示解释 | 启用 |
| `!!剧透内容!!` | 悬停显示（Plot） | 启用 |
| `::ri:book-open-line::` | 行内图标，可带 `=1.5em /red` 尺寸颜色 | 启用 |
| `{.class #id key=value}` | 行内属性（标题/围栏/表格/列表） | 启用 |
| `$x^2$` / `$$...$$` | Katex 行内/块级公式 | 启用 |
| `[[wiki链接]]` / `![[嵌入]]` / `%%注释%%` | Obsidian 兼容 | 默认启用 |
| `<!-- @include: ./part.md -->` | 引入其他文件 | 默认启用 |

## 组件

主题全局组件（无需导入）：

```md
<Badge type="tip" text="New" />   <!-- type: tip/info/warning/danger，也支持 color/bgColor/borderColor -->

<Card title="标题" icon="ri:rocket-line">
内容
</Card>

<RepoCard repo="LyraVoid/Shirone" />   <!-- 本项目已在 client.ts 注册 -->

<LinkCard>链接卡片</LinkCard>
<ImageCard>图片卡片</ImageCard>
```

其余主题全局组件：`VPButton`、`HomeBox`、`CardGrid`、`CardMasonry`。可从 `vuepress-theme-plume/features/*` 按需导入：`RepoCard`、`NpmBadge`、`NpmBadgeGroup`、`Swiper`、`PageContextMenu` 等。

Tabs（通用标签，非代码专属）：

```md
:::: tabs#unique-id
@tab 第一个#tab1
内容
@tab:active 第二个
内容
::::
```

## Frontmatter

本站（plume）常用键——注意与 Shirone 主题（Astro）内容仓的 frontmatter 键（`published`、`series`、`pinned` 等）是两套体系，不要混用：

```yaml
---
title: 页面标题            # 缺省时取第一个 H1（该 H1 会从正文移除）
icon: ri:book-open-line     # Iconify 名称 / svg URL / 内联 {svg}
permalink: /custom/path/    # 缺省时自动生成
createTime: 2026/01/01      # 缺省时按文件创建时间自动填
pageLayout: doc             # home | posts | doc | page | friends | custom | false
sidebar: false              # 隐藏侧边栏
aside: left                 # aside 位置；outline: 2 | deep | false
navbar: true
comments: false
editLink: false
lastUpdated: false
readingTime: false
prev: /other/               # 上/下页覆盖
next: { text: X, link: /x/ }
badge: { type: tip, text: New }
# 博客类页面额外支持：
tags: [a, b]
sticky: 1                   # 置顶，数字为优先级
draft: true                 # 从列表隐藏
article: false              # 不进博客列表
cover: /images/x.png
excerpt: 自定义摘要          # 或正文用 <!-- more --> 分隔
copyright: CC-BY-4.0
password: xxx               # 文章加密，配 passwordHint
---
```

集合内页面（`docs/guide`、`docs/en/guide` 下）的 `title`（文件名 `NN.` 前缀会被剥掉）、`createTime`、`permalink` 会自动补全——frontmatter 里已有的键不会被覆盖。

首页用 `pageLayout: home` + `config:` 块数组（`doc-hero`、`features` 等）。

## 集合与侧边栏

`collections.ts` 中用 `defineCollection({ type: 'doc', dir: 'guide', linkPrefix: '/guide', title, sidebar: [...] })` 定义集合。侧边栏项类型：`{ text, link, icon, badge, items: 'auto' | [...], collapsed, prefix }` 或纯字符串——没有 VitePress 风格的 `dir/file/link/divider` 项类型。

博客类集合（`type: 'post'`）额外支持：`include`、`exclude`、`pagination`、`tags`、`archives`、`categories`、`postCover`、`profile`。

`sidebar: 'auto'` 或 `items: 'auto'` 自动生成：按文件名 `NN.` 前缀排序，目录内 `index.md`/`README.md` 作为目录链接，frontmatter 的 `title`/`icon` 覆盖条目文字与图标。

## 其他行为

- **图片**：photoSwipe 灯箱已启用（`.vp-doc :not(a) > img`）；图片懒加载/题注插件、自动宽高（imageSize）未启用。
- **链接**：内部 `.md` 链接自动转路由；外部链接自动加 `target="_blank" rel="noopener"`；死链在构建时会报错。
- **搜索**：本地搜索（`provider: 'local'`）。
- **SEO / sitemap**：主题 `hostname` 未设置，生产环境不生成 sitemap。
- **加密**：支持文章级 `password` frontmatter；站点级 encrypt 与 `::: encrypt` 片段未启用。
- **`::github{repo=...}`**：这是 Astro 语法，plume 不支持；本站等价写法是 `<RepoCard repo="owner/name" />`。

## 写作约定提醒

- 修改中文页面的措辞/排版时，同步检查英文对应页（`docs/en/guide/...`），仅在同样问题存在时应用等价改法。
- 复杂容器渲染核验：`steps`、`collapse` 等依赖 DOM 结构的高级容器，构建后需检索 `.vuepress/dist/` 下的 HTML 产物，确保列表未被断流拆分（如检查是否存在非预期的 `<ol start="2">`）。
- 构建验证：`pnpm docs:build`（约 15-25s，229 页）。
- 提交信息用英文；未经明确许可不 commit/push。
