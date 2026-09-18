---
title: 系列页
createTime: 2026/09/18 12:00:00
permalink: /guide/pages/series/
---

系列页（`/series/`）用来把多篇主题相关的文章串联成专题合集——比如「前端从入门到进阶」「我的旅行游记」或「游戏通关笔记」。<Badge text="连载专题" type="tip" />

平时写连载教程或多篇游记时，读者往往很难一眼看全整套内容。开启系列功能后：
- 每篇文章底部（或顶部）会自动附带一个**系列导航条**，告诉读者「这是第几集」，并能一键跳到上一篇和下一篇；
- 全站会有专属的**系列总览页**（`/series/`）和**系列详情目录页**（`/series/<slug>/`），方便读者一口气看完全部章节；
- 侧边栏也能放上**系列列表**，展示最近更新的连载。

---

## 目录结构一览

系列文件与普通文章同属于内容区，结构清晰直观：

```file-tree title="系列与文章存放结构"
content/ (或代码仓 src/content/)
├── series/                  # 存放系列介绍文件
│   ├── docker-guide.md      # 系列一（文件名就是系列标识 slug）
│   └── travel-japan.md      # 系列二
└── posts/                   # 存放普通博客文章
    ├── docker-01.md         # 文章 1：关联 docker-guide
    ├── docker-02.md         # 文章 2：关联 docker-guide
    └── regular-post.md      # 普通文章：不写 series 即可
```

---

## 两步创建你的第一个系列

把文章加入系列非常简单，跟随以下两步即可完成：

:::: steps
1. **创建系列介绍文件**

   在 `content/series/`（单仓用户为 `src/content/series/`）目录下新建一个 `.md` 文件。文件名即为系列的英文简称（如 `docker-guide.md`）：

   ::: tabs
   @tab 连载中（推荐）
   ```markdown title="src/content/series/docker-guide.md"
   ---
   title: Docker 从入门到实战
   status: ongoing
   defaultCategory: 开发运维
   ---

   这里可以写一段系列的简介或导读前言（支持标准 Markdown 语法）。
   这段话会展示在系列详情页的最顶部，给读者交代专题背景与学习路线。
   ```

   @tab 已完结
   ```markdown title="src/content/series/travel-japan.md"
   ---
   title: 关西秋日漫游记
   status: completed
   defaultCategory: 旅行摄影
   ---

   记录为期一周的关西赏枫之旅，包含大阪美食、京都古寺与奈良春日大社。
   系列已全部更新完毕。
   ```
   :::

   #### 系列参数说明

   | 字段 | 必填 | 默认值 | 作用说明 |
   | --- | --- | --- | --- |
   | `title` | **是** | 无 | 系列的完整展示名称，如「Docker 从入门到实战」 |
   | `status` | 否 | `ongoing` | 连载状态：`ongoing`（更新中）或 `completed`（已完结） |
   | `defaultCategory` | 否 | 空 | 兜底分类。当系列中的某篇文章自己没写 `category` 时，自动继承该分类 |

   > [!TIP] 导读正文是可选的
   > 如果你只想简单把文章编排在一起、不需要写前言介绍，正文留空也可以正常工作。

2. **在文章里关联该系列**

   打开你想要归入该系列的文章（位于 `content/posts/` 目录下），在文章开头的 Frontmatter 里加上 `series` 和 `seriesOrder`：

   ```yaml title="src/content/posts/docker-01.md"
   ---
   title: "Docker 基础概念篇"
   published: 2026-08-27
   category: "开发运维"

   # 关联第一步创建的文件名（不要写 .md 后缀）
   series: "docker-guide"

   # 填写这篇文章是第几集（从 1 开始的正整数）
   seriesOrder: 1
   ---

   正文从这里开始……
   ```

   保存文件后就配置完成了，系统会自动将文章串联起来！

   - **`series`**：指定所属系列的文件名。填好后，文章就会被收录进该系列；
   - **`seriesOrder`**：指定文章在系列里的先后顺序（比如第 1 篇、第 2 篇）。如果未填写，系统会自动按文章的发布日期从早到晚排序。
::::

---

## 读者的阅读体验

配置好系列后，全站会为读者呈现三种协同的阅读体验：

::: card-grid
```markdown
### 1. 文章内的连载导航条
正文底部（或顶部）会自动出现连载导航区，清晰标出系列名称、状态小标签（进行中/已完结）、当前是第几篇（例如「第 2/共 5 篇」），并提供「上一篇」与「下一篇」的直接跳转。
```

