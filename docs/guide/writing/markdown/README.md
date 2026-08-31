---
title: Markdown 基础与增强
createTime: 2026/08/31 23:11:00
permalink: /guide/writing/markdown/
---

Shirone 支持标准 Markdown 与 MDX，并在此基础上提供一套主题专属的增强语法。所有增强都在**构建期**渲染为无障碍的语义化 HTML，零客户端 hydration 开销。本篇覆盖基础之外的提示容器、高亮、缩写、折叠、选项卡、步骤等语法；图表与媒体见[图表与媒体嵌入](/guide/writing/media/)。

## 提示容器（Admonitions）

七种类型：`note` `info` `tip` `important` `warning` `caution` `details`。

```markdown
:::note
默认标题的提示。
:::

:::tip[自定义标题]
方括号可自定义标题。
:::

::: warning 空格标题
空格写法同样支持。
:::
```

GitHub 风格的写法也支持：

```markdown
> [!IMPORTANT]
> GitHub Alert 语法。
```

## 马克笔高亮（Marker）

用 `==双等号==` 为短语添加高亮，支持语义变体：

```markdown
==默认使用主题主色==
==次级强调=={.secondary}
==需要修正的条件=={.error}
```

可用后缀：`.primary`、`.secondary`、`.tertiary`、`.error`、`.tip`。

## 缩写词（Abbreviations）

在文章内定义术语，正文中的同名术语悬停显示释义：

```markdown
*[SSR]: Server-Side Rendering
*[LCP]: Largest Contentful Paint

SSR-first output should keep LCP stable.
```

术语以字母或数字开头，最长 48 字符。定义只在当前文章生效，不输出为正文。

## 折叠面板（Collapse Panels）

```markdown
::: collapse accordion
- :+ 默认展开的标题

  支持段落、列表、引用和代码块。

- 第二个标题

  打开此项时，手风琴组中的上一项自动关闭。
:::
```

- `accordion` 模式一次只展开一项；默认模式允许多项同时展开
- `:+` / `:-` 前缀覆盖单条初始展开/折叠状态

## 选项组（Option Groups / Tabs）

```markdown
::: tabs#runtime

@tab Node.js#node

Node.js 对应的完整 Markdown 正文。

@tab:active **Bun**#bun

Bun 对应的完整 Markdown 正文。

:::
```

- `@tab:active` 指定初始项；标题末尾的 `#值` 是同步标识
- 相同标识的选项组会**同步切换**，读者切换后选择记入 localStorage
- 脚本不可用时所有面板内容平铺可读（SSR 不预先隐藏）

## 步骤（Steps）

把一个有序列表渲染为带编号导轨的步骤流：

````markdown
:::steps[部署流程]
1. **克隆仓库**

   ```bash
   git clone https://github.com/LyraVoid/Shirone.git
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```
:::
````

选项：`:::steps[标题]` 或 `title="标题"` 添加可见标签；`start=4` 改变起始编号。容器内必须恰好一个有序列表。

## 剧透（Spoiler）

隐藏行内短答案，悬停/聚焦/点击揭示：

```markdown
答案是 :spoiler[**42**]。
```

生成原生 button + `aria-expanded`，无 JavaScript 时悬停聚焦仍可显示。

## 内容注解（Content Annotations）

把补充说明挂在句子旁而不打断阅读流：

```markdown
Astro 渲染静态页面并按需激活**交互孤岛** [+islands]。

[+islands]:
  孤岛是被静态 HTML 包围的交互组件。
```

同一标签可定义多条注解；未定义的引用（如 `[+missing]`）保持普通文本。

## 数学公式（KaTeX）

```markdown
行内公式：$\omega = d\phi / dt$

块级公式独占一行：
$$I = \int \rho R^{2} dV$$
```

## 字段卡（Field Cards）

API/组件参数文档卡片，适合写配置参考：

```markdown
:::: field-group

::: field output
@type 'svg' | 'chtml'
@default 'svg'
@optional

输出格式。
:::

::::
```

`@type` / `@default` 渲染为代码，`@required` / `@optional` / `@deprecated` 渲染为状态徽标。

## 文件导入（Includes）

构建期把仓库内 Markdown 片段展开进当前文章：

```markdown
<!-- @include: ../snippets/example.md -->
<!-- @include: ../snippets/example.md{2-6} -->   行号范围
<!-- @include: ../snippets/example.md#region --> 区域标记
```

行号从 1 开始且含首尾；区域由源文件的 `#region name` / `#endregion` 界定。代码围栏内的 include 注释不展开。

## 标准语法备忘

以下标准语法开箱即用：标题、粗斜体、行内代码、代码围栏（语法高亮）、引用、有序/无序列表、任务列表、表格、脚注（`[^1]`）、链接图片、水平线。

## 常见问题

**增强语法没渲染，原样显示**

多数容器语法对结构有严格要求（如 steps 必须恰好一个有序列表、tabs 每组至少两项）。非法输入会**有意保留为普通 Markdown** 而非猜测解析——对照本篇示例修正结构。

**修改语法后 dev 不生效**

Astro dev 可能缓存旧的 Markdown 编译结果（新 CSS 出现但新 DOM 结构不存在是典型信号）。停掉 dev server，删除 `.astro/data-store.json` 后重启。

**KaTeX 公式报错**

检查美元符号配对与 LaTeX 语法；`$` 与公式间不要有空格（`$\omega$` 正确，`$ \omega $` 可能不解析）。
