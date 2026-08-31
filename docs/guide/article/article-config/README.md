---
title: 文章页配置
createTime: 2026/09/01 00:10:00
permalink: /guide/article/article-config/
---

`articleConfig.ts` 控制文章详情页的三个尾部区块：最后更新提示、延伸阅读、分享海报。所有区块都遵循零额外负担原则——关闭后不渲染 DOM、不计算数据、不引入客户端脚本。

## 配置速览

```ts title="src/config/articleConfig.ts"
export const articleConfig = withUserConfig("article", {
  lastUpdated: {
    enable: true,
    minimumAgeDays: 90,
  },
  discovery: {
    enable: true,
    related: { enable: true, count: 3 },
    random: { enable: true, count: 2 },
  },
  share: {
    enable: true,
    includeCover: true,
  },
})
```

## 最后更新提示（lastUpdated）

```ts
lastUpdated: {
  enable: true,
  minimumAgeDays: 90,
},
```

文章的 `updated` 字段与发布日期相差达到 `minimumAgeDays`（按 UTC 日历日计算，达到该天数当天开始显示）后，文章页顶部出现「内容已有一段时间未更新」的提示。设为 `0` 表示只要填写了 `updated` 就立即显示。

::: tip 提示的前提
提示只在文章 frontmatter 填写了 `updated` 字段时才有机会触发——未写 `updated` 的文章永不显示该提示。
:::

## 延伸阅读（discovery）

文章尾部推荐区，分两组：

```ts
discovery: {
  enable: true,                       // 总开关，关闭后不计算、不渲染
  related: {
    enable: true,                     // 相关文章：至少共享一个标签或分类
    count: 3,
  },
  random: {
    enable: true,                     // 随机文章：按当前文章标识稳定抽样
    count: 2,
  },
},
```

| 项 | 规则 |
| --- | --- |
| `related` | 只展示与当前文章共享至少一个标签或分类的文章 |
| `random` | 从全站文章抽样；抽样基于文章标识**稳定**——同一构建内的结果不随刷新变化 |

数量上限为 **6**（`normalizeDiscoveryCount` 会被截断到 0 ~ 6 并取整），两组数量之和大于 0 才会渲染区块。

**关闭某一项**：`related.enable: false`（只留随机文章）或 `random.enable: false`（只留相关文章）；全关则整个区块消失。

## 分享海报（share）

```ts
share: {
  enable: true,       // 文章尾部分享区块总开关
  includeCover: true, // 海报默认包含文章封面
},
```

- 关闭后不渲染分享区块、不引入客户端水合
- `includeCover: true` 时生成海报包含文章封面图；封面不可用时自动降级为无封面排版

## 单篇覆盖

以上是全站默认值。单篇文章层面的控制通过 frontmatter：

- `updated`：控制最后更新提示的数据来源
- `comment: false`：单篇关闭评论

## 实战示例

**内容型博客（保持默认 + 更多相关推荐）**

```ts
discovery: {
  enable: true,
  related: { enable: true, count: 4 },
  random: { enable: true, count: 2 },
},
```

**随笔站（关闭时效提示与延伸阅读，只留分享）**

```ts
lastUpdated: { enable: false, minimumAgeDays: 90 },
discovery: { enable: false },
share: { enable: true, includeCover: true },
```

**隐私优先（全部关闭）**

```ts
lastUpdated: { enable: false, minimumAgeDays: 90 },
discovery: { enable: false },
share: { enable: false, includeCover: false },
```

## 常见问题

::: collapse
- 延伸阅读出现的推荐不相关
  `related` 的匹配依据是标签与分类的重叠。检查文章 frontmatter 的 `tags` / `category` 是否写得太宽泛（如全站共用一个「随笔」分类），细化分类标签能显著改善推荐质量。

- 随机文章每次刷新都变吗
  不会。抽样基于当前文章标识，同一构建内结果稳定；重新构建后才可能变化。

- 更新提示为什么不出现
  依次检查：文章是否填写 `updated` → 时间差是否达到 `minimumAgeDays` → `lastUpdated.enable` 是否被关闭。
:::
