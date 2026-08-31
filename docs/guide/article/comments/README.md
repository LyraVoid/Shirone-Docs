---
title: 评论系统
createTime: 2026/09/01 00:13:00
permalink: /guide/article/comments/
---

评论系统默认全局关闭，由 `commentConfig.ts` 统一管理。当前支持 Twikoo。遵循零额外负担原则：未开启时不产生任何外部请求、零额外 DOM 占位与零包体积膨胀。

## 配置速览

```ts title="src/config/commentConfig.ts"
export const commentConfig = withUserConfig("comment", {
  enable: false,        // 全局总开关
  provider: "none",     // "none" | "twikoo"
  lazy: true,           // 视口懒加载
  twikoo: {
    envId: "",
    scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.19/dist/twikoo.min.js",
    lang: "auto",
    placeholder: "Share your thoughts...",
  },
})
```

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 全局总开关；`false` 时不加载评论脚本与 DOM |
| `provider` | `"none"` / `"twikoo"` | `"none"` | 评论提供商 |
| `lazy` | `boolean` | `true` | 视口懒加载：滚动进入视口才动态加载评论组件 |
| `twikoo.envId` | `string` | `""` | Twikoo 环境 ID |
| `twikoo.scriptUrl` | `string` | jsdelivr 源 | Twikoo 前端脚本地址 |
| `twikoo.lang` | `string` | `"auto"` | 评论界面语言，`auto` 跟随站点 |
| `twikoo.placeholder` | `string` | 英文占位 | 评论输入框提示文本 |

## 开启 Twikoo 评论

::: steps

1. **部署 Twikoo 服务端**并获取环境 ID。支持腾讯云 CloudBase、Vercel、Railway 或私有部署。

2. **修改配置**：把 `enable` 设为 `true`，`provider` 设为 `"twikoo"`，并填入 `envId`：

   ```ts title="src/config/commentConfig.ts"
   export const commentConfig = withUserConfig("comment", {
     enable: true,
     provider: "twikoo",
     lazy: true,
     twikoo: {
       envId: "https://your-twikoo.vercel.app",
       scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.19/dist/twikoo.min.js",
       lang: "auto",
       placeholder: "说点什么吧……",
     },
   })
   ```

3. **重新构建部署**，文章页底部即出现评论组件。

:::

## 生效条件与解析规则

配置解析器在以下任一情况返回 `null`（评论完全不渲染，零 DOM）：

- `enable` 为 `false`
- `provider` 为 `"none"`
- `envId` 或 `scriptUrl` 为空

条件满足时组件才动态加载。配合 `lazy: true`，评论脚本在读者滚动到文章底部时才请求——不影响首屏性能。

## 单篇控制

frontmatter 中设置 `comment: false` 可对单篇文章关闭评论（全局开关需已启用）：

```yaml
---
title: 这篇不开放评论
comment: false
---
```

关闭后 FAB 的「直达评论」按钮对该文章也零 DOM（见[悬浮控制流](/guide/article/fab/)）。

## 实战示例

**中文博客（本地化评论）**

```ts title="src/config/commentConfig.ts"
{
  enable: true,
  provider: "twikoo",
  lazy: true,
  twikoo: {
    envId: "https://your-twikoo.vercel.app",
    lang: "zh-CN",
    placeholder: "友善发言，理性讨论",
  },
}
```

**自建 CDN 脚本**

```ts
twikoo: {
  envId: "…",
  scriptUrl: "https://your-cdn.example.com/twikoo.min.js",
},
```

## 常见问题

::: collapse
- 评论组件不出现
  按解析规则逐层检查：`enable` → `provider` → `envId` / `scriptUrl` 非空。任一缺失即静默关闭（设计行为，不报错）。

- 评论加载拖慢页面
  确认 `lazy: true`（默认已开）。开启后脚本仅在评论区域进入视口时加载。

- envId 用什么格式
  两种都可以：完整 URL（如 `https://your-twikoo.vercel.app`，Vercel/Railway 部署常见）或腾讯云环境 ID 字符串。

- 评论语言跟站点不一致
  `twikoo.lang` 设为 `"auto"` 时跟随站点语言。强制指定（如 `"zh-CN"`）可覆盖。
:::
