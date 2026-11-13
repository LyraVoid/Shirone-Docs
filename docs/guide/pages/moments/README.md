---
title: 瞬间页
createTime: 2026/09/01 00:31:00
permalink: /guide/pages/moments/
---

瞬间（`/moments/`）是比文章更轻的动态流——随手想法、截图分享、进行中的小实验。每个瞬间是一个 Markdown 文件，frontmatter 支持**图片排版数组**、心情与位置等元数据，也可以像文章那样加密码。

## 内容位置

```file-tree title="瞬间内容目录"
src/content/moments/
├── 2026-08-15-welcome.md
├── 2026-08-12-riverside.md
└── 2026-08-08-late-night-coding.md
```

## Frontmatter 字段一览

```markdown title="src/content/moments/2026-08-12-riverside.md"
---
published: 2026-08-12T18:30:00+08:00   # 发布时间（含时区），必填
mood: material-symbols:sentiment-excited-outline-rounded  # 心情图标
tags:                                   # 标签，用于筛选
  - wallpaper
  - daily
images:                                 # 图片排版数组
  - src: /images/moments/girls-trio/girl-1.webp
    alt: Lovely girl wallpaper one
  - src: /images/moments/girls-trio/girl-2.webp
    alt: Lovely girl wallpaper two
---

正文：一两句话即可。
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `published` | `datetime` | 是 | 发布时间（含时区），决定瞬间流排序 |
| `pinned` | `boolean` | 否 | `true` 置顶（多条置顶按时间倒序） |
| `mood` | `string` | 否 | 心情图标，iconify 编码 |
| `tags` | `array` | 否 | 标签，用于瞬间流筛选 |
| `location` | `string` | 否 | 位置文本（如「在工位上」「江边」） |
| `images` | `array` | 否 | **图片排版数组**，见下节 |
| `encrypted` | `boolean` | 否 | 显式声明加密；写了 `true` 却没给密码时构建会报错 |
| `password` | `string` / `number` | 否 | 填了非空值就启用加密，不必再写 `encrypted` |
| `passwordHint` | `string` | 否 | 密码框下面的提示语 |

## 图片排版（images）

瞬间的专属能力：frontmatter 中声明 `images` 数组，每项含 `src` 与 `alt`，渲染时自动排成整齐的图片网格/胶片流。

### 基本用法

```yaml
images:
  - src: /images/moments/trio/girl-1.webp
    alt: 第一张壁纸
  - src: /images/moments/trio/girl-2.webp
    alt: 第二张壁纸
  - src: /images/moments/trio/girl-3.webp
    alt: 第三张壁纸
```

- 数组顺序即展示顺序
- `src` 支持 `public` 绝对路径（`/images/…`）或远程 URL
- `alt` 是无障碍替代文本，建议填写
- 多张图片自动排布，无需手写任何网格标记——比在正文里贴图片更整齐

### 数量与排版效果

参考内置示例的两种典型用法：

| 场景 | 数量 | 效果 |
| --- | --- | --- |
| 三联壁纸分享 | 3 张 | 整齐的横排网格（`2026-08-12-riverside.md`） |
| 胶片式多图 | 7 张 | 多行排布的图片流（`2026-08-03-film-roll.md`） |

图片少时用正文行内图片更轻盈；三张以上时用 `images` 数组，排版观感明显更好。

### 图片放哪里

推荐集中在 `public/images/moments/<主题>/` 下按组存放，与瞬间的 `日期-主题` 命名对应，便于管理。

## 加密瞬间

瞬间也能加密码，用法和文章一样：frontmatter 里写一个非空的 `password` 就行，`encrypted: true` 只是把意图写明白。

```markdown title="src/content/moments/2026-09-02-private-note.md"
---
published: 2026-09-02T21:00:00+08:00
encrypted: true
password: "your-super-secret-password"
passwordHint: "我最喜欢的一部番剧名称"
tags: [diary]
---

这条瞬间解锁后才能看到。
```

正文在构建时就被加密，页面源码里只有密文。发布时间、置顶状态、密码提示，以及给筛选栏用的 `filterTags` 仍然是公开的。

:::: warning 哪些内容会被加密
- 正文、位置、心情、展示标签和图片清单都会加密；
- 标签会以 `filterTags` 的形式公开，所以筛选栏里仍然看得到；
- 图片文件本身还在 `public/` 下，知道地址就能直接打开——敏感图片别用加密瞬间放。
::::

解锁后会原地展开成普通瞬间卡片。和文章、相册不同，瞬间**不记住解锁状态**：刷新或重新进来都要再输一次密码。锁定的瞬间不会进入站内搜索，但标签筛选仍然有效。

只写了 `encrypted: true` 却忘了给 `password`，构建会直接报 `Encrypted moments require a non-empty password`，不会把正文当明文发出去。

## 正文写作

瞬间正文支持完整 Markdown，但内容宜轻：

- 一两句话的随想
- 一段引用、一个链接
- 配合 `images` 数组的图片说明

```markdown
---
published: 2026-08-12T18:30:00+08:00
mood: material-symbols:sentiment-excited-outline-rounded
tags: [wallpaper, daily]
images:
  - src: /images/moments/trio/girl-1.webp
    alt: 壁纸一
---

换了三张新壁纸，桌面亮了，写代码的心情也亮了。
```

## 瞬间 vs 文章 vs 时间线

| 维度 | 瞬间 | 文章 | 时间线 |
| --- | --- | --- | --- |
| 轻重 | 最轻 | 最重 | 中等 |
| 结构 | 碎片动态 + 图片流 | 完整长文 | 节点式经历 |
| 筛选 | mood + tags | 分类 + 标签 | categories |
| 加密 | 支持，但不记住解锁状态 | 支持，标签页内记住 | 不支持 |

## 常见问题

::: collapse
- 瞬间不显示

  检查 `published` 是否为合法的完整时间戳（含时区偏移）；文件是否在 `src/content/moments/` 下。

- images 的图片不显示

  `src` 以 `/` 开头时相对 `public` 目录——确认图片确实放在 `public/images/moments/…` 下；远程 URL 需带 `https://`。

- mood 图标显示为方块

  图标集未安装。到 [icones.js.org](https://icones.js.org/) 确认集合名，安装 `@iconify-json/<集合名>` 后重新构建。

- 能发纯文字瞬间吗

  可以——`images` 是可选字段，省略即纯文字动态。

- 加密瞬间刷新后还要再输一次密码吗

  需要。瞬间不记住解锁状态，刷新或重新进来都会回到密码框；文章和相册则会在当前标签页里记住。

- 写了 encrypted: true 但没写 password 会怎样

  构建会直接报错：`Encrypted moments require a non-empty password`。这样就算漏填密码，正文也不会以明文发出去。
:::
