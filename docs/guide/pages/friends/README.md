---
title: 友链页
createTime: 2026/09/01 00:22:00
permalink: /guide/pages/friends/
---

友链页（`/friends/`）的数据由 `src/data/friends.ts` 管理——数据即内容，没有额外行为配置。条目中的 `tags` 会自动聚合为页面顶部的筛选 chips。

## 数据结构

```ts title="src/data/friends.ts"
export interface FriendItem {
  id: number;
  title: string;     // 站点名称
  imgurl: string;    // 头像/图标 URL
  desc: string;      // 一句话简介
  siteurl: string;   // 站点地址
  tags: string[];    // 标签（聚合为筛选 chips）
}

export const friendsData: FriendItem[] = [
  {
    id: 1,
    title: "Mizuki",
    imgurl: "https://avatars.githubusercontent.com/u/…",
    desc: "Another Fuwari-based blog theme with docs",
    siteurl: "https://mizuki.mysqil.com",
    tags: ["Blog", "Theme"],
  },
  // …
];
```

## 添加友链

在 `friendsData` 数组中追加一项即可，页面与筛选标签自动生成：

```ts
{
  id: 4,                            // 递增的唯一编号
  title: "朋友的博客",
  imgurl: "https://friend.example.com/avatar.png",
  desc: "记录生活与技术",
  siteurl: "https://friend.example.com",
  tags: ["Blog", "Life"],
}
```

## 标签筛选

页面顶部的筛选 chips 由所有条目的 `tags` 自动聚合（去重后展示）。选中多个标签时为 **OR 命中**——命中任一标签的友链都会显示。

建议规划少量宽泛标签（如 `Blog`、`Tool`、`Design`），标签过多会让筛选栏拥挤。

## 排序

- `getFriendsList()`：稳定顺序（数组声明顺序），便于测试复现
- `getShuffledFriendsList()`：随机排序（页面按需调用），避免固定排序

页面默认使用随机展示，让每个访客看到的顺序不同，友链曝光更公平。

## 头像建议

- 使用方形图（页面按圆形/圆角裁切展示）
- 尺寸 128×128 以上、正方形，避免模糊
- 对方站点不可用时图标会显示破图——定期清理失效友链是好习惯

## 常见问题

::: collapse
- 友链页地址想换
  预设 `Friends` 的 `url` 可通过自定义链接覆盖（见[导航栏配置](/guide/layout/navbar/)）；页面文件路径在 `src/pages/friends.astro`，改地址需要同步处理路由。

- 双仓模式下友链数据在哪维护
  `friends.ts` 属于 Data 层。内容分离部署时可随内容仓覆盖数据文件，具体边界见主题仓库《内容分离指南》。

- 想去掉筛选栏
  筛选栏由 tags 聚合生成——所有条目不写 `tags`（或统一一个标签）时筛选栏自然退化。
:::
