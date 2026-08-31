---
title: 页脚与博主资料
createTime: 2026/08/31 22:35:00
permalink: /guide/layout/footer-profile/
---

页脚与博主资料是两个小而常用的配置：`footerConfig.ts` 控制页脚自定义 HTML 注入，`profileConfig.ts` 定义头像、名称、简介与社交链接（被侧栏 Profile 卡片、页脚、RSS 作者等共同消费）。

## 页脚自定义 HTML（footerConfig）

```ts title="src/config/footerConfig.ts"
export const footerConfig = withUserConfig("footer", {
  enable: false,
})
```

只有一个开关：

- 开启后读取 `src/config/FooterConfig.html` 的内容，注入到页脚版权信息**上方**
- 关闭时零额外 DOM 占位、零文件读取开销

### 使用步骤

::: steps

1. 在 `src/config/` 下创建 `FooterConfig.html`，写入你的自定义内容：

   ```html title="src/config/FooterConfig.html"
   <div style="text-align: center; margin-bottom: 8px;">
     <span>本站由 <a href="https://astro.build/">Astro</a> 驱动</span>
     ·
     <a href="/rss.xml">RSS 订阅</a>
   </div>
   ```

2. 把 `footerConfig.enable` 设为 `true`。

3. 重新构建，页脚版权区上方即出现注入内容。

:::

::: warning 注入的是原生 HTML
内容不经 Markdown 处理与转义，直接插入页面——请自行保证标记合法与安全（不要粘贴不可信来源的代码）。
:::

## 博主资料（profileConfig）

```ts title="src/config/profileConfig.ts"
export const profileConfig = withUserConfig("profile", {
  avatar: "assets/images/demo-avatar.webp",
  name: "Shirone",
  bio: "The rain remembers what the sky forgot to say.",
  links: [
    {
      name: "Twitter",
      icon: "fa6-brands:twitter",
      url: "https://twitter.com",
    },
    {
      name: "Steam",
      icon: "fa6-brands:steam",
      url: "https://store.steampowered.com",
    },
    {
      name: "GitHub",
      icon: "fa6-brands:github",
      url: "https://github.com/LyraVoid/Shirone",
    },
  ],
})
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `avatar` | `string` | 头像路径。相对 `src` 的路径，或以 `/` 开头相对 `public` |
| `name` | `string` | 显示名称（侧栏卡片、RSS 作者） |
| `bio` | `string` | 一句话简介 |
| `links` | `array` | 社交链接清单 |

### 头像路径规则

- `assets/images/xxx.webp` —— 相对 `src` 目录，走构建管线（推荐，可被优化）
- `/avatar.png` —— 以 `/` 开头，相对 `public` 目录，原样输出

### 社交链接

每个条目三个字段：

```ts
{
  name: "Bilibili",                     // 显示名称
  icon: "fa6-brands:bilibili",          // iconify 图标编码
  url: "https://space.bilibili.com/…",  // 跳转地址
}
```

图标来自 [icones.js.org](https://icones.js.org/)。使用未内置的图标集时先安装：

```bash
pnpm add @iconify-json/<icon-set-name>
```

::: tip 资料的消费方
`profileConfig` 是全局唯一定义——侧栏 Profile 卡片、页脚、RSS 作者信息都从这里取值，改一处全站生效。侧栏中是否显示 Profile 卡由 `sidebarConfig` 的 `profile` widget 条目控制（见[侧栏布局](/guide/layout/sidebar/)）。
:::

## 实战示例

**完整的个人资料配置**

```ts title="src/config/profileConfig.ts"
export const profileConfig = withUserConfig("profile", {
  avatar: "assets/images/my-avatar.webp",
  name: "小白",
  bio: "写字、拍照、看番的普通人",
  links: [
    { name: "GitHub", icon: "fa6-brands:github", url: "https://github.com/yourname" },
    { name: "Bilibili", icon: "fa6-brands:bilibili", url: "https://space.bilibili.com/12345" },
    { name: "Email", icon: "material-symbols:mail-outline-rounded", url: "mailto:me@example.com" },
  ],
})
```

**页脚展示运行时长**

```html title="src/config/FooterConfig.html"
<div style="text-align:center;font-size:0.85em;opacity:0.75;">
  本站已运行
  <span id="site-days">…</span>
  天
</div>
<script>
  const start = new Date("2026-01-01").getTime()
  const el = document.getElementById("site-days")
  const update = () => {
    el.textContent = Math.floor((Date.now() - start) / 86400000)
  }
  update()
  setInterval(update, 3600000)
</script>
```

配合 `footerConfig.enable: true` 使用。

## 常见问题

::: collapse
- 页脚 HTML 没生效
  依次确认：`enable` 是否为 `true`、`FooterConfig.html` 是否位于 `src/config/` 且文件名大小写正确、是否重新构建。Swup 切页时页脚属外围框架，注入内容不会重复插入。

- 头像不显示
  检查路径规则：相对 `src` 不带 `/` 前缀、相对 `public` 带 `/` 前缀。远程 URL 也可以用，但不受构建优化。

- 社交图标显示为方块
  该图标集未安装。到 [icones.js.org](https://icones.js.org/) 确认图标所属集合名，执行 `pnpm add @iconify-json/<集合名>` 后重新构建。

- 想在页脚放 ICP 备案号
  正合适——写入 `FooterConfig.html` 并开启开关即可，主题默认页脚的版权行不会受影响。
:::
