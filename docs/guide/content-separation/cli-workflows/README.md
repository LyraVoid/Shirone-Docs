---
title: CLI 工具链
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/cli-workflows/
---

在双仓分离架构下，所有内容分离相关的 CLI 命令均在**主题代码仓库根目录**下执行。

对于日常博客写作，通常只需要记住一条监听命令：`pnpm content:watch`。其他命令主要用于配置排查、数据同步或架构迁移。

## 命令速查表

| 命令 | 核心作用 | 是否修改文件 | 常用场景 |
| --- | --- | --- | --- |
| `pnpm content:watch` | 监听内容仓变动并自动实时同步 | 是 | 本地写作与实时预览 |
| `pnpm content:sync` | 手动将内容仓同步至主题代码仓 | 是 | 单次手动同步或查看同步差异 |
| `pnpm content:validate` | 检查内容目录规范与 YAML 配置语法 | 否（仅拉取临时源） | 推送代码前的语法检查与 CI 校验 |
| `pnpm content:status` | 输出当前使用的主题与内容源诊断信息 | 否 | 排查读取了哪个仓库或分支 |
| `pnpm anime:sync` | 同步追番列表（B 站封面默认下载到本地，Bangumi 封面默认远程直链） | 是 | 番剧页面初次配置或数据更新 |
| `pnpm content:clean` | 清理已同步的内容，还原为示例博客 | 是（自动创建备份） | 重置主题仓或切换测试内容 |
| `pnpm content:eject` | 将单仓模式迁出为独立的双仓结构 | 是 | 从单仓平滑迁移至双仓架构 |
| `pnpm content:export` | 将主题仓调试的改动反向同步回内容仓 | 是 | 本地调试后的临时改动回写 |

---

## 常用命令

### 1. content:watch（实时监听）

这是本地写作最常用的命令：

```bash
pnpm content:watch
```

**工作机制**：该命令会持续监听本地内容仓库的文件夹变动。当你在本地编辑器中修改并保存文章或 YAML 配置文件时，它会自动将变动增量同步到主题仓。

**推荐用法（双终端协作）**：

在个人电脑上写作时，建议开启两个终端窗口协同工作：

1. **终端 1**：运行 `pnpm dev` 启动博客本地预览服务器；
2. **终端 2**：运行 `pnpm content:watch` 实时监听内容仓。

你在内容仓保存文件后，终端 2 会立刻完成同步，Astro 开发服务器随即自动热重载，几秒内即可在浏览器中看到排版效果。

::: tip 仅对本地内容源生效
`content:watch` 专用于本地目录内容源（即配置了 `CONTENT_DIR` 的场景）。如果你配置的是远程 Git 地址，命令无法监听远端网页变动。
:::

### 2. content:sync（单次同步）

手动将内容仓的所有文章、图片与配置文件复制到主题代码仓：

```bash
pnpm content:sync

# 预演模式：仅打印比对差异，不执行实际写入
pnpm content:sync --dry-run
```

**工作流程**：

1. 读取内容源配置（优先读取 `CONTENT_DIR`，其次拉取 `CONTENT_REPO_URL` 到 `.content-src/`）；
2. 将文章、资源与数据复制到主题仓的对应目录（`src/content/`、`src/data/` 等）；
3. 读取 `config/*.yaml` 配置文件，编译生成 `src/user/user-config.ts`；
4. 自动移除主题仓中已在内容仓删除的废弃旧文件（除非使用了 `--no-prune` 参数）。

`pnpm dev` 与 `pnpm build` 在启动前都会自动执行该命令，通常无需在打包脚本中重复手动调用。

### 3. content:validate（格式与语法校验）

用于在正式推送前检查内容仓库是否存在语法错误：

```bash
pnpm content:validate
```

**主要特点**：

