---
title: 评论系统
createTime: 2026/09/01 00:13:00
permalink: /guide/article/comments/
---

评论系统默认全局关闭，由 `commentConfig.ts` 统一管理。当前支持 **Twikoo**（自建/托管后端）、**Giscus**（基于 GitHub Discussions 的零后端方案）与 **Waline**（自建/托管服务端，支持匿名评论、登录、表情与文章表情反应）。遵循零额外负担原则：未开启时不产生任何外部请求、零额外 DOM 占用与零包体积膨胀。

> [!TIP]
> **按需懒加载策略**
> 建议保持 `lazy: true`。评论客户端脚本仅在访客滚动至文章底部评论区域时才会按需下载并初始化，保证首屏极速加载与零多余网络开销。

## 配置速览

```ts title="src/config/commentConfig.ts"
export const commentConfig = withUserConfig("comment", {
  enable: false,        // 全局总开关
  provider: "none",     // "none" | "twikoo" | "giscus" | "waline"
  lazy: true,           // 视口懒加载
  twikoo: {
    envId: "",
    scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.20/dist/twikoo.min.js",
    lang: "auto",
    placeholder: "Share your thoughts...",
  },
  giscus: {
    repo: "",
    repoId: "",
    category: "Announcements",
    categoryId: "",
    mapping: "pathname",
    strict: false,
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: "bottom",
    theme: { light: "light", dark: "dark" },
    lang: "auto",
    scriptUrl: "https://giscus.app/client.js",
  },
  waline: {
    serverURL: "",
    scriptUrl: "https://cdn.jsdelivr.net/npm/@waline/client@3.16.1/dist/waline.umd.js",
    styleUrl: "https://cdn.jsdelivr.net/npm/@waline/client@3.16.1/dist/waline.css",
    lang: "auto",
    locale: { placeholder: "Share your thoughts..." },
    emoji: true,
    commentSorting: "latest",
    meta: ["nick", "mail", "link"],
    requiredMeta: [],
    login: "enable",
    wordLimit: 0,
    pageSize: 10,
    imageUploader: true,
    highlighter: true,
    texRenderer: false,
    noCopyright: false,
    noRss: true,
    recaptchaV3Key: "",
    turnstileKey: "",
    reaction: true,
  },
})
```

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 全局总开关；`false` 时不加载评论脚本与 DOM |
| `provider` | `"none"` / `"twikoo"` / `"giscus"` / `"waline"` | `"none"` | 评论提供商 |
| `lazy` | `boolean` | `true` | 视口懒加载：滚动进入视口才动态加载评论组件 |
| `twikoo.envId` | `string` | `""` | Twikoo 环境 ID |
| `twikoo.scriptUrl` | `string` | jsdelivr 源 | Twikoo 前端脚本地址 |
| `twikoo.lang` | `string` | `"auto"` | 评论界面语言，`auto` 跟随站点 |
| `twikoo.placeholder` | `string` | 英文占位 | 评论输入框提示文本 |
| `giscus.repo` | `string` | `""` | 公开仓库，格式 `owner/repo`（必填） |
| `giscus.repoId` | `string` | `""` | 仓库 ID，从 giscus.app 获取（必填） |
| `giscus.categoryId` | `string` | `""` | 分类 ID，从 giscus.app 获取（必填） |
| `giscus.category` | `string` | `"Announcements"` | Discussion 分类名，推荐 Announcements |
| `giscus.mapping` | 枚举 | `"pathname"` | 页面 ↔ Discussion 映射：`pathname` / `url` / `title` / `og:title` / `specific` / `number` |
| `giscus.strict` | `boolean` | `false` | 严格标题匹配（SHA-1 校验），避免模糊搜索误配 |
| `giscus.reactionsEnabled` | `boolean` | `true` | 显示主贴表情反应 |
| `giscus.emitMetadata` | `boolean` | `false` | 向页面发送 Discussion 元数据 |
| `giscus.inputPosition` | `"top"` / `"bottom"` | `"bottom"` | 评论输入框位置 |
| `giscus.theme.light` / `.dark` | `string` | `"light"` / `"dark"` | 明暗双主题（giscus 主题键或自定义 CSS URL），跟随站点切换 |
| `giscus.lang` | `string` | `"auto"` | 评论语言，`auto` 跟随站点 |
| `giscus.scriptUrl` | `string` | giscus.app 源 | client.js 地址，自托管 giscus 时替换 |
| `waline.serverURL` | `string` | `""` | Waline 服务端 http(s) 地址（必填） |
| `waline.scriptUrl` / `.styleUrl` | `string` | jsdelivr 源 | 客户端 JS 与 CSS 地址，进入视口后加载；自托管或升级时须同版本 |
| `waline.lang` | `string` | `"auto"` | 评论语言，`auto` 跟随文章/站点语言（未内置的语言回退 `en`），或 Waline 语言码如 `zh-CN`、`jp` |
| `waline.locale` | 对象 | `{ placeholder }` | 文案覆盖，省略的字段沿用当前语言默认文案；`placeholder` 为输入框提示 |
| `waline.emoji` | `boolean` / 数组 | `true` | `true` 使用 Waline 默认表情包，`false` 关闭，也可填写表情包地址列表 |
| `waline.commentSorting` | `"latest"` / `"oldest"` / `"hottest"` | `"latest"` | 评论排序 |
| `waline.meta` / `.requiredMeta` | 数组 | `["nick","mail","link"]` / `[]` | 评论者信息字段与其中的必填项；`requiredMeta` 为空时允许匿名 |
| `waline.login` | `"enable"` / `"disable"` / `"force"` | `"enable"` | 登录模式 |
| `waline.wordLimit` | `number` / `[min, max]` | `0` | 字数限制，`0` 不限制 |
| `waline.pageSize` | `number` | `10` | 每页评论条数 |
| `waline.imageUploader` / `.highlighter` / `.texRenderer` | `boolean` | `true` / `true` / `false` | 图片上传（Base64）、代码高亮与 TeX 提示；只接受布尔值 |
| `waline.noCopyright` / `.noRss` | `boolean` | `false` / `true` | 隐藏页脚版权 / RSS 订阅链接 |
| `waline.recaptchaV3Key` / `.turnstileKey` | `string` | `""` | 人机验证站点密钥，留空不启用 |
| `waline.reaction` | `boolean` / 数组 | `true` | 文章表情反应，也可填写自定义表情图片地址列表 |

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
       scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.20/dist/twikoo.min.js",
       lang: "auto",
       placeholder: "说点什么吧……",
     },
   })
   ```

3. **重新构建部署**，文章页底部即出现评论组件。

:::

## 开启 Giscus 评论

Giscus 基于 GitHub Discussions，无需部署任何后端，评论数据存储在你自己的公开仓库中。

::: steps

1. **准备仓库**：创建一个公开 GitHub 仓库，在 Settings → General → Features 中开启 Discussions；安装 [giscus App](https://github.com/apps/giscus) 并授权给该仓库。

2. **获取 ID**：打开 [giscus.app](https://giscus.app/zh-CN)，选择仓库与 Discussion 分类（推荐 **Announcements**，仅维护者可开新讨论），记下生成的 `data-repo-id` 与 `data-category-id`。

3. **修改配置**：把 `enable` 设为 `true`，`provider` 设为 `"giscus"`，填入三必填字段：

   ```ts title="src/config/commentConfig.ts"
   export const commentConfig = withUserConfig("comment", {
     enable: true,
     provider: "giscus",
     lazy: true,
     giscus: {
       repo: "owner/repo",
       repoId: "R_xxxxxxxxxx",
       categoryId: "DIC_xxxxxxxxxx",
       // 可选：明暗主题跟随站点自动切换
       theme: { light: "light", dark: "transparent_dark" },
     },
   })
   ```

4. **重新构建部署**，文章页底部即出现 Giscus 评论区，明暗主题随站点切换自动同步。

:::

## 开启 Waline 评论

Waline 的评论区沿用主题为 Twikoo 设计的线条样式，评论框中的表情显示为图标，文章表情反应显示在评论区顶部。

::: steps

1. **部署 Waline 服务端**：按 [Waline 官方文档](https://waline.js.org/guide/get-started/) 部署（Vercel、Deta、Railway 或私有部署），记下服务端地址。

2. **修改配置**：把 `enable` 设为 `true`，`provider` 设为 `"waline"`，填入 `serverURL`：

   ```ts title="src/config/commentConfig.ts"
   export const commentConfig = withUserConfig("comment", {
     enable: true,
     provider: "waline",
     lazy: true,
     waline: {
       serverURL: "https://comments.example.com",
       lang: "auto",
       locale: { placeholder: "说点什么吧……" },
       // 可选：要求填写昵称与邮箱
       requiredMeta: ["nick", "mail"],
     },
   })
   ```

3. **重新构建部署**，文章页底部即出现 Waline 评论区；客户端 JS 与 CSS 在评论区进入视口后才加载。

:::

> [!NOTE]
> 配置以 JSON 形式写入页面，因此 `imageUploader`、`highlighter`、`texRenderer` 只接受 `true` / `false`，填写 Waline 原生的自定义函数会在构建时报错。主题不采集浏览量（Waline 的 `pageview` 始终关闭）。自托管客户端或升级版本时，`scriptUrl` 与 `styleUrl` 须保持同一版本。

## 生效条件与解析规则

配置解析器在以下任一情况返回 `null`（评论完全不渲染，零 DOM）：

- `enable` 为 `false`
- `provider` 为 `"none"`
- provider 为 `"twikoo"` 时：`envId` 或 `scriptUrl` 为空
- provider 为 `"giscus"` 时：`repo`、`repoId`、`categoryId` 任一为空
- provider 为 `"waline"` 时：`serverURL`、`scriptUrl`、`styleUrl` 任一为空，或 `serverURL` 不是 http(s) 地址

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

**零后端 GitHub 评论**

```ts title="src/config/commentConfig.ts"
{
  enable: true,
  provider: "giscus",
  lazy: true,
  giscus: {
    repo: "owner/repo",
    repoId: "R_xxxxxxxxxx",
    categoryId: "DIC_xxxxxxxxxx",
    mapping: "pathname",
    lang: "auto",
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

**Waline 实名评论**

```ts title="src/config/commentConfig.ts"
{
  enable: true,
  provider: "waline",
  lazy: true,
  waline: {
    serverURL: "https://comments.example.com",
    login: "force",
    requiredMeta: ["nick", "mail"],
    wordLimit: [0, 500],
    turnstileKey: "0x4AAAAAAA…",
  },
}
```

## 常见问题

::: collapse
- 评论组件不出现

  按解析规则逐层检查：`enable` → `provider` → 必填字段非空（twikoo 的 `envId` / `scriptUrl`，giscus 的 `repo` / `repoId` / `categoryId`，waline 的 `serverURL` / `scriptUrl` / `styleUrl`，且 `serverURL` 须为 http(s) 地址）。任一缺失即静默关闭（设计行为，不报错）。

- 评论加载拖慢页面

  确认 `lazy: true`（默认已开）。开启后脚本仅在评论区域进入视口时加载。

- envId 用什么格式

  两种都可以：完整 URL（如 `https://your-twikoo.vercel.app`，Vercel/Railway 部署常见）或腾讯云环境 ID 字符串。

- Giscus 的 repoId / categoryId 从哪里获取

  打开 [giscus.app](https://giscus.app/zh-CN)，选择仓库与分类后，页面生成的 `<script>` 标签里就有 `data-repo-id` 与 `data-category-id`。

- 评论语言跟站点不一致

  `twikoo.lang`、`giscus.lang` 或 `waline.lang` 设为 `"auto"` 时跟随站点语言。强制指定（如 `"zh-CN"`）可覆盖。Waline 用 `"jp"` 表示日语；站点语言不在其内置列表中时回退英文。

- Waline 能不能自定义图片上传或代码高亮函数

  不能。配置以 JSON 写入页面，无法携带函数，`imageUploader`、`highlighter`、`texRenderer` 只接受 `true` / `false`；写入函数会在构建时报错而不是静默失效。
:::
