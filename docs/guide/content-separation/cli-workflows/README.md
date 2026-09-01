---
title: CLI 命令行工具链
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/cli-workflows/
---

# CLI 命令行工具链

Shirone 提供了一整套专为内容分离架构打造的 CLI 工具链。无论是外部编辑器中的日常写作、配置修改后的零写盘预检，还是不同仓库之间的双向同步与安全重置，均可通过简单指令一键完成。

---

## 核心命令总览速查

| 指令 | 核心功能定位 | 典型使用时机 | 磁盘写入行为 |
| :--- | :--- | :--- | :--- |
| `pnpm content:sync` | 单次全量或增量同步 | 本地预览前拉取内容，或持续集成构建中物化 | 增量写入代码仓临时副本 |
| `pnpm content:watch` | 实时增量监听 | 在外部编辑器边写边看实时预览 | 保存时自动增量写入 |
| `pnpm content:validate` | 内存安全预检 | 改完 YAML 快速排查语法与字段拼写 | 纯内存类型校验，零磁盘写入 |
| `pnpm content:status` | 状态与差异检查 | 检查内容源连接、分支版本与覆盖统计 | 只读检查 |
| `pnpm content:export` | 差异反向导出 | 将本地修改过的配置最小化导出到内容仓 | 写入内容仓 YAML |
| `pnpm content:clean` | 安全重置与清理 | 清理代码仓临时副本并恢复初始演示状态 | 还原代码仓，自动备份快照 |
| `pnpm content:eject` | 一键解耦迁移向导 | 将单仓模式抽离为独立的私有内容仓 | 导出完整内容结构 |

> 提示：在 Windows PowerShell 终端中，建议使用 `pnpm.cmd <命令>` 执行。

---

## 1. 单次与增量同步：`content:sync`

```bash
pnpm content:sync
```

### 执行逻辑与保护规则
- **增量物化**：采用“文件大小 + 修改时间戳”进行智能比对，内容未修改的文件跳过写入，重复执行耗时接近 0 秒；
- **配置编译**：将内容仓 `config/*.yaml` 提取编译为带类型约束的 `src/user/user-config.ts`；
- **派生资源隔离**：说说缩略图、番剧封面快照与中文字体子集产物受到严格保护，不会被覆盖或删除。

---

## 2. 实时增量监听：`content:watch`

```bash
pnpm content:watch
```

### 适用场景
在 Obsidian、VS Code 或 Typora 等外部编辑器中撰写文章或调整 YAML 配置，希望在保存文件时，本地浏览器自动刷新并呈现最新效果。

### 核心机制
- 内部采用防抖监听机制，只同步发生变化的文件；
- 修改任何 `config/*.yaml` 时，自动重新生成 TypeScript 配置桥接文件并触发热重载；
- 需配合另一个终端窗口中运行的 `pnpm dev` 共同使用。

---

## 3. 内存安全预检：`content:validate`

```bash
pnpm content:validate
```

### 适用场景
刚修改完某个 `config/*.yaml` 配置文件或文章元数据，不想启动耗时的本地开发服务器，也不希望写入任何磁盘文件，只想快速确认字段拼写与格式是否正确。

### 核心机制
- **纯内存校验**：在内存中完成 YAML 解析、模式比对与 TypeScript 诊断；
- **零磁盘写入**：不会向代码仓或内容仓写入任何临时文件；
- **智能纠错提示**：若字段拼写错误，终端会高亮输出行号并给出正确的建议字段。

---

## 4. 状态与差异检查：`content:status`

```bash
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

```bash
pnpm content:export          # 预演：仅输出将要导出的文件清单
pnpm content:export --yes    # 实际执行导出
```

### 适用场景
在主题代码仓的本地开发环境中临时调试了某些配置或样式，希望将这些修改反向沉淀回外部的内容仓库。

### 核心机制
- **最小化覆盖导出**：仅导出相对于主题默认配置发生过修改的键值，绝不将主题的默认值硬编码写死在 YAML 中；
- **保护未来升级**：未修改的项不会被导出，未来主题新增特性时，内容仓能继续平滑继承最新默认值。

---

## 6. 安全清理与重置：`content:clean`

```bash
pnpm content:clean          # 预演：打印清理计划
pnpm content:clean --yes    # 实际执行清理
```

### 适用场景
想将主题代码仓恢复到干净的纯初始演示状态，或者排除因本地临时测试产生的残留脏数据。

### 安全保护与自动备份
- **强制快照备份**：实际执行删除前，系统会自动将当前的本地内容打包归档到 `.content-backup/clean-<时间戳>/` 目录下；
- **重置代码仓**：清除代码仓内同步的内容副本，并将内置演示文章与默认配置恢复就位；
- **真实内容完好无损**：此命令仅清理代码仓本地的临时副本，外部内容仓数据不受影响。

若需还原清理前的工作区状态，直接运行对应系统的复制命令：

::: tabs
@tab Windows (PowerShell)
```powershell
Copy-Item -Recurse -Force .\.content-backup\clean-<时间戳>\* .
```
@tab Linux / macOS (Bash)
```bash
cp -a .content-backup/clean-<时间戳>/. .
```
:::

---

## 7. 一键解耦迁移向导：`content:eject`

```bash
pnpm content:eject          # 预演：打印迁移计划与生成清单
pnpm content:eject --yes    # 实际执行迁移（默认导出到 ../shirone-content）
pnpm content:eject --yes --out ..\my-content  # 指定自定义导出路径
```

### 适用场景
原先以单仓库模式运行博客的用户，希望一键将现有的文章、相册、自定义页面数据和配置文件抽离出来，初始化为一个崭新、独立的双仓内容仓库（通常只需执行一次）。

---

## 清单文件与环境变量配置

### 清单文件：`shirone.content.json`

位于代码仓根目录的可选配置文件：

```json
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

系统配置优先级为：`进程环境变量` > `.env.local` > `.env` > `shirone.content.json`。

| 环境变量 | 作用与说明 |
| :--- | :--- |
| `CONTENT_DIR` | 本地内容仓库路径 |
| `CONTENT_REPO_URL` | 远端 Git 内容仓库地址 |
| `CONTENT_REPO_REF` | 指定内容仓分支、标签或 Commit SHA（默认为 `main`） |
| `SHIRONE_CONTENT_SYNC` | 设为 `0` 或 `false` 时可强制关闭同步，临时回到单仓模式 |
| `CONTENT_SYNC_PULL` | 设为 `false` 时离线复用已存在的本地临时缓存副本，不主动联网拉取 |

---

## 下一步

- 前往 [配置覆盖核心原理](/guide/content-separation/config-overlay/)：深入了解最小化覆盖原则、对象合并与数组替换规则