- **只读校验**：该命令会在不改动项目实际文件的前提下运行，核对目录层级是否正确、文件挂载是否存在冲突、YAML 字段名及数据类型是否符合规范；
- **远程拉取机制**：如果内容源为远程 Git 仓库，运行该命令依然会连接网络更新 `.content-src/` 临时目录，以保证按最新代码进行检查；
- **工作流集成**：内容仓库的 GitHub Actions 工作流内置了该命令。如果某篇 YAML 配置拼错了字段，工作流会在这一步拦截报错，避免把错误配置发布上线。

### 4. content:status（内容源状态诊断）

当你不确定博客当前读取的是哪个本地目录、哪个远程分支或某次 commit 时，使用此命令进行诊断：

```bash
pnpm content:status

# 额外向远程仓库发起网络核验
pnpm content:status --remote
```

**输出信息包括**：

- 当前运行模式（`local` 本地目录 或 `external` 远程仓库）；
- 当前匹配的具体文件路径或 Git 远程 URL；
- 当前检出的 commit SHA 提交版本号；
- 当前生效的配置文件数量与识别到的文章总数。

---

## 其余命令

### 5. anime:sync（番剧数据同步）

当你在内容仓中启用了番剧追踪页（配置了 `config/anime.yaml`）后，使用此命令下载追番进度快照。封面处理由 `cover.mode` 决定：B 站默认 `local`（下载海报到本地），Bangumi 默认 `remote`（快照存远程链接）：

```bash
# 智能同步：若本地快照未过期则跳过（推荐在构建流程中使用）
pnpm anime:sync --if-stale

# 强制全量重新下载
pnpm anime:sync

# 仅同步指定平台的数据
pnpm anime:sync --provider bangumi
pnpm anime:sync --provider bilibili
```

快照默认保质期为 30 天。若未配置任何有效账号，命令会安全退出，不会阻断整个站点的打包流程。详细配置请参阅[番剧页配置](/guide/pages/anime/)。

### 6. content:clean（清理并重置主题仓）

用于将主题代码仓中由同步生成的文章与数据副本清理干净，还原为最初的示例博客：

```bash
# 预演模式：打印待清理的文件列表
pnpm content:clean

# 正式执行清理
pnpm content:clean --yes
```

**安全机制**：

- 该命令仅清理主题代码仓中的生成副本，**绝不会影响或删除你的独立内容仓库**；
- 执行清理前，系统会自动在主题仓根目录下生成快照备份（存放在 `.content-backup/clean-<时间戳>/` 中）。如果不小心误操作，只需把备份目录里的文件拷回原位即可。

### 7. content:eject（单仓迁出为双仓）

用于从传统单仓模式平滑分离出独立的内容仓库：

```bash
# 预演模式：查看待迁出的文件列表
pnpm content:eject

# 正式执行迁出（默认导出到上级目录 ../shirone-content）
pnpm content:eject --yes

# 导出到自定义指定路径
pnpm content:eject --yes --out ../my-blog-content
```

迁出命令会自动复制所有文章、静态图片、独立页面数据及配置文件，并自动生成内容仓所需的初始文件。完整迁移教学见[初始化内容仓](/guide/content-separation/init-repo/)。

### 8. content:export（反向导出改动）

在少数本地开发场景下，如果你直接在主题代码仓中调试并修改了某些 YAML 字段，希望把修改回写到内容仓：

```bash
# 预演模式
pnpm content:export

# 确认导出
pnpm content:export --yes
```

该命令仅提取你修改过的差异项写回内容仓，不会把全量默认配置写死。注意该命令仅适用于本地目录内容源，且内容仓不能有未提交的未跟踪改动。

---

## 下一步

- [本地预览与实时调试](/guide/content-separation/local-preview/)：快速上手 `watch` 监听工作流
- [跨仓自动构建](/guide/content-separation/ci-dispatch/)：了解 GitHub Actions 如何在云端调用同步命令
- [配置覆盖规则](/guide/content-separation/config-overlay/)：深入了解 YAML 配置字段的合并机制
