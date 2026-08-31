---
title: 番剧页
createTime: 2026/09/01 00:24:00
permalink: /guide/pages/anime/
---

番剧页（`/anime/`）展示追番记录，支持三种数据源：本地手写数据（默认）、Bangumi 快照、Bilibili 快照。核心设计是**双平面模型**——外部同步只发生在显式的 `pnpm anime:sync` 阶段，页面运行时与默认构建绝不直接请求外部 API。

## 数据源模型

```ts title="src/config/animeConfig.ts"
export const animeConfig = withUserConfig("anime", {
  enable: true,          // 仅控制页面渲染，不发起外部连接
  source: {
    kind: "local",       // "local" | "snapshot"
    // provider: "bangumi",
    // file: "bangumi.json",
    // fetchOnDev: true,
  },
  fallback: {
    kind: "local",       // 快照丢失/解析失败时回退本地数据
  },
  providers: {
    bangumi: { enable: false, userId: "" },
    bilibili: { enable: false, vmid: "" },
  },
})
```

| 模式 | 数据来源 | 特点 |
| --- | --- | --- |
| `local` | `src/data/anime.ts` | 默认。完全离线，零网络、零构建脚本负担 |
| `snapshot` | `src/data/anime-snapshots/` 下的脱敏 JSON | 构建期抓取清洗后的本地快照；同步只发生在显式命令阶段 |

## 场景 A：本地数据（默认）

直接编辑 `src/data/anime.ts`，最稳定安全，零外部依赖。适合不想接入外部账号的用户。

## 场景 B：Bangumi 追番快照

::: steps

1. 在 `providers.bangumi` 中填入你的 Bangumi 数字 UID 或公开用户名，并将 `enable` 置为 `true`：

   ```ts title="src/config/animeConfig.ts"
   providers: {
     bangumi: {
       enable: true,
       userId: "sai",   // 你的 Bangumi UID
       request: { pageSize: 50, maxItems: 300, minDelayMs: 200 },
     },
   }
   ```

2. 将 `source` 切换为快照模式：

   ```ts
   source: { kind: "snapshot", provider: "bangumi" },
   ```

3. 执行同步命令生成快照：

   ```bash
   pnpm anime:sync --provider bangumi
   ```

4. 重新构建，番剧页展示 Bangumi 数据。

:::

## 场景 C：Bilibili 追番快照

::: steps

1. 填入 B 站公开 UID 并启用：

   ```ts title="src/config/animeConfig.ts"
   providers: {
     bilibili: {
       enable: true,
       vmid: "12345678",     // 你的 B 站 UID
       sessdataEnv: "BILI_SESSDATA",
       cover: { mode: "local", useWebp: true },
       request: { pageSize: 30, maxItems: 300, minDelayMs: 300 },
     },
   }
   ```

2. **追番列表设为私密时**，在 `.env` 中配置凭据（凭据只进同步进程，绝不进入客户端代码与 Git）：

   ```text title=".env"
   BILI_SESSDATA="your_sessdata"
   ```

3. 切换数据源并同步：

   ```bash
   # source: { kind: "snapshot", provider: "bilibili" }
   pnpm anime:sync --provider bilibili
   ```

:::

## 封面缓存

```ts
cover: {
  mode: "local",   // "local" 站内下载缓存（推荐）| "remote" 远程链接 | "none"
  useWebp: true,
},
```

`local` 模式把封面下载到站内（构建产物自带），避免外链失效与热链问题，`useWebp` 转换为更小的 WebP 格式。

## 降级策略

```ts
fallback: { kind: "local" },
```

快照文件丢失或解析失败时自动回退到 `src/data/anime.ts` 的本地数据——追番页永不空白。

## 零额外负担边界

- `enable: false` 仅控制页面渲染，主题本身不发起任何外部连接
- 没有 `pnpm anime:sync` 显式触发，默认构建不会请求外部 API
- 私密凭据（SESSDATA）只通过环境变量注入同步进程，不进客户端代码与 Git 提交

## 常见问题

::: collapse
- 快照同步失败

  检查网络可达性、账号 ID 正确性、私密列表的 SESSDATA 是否配置且未过期。同步命令有限速参数（`minDelayMs`），被平台限流时适当调大。

- 换数据源后页面没变

  确认 `source.kind` 已切换且快照文件存在（`src/data/anime-snapshots/`），同步命令是否成功执行。

- 同步后的数据可以手改吗

  可以。快照是普通 JSON，小修小改可行；但下次 `anime:sync` 会重新生成覆盖——长期修改请回到本地模式或在同步后作为发布流程的一部分。

- 凭据会被打包进产物吗

  不会。`BILI_SESSDATA` 只在同步命令运行时读取，快照生成后凭据不参与构建产物。
:::
