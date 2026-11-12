---
title: 番剧页
createTime: 2026/09/01 00:24:00
permalink: /guide/pages/anime/
---

番剧页（`/anime/`）用于展示个人追番与追剧记录，支持三种方式：本地手写数据（默认）、同步 Bangumi 追番、同步 Bilibili 追番。**数据同步与页面展示完全分离**：外部追番数据仅在执行 `pnpm anime:sync` 命令时才会下载到本地；访客浏览页面或日常打包网站时，绝不会向第三方平台发起网络请求。

::: tip 内容分离模式（双仓架构）必读
若你使用的是双仓架构（主题代码仓 + 独立内容仓），追番配置存放在**内容仓库**的 `config/anime.yaml`（手写数据对应 `data/anime.ts`）。

修改配置后，**必须先执行 `pnpm anime:sync --if-stale && pnpm build` 把追番数据拉到本地并重新打包**，博客上才会显示你自己的追番记录。详细操作见下文[内容分离与番剧同步流程](#内容分离与番剧同步流程)。
:::

## 数据源模式

::: tabs
@tab 单仓模式 (TS)
```ts title="src/config/animeConfig.ts"
export const animeConfig = withUserConfig("anime", {
  enable: true,          // 控制页面是否开启，不发起外部网络连接
  source: {
    kind: "local",       // "local" 手写数据 | "snapshot" 平台同步
    // provider: "bangumi",
    // file: "bangumi.json",
    // fetchOnDev: true,
  },
  fallback: {
    kind: "local",       // 同步数据缺失或解析失败时，回退到本地手写数据
  },
  providers: {
    bangumi: { enable: false, userId: "" },
    bilibili: { enable: false, vmid: "" },
  },
})
```
@tab 内容分离双仓模式 (YAML)
```yaml title="config/anime.yaml"
# 页面总开关
enable: true

# 数据源方式：local (读取 data/anime.ts) 或 snapshot (读取平台同步数据)
source:
  kind: "local"
  # provider: "bangumi"
  # file: "bangumi.json"
  # fetchOnDev: true

# 降级策略（本地缓存不存在或抓取失败时）
fallback:
  kind: "local"

# 外部账号配置
providers:
  bangumi:
    enable: false
    userId: ""
  bilibili:
    enable: false
    vmid: ""
    sessdataEnv: "BILI_SESSDATA"
```
:::

| 模式 | 数据来源 | 说明 |
| --- | --- | --- |
| `local` | `src/data/anime.ts`（双仓为 `data/anime.ts`） | 默认方式。完全离线手写，零网络依赖，最稳定 |
| `snapshot` | `src/data/anime-snapshots/` 下的本地 JSON | 通过命令提前下载到本地的追番数据，构建时直接读取 |

---

## 方式 A：本地手写数据（默认）

直接编辑 `src/data/anime.ts`（双仓架构下编辑内容仓的 `data/anime.ts`），适合不想绑定第三方平台账号的用户。

---

## 方式 B：同步 Bangumi 追番

::: steps

1. 在配置文件中填入你的 Bangumi 数字 UID 或用户名，并将 `enable` 设为 `true`：

   ::: tabs
   @tab 内容分离模式 (config/anime.yaml)
   ```yaml title="config/anime.yaml"
   source:
     kind: "snapshot"
     provider: "bangumi"

   providers:
     bangumi:
       enable: true
       userId: "sai"   # 你的 Bangumi 数字 UID 或公开用户名
       cover:
         mode: "remote"  # 封面：remote 远程直链（默认）| local 下载到本地 | none
       request:
         pageSize: 50
         maxItems: 300
         minDelayMs: 200
   ```
   @tab 单仓模式 (animeConfig.ts)
   ```ts title="src/config/animeConfig.ts"
   source: { kind: "snapshot", provider: "bangumi" },
   providers: {
     bangumi: {
       enable: true,
       userId: "sai",   // 你的 Bangumi UID
       cover: { mode: "remote" },
       request: { pageSize: 50, maxItems: 300, minDelayMs: 200 },
     },
   }
   ```
   :::

2. 执行同步与打包命令：

   ```bash
   pnpm anime:sync --provider bangumi
   pnpm build
   ```

3. 构建完成后，番剧页将自动展示 Bangumi 的追番列表。

:::

---

## 方式 C：同步 Bilibili 追番

::: steps

1. 填入 B 站公开 UID 并启用：

   ::: tabs
   @tab 内容分离模式 (config/anime.yaml)
   ```yaml title="config/anime.yaml"
   source:
     kind: "snapshot"
     provider: "bilibili"

   providers:
     bilibili:
       enable: true
       vmid: "12345678"     # 你的 B 站数字 UID
       sessdataEnv: "BILI_SESSDATA"
       cover:
         mode: "local"
         useWebp: true
       request:
         pageSize: 30
         maxItems: 300
         minDelayMs: 300
   ```
   @tab 单仓模式 (animeConfig.ts)
   ```ts title="src/config/animeConfig.ts"
   source: { kind: "snapshot", provider: "bilibili" },
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
   :::

2. **追番列表若设置为私密**，需在 `.env`（本地）或部署平台环境变量（云端）中填入登录凭据：

   ```text title=".env"
   BILI_SESSDATA="your_sessdata"
   ```

   > [!IMPORTANT] 凭据安全说明
   > 登录凭证仅在运行同步脚本时用于请求个人追番接口，绝不会被打包进网页前端代码，也严禁提交到公开 Git 仓库。

3. 执行同步与打包：

   ```bash
   pnpm anime:sync --provider bilibili
   pnpm build
   ```

:::

---

## 内容分离与番剧同步流程

在双仓（内容分离）架构下，许多博主容易遇到一个问题：**“为什么在内容仓修改了 `config/anime.yaml`，博客重新打包后依然是默认的演示番剧？”**

这是因为把追番记录放到博客上分成了两步：
1. **同步配置**：把内容仓里的 `config/anime.yaml` 同步到主题代码仓；
2. **下载数据**：运行抓取命令，从 B 站或 Bangumi 把你的追番记录（以及配置为本地化的封面图片）下载到本地。

单纯修改 YAML 文件并不会自动联网抓取数据。必须执行同步命令把数据拉到本地，再打包网站，页面才会更新为你自己的追番列表。

### 推荐命令：一键拉取并打包

```bash
# 检查数据是否过期，按需下载番剧数据并完整打包网站
pnpm anime:sync --if-stale && pnpm build
```

这一行命令的完整执行流程如下：
1. `pnpm anime:sync --if-stale`：
   - 检查本地是否已有追番缓存文件；
   - **`--if-stale` 缓存判断**：如果本地缓存还在有效期内（默认 30 天，可在配置中通过 `snapshot.staleAfterDays` 调整），就会**直接跳过网络请求**正常退出，避免频繁打包被 B 站或 Bangumi 限制访问；如果本地没有缓存或数据已过期，才会联网下载最新的追番列表（以及配置为 `cover.mode: "local"` 的封面图片）；
   - 如果没有配置任何账号，命令会自动跳过，不影响打包流程。
2. `&& pnpm build`：
   - 自动把内容仓的最新文章和配置文件同步到代码仓；
   - 编译静态网页，生成搜索索引，完成全站打包。

### 常用 CLI 同步命令速查

| 指令 | 作用说明 | 适用场景 |
| :--- | :--- | :--- |
| `pnpm anime:sync --if-stale && pnpm build` | **推荐**。缓存过期时自动拉取，随后打包网站 | GitHub Actions 等云端部署、本地一键发布 |
| `pnpm anime:sync` | 强制联网拉取所有已启用平台的追番数据 | 第一次配置追番、手动强制刷新数据 |
| `pnpm anime:sync --if-stale` | 仅在缓存过期（超过 30 天）或缺失时拉取 | 本地预览前检查数据 |
| `pnpm anime:sync --provider bangumi` | 仅强制同步 Bangumi 数据（封面按 `cover.mode` 处理） | 单独调试 Bangumi |
| `pnpm anime:sync --provider bilibili` | 仅强制同步 Bilibili 数据（默认含封面下载） | 单独调试 B 站与封面下载 |
| `pnpm anime:sync --provider all` | 强制同步所有支持的平台 | 多平台合并检查 |

---

## 封面加载策略（本地下载与防盗链处理）

两个平台的封面都通过 `cover.mode` 配置，可选 `local`（下载到本地）、`remote`（直接使用外链）、`none`（不显示封面）。**默认值不同**：

| 平台 | 默认模式 | 原因 |
| :--- | :--- | :--- |
| Bilibili | `local` | B 站图床（hdslb.com）的防盗链可由 Shirone 内置的 `no-referrer` 绕过（`remote` 亦可用），但本地化还能获得 WebP 体积压缩与零第三方依赖，更稳 |
| Bangumi | `remote` | bgm.tv 图床没有防盗链，直链可以正常显示；需要时再改为 `local` |

```yaml title="config/anime.yaml"
providers:
  bilibili:
    cover:
      mode: "local"   # "local" 下载到本地静态目录（推荐）| "remote" 直接使用外链 | "none" 不显示
      useWebp: true   # B 站图床支持服务端 WebP 压缩参数
  bangumi:
    cover:
      mode: "remote"  # "remote" 远程直链（默认）| "local" 下载到本地静态目录 | "none" 不显示
      # mirror: "https://your-proxy.example.com"  # remote 模式可选镜像前缀
```

使用 `local` 模式时，脚本会把封面图片下载到本地 `public/assets/anime/covers/`（文件名分别为 `bili_{ID}` 与 `bgm_{条目ID}` 前缀），随网站静态产物一起发布。封面从此不依赖第三方图床的防盗链策略与网络状况；B 站封面还会自动压缩为更省流量的 WebP 格式（Bangumi 图床不支持服务端转换，按原始格式保存）。下载失败时会自动退回远程直链，封面不会缺位。

使用 `remote` 模式时，快照里只保存图片链接，访客打开页面时浏览器实时加载（Shirone 的封面 `<img>` 自带 `no-referrer`，可绕过 B 站图床的防盗链）。此时页面能否显示封面取决于图床当时是否可达，若追求完全不依赖第三方，请使用 `local`。

---

## 降级回退策略

```yaml title="config/anime.yaml"
fallback:
  kind: "local"       # "local" 自动回退到本地手写数据 | "empty" 显示空状态
```

当同步数据不存在或网络下载失败时，页面会自动回退到 `data/anime.ts` 中的本地手写数据，保证页面正常打开，不会报错白屏。

---

## 常见问题排查

::: collapse
- 在内容仓配置了 `anime.yaml`，为什么页面没变化？

  修改 YAML 只是保存了账号配置，并不会自动触发网络请求。必须在代码仓运行一次 `pnpm anime:sync --if-stale && pnpm build`（本地预览可先运行 `pnpm anime:sync` 再运行 `pnpm dev`），把追番数据下载到本地。

- 为什么要加 `--if-stale` 参数？

  B 站等平台对频繁抓取接口有访问频率限制。`--if-stale` 会根据配置的过期天数（默认 30 天）判断是否需要重新下载。数据未过期时直接跳过，既保护账号安全，又能加快打包速度。

- 追番数据同步失败怎么排查？

  1. 检查网络连接（部分海外服务器可能访问国内接口较慢）；
  2. 确认账号 ID 是否正确（B 站是纯数字 UID，Bangumi 可以是数字 UID 或用户名）；
  3. B 站私密追番列表必须配置 `BILI_SESSDATA` 环境变量；
  4. 如果被平台临时限制访问，可在配置中调大 `request.minDelayMs`（如改为 500 或 1000 毫秒）。

- 同步下来的数据可以手动修改吗？

  可以。下载好的数据保存在 `src/data/anime-snapshots/<provider>.json`，是格式化好的纯 JSON 文件，可以临时手动修改。但下次如果不带 `--if-stale` 重新同步，手改的内容会被覆盖。如果想长期手动维护，建议将 `source.kind` 设为 `local` 并直接编辑 `data/anime.ts`。
:::
