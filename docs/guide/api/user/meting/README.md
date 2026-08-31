---
title: Meting API
createTime: 2026/09/01 01:00:00
permalink: /guide/api/user/meting/
---

Meting API 是一个通用的音乐元数据聚合接口，Shirone 的侧栏音乐播放器通过它支持从网易云音乐、QQ 音乐等主流平台按需解析歌单、专辑或单曲。

在 Shirone 中，Meting API 的调用由 `src/utils/music/meting.ts` 处理，支持在纯云端模式（`meting`）或混合模式（`mixed`）下无缝工作。

## 配置方式

在 `src/config/musicConfig.ts` 中配置 Meting 数据源：

```ts title="src/config/musicConfig.ts"
export const musicConfig = withUserConfig("music", {
  enable: true,
  provider: "mixed", // "local" | "meting" | "custom" | "mixed"
  meting: {
    server: "netease", // 音乐平台
    type: "playlist",  // 资源类型
    id: "14164869977", // 资源 ID
    // api: "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r", // 可选自定义 API
  },
  defaultVolume: 0.7,
  defaultMode: "sequence",
})
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `server` | `MetingServer` | `"netease"` | 音乐平台源：`netease`、`tencent`、`kugou`、`xiami`、`baidu` |
| `type` | `MetingType` | `"playlist"` | 资源类型：`playlist`（歌单）、`song`（单曲）、`album`（专辑）、`artist`（艺术家） |
| `id` | `string` | `""` | 对应平台的资源 ID（歌单 ID、歌曲 ID 等） |
| `api` | `string` | *(默认公共接口)* | 自定义 Meting API 模板地址（留空使用默认公共 API） |

## API 模板与参数

Meting 请求通过 URL 模板动态替换参数生成：

```text
{api_base_url}?server=:server&type=:type&id=:id&auth=:auth&r=:r
```

- `:server`：平台标识（如 `netease`、`tencent`）
- `:type`：资源类型（如 `playlist`、`song`）
- `:id`：资源唯一 ID
- `:auth`：认证参数（大部分公共 API 为空）
- `:r`：时间戳随机数（防止浏览器 GET 缓存）

### 默认公共 API

Shirone 内置的默认 API 端点为：

```text
https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r
```

::: tip 建议自建 API
公共公益 API 可能会因网络波动、IP 频控或服务维护出现暂时不可用。为获得最稳定的体验，推荐自行部署 Meting API 服务。
:::

## 响应数据结构

Meting API 请求成功后返回 JSON 数组，包含歌曲列表元数据：

```json
[
  {
    "id": 1827600686,
    "name": "歌曲名称",
    "artist": "歌手名",
    "url": "https://.../audio.mp3",
    "pic": "https://.../cover.jpg",
    "lrc": "https://.../lyric.lrc",
    "duration": 248000
  }
]
```

### Shirone 的数据清洗与归一化

Shirone 会在客户端对 Meting API 返回的原始数据进行严格清洗 (`parseMetingSong`)：

1. **ID 唯一性规范**：转换为 `meting-${server}-${id}` 格式，避免多平台或本地曲目 ID 冲突。
2. **时长单位转换**：若返回的 `duration` 大于 10000（毫秒），自动换算为秒（`Math.floor(duration / 1000)`）。
3. **曲目去重**：自动过滤具有重复 ID 的曲目。
4. **属性冻结**：输出为只读不可变的 `TrackDescriptor` 对象。

## 工作模式与容灾

### 混合模式 (`mixed`，推荐)

- **首屏秒开**：优先加载本地 `src/data/music.ts` 中的曲目，保证页面挂载即可立刻播放。
- **后台异步扩容**：后台无感发起 Meting API 请求，成功后将云端歌单合并到播放列表中。
- **静默降级**：若网络超时或 API 返回异常，自动保留本地曲目，绝不阻断播放器渲染或报错崩溃。

### 纯云端模式 (`meting`)

- 完全依赖 Meting API 返回的曲目列表。
- 适合不想在本地代码库中维护任何音频文件的场景。

## 自建 Meting API

你可以使用开源项目（如 [Meting-API](https://github.com/injahow/meting-api)）轻松搭建自己的接口：

::: tabs
@tab Vercel 一键部署
1. Fork [injahow/meting-api](https://github.com/injahow/meting-api) 仓库。
2. 导入到 Vercel 完成部署，获取分配的域名 `https://your-meting.vercel.app`。
3. 在 `musicConfig.ts` 中配置：
   ```ts
   meting: {
     api: "https://your-meting.vercel.app/api?server=:server&type=:type&id=:id&r=:r",
   }
   ```

@tab Docker 部署
```bash
docker run -d --name meting-api -p 3000:3000 injahow/meting-api
```
在站点中配置反代地址即可。
:::

## 常见问题

**网易云/QQ 音乐部分歌曲无法播放**

受音乐平台版权限制（VIP 歌曲、付费无损、地区限制），API 可能无法解析真实音频 URL 或只返回试听片段。建议歌单尽量选取非 VIP 免费曲目，或在本地维护一份重要曲目的兜底。

**如何获取网易云歌单 ID**

在网页版网易云音乐打开你的歌单页面，URL 形如 `https://music.163.com/#/playlist?id=14164869977`，其中的数字即为 `id`。

**出现跨域（CORS）报错**

若自建 API，请确保服务器响应头包含 `Access-Control-Allow-Origin: *`。默认内置的公共 API 已开启 CORS 支持。
