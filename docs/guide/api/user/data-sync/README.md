---
title: 数据快照与离线同步
createTime: 2026/09/01 03:40:00
permalink: /guide/api/user/data-sync/
---

番剧等外部数据采用“同步时请求、运行时读快照”的双平面模型。页面不直接向 Bangumi 或 Bilibili 请求数据，而是消费本地 JSON 快照。

## 同步命令

```bash
pnpm anime:sync --provider bangumi
pnpm anime:sync --provider bilibili
```

入口是 `scripts/anime/sync.mjs`，provider 位于 `scripts/anime/providers/`。凭据只在显式同步阶段读取，不应写入文章或提交到仓库。

## 快照生命周期

1. 同步脚本读取 `animeConfig` 与环境变量。
2. provider 请求 API，清洗并写入本地快照。
3. `src/pages/anime.astro` 和页面组件在构建时读取快照。
4. 提交需要发布的快照；部署无需再次访问外部 API。

同步失败时保留上一份有效快照。排查凭据、用户 ID、网络和 API 限流后再重试。
