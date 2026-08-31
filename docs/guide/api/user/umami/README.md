---
title: Umami API
createTime: 2026/09/01 01:15:00
permalink: /guide/api/user/umami/
---

[Umami](https://umami.is/) 是一个开源、自托管且保护用户隐私的现代网站分析统计服务。在 Shirone 中，Umami 统计由底层 [`oddmisc`](https://www.npmjs.com/package/oddmisc) 客户端驱动，提供了基于公开分享链接的无鉴权数据读取与官方访问数据上报能力。

## 核心能力层 <Badge text="oddmisc" color="#6366f1" vertical="middle" /> <Badge text="Zero Token" type="tip" vertical="middle" />

Shirone 的 Umami API 架构划分为两个独立能力层：

1. **公开分享统计层（Public Share API）**：无需提供任何管理员密钥或登录凭证，直接通过 Umami 生成的公开分享链接（`shareUrl`）在前端安全读取站点与单页面的 PV / UV 数据。
2. **访问采集上报层（Visitor Tracking）**：通过注入官方轻量采集脚本（`scriptUrl` + `websiteId`）记录访客行为。

## 配置规范 <Badge text="src/config/umamiConfig.ts" type="info" vertical="middle" />

在 `src/config/umamiConfig.ts`（或内容仓 `config/umami.yaml`）中配置：

```ts title="src/config/umamiConfig.ts"
export const umamiConfig = withUserConfig("umami", {
  enable: true,
  shareUrl: "https://umami.example.com/share/xxxxxx",
  // 可选：需要采集访问时同时配置以下两项
  websiteId: "your-website-id",
  scriptUrl: "https://umami.example.com/script.js",
})
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 全局总开关。为 `false` 时零网络请求、零 DOM、零运行时脚本 |
| `shareUrl` | `string` | `""` | Umami 公开分享链接（必填，缺失时整体静默关闭） |
| `websiteId` | `string` | `""` | 网站 ID（可选，与 `scriptUrl` 成对生效） |
| `scriptUrl` | `string` | `""` | 官方采集脚本 URL（可选，与 `websiteId` 成对生效） |

### 规则组合

- `enable: false` → 整体关闭（零加载）
- 只配置 `shareUrl` → 仅启用前端公开统计数据展示（读取模式）
- `shareUrl` + `websiteId` + `scriptUrl` 均配置 → 统计数据展示 + 访问上报同时启用

## 支持的 Share URL 格式

Umami 官方云与自托管实例生成的以下格式均被原生支持：

- 自托管实例：`https://umami.yourdomain.com/share/<shareId>`
- 官方云服务：`https://cloud.umami.is/analytics/us/share/<shareId>`
- 自定义路径：`https://umami.yourdomain.com/analytics/share/<shareId>`

---

## 客户端 JavaScript API

在浏览器中，当 Umami 统计启用后，可通过全局对象 `window.oddmisc` 直接调用以下异步方法：

### 1. 站点整体统计

```js
const siteStats = await window.oddmisc.getSiteStats();
console.log(siteStats);
```

### 2. 指定页面路径统计

```js
const pageStats = await window.oddmisc.getPageStats("/posts/hello-world/");
console.log(pageStats);
```

### 3. 实时在线访客

```js
const active = await window.oddmisc.getActiveVisitors();
console.log(`当前在线访客: ${active.x}`);
```

### 4. 客户端就绪事件

```js
window.addEventListener("oddmisc-ready", (event) => {
  const client = event.detail.client;
  client.getSiteStats().then((stats) => {
    console.log("Umami stats loaded:", stats);
  });
});
```

---

## 返回数据结构

```ts
interface StatsResult {
  /** 页面总浏览量 (Page Views) */
  pageviews: number;
  /** 独立访客数 (Unique Visitors) */
  visitors: number;
  /** 访问会话次数 (Visits) */
  visits: number;
  /** 跳出次数 (可选) */
  bounces?: number;
  /** 平均停留时间秒数 (可选) */
  totaltime?: number;
  /** 与上一周期对比数据 (可选) */
  comparison?: {
    pageviews?: number;
    visitors?: number;
    visits?: number;
  };
  /** 是否来自本地缓存 */
  _fromCache?: boolean;
}
```

---

## 缓存与请求合并

为了避免频繁刷新或多组件重复调用导致 Umami 服务压力过大，Shirone 实现了高可用优化：

1. **双层缓存**：内存与 `localStorage` 双重缓存，默认缓存时长（TTL）为 1 小时。
2. **并发请求合并**：在 SPA 站内导航或页面存在多个统计组件时，相同路由的请求自动复用同一个在途 Promise（`__shironeUmamiStatsPromises`）。
3. **Swup 切页响应**：无感监听 `swup:content:replace` 与 `swup:page:view` 事件，切换路由自动刷新统计数值。

---

## 错误分类

当请求异常时，`oddmisc` 会抛出标准化的错误实例：

- `UmamiUrlError`（`INVALID_URL`）：分享链接格式不正确。
- `UmamiAuthError`（`AUTH_FAILED`）：HTTP 401 状态码，分享 ID 已失效或被后台撤回。
- `UmamiNetworkError`（`NETWORK_ERROR`）：网络不可达或实例返回 5xx 错误。
- `UmamiTimeoutError`（`TIMEOUT`）：网络请求超时（默认 10 秒）。

## 常见问题

**如何获取 Share URL**

在 Umami 实例控制台中：
1. 打开 **Settings** → **Websites**。
2. 找到你的站点，点击 **Edit**。
3. 切换到 **Share URL** 选项卡，开启分享开关并复制生成的链接。

**统计数据显示 `--` 没有数值**

1. 检查 `shareUrl` 是否在浏览器中能直接访问并看到图表。
2. 检查控制台是否有跨域（CORS）报错。
3. 若分享链接刚创建，Umami 数据库需要接收第一条访问后才会产出聚合数据。
