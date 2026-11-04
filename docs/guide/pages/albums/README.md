---
title: 相册页
createTime: 2026/11/04 00:00:00
permalink: /guide/pages/albums/
---

相册（`/albums/`）是纯数据与目录驱动的瀑布流画廊：不需要写代码，把照片放进目录、配一个 `info.json` 即可。支持本地图库、外部图床链接与密码保护三种模式。

![相册汇总页的大图封面卡片列表](/images/content-separation/03-content/03-albums/01-albums-masonry-preview.png)
*相册汇总页的封面卡片列表*

![相册内照片瀑布流画廊排版](/images/content-separation/03-content/03-albums/02-albums-masonry-detail-preview.png)
*相册内的照片瀑布流画廊*

## 内容位置

在内容仓的 `public/images/albums/` 下，每个相册一个独立文件夹，文件夹名即访问路径标识：

```file-tree title="相册内容目录"
public/images/albums/
├── KyotoTrip/            # 相册文件夹（访问路径标识）
│   ├── info.json         # 相册元数据，必需
│   ├── cover.webp        # 封面图
│   ├── 01.webp           # 照片按序号命名
│   └── 02.webp
```

每个相册目录必须包含一个 `info.json`。

## 三种模式

### 本地照片相册

照片直接放在相册文件夹中，构建时自动扫描所有按序号命名的图片：

```json
{
  "title": "京都古韵",
  "description": "漫步在三年坂二年坂的雨后清晨",
  "date": "2026-08-15",
  "location": "日本 · 京都",
  "tags": ["旅行", "摄影"],
  "layout": "masonry",
  "columns": 3,
  "hidden": false
}
```

::: tip
用 `01.webp`、`02.webp` 这样的补零数字命名，照片才会按你想要的顺序展示。
:::

### 远端外链相册

照片存放在外部图床或对象存储时，使用 `mode: "external"` 并在 `photos` 列表中声明：

```json
{
  "mode": "external",
  "title": "风光摄影集",
  "cover": "https://img.example.com/cover.webp",
  "layout": "masonry",
  "columns": 3,
  "photos": [
    {
      "src": "https://img.example.com/photo1.webp",
      "title": "日照金山",
      "description": "清晨第一缕阳光照耀在雪山顶峰",
      "width": 1920,
      "height": 1080
    },
    {
      "src": "https://img.example.com/photo2.webp",
      "title": "星空银河",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

::: tip
尽量提供每张照片的 `width` 与 `height`，瀑布流首屏排版不会抖动错位。
:::

### 加密相册

在 `info.json` 中配置 `password` 字段即可创建私密相册，访问时须输入正确密码才能查看照片大图：

```json
{
  "title": "私人家庭相册",
  "description": "家庭聚会记录",
  "date": "2026-08-20",
  "password": "your_private_password",
  "layout": "masonry",
  "columns": 3
}
```

## 常用属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `layout` | `string` | `"masonry"` | 排版布局：`"masonry"`（瀑布流）或 `"grid"`（等高网格） |
| `columns` | `number` | `3` | 桌面端列数，`1`–`6` |
| `hidden` | `boolean` | `false` | `true` 时不显示在总览列表，但仍可通过直链访问 |
| `cover` | `string` | — | 自定义封面图路径；留空时取 `cover.webp` 或第一张照片 |

## 下一步

[独立页面总览](/guide/pages/pages-overview/)：了解其余独立页面的开关体系与导航联动。
