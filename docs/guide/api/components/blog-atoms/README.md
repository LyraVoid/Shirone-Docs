---
title: 博客专用原子 (Blog-Specific Atoms)
createTime: 2026/09/01 01:50:00
permalink: /guide/api/components/blog-atoms/
---

博客专用原子围绕文章阅读、内容检索、分类筛选与元数据展示深度定制，大部分采用 Astro 纯服务端静态直出（零客户端 JS 开销），保证博客的极致加载速度。

---

## PostCard <Badge text="Astro SSR" color="#bc52ee" vertical="middle" /> <Badge text="Zero-JS" type="tip" vertical="middle" />

**文件**：`src/components/atoms/blog/PostCard.astro`  
**职责**：文章摘要卡片，支持封面图自适应裁剪、置顶徽标、加密锁定提示、分类标签与悬浮微动效。

### Props 规范

```astro
---
interface Props {
  /** 文章对象（来自 Astro Content Collections） */
  entry: CollectionEntry<"posts">;
  /** 标题 */
  title: string;
  /** 文章链接 */
  url: string;
  /** 发布日期 */
  published: Date;
  /** 摘要或描述文本 */
  description?: string;
  /** 封面图片路径 */
  image?: string;
  /** 分类名称 */
  category?: string;
  /** 标签数组 */
  tags?: string[];
  /** 是否置顶（置顶卡片会展示高亮 Pin 角标） */
  pinned?: boolean;
  /** 是否需要密码解锁 */
  encrypted?: boolean;
  /** 预估阅读分钟数 */
  readingTime?: number;
  class?: string;
}
---
```

---

## PostMeta <Badge text="Astro SSR" color="#bc52ee" vertical="middle" /> <Badge text="Metadata" type="info" vertical="middle" />

**文件**：`src/components/atoms/blog/PostMeta.astro`  
**职责**：文章详情页与卡片内的元信息条，负责展示日期、分类、字数与阅读时长。

### Props 规范

```astro
---
interface Props {
  published: Date;
  updated?: Date;
  category?: string;
  tags?: string[];
  wordsCount?: number;
  readingMinutes?: number;
  /** 是否展示紧凑模式（用于卡片内） */
  compact?: boolean;
}
---
```

---

## TocList <Badge text="IntersectionObserver" color="#059669" vertical="middle" /> <Badge text="Active Track" type="tip" vertical="middle" />

**文件**：`src/components/atoms/blog/TocList.astro`  
**职责**：文章目录导航树，支持深度层级（H2/H3/H4）、当前阅读位置高亮、平滑锚点定位与侧栏自动跟随滚动。

### Props 规范

```astro
---
interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: TocHeading[];
  /** 最小解析深度（默认 2） */
  minDepth?: number;
  /** 最大解析深度（默认 4） */
  maxDepth?: number;
}
---
```

---

## TagBadge & TagList <Badge text="Astro SSR" color="#bc52ee" vertical="middle" /> <Badge text="Taxonomy" type="info" vertical="middle" />

**文件**：`src/components/atoms/blog/TagBadge.astro` & `TagList.astro`  
**职责**：文章标签徽标与标签云集合，支持动态计算文章数量并带有多彩色调映射。

---

## CategoryList <Badge text="Astro SSR" color="#bc52ee" vertical="middle" /> <Badge text="Taxonomy" type="info" vertical="middle" />

**文件**：`src/components/atoms/blog/CategoryList.astro`  
**职责**：文章分类导航树，支持展示分类名称、包含文章计数与当前路由激活高亮。

---

## PagePagination <Badge text="Astro SSR" color="#bc52ee" vertical="middle" /> <Badge text="Navigation" type="info" vertical="middle" />

**文件**：`src/components/atoms/blog/PagePagination.astro`  
**职责**：列表底部分页导航组件，支持首页、上一页、数字页码省略折叠、下一页与尾页。

---

## SearchPanel <Badge text="Pagefind" color="#f59e0b" vertical="middle" /> <Badge text="WASM Index" type="tip" vertical="middle" />

**文件**：`src/components/atoms/blog/SearchPanel.svelte`  
**职责**：站内全文搜索引擎面板，与 Pagefind 静态索引深度集成，支持实时分词高亮、键盘上下选择与直接路由跳转。
