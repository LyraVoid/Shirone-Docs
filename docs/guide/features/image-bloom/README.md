---
title: 图片色调辉光
createTime: 2026/09/01 00:51:00
permalink: /guide/features/image-bloom/
---

Tonal Bloom（色调辉光占位）为全站图片提供**防抖动的尺寸占位与色彩过渡体验**：图片加载完成前，先显示一张与图片主色调同源（HCT 色彩系统）的模糊色块，加载完成后平滑过渡到清晰图片——==消除图片加载时的布局跳动与白块闪烁==。

## 配置

```ts title="src/config/imageBloomConfig.ts"
export const imageBloomConfig = withUserConfig("imageBloom", {
  enable: true,
  blurRadius: 20,
  opacity: 0.7,
  transitionDuration: 300,
})
```

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 辉光占位总开关 |
| `blurRadius` | `number` | `20` | 占位色块的模糊半径（px） |
| `opacity` | `number` | `0.7` | 占位色块不透明度（0 ~ 1） |
| `transitionDuration` | `number` | `300` | 图片加载完成后的过渡时长（ms） |

## 工作原理

1. 图片加载前：根据图片信息渲染一个与 HCT 主题色同源的模糊色块占位，**提前锁定尺寸**——页面布局不会因图片加载而跳动（CLS 为 0）
2. 图片加载完成：模糊色块以 `transitionDuration` 指定的时长平滑淡出，清晰图片浮现

占位色与主题动态配色同源——换主题色时辉光色调也跟随变化。

## 调参建议

**过渡更快/更慢**

```ts
transitionDuration: 150,  // 快切，适合图片普遍较小的站点
transitionDuration: 600,  // 柔和，适合大图摄影博客
```

**辉光更明显**

```ts
blurRadius: 30,
opacity: 0.85,
```

`blurRadius` 越大色块越朦胧，`opacity` 越高色彩越浓。默认值（20 / 0.7）是平衡观感与干扰的推荐值。

**完全关闭**

```ts
enable: false,
```

关闭后图片直接按普通加载流程渲染（无占位色块），可能出现加载时的布局偏移。

## 常见问题

::: collapse
- 图片加载完还是先看到模糊块
  这是过渡动画的中间态。如果停留时间明显超过 `transitionDuration`，检查图片本身是否加载缓慢（大图先压缩）。

- 占位色和图片颜色不一致
  占位色来自主题 HCT 配色而非单张图片的主色提取——它是主题级统一色块。这与「从壁纸提取主题色」（横幅场景）是两套机制。

- 会影响性能吗
  占位是纯 CSS 模糊色块，无 JavaScript 计算图片主色的开销；关闭时零残留。
:::