```markdown
### 2. 系列全站总览页 (/series/)
全宽精美卡片整齐排列所有专栏，展示系列封面导读、文章篇数、最新更新时间，方便访客发现感兴趣的专题。
```

```markdown
### 3. 系列详情目录页 (/series/[slug]/)
突出展示该系列的专属前言与导读卡片，并按顺序罗列该系列包含的全部文章列表，方便顺着章节按序阅读。
```
:::

---

## 行为配置与开关

如果你需要临时关闭系列功能，或者调整文章内系列导航卡片的摆放位置，可以修改对应配置文件：

::: tabs
@tab 双仓分离模式 (推荐)
```yaml title="config/series.yaml"
# 功能总开关：设为 false 后，系列页返回 404，导航和侧栏入口自动隐藏
enable: true

# 系列索引页的大标题（默认提取多语言翻译「系列」）
title: "$t:series"

# 网页摘要描述（SEO meta），留空会自动显示「x 个系列 · y 篇文章」
description: ""

# 系列卡片在文章中的渲染位置：
# - "top": 放置在文章标题与发布时间下方
# - "bottom": 放置在文章正文结束后、延伸阅读之前（默认）
cardPosition: "bottom"
```

@tab 单仓源码模式
```ts title="src/config/seriesConfig.ts"
export const seriesConfig: SeriesConfig = withUserConfig("series", {
  enable: true,           // 功能总开关：关闭后系列页面 404，相关入口全部隐藏
  title: "$t:series",     // 系列索引页大标题
  description: "",        // 网页描述，留空自动生成动态统计
  cardPosition: "bottom", // 文章内系列卡位置："top" | "bottom"
})
```
:::

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 功能开关。设为 `false` 后系列页面返回 404，导航和侧栏入口隐藏，文章内不会插入任何多余代码 |
| `title` | `string` | `"$t:series"` | 系列总览页的大标题，也可以直接写自定义文本，例如 `"我的专栏"` |
| `description` | `string` | `""` | 网页摘要。留空时系统会自动帮你汇总当前系列总数与文章篇数 |
| `cardPosition` | `"top"` / `"bottom"` | `"bottom"` | 系列导航条在文章里的位置：`"top"` 在标题下方；`"bottom"` 在文末延伸阅读旁 |

---

## 在导航栏与侧边栏展示

### 顶栏导航挂载
主题内置了 `Series` 导航预设。如果你想在顶栏导航菜单里放上系列入口，直接在导航配置中添加：

::: tabs
@tab 双仓内容仓 (config/nav-bar.yaml)
```yaml title="config/nav-bar.yaml"
links:
  - Home
  - Archive
  - Series      # 点击直达 /series/ 系列总览页
  - About
```

@tab 单仓源码 (src/config/navBarConfig.ts)
```ts title="src/config/navBarConfig.ts"
links: [
  LinkPresets.Home,
  LinkPresets.Archive,
  LinkPresets.Series, // 引入系列预设
  LinkPresets.About,
]
```
:::

### 侧边栏组件
主题自带 `series` 侧边栏小组件，按「最近更新」排序列出前几个系列：

```ts title="src/config/sidebarConfig.ts"
{
  type: "series",
  enable: true,
  slot: "sticky",       // 吸附跟随页面滚动
  collapseAfter: 5,     // 超过 5 个系列时折叠，并附带「查看全部系列」按钮直达 /series/
}
```

---

## 常见问题

::: collapse
- 文章里写了 series，但文章页上没看到系列卡片？

  请按以下三个常见原因排查：
  1. **文件名核对**：检查 `src/content/series/`（或内容仓 `content/series/`）下是否存在对应的 `.md` 文件，且文件名与文章里的 `series` 拼写完全相同（大小写敏感）；
  2. **开关检查**：确认 `seriesConfig.ts` 或 `config/series.yaml` 中的 `enable` 为 `true`；
  3. **草稿过滤**：确认文章的 `draft` 不是 `true`。系列卡片只在有已发布的公开文章时才会渲染。

- 文章的 category 和系列的 defaultCategory 冲突时以谁为准？

  **文章自身的 `category` 优先级更高**。只有当某篇文章完全没有声明分类时，系统才会自动借用该系列的 `defaultCategory` 兜底，避免文章在博客中变成无分类。

- 系列的文件名可以写中文吗？

  为了保证网页网址（URL）在各种设备、社交平台分享或微信内打开时都能稳定访问，**强烈建议使用简短的英文单词或拼音加连字符**（例如 `docker-guide`、`japan-travel`），避免使用特殊符号、空格或中文。
:::
