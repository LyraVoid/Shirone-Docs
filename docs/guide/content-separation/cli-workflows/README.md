---
title: CLI 命令行工具链
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/cli-workflows/
---

# CLI 命令行工具链

Shirone 提供了一整套专为内容分离架构打造的 CLI 工具链。无论是外部编辑器中的日常写作、配置修改后的 ==零写盘预检=={.tip}，还是不同仓库之间的双向同步与安全重置，均可通过简单指令一键完成。

---

## 核心命令总览速查

| 指令 | 核心功能定位 | 典型使用时机 | 磁盘写入行为 |
| :--- | :--- | :--- | :--- |
| `pnpm content:sync` <Badge text="高频" type="tip" /> | 单次全量或增量同步 | 本地预览前拉取内容，或持续集成构建中物化 | 增量写入代码仓临时副本 |
| `pnpm content:watch` <Badge text="高频" type="tip" /> | 实时增量监听 | 在外部编辑器边写边看实时预览 | 保存时自动增量写入 |
| `pnpm content:validate` <Badge text="安全预检" type="info" /> | 内存安全预检 | 改完 YAML 快速排查语法与字段拼写 | ==纯内存类型校验，零磁盘写入=={.tip} |
| `pnpm content:status` <Badge text="状态检查" type="info" /> | 状态与差异检查 | 检查内容源连接、分支、Commit SHA 与修改项 | 纯只读检查 |
| `pnpm content:export` <Badge text="反向导出" type="warning" /> | 差异反向导出 | 将代码仓调试好的 YAML 配置抽离回外部内容仓 | 写入外部内容仓库 |
| `pnpm content:clean` <Badge text="带备份重置" type="warning" /> | 安全重置与清理 | 还原代码仓至干净演示状态（自动创建快照备份） | 清理代码仓临时副本 |
| `pnpm content:eject` <Badge text="一次性迁出" type="tip" /> | 一键解耦迁出 | 从默认单仓模式一键升级为独立内容仓库 | 生成独立内容仓库 |

---

## 1. 单次内容同步：`content:sync` <Badge text="核心" type="tip" />

```bash title="content:sync"
# 1. 增量同步（仅复制或拉取修改过的文件，速度极快）
pnpm content:sync

# 2. 全量强制同步（重新覆盖所有文章、相册与数据文件）
pnpm content:sync --clean-temp
```

### 适用场景
- 本地启动开发服务器前，拉取外部内容仓的数据；
- GitHub Actions、Cloudflare Pages 等云端构建脚本中物化内容。

### 核心机制
- **自动检测内容源**：优先检测本地环境变量 `CONTENT_DIR`，若未设置则拉取 `CONTENT_REPO_URL` 指向的远程 Git 仓库；
- **智能增量比对**：根据文件 mtime 或 Git commit 仅同步增量文件，避免无效的磁盘 I/O；
- **配置自动编译**：自动将 YAML 文件解析并转换为带类型约束的 `src/user/user-config.ts` 桥接文件。

---

## 2. 实时增量监听：`content:watch` <Badge text="推荐写作使用" type="tip" />

```bash title="content:watch"
pnpm content:watch
```

### 适用场景
使用 Obsidian、VS Code 或 Typora 独立打开外部内容仓库进行写作，配合本地 `pnpm dev` 享受边写边看的热重载体验。

### 核心机制
- 采用毫秒级防抖监听机制，只同步发生变化的文件；
- 修改任何 `config/*.yaml` 时，自动重新生成 TypeScript 配置桥接文件并触发热重载；
- 需配合另一个终端窗口中运行的 `pnpm dev` 共同使用。

---

## 3. 内存安全预检：`content:validate` <Badge text="零磁盘写入" type="info" />

```bash title="content:validate"
pnpm content:validate
```

### 适用场景
刚修改完某个 `config/*.yaml` 配置文件或文章元数据，不想启动耗时的本地开发服务器，也不希望写入任何磁盘文件，只想快速确认字段拼写与格式是否正确。

### 核心机制
- **纯内存校验**：在内存中完成 YAML 解析、模式比对与 TypeScript 诊断；
- **零磁盘写入**：==绝不向磁盘写入任何临时文件=={.tip}；
- **智能纠错提示**：若字段拼写错误，终端会高亮输出行号并给出正确的建议字段。

> [!TIP] 推荐在提交 Git 前运行
> 在向内容仓推送 Commit 前执行一次 `pnpm content:validate`，可以提前拦截所有 YAML 格式与字段拼写错误。

---

## 4. 状态与差异检查：`content:status`

```bash title="content:status"
pnpm content:status

# 或检查远端 Git 仓库连接与最新版本：
pnpm content:status --remote
```

### 适用场景
长时间未操作或切换了分支，想确认当前本地绑定的是哪个内容仓库、远程连接是否通畅、是否有未同步的文件或配置覆盖项。

