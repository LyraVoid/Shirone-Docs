---
title: 代码块主题
createTime: 2026/09/01 00:14:00
permalink: /guide/article/code-theme/
---

文章代码块的语法高亮由 Expressive Code 提供，明暗两套主题由 `expressiveCodeConfig.ts` 配置，随站点的深色模式自动切换。

## 配置

```ts title="src/config/expressiveCodeConfig.ts"
export const expressiveCodeConfig = withUserConfig("expressiveCode", {
  theme: "github-dark",
  lightTheme: "github-light",
  darkTheme: "github-dark",
})
```

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `theme` | `github-dark` | 基础主题（兼容场景回退值） |
| `lightTheme` | `github-light` | 浅色模式下的代码主题 |
| `darkTheme` | `github-dark` | 深色模式下的代码主题 |

构建期会为明暗两套主题各生成一份样式，页面随访客的明暗模式选择自动切换，无需任何客户端脚本。

## 可用主题

主题名取自 Shiki 主题库，常用选择：

| 主题名 | 风格 |
| --- | --- |
| `github-light` / `github-dark` | 默认。GitHub 风格，中性易读 |
| `catppuccin-latte` / `catppuccin-mocha` | 柔和马卡龙色系，与二次元气质契合 |
| `one-light` / `one-dark-pro` | 经典编辑器风格 |
| `dracula` | 高饱和紫调 |
| `rose-pine-dawn` / `rose-pine` | 低饱和玫瑰调 |
| `vitesse-light` / `vitesse-dark` | 低对比护眼风 |

完整主题列表见 Expressive Code / Shiki 的主题文档。

## 搭配建议

**与站点配色呼应（推荐二次元站点）**

```ts title="src/config/expressiveCodeConfig.ts"
{
  theme: "catppuccin-mocha",
  lightTheme: "catppuccin-latte",
  darkTheme: "catppuccin-mocha",
}
```

**低对比护眼组合**

```ts title="src/config/expressiveCodeConfig.ts"
{
  theme: "vitesse-dark",
  lightTheme: "vitesse-light",
  darkTheme: "vitesse-dark",
}
```

::: tip 与动态配色的关系
代码块主题是**固定色板**，不参与 HCT 动态配色——换 `themeColor.hue` 不会改变代码高亮颜色。若希望观感统一，选择与站点种子色相近的 Shiki 主题（如粉紫站点配 `rose-pine` 系）。
:::

## 相关阅读

代码块的语法能力（文件树、代码树、行装饰、折叠）见写作板块的[代码展示](/guide/writing/code/)；本篇只涉及颜色主题。

## 常见问题

**换了主题没生效**

主题名必须与 Shiki 注册名完全一致（大小写敏感）。构建会为明暗两套各生成样式，确认重新构建后再检查。

**代码块背景与卡片背景颜色冲突**

部分样式（如背景色）在 `astro.config.mjs` 中有覆盖逻辑（源码注释有说明）。若自定义主题后出现背景不一致，检查该文件中的样式覆盖是否需要同步调整。

**想让代码块也跟随主题色变化**

当前不支持——Shiki 主题是静态色板。变通方案：选择中性色系主题（`github-*`、`vitesse-*`），让代码块在任何站点配色下都不突兀。
