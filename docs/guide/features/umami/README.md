---
title: Umami 统计
createTime: 2026/09/01 00:52:00
permalink: /guide/features/umami/
---

接入 [Umami](https://umami.is/)（开源自托管分析服务）获取站点访问统计。由 `umamiConfig.ts` 配置，默认全局关闭。Shirone 的集成有两个能力层：

1. **公开分享统计**：侧栏等位置读取 Umami 公开分享接口的访问数据（需填 `shareUrl`）
2. **访问采集**：加载 Umami 官方脚本采集访客行为（需同时填 `websiteId` 与 `scriptUrl`）

## 配置

```ts title="src/config/umamiConfig.ts"
export const umamiConfig = withUserConfig("umami", {
  enable: false,      // 全局总开关
  shareUrl: "",       // Umami 分享链接（必填）
  websiteId: "",      // Umami Website ID
  scriptUrl: "",      // Umami 采集脚本 URL
})
```

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 全局总开关；`false` 时不加载 oddmisc 运行时脚本与 DOM |
| `shareUrl` | `string` | `""` | Umami 分享链接（必填，缺失时整体不生效） |
| `websiteId` | `string` | `""` | Website ID，与 `scriptUrl` 同时填写才启用访问采集 |
| `scriptUrl` | `string` | `""` | 采集脚本 URL，与 `websiteId` 成对生效 |

## 解析规则

- `enable: false` → 整体不生效（零请求、零 DOM、零包体积）
- `shareUrl` 为空 → 整体不生效
- 只填 `shareUrl` → 仅启用公开分享统计展示
- `shareUrl` + `websiteId` + `scriptUrl` 三者齐备 → 分享统计 + 访问采集同时启用

## 开启步骤

::: steps

1. **部署 Umami**（自托管或官方云服务），创建网站并拿到 `websiteId` 与采集脚本地址。

2. **开启分享链接**：在 Umami 控制台为该网站开启「分享 URL」，得到形如 `https://umami.example.com/share/xxxx` 的链接。

3. **填写配置**：

   ```ts title="src/config/umamiConfig.ts"
   {
     enable: true,
     shareUrl: "https://umami.example.com/share/xxxx",
     websiteId: "your-website-id",
     scriptUrl: "https://umami.example.com/script.js",
   }
   ```

4. **重新构建部署**。

:::

## 隐私说明

Umami 是无 Cookie 的轻量分析方案，不追踪跨站身份。仍建议在隐私政策中说明站点使用了访问统计。

## 双仓覆盖

统计属于站点级配置，可在内容仓 `config/umami.yaml` 中覆盖（领域键 `umami`）：

```yaml title="config/umami.yaml（内容仓）"
enable: true
shareUrl: https://umami.example.com/share/xxxx
```

## 常见问题

::: collapse
- 侧栏/统计区不显示数据
  检查 `shareUrl` 是否填写且正确——它是公开分享统计的唯一数据来源，缺失时整体静默关闭（设计行为）。

- 访问数据一直没有
  确认 `websiteId` 与 `scriptUrl` 成对填写且正确；用浏览器开发者工具确认采集脚本已加载并向 Umami 实例发起了请求；Umami 后台是否能看到自己的访问。

- 会拖慢页面吗
  不会。采集脚本与数据拉取都是异步按需进行，`enable: false`（默认）时完全不加载任何资源。
:::
