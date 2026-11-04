---
title: CLI 工具链
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/cli-workflows/
---

内容分离相关的 CLI 命令均在主题仓根目录下执行。日常本地写作通常只需运行 `content:watch`，排查配置或结构异常时使用 `content:status` 与 `content:validate`。

## 命令一览

| 命令 | 作用 | 是否修改文件 |
| --- | --- | --- |
| `pnpm content:sync` | 将内容仓同步至主题仓 | 是，写入 `src/content/` 等目录 |
| `pnpm content:watch` | 监听内容仓变动并自动增量同步 | 是 |
| `pnpm content:validate` | 检查目录结构与 YAML 字段类型 | 不写入 `src/`，远程源仍会更新 `.content-src/` |
| `pnpm content:status` | 输出当前内容源状态与 commit SHA | 否 |
| `pnpm content:export` | 将主题仓调试好的改动反向导出至内容仓 | 是，写入内容仓 |
| `pnpm content:clean` | 清理主题仓物化内容，恢复默认示例 | 是，默认会自动创建备份 |
| `pnpm content:eject` | 将单仓模式迁出为双仓结构 | 是，生成独立内容仓 |
| `pnpm anime:sync` | 下载追番列表与封面资源 | 是，写入本地数据快照 |

## 常用命令

### content:sync

```bash
pnpm content:sync
pnpm content:sync --dry-run   # 仅比对差异，不执行写入
```

读取配置的内容源，将文件复制到主题仓的标准映射目录，并将 `config/*.yaml` 编译输出为 `src/user/user-config.ts`。`pnpm dev` 与 `pnpm build` 在启动前均会自动执行此步骤。

支持参数：`--dry-run`、`--no-prune`、`--quiet`。

### content:watch

```bash
pnpm content:watch
```

监听本地内容仓目录变动，在保存文件时触发增量同步。通常需配合另一个终端中运行的 `pnpm dev` 协同使用。该命令仅对本地目录内容源有效。

### content:validate

```bash
pnpm content:validate
```

校验内容仓的目录层级、挂载冲突与 YAML 字段类型，功能等价于 `content:sync --dry-run`。

此命令**不校验文章 frontmatter**，文章元数据由 `astro sync` 或完整构建阶段进行类型检查。

若内容源为远程 Git 仓库，运行此命令依然会拉取并更新 `.content-src/` 工作副本，首次执行需要网络连接。它仅跳过对 `src/` 目录与配置桥接文件的写入。

官方校验工作流会依次执行两步：先运行 `content:validate`，再运行 `content:sync && astro sync`。排查文章元数据异常时，后一种组合能提供更完整的诊断信息。

### content:status

```bash
pnpm content:status
pnpm content:status --remote   # 额外向远端分支发起网络校验
```

输出当前内容源的解析诊断结果：

- 运行模式（`local` 或 `external`）；
- 本地内容仓路径或远程仓库地址；
- 解析并匹配到的 commit SHA；
- 已生效覆盖的配置文件清单与识别到的文章总数。

排查当前具体读取哪个仓库时优先运行该命令。默认处于离线检测状态，仅在传入 `--remote` 参数时才会访问远端。

## 其余命令

::: details 展开查看不常用的四条命令

### content:export

在主题仓临时调试并修改了配置后，可使用此命令将改动安全回写到内容仓：

```bash
pnpm content:export         # 预演模式，列出待导出的文件列表
pnpm content:export --yes   # 正式执行导出
```

导出时仅提取与主题默认值不同的差异字段，不会将全量默认值写死到 YAML 中，从而确保后续主题升级仍能继承新默认值。支持参数：`--config`、`--posts`、`--prune`、`--out`、`--force`。

这是一条本地开发命令，有以下限制：

::: warning 使用限制

- CI 环境中会拒绝执行；
- 内容源为 `git` 时同样拒绝——`.content-src/` 只是浅克隆工作副本，往里提交会丢失改动，需用 `--out` 指向一份真正的本地检出；
- 内容仓工作区不干净时拒绝执行；
- `nav-bar.yaml` 不会被自动导出。

:::

### content:clean

将主题仓还原为仅包含示例内容的纯净状态：

```bash
pnpm content:clean          # 预演模式，打印清理计划
pnpm content:clean --yes    # 正式执行，默认先备份至 .content-backup/clean-<时间戳>/
```

此命令仅清理主题仓中物化的副本文件，内容仓本身不受任何影响。若需还原，将备份目录中的文件复制回原路径即可。`--no-backup` 可跳过快照备份，通常不建议使用。

### content:eject

从单仓模式平滑迁移为双仓架构，操作说明详见[初始化内容仓](/guide/content-separation/init-repo/)。

```bash
pnpm content:eject                        # 预演模式
pnpm content:eject --yes                  # 正式执行，默认导出到 ../shirone-content
pnpm content:eject --yes --out ../my-content
```

### anime:sync

```bash
pnpm anime:sync --if-stale           # 快照未过期时跳过，构建流水线中使用
pnpm anime:sync                      # 强制全量刷新数据
pnpm anime:sync --provider bangumi   # 仅同步指定的数据源
```

快照缓存有效时长由 `config/anime.yaml` 中的 `snapshot.staleAfterDays` 字段控制，默认设定为 30 天。未配置任何有效数据源时，命令会正常退出，不会中断构建流程。详见[番剧页](/guide/pages/anime/)。

:::

## 清单文件

主题仓根目录下的 `shirone.content.json` 用于显式固化内容源与挂载映射。字段定义详见[内容源配置](/guide/content-separation/content-sources/#清单文件)，参考模板见代码仓中的 `shirone.content.example.json`。

## 下一步

[跨仓自动构建](/guide/content-separation/ci-dispatch/)：推送内容后自动触发主题仓构建与部署。
