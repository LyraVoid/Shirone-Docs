---
title: Blog-Specific Atoms
createTime: 2026/09/01 01:50:00
permalink: /en/guide/api/components/blog-atoms/
---

Blog-specific atoms are purpose-built for reading workflows, content indexing, category filtering, and metadata display. Most components are rendered via Astro SSR (zero client JS footprint) to maximize site performance.

---

## PostCard

**Path**: `src/components/atoms/blog/PostCard.astro`  
**Purpose**: Post preview card supporting responsive cover image cropping, pinned badges, encryption locks, category tags, and subtle hover animations.

### Props Specification

```astro
---
interface Props {
  entry: CollectionEntry<"posts">;
  title: string;
  url: string;
  published: Date;
  description?: string;
  image?: string;
  category?: string;
  tags?: string[];
  pinned?: boolean;
  encrypted?: boolean;
  readingTime?: number;
  class?: string;
}
---
```

---

## PostMeta

**Path**: `src/components/atoms/blog/PostMeta.astro`  
**Purpose**: Metadata display bar across articles and cards, showing publication date, last update, category, tags, and reading estimates.

### Props Specification

```astro
---
interface Props {
  published: Date;
  updated?: Date;
  category?: string;
  tags?: string[];
  wordsCount?: number;
  readingMinutes?: number;
  compact?: boolean;
}
---
```

---

## TocList

**Path**: `src/components/atoms/blog/TocList.astro`  
**Purpose**: Table of Contents navigation tree supporting multi-level headings (H2/H3/H4), active scroll position tracking, and smooth anchor scrolling.

### Props Specification

```astro
---
interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: TocHeading[];
  minDepth?: number;
  maxDepth?: number;
}
---
```

---

## TagBadge & TagList

**Path**: `src/components/atoms/blog/TagBadge.astro` & `TagList.astro`  
**Purpose**: Tag pills and tag clouds with dynamic article counts and tonal hue mapping.

---

## CategoryList

**Path**: `src/components/atoms/blog/CategoryList.astro`  
**Purpose**: Category hierarchy navigation showing category labels, post tallies, and active route markers.

---

## PagePagination

**Path**: `src/components/atoms/blog/PagePagination.astro`  
**Purpose**: List pagination supporting first, previous, folded page numbers, next, and last page navigation.

---

## SearchPanel

**Path**: `src/components/atoms/blog/SearchPanel.svelte`  
**Purpose**: Full-text search panel integrated with Pagefind indexing, featuring keyword highlighting, arrow-key navigation, and direct route transitions.
