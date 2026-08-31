---
title: 导航栏配置
createTime: 2026/08/31 22:33:00
permalink: /guide/layout/navbar/
---

导航栏由 `navBarConfig.ts` 统一配置，同时驱动电脑端顶栏下拉菜单与全端导航抽屉。配置分两层：`LinkPresets`（命名链接预设表）与 `links`（导航结构与顺序）。

## 预设表（LinkPresets）

主题内置 15 个命名预设，名称、地址、图标单点维护、可整体复用：

| 预设 | 地址 | 说明 |
| --- | --- | --- |
| `Home` | `/` | 首页 |
| `Archive` | `/archive/` | 归档 |
| `Friends` | `/friends/` | 友链 |
| `Moments` | `/moments/` | 瞬间 |
| `Anime` | `/anime/` | 番剧 |
| `Compass` | `/compass/` | 罗盘 |
| `Skills` | `/skills/` | 技能 |
| `Projects` | `/projects/` | 项目 |
| `Devices` | `/devices/` | 设备 |
| `Timeline` | `/timeline/` | 时间线 |
| `Albums` | `/albums/` | 相册 |
| `Categories` | `/categories/` | 分类 |
| `Tags` | `/tags/` | 标签 |
| `About` | `/about/` | 关于 |
| `GitHub` | 外链 | 主题仓库 |

每个预设自带 i18n 名称与 Material 图标（如 `Archive` 使用 `material-symbols:archive-outline-rounded`）。

## 导航结构（links）

```ts title="src/config/navBarConfig.ts"
const defaultNavBarConfig: NavBarConfig = {
  links: [
    LinkPresets.Home,
    LinkPresets.Archive,
    LinkPresets.Friends,
    LinkPresets.Moments,
    LinkPresets.Anime,
    LinkPresets.Compass,
    LinkPresets.Albums,
    {
      name: i18n(I18nKey.more),
      icon: "material-symbols:apps-rounded",
      children: [
        ...(timelineConfig.enable ? [LinkPresets.Timeline] : []),
        ...(projectsConfig.enable ? [LinkPresets.Projects] : []),
        ...(devicesConfig.enable ? [LinkPresets.Devices] : []),
        ...(skillsConfig.enable ? [LinkPresets.Skills] : []),
        LinkPresets.About,
        LinkPresets.GitHub,
      ],
    },
  ],
}
```

要点：

- **顺序即展示顺序**：顶栏按 `links` 数组顺序渲染
- **分组**：带 `children` 的条目渲染为下拉菜单（顶栏）与子列表（抽屉）
- **条件挂载**：`more` 分组内通过各页面 Config 的 `enable` 条件展开——关闭时间线页时导航入口同步消失
- **分类/标签默认不进导航**：预设已登记但被注释，需要时取消注释即可

## 自定义链接

直接写 `NavBarLink` 对象即可加入任意链接：

```ts title="src/config/navBarConfig.ts"
links: [
  LinkPresets.Home,
  LinkPresets.Archive,
  {
    name: "我的friends",        // 字面量文本
    url: "https://example.com", // 任意地址
    icon: "fa6-brands:github",  // iconify 图标，见 https://icones.js.org/
    external: true,             // 标记为外链（新窗口打开）
  },
  // ...
]
```

::: tip 新增入口的推荐做法
先在 `LinkPresets` 登记预设（名称走 `i18n()`，图标单点维护），再在 `links` 中按序引用。临时链接可直接内联对象。
:::

## 内容仓覆盖（双仓模式）

`navBarConfig` 是唯一不走 `withUserConfig()` 深合并的领域（导航项引用 `LinkPresets` 并调用 `i18n()`，深合并会得到未解析的引用），改由 `resolveNavBarLinks()` 把内容仓的声明式条目还原：

```yaml title="config/nav-bar.yaml（内容仓）"
links:
  - preset: Home
  - preset: Archive
  - name: "$t:friends"        # $t: 前缀引用 i18n 词条
    url: /friends/
  - name: 我的合集
    children:
      - preset: Anime
      - preset: Albums
      - name: "$t:about"
        preset: About
```

- `preset` 引用内置预设，未知预设名会在构建时直接报错并列出可用项
- `name` 支持 `$t:词条名` 引用 i18n（如 `$t:home`），纯文本直接写字面量
- 未声明的字段自动沿用预设自带值（url、icon、children 等）

::: warning 两条边界
- `navBar` 不参与 `content:export` 反向导出，YAML 只能手工维护
- Windows 本地运行相关命令请使用 `pnpm.cmd` / `npx.cmd`（PowerShell 执行策略限制）
:::

## 图标

导航图标使用 [iconify](https://icones.js.org/) 编码，主题已内置 `material-symbols`、`fa6-brands` 等图标集。使用未安装的图标集时：

```bash
pnpm add @iconify-json/<icon-set-name>
```

## 实战示例

**精简导航（纯文字博客）**

```ts title="src/config/navBarConfig.ts"
const defaultNavBarConfig: NavBarConfig = {
  links: [
    LinkPresets.Home,
    LinkPresets.Archive,
    LinkPresets.About,
    LinkPresets.GitHub,
  ],
}
```

**按内容型站点组织（内容展示优先）**

```ts title="src/config/navBarConfig.ts"
links: [
  LinkPresets.Home,
  LinkPresets.Moments,
  LinkPresets.Albums,
  LinkPresets.Anime,
  {
    name: i18n(I18nKey.more),
    icon: "material-symbols:apps-rounded",
    children: [
      LinkPresets.Archive,
      LinkPresets.Friends,
      LinkPresets.About,
    ],
  },
]
```

## 常见问题

::: collapse
- 关闭某页面后导航还有入口吗

  没有。技能、项目、设备、时间线等页面的导航入口与其 Config 的 `enable` 联动，关闭页面时入口自动隐藏，无需改导航配置。

- 外链和内链的区别

  内链（`url` 以 `/` 开头）经 Swup 平滑切页；设 `external: true` 的外链在新标签页打开。

- 自定义名称不跟随语言切换

  `name` 写字面量就固定不变。要多语言请用 `i18n(I18nKey.xxx)` 引用词条（代码仓）或 `$t:xxx`（内容仓 YAML）。

- 改了 links 但导航没更新

  检查是否处于双仓模式且 `config/nav-bar.yaml` 存在——内容仓的 `links` 会整体替换代码仓默认结构。确认生效来源后修改对应位置。
:::
