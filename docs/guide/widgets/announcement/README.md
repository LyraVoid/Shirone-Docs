---
title: 公告组件
createTime: 2026/09/01 00:41:00
permalink: /guide/widgets/announcement/
---

公告组件在侧栏顶部展示一条站点通知，支持关闭按钮与本地记忆。内容与行为由 `announcementConfig.ts` 配置。

## 配置

```ts title="src/config/announcementConfig.ts"
export const announcementConfig = withUserConfig("announcement", {
  title: "",    // 公告标题，留空使用 i18n 默认标题
  content: "The only way to do great work is to love what you do",
  closable: true,   // 允许访客关闭
  link: {
    enable: true,   // 启用尾部链接
    text: "GitHub",
    url: "https://github.com",
    external: true, // 外链新窗口打开
  },
})
```

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `""` | 公告标题；留空使用 i18n 词条 Key.announcement |
| `content` | `string` | 示例文本 | 公告正文 |
| `closable` | `boolean` | `true` | 显示关闭按钮 |
| `link.enable` | `boolean` | `true` | 是否启用尾部链接 |
| `link.text` | `string` | `GitHub` | 链接文本 |
| `link.url` | `string` | GitHub | 链接地址 |
| `link.external` | `boolean` | `true` | 标记为外链 |

## 渲染与行为

- **纯卡片形态**：公告不套 `WidgetLayout` 标题外壳（与其他列表类 widget 不同），视觉上更轻
- **关闭与记忆**：`closable: true` 时访客可关闭公告，关闭状态存入 localStorage——此后不再打扰该访客
- **零额外负担**：内容为空或已被关闭时不渲染任何 DOM

## 在侧栏中的位置

组件显示由 `sidebarConfig` 统一编排。默认配置：

```ts title="src/config/sidebarConfig.ts"
{ type: "announcement", enable: true, slot: "top", pages: ["home"] }
```

默认只在**首页**显示（`pages: ["home"]`）、固定在侧栏顶部。想全站显示可改为省略 `pages`，或仅移除首页限定：

```ts
{ type: "announcement", enable: true, slot: "top" }  // 全页面显示
```

## 实战示例

**活动通知（带链接）**

```ts title="src/config/announcementConfig.ts"
{
  title: "🎉 博客两周年",
  content: "感谢大家两年来的支持！博客两周年活动进行中。",
  closable: true,
  link: {
    enable: true,
    text: "查看活动",
    url: "/posts/anniversary/",
    external: false,   // 站内链接走 Swup 平滑切页
  },
}
```

**常驻免责声明（不可关闭）**

```ts title="src/config/announcementConfig.ts"
{
  title: "声明",
  content: "本站内容均为个人学习笔记，转载请注明出处。",
  closable: false,
  link: { enable: false, text: "", url: "", external: false },
}
```

## 常见问题

::: collapse
- 公告改了内容但访客看不到
  如果访客之前关闭过旧公告，`closable: true` 下关闭记忆会让新公告也被隐藏——记忆按公告关闭状态存储。临时方案是改 `content` 的同时请读者清缓存，或把 `closable` 关掉重发。

- 想让公告支持多语言
  `title` 留空走 i18n；`content` 是纯文本，多语言公告需要配合 `lang` 相关方案或按需自行处理。

- 公告和瞬间有什么区别
  公告是常驻侧栏的一条置顶通知（适合站点级消息）；瞬间是动态流（适合日常记录），两者用途不同。
:::
