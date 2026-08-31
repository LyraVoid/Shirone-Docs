---
title: 基础配置
createTime: 2026/08/31 22:30:00
permalink: /guide/layout/site-config/
---

`siteConfig.ts` 是站点的核心配置入口，控制站点标识、语言时区、页内目录、进度条、favicon 等基础能力。本篇讲解其中的基础字段——动态配色与横幅有专篇（[动态配色](/guide/layout/theme-color/)、[横幅与背景](/guide/layout/banner/)），此处不展开。

## 字段速览

```ts title="src/config/siteConfig.ts"
export const siteConfig = withUserConfig("site", {
  site: "https://shirone.mysqil.com/",
  base: "/",
  title: "Shirone",
  subtitle: "A Material 3 anime blog",
  topAppBar: { contentAlign: "center" },
  lang: "en",
  timeZone: "Asia/Shanghai",
  toc: { enable: true, depth: 2 },
  progressIndicator: { style: "dual" },
  favicon: [],
})
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `site` | `string` | 主题演示站 | 站点正式网址，影响 RSS、Sitemap、OG 图 |
| `base` | `string` | `/` | 部署子路径，仅子目录部署时修改 |
| `title` | `string` | `Shirone` | 站点标题，顶栏与浏览器标签页显示 |
| `subtitle` | `string` | — | 站点副标题 |
| `topAppBar.contentAlign` | `left` / `center` | `center` | 电脑端顶栏标题与导航的对齐方式 |
| `lang` | `string` | `en` | 界面语言代码，如 `zh_CN`、`ja`（内置 10 种语言） |
| `timeZone` | `string` | `Asia/Shanghai` | IANA 时区，决定文章与瞬间的精确时间戳 |
| `toc` | `object` | 启用、深度 2 | 文章右侧目录 |
| `progressIndicator.style` | `dual` / `single` | `dual` | 顶部阅读进度条样式 |
| `favicon` | `array` | `[]` | 自定义站点图标，空数组使用默认值 |

## 详解

### site 与 base

`site` ==必须在部署前设置为你的正式域名==，它被 RSS、Sitemap 与社交分享卡片（OG 图）共同消费，填错会导致订阅与分享链接全部指向错误地址。

`base` 仅在「子目录部署」时修改（如 `https://user.github.io/blog/` 对应 `base: "/blog/"`），独立域名部署保持 `/` 即可。详见 [部署到 GitHub Pages](/guide/deploy/github/) 中的 base 说明。

### 语言与时区

`lang` 控制界面文案语言（导航、按钮、提示语等），与文章内容的语言无关。可选值见 `src/i18n/languages/` 目录，内置简中、繁中、英语、日语等 10 种。

`timeZone` 采用 IANA 格式（如 `Asia/Shanghai`、`America/New_York`），独立于 `lang`——即界面用英语、时间戳仍可按上海时区展示。

### 页内目录（TOC）

```ts
toc: {
  enable: true,  // 文章页右侧显示目录
  depth: 2,      // 目录最大标题深度，取值 1~3
},
```

`depth: 2` 表示收录 `h1` 与 `h2`。技术长文建议 `3`（收录到 h3），随笔类保持 `2` 避免目录过长。

### 阅读进度条

```ts
progressIndicator: {
  style: "dual",   // "dual" 双向扫描（双线）/ "single" 单向扫描（单线）
},
```

进度条显示在页面顶部，随阅读位置推进。

### favicon

```ts
favicon: [
  {
    src: "/favicon/icon.png",   // 相对 /public 目录的路径
    theme: "light",             // 可选：light / dark，仅明暗使用不同图标时填写
    sizes: "32x32",             // 可选：仅不同尺寸图标需要时填写
  },
],
```

保持空数组 `[]` 则使用主题默认图标。

## 配置与数据分层原则

Shirone 的 `src/config/` 与 `src/data/` 有严格分工，修改配置前先理解这条原则：

| 判别问题 | 归属 | 位置 |
| --- | --- | --- |
| 控制「页面是否开启 / 排序 / 凭据」？ | **Config** | `src/config/*Config.ts` |
| 是「站点要展示的具体条目与说明」？ | **Data** | `src/data/*.ts` |

例如「时间线页是否显示」写进 `timelineConfig.enable`（Config），而时间线的具体节点内容维护在 `src/data/timeline.ts`（Data）。单项内容的停用通过 Config 中的 `disabledKeys` 列表声明，Data 保持纯净。

::: tip 零额外负担原则
可选外部服务与重量级特性默认必须为关闭（==`enable: false`==）。关闭或未配置时满足「零外部请求、零占位 DOM、零性能损耗、零主包膨胀」——这是全主题配置的统一契约。
:::

## 实战示例

**最小化配置（个人博客起步）**

```ts title="src/config/siteConfig.ts"
export const siteConfig = withUserConfig("site", {
  site: "https://blog.example.com/",
  base: "/",
  title: "我的博客",
  subtitle: "记录与分享",
  lang: "zh_CN",
  timeZone: "Asia/Shanghai",
})
```

未列出的字段（toc、progressIndicator 等）全部使用默认值，开箱即用。

**内容仓覆盖（双仓模式）**

内容仓中创建 `config/site.yaml`，只需写要覆盖的键：

```yaml title="config/site.yaml（内容仓）"
site: https://blog.example.com/
title: 我的博客
lang: zh_CN
```

YAML 键与代码默认值深合并（对象递归合并、数组整体替换），未覆盖的字段继续使用主题默认。

## 常见问题

**修改配置后构建报类型错误**

Shirone 是强类型配置，字段名与取值写错会在构建时直接报错。对照 `src/types/config.ts` 中的类型定义修正，或在修改后运行 `npx astro check` 校验。

**语言切换了但部分文案没变**

界面文案依赖 i18n 词条。自定义文案（如横幅副标题、公告内容）是纯文本，不随 `lang` 翻译；需要多语言的地方应使用主题的 i18n 机制。

**title 和 subtitle 在哪里显示**

`title` 显示在顶栏与浏览器标签页；`subtitle` 主要用于 SEO 与元数据。首页横幅中央的大字标题是 `banner.homeText.title`（见 [横幅与背景](/guide/layout/banner/)），与本处 `title` 相互独立。