### 检查输出
- 当前生效的 `CONTENT_DIR` 或 `CONTENT_REPO_URL`；
- 当前已覆盖的配置文件清单与纯内容文章总数；
- 远端仓库的最新 Commit SHA 与本地缓存副本的新旧状态。

---

## 5. 差异反向导出：`content:export`

```bash title="content:export"
pnpm content:export          # 预演：仅输出将要导出的文件清单
pnpm content:export --yes    # 实际执行导出
```

### 适用场景
在主题代码仓的本地开发环境中临时调试了某些配置或样式，希望将这些修改反向沉淀回外部的内容仓库。

### 核心机制
- **最小化覆盖导出**：仅导出相对于主题默认配置发生过修改的键值，==绝不将主题默认值硬编码写死在 YAML 中==；
- **保护未来升级**：未修改的项不会被导出，未来主题新增特性时，内容仓能继续平滑继承最新默认值。

---

## 6. 安全清理与重置：`content:clean`

```bash title="content:clean"
pnpm content:clean          # 预演：打印清理计划
pnpm content:clean --yes    # 实际执行清理
```

### 适用场景
想将主题代码仓恢复到干净的纯初始演示状态，或者排除因本地临时测试产生的残留脏数据。

### 安全保护与自动备份
- **强制快照备份**：实际执行删除前，系统会自动将当前的本地内容打包归档到 `.content-backup/clean-<时间戳>/` 目录下；
- **重置代码仓**：清除代码仓内同步的内容副本，并将内置演示文章与默认配置恢复就位；
- **真实内容完好无损**：此命令仅清理代码仓本地的临时副本，外部内容仓数据不受影响。

> [!NOTE] 还原快照备份
> 若需还原清理前的工作区状态，直接运行对应系统的复制命令：
>
> ::: tabs
> @tab Windows (PowerShell)
> ```powershell
> Copy-Item -Recurse -Force .\.content-backup\clean-<时间戳>\* .
> ```
> @tab Linux / macOS (Bash)
> ```bash
> cp -a .content-backup/clean-<时间戳>/. .
> ```
> :::

---

## 7. 一键解耦迁移向导：`content:eject`

```bash title="content:eject"
pnpm content:eject          # 预演：打印迁移计划与生成清单
pnpm content:eject --yes    # 实际执行迁移（默认导出到 ../shirone-content）
pnpm content:eject --yes --out ..\my-content  # 指定自定义导出路径
```

---

## 清单文件与环境变量配置

### 清单文件：`shirone.content.json`

位于代码仓根目录的可选配置文件：

```json title="shirone.content.json"
{
  "schemaVersion": 1,
  "source": {
    "type": "path",
    "path": "../shirone-content"
  },
  "mounts": {
    "content": "src/content",
    "data": "src/data",
    "assets": "src/assets",
    "public": "public"
  },
  "keep": ["src/data/my-special-data.ts"],
  "prune": true
}
```

| 字段 | 说明 |
| :--- | :--- |
| `schemaVersion` | 清单结构版本，默认为 `1` |
| `source.type` | 内容源类型：`"path"`（本地目录）或 `"git"`（远端仓库） |
| `source.path` | 本地内容目录路径（相对代码仓根目录解析） |
| `source.url` / `source.ref` | 远端 Git 仓库地址与目标分支/Tag/Commit SHA（默认为 `main`） |
| `mounts` | 自定义挂载映射表（可按需关闭或重定向某个挂载点） |
| `keep` | 受保护的文件白名单列表（支持通配符 `*` 与 `**`） |
| `prune` | 设为 `false` 时仅执行增量拷贝，不删除已不存在的文件 |

### 环境变量优先级

系统配置优先级为：==进程环境变量 > .env.local > .env > shirone.content.json==。

| 环境变量 | 作用与说明 |
| :--- | :--- |
| `CONTENT_DIR` | 本地内容仓库路径 |
| `CONTENT_REPO_URL` | 远端 Git 内容仓库地址 |
| `CONTENT_REPO_REF` | 指定内容仓分支、标签或 Commit SHA（默认为 `main`） |
| `SHIRONE_CONTENT_SYNC` | 设为 `0` 或 `false` 时可强制关闭同步，临时回到单仓模式 |
| `CONTENT_SYNC_PULL` | 设为 `false` 时离线复用已存在的本地临时缓存副本，不主动联网拉取 |

::: details 展开查看高级参数与调试选项 (CLI Flags)
- `--dry-run`：所有具有修改行为的命令均支持此选项，仅打印执行计划而不写入磁盘；
- `--verbose`：在终端输出每个文件的比对耗时与 MD5 / mtime 详细校验过程；
- `--force`：跳过冲突检查强制执行同步或覆盖；
- `--json`：以 JSON 格式输出状态与校验结果，方便第三方 CI 工具解析。
:::

---

## 下一步

- 前往 [配置覆盖核心原理](/guide/content-separation/config-overlay/)：深入了解最小化覆盖原则、对象合并与数组替换规则
