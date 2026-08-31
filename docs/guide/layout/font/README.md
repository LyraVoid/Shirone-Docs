---
title: 自定义字体
createTime: 2026/08/31 22:36:00
permalink: /guide/layout/font/
---

`fontConfig.ts` 管理全站字体。Shirone 把字体分成三种角色（正文西文、CJK、等宽），支持系统字体与自定义字体两种模式、三种字体来源，并通过生产构建期的自动子集化把几十兆的大字体压缩为几百 KB。

## 三种字体角色

| 角色 | 职责 | 对应 CSS 变量 |
| --- | --- | --- |
| `body` | 西文与默认基础正文（英文字母、数字、基础标点） | `--font-body` |
| `cjk` | 中日韩字体（汉字、日文假名、韩文） | `--font-cjk` |
| `mono` | 等宽代码字体（代码块、行内代码、终端输出） | `--font-mono` |

主题默认组合：**Outfit**（几何圆润西文）+ **悠哉圆体 Yozai Medium**（全量简繁中日韩）+ **JetBrains Mono**（代码）。

## 两种构建模式

```ts title="src/config/fontConfig.ts"
export const fontConfig = withUserConfig("font", {
  mode: "custom",       // "custom" 自定义字体 | "system" 纯系统字体
  fontFamilies: [ /* 字体清单 */ ],
  subsetting: { ... },
  budget: { ... },
})
```

| mode | 行为 | 适用场景 |
| --- | --- | --- |
| `"custom"` | 打包 `fontFamilies` 中配置的字体 | 想要特定观感（默认） |
| `"system"` | 不打包任何字体文件，完全依赖访客设备字体 | 极速加载、最省流量 |

**场景 A：完全使用系统默认字体**

```ts
mode: "system",
fontFamilies: [],
```

零字体打包，构建最快。

## 三种字体来源

每个字体条目通过 `source` 声明来源：

### 本地字体（local）

```ts
{
  id: "yozai-cjk",
  family: "Yozai Medium",
  role: "cjk",
  source: "local",
  variants: [
    { file: "src/assets/fonts/Yozai-Medium.ttf", weight: 500, style: "normal" },
  ],
  fallback: ["system-ui", "sans-serif"],
  display: "swap",
  preload: false,
}
```

把 `.woff2`（或 `.ttf`）放入 `src/assets/fonts/`，`file` 填相对项目根的路径，`family` 填字体真实族名。

### Fontsource 字体包（fontsource）

```ts
{
  id: "outfit-body",
  family: "Outfit",
  role: "body",
  source: "fontsource",
  variants: [
    { file: "@fontsource/outfit/400.css", weight: 400, style: "normal" },
    { file: "@fontsource/outfit/700.css", weight: 700, style: "normal" },
  ],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
}
```

先安装字体包（`pnpm add @fontsource/outfit`），`file` 填包内 CSS 路径。

### 字段说明

| 字段 | 说明 |
| --- | --- |
| `id` | 条目标识，任意唯一字符串 |
| `family` | CSS font-family 真实族名 |
| `role` | `body` / `cjk` / `mono` 三角色之一 |
| `variants` | 字重与样式变体清单 |
| `fallback` | 字体不可用时的回退栈 |
| `display` | 加载策略，默认 `swap`（先用回退渲染，字体就绪后替换） |
| `preload` | 是否预加载，CJK 大字体建议 `false` |

## 字体子集化（subsetting）

生产构建的核心优化——自动从内容中提取实际用到的字符，生成精简版 `.woff2`：

```ts
subsetting: {
  enable: true,          // 启用自动化子集裁剪
  includeContent: true,  // 扫描 src/content/ 下所有文章
  includeI18n: true,     // 扫描全部 10 种语言词典
  includeConfig: true,   // 扫描站点配置与导航
  includeCommon: true,   // 包含常用标点与基础字符
  allowRemoteText: true, // 允许抓取 Meting 云端歌单曲目文本参与字形提取
},
```

- **Dev 开发环境**：加载完整原字体——新写的任意汉字实时可见，HMR 零等待
- **Build 生产构建**：执行子集裁剪，几十兆大字体压缩为几百 KB 专属子集

> [!WARNING]
> **新内容发布后需重新构建**
> 字体子集基于构建时的全站内容生成。发布新文章后必须重新执行 `pnpm build`，否则新文章中未收录的生僻字符会优雅回退到系统字体。

## 体积预算（budget）

```ts
budget: {
  maxTotalBytes: 6 * 1024 * 1024,  // 全站自定义字体总大小上限：6MB
  maxFamilyBytes: 4 * 1024 * 1024, // 单个字体族上限：4MB
},
```

子集化后通常仅 300KB ~ 1MB。超预算时 `fonts:check` 会报错，防止字体体积失控。

## 修改后的验证命令

```bash
npx astro check   # 校验配置与页面语法
pnpm build        # 执行生产构建与字体打包
pnpm fonts:check  # 校验字体格式与体积预算
```

Windows PowerShell 用户使用 `npx.cmd` / `pnpm.cmd`。

## 实战示例

**换用霞鹜文楷屏幕版作为中文字体**

```bash
# 下载 LXGW WenKai Screen 的 woff2 到 src/assets/fonts/
```

```ts title="src/config/fontConfig.ts"
fontFamilies: [
  {
    id: "outfit-body",
    family: "Outfit",
    role: "body",
    source: "fontsource",
    variants: [
      { file: "@fontsource/outfit/400.css", weight: 400, style: "normal" },
      { file: "@fontsource/outfit/700.css", weight: 700, style: "normal" },
    ],
    fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  },
  {
    id: "lxgw-cjk",
    family: "LXGW WenKai Screen",
    role: "cjk",
    source: "local",
    variants: [
      { file: "src/assets/fonts/LXGWWenKaiScreen.woff2", weight: 400, style: "normal" },
    ],
    fallback: ["system-ui", "sans-serif"],
    display: "swap",
    preload: false,
  },
]
```

**零字体负担模式**

```ts title="src/config/fontConfig.ts"
mode: "system",
fontFamilies: [],
```

不打包任何字体，访客使用设备自带字体——加载最快，但观感因设备而异。

## 常见问题

::: collapse
- 构建后新文章的部分汉字字体不对

  子集化只收录构建时扫描到的字符。重新执行 `pnpm build` 即可把新内容纳入子集。

- fonts:check 报体积超限

  检查 `mode` 是否误设为 `"custom"` 却想用系统字体；或某个 `local` 字体文件过大——确认子集化 `enable: true`，必要时收紧 `budget`。

- 同一角色配多个字体条目会怎样

  按声明顺序形成字体栈：先命中的字符用前面的字体，未覆盖的字符回退到后面的条目与 `fallback`。西文 + CJK 分角色配置是推荐做法，无需在同一角色内堆叠。

- 为什么 dev 时字体很大、build 后很小

  这是设计行为：开发环境加载完整字体保证任意字符即时预览，生产构建执行子集裁剪。
:::
