---
title: Bilibili API
createTime: 2026/09/01 01:10:00
permalink: /guide/api/user/bilibili/
---

Bilibili（哔哩哔哩）是中国广受欢迎的弹幕视频与动画社区。在 Shirone 中，Bilibili 相关的接口主要用于两个场景：

1. **番剧追番同步（Anime Sync Provider）**：在离线构建期抓取用户在 B 站的追番列表，生成本地快照。
2. **视频门面嵌入（Video Embed Facade）**：在文章排版中以延迟加载的隐私保护门面形式嵌入 B 站视频播放器。

---

## 追番列表同步 API

Shirone 的追番同步脚本（`scripts/anime/providers/bilibili.mjs`）通过 Bilibili 空间追番接口批量拉取追番数据。

### 配置方式 <Badge text="src/config/animeConfig.ts" type="info" vertical="middle" />

在 `src/config/animeConfig.ts` 中配置 Bilibili 提供方：

```ts title="src/config/animeConfig.ts"
export const animeConfig = withUserConfig("anime", {
  enable: true,
  source: {
    kind: "snapshot",
    provider: "bilibili",
  },
  providers: {
    bilibili: {
      enable: true,
      vmid: "12345678",             // 你的 B 站数字 UID
      sessdataEnv: "BILI_SESSDATA", // .env 中的凭据环境变量名
      cover: {
        mode: "local",              // 封面本地下载缓存（推荐）
        useWebp: true,              // 自动转换为 WebP
      },
      request: {
        pageSize: 30,               // 单页大小（10 ~ 50，默认 30）
        maxItems: 300,              // 最大条目上限
        minDelayMs: 300,            // 请求间隔延迟（毫秒）
      },
    },
  },
})
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `vmid` | `string` | `""` | 用户的 B 站数字 UID（必填） |
| `sessdataEnv` | `string` | `"BILI_SESSDATA"` | 读取私密追番凭据的环境变量名称 |
| `cover.mode` | `"local" \| "remote" \| "none"` | `"local"` | 封面策略：`local`（本地下载缓存，推荐）、`remote`（直连远程直链）、`none`（不加载封面） |
| `cover.useWebp` | `boolean` | `true` | 是否启用 WebP 格式压缩 |
| `request.pageSize` | `number` | `30` | 分页大小 |
| `request.minDelayMs` | `number` | `300` | 请求间隔延迟（毫秒） |

### 接口端点详情

- **端点地址**：`GET https://api.bilibili.com/x/space/bangumi/follow/list`
- **请求头**：
  - `User-Agent`：合规桌面浏览器 UA
  - `Referer`：`https://space.bilibili.com/`
  - `Cookie`：`SESSDATA=${sessdata};`（仅当追番列表设为私密且提供了环境变量时携带）

#### 查询参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `number` | 固定为 `1`（追番） |
| `follow_status` | `number` | 追番状态：`1` 想看 / `2` 在看 / `3` 看过 |
| `vmid` | `string` | 目标用户的 UID |
| `ps` | `number` | 每页数量（最大 50） |
| `pn` | `number` | 当前页码（从 1 开始） |

#### 接口响应与状态码

```json
{
  "code": 0,
  "message": "0",
  "ttl": 1,
  "data": {
    "list": [
      {
        "media_id": 28228367,
        "season_id": 34209,
        "title": "间谍过家家",
        "cover": "http://i0.hdslb.com/bfs/bangumi/image/....jpg",
        "total_count": 25,
        "progress": "看到第12话",
        "rating": {
          "score": 9.7
        },
        "evaluate": "为了潜入名校，西国能力最强的间谍...",
        "publish": {
          "pub_time": "2022-04-09 23:00:00"
        },
        "styles": ["搞笑", "日常", "漫画改"]
      }
    ],
    "total": 45
  }
}
```

- `code: 0`：请求成功
- `code: 53013` 或 `-401`：追番列表被用户设置为私密，需要提供合法的 `SESSDATA`

### 封面防盗链与加载策略

B 站图片服务器（`hdslb.com`）有 Referer 防盗链校验：请求头携带**外部站点 Referer** 时返回 403，但**不携带 Referer 时正常放行**。Shirone 的番剧卡片 `<img>` 标签内置了 `referrerpolicy="no-referrer"`，因此 `remote` 模式（直连远程直链）开箱即用，无需任何镜像或代理。

两种常用模式：

- **`local`（默认，推荐）**：同步脚本在构建机上把封面下载到 `public/assets/anime/covers/bili_{id}.webp`。
  - **体积优化**：经 B 站 CDN 的 `@220w_280h.webp` 参数压缩为轻量 WebP，加快首屏加载；
  - **零第三方依赖**：封面随站点一起发布，不受 B 站图床防盗链策略调整或网络波动影响，快照与图片完全自包含。
- **`remote`**：快照只存封面直链（自动升级 HTTPS，并附加 `@220w_280h.webp` 压缩参数），访客浏览器凭 `no-referrer` 实时加载。同步更快、仓库不进图片文件，但封面可用性依赖 B 站图床在线。

若访问 B 站图床较慢，`remote` 模式还支持 `cover.mirror` 镜像前缀——它**与完整封面 URL 直接拼接**，因此路径式反代（如 `https://your-proxy.com/`）与查询式图片代理（如 `https://wsrv.nl/?url=`）都可以使用。

---

## 视频嵌入门面（Video Facade）

在 Markdown 文章中插入 B 站视频时，Shirone 使用了轻量门面技术：

```markdown
::bilibili{bvid="BV1GJ411x7h7" part=1}
```

### 播放器参数

- **播放器地址**：`https://player.bilibili.com/player.html?bvid={bvid}&page={part}&as_wide=1&high_quality=1&danmaku=0`
- **按需加载**：初始状态仅渲染静态预览卡片与播放按钮（零外部脚本注入、零 Cookie 追踪）；用户点击播放后才动态创建 `iframe`。

## 常见问题

::: collapse
- 追番同步报错 `code: 53013`（权限不足）

  你在 B 站的「空间隐私设置」中将追番列表设为了「仅自己可见」。
  解决方式：在项目根目录 `.env`（或 CI 环境变量）中添加 `BILI_SESSDATA="你的SESSDATA"`。

  > [!CAUTION]
  > **凭据安全警报**
  > `SESSDATA` 拥有对应 B 站账号的完整会话权限。切勿将含有真实 Cookie 的 `.env` 文件提交至公开 Git 仓库或客户端前端包中。

- 同步命令执行方式

  ```bash
  pnpm anime:sync --provider bilibili
  ```
:::
