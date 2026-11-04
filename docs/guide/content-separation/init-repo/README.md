---
title: 初始化内容仓
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/init-repo/
---

内容仓可以自行创建，也可以基于官方模板初始化。两种方式生成的结构完全相同，区别在于起点不同。

| 方式 | 适合场景 | 是否保留现有文章 |
| --- | --- | --- |
| `content:eject` 一键迁出 | 已在主题仓中编写过文章 | 是，文章和配置一并迁出 |
| 克隆官方模板 | 全新开始搭建博客 | 否，仅包含示例内容 |

## 方式一：从主题仓迁出

在**主题仓根目录**执行。先运行预演命令，确认计划无误后再正式执行：

```bash
pnpm content:eject          # 打印执行计划，不修改任何文件
pnpm content:eject --yes    # 默认导出到 ../shirone-content
```

::: warning 执行前先提交改动
`content:eject` 会修改 `.gitignore` 和 Git 索引。工作区存在未提交改动时，命令将拒绝执行。请先提交或暂存改动，再运行命令。
:::

需要指定导出目录时，添加 `--out` 参数：

```bash
pnpm content:eject --yes --out ../my-blog-content
```

Windows PowerShell 环境下请将 `pnpm` 替换为 `pnpm.cmd`。

迁出命令会执行以下五项操作：

1. 复制 `src/content/`、`src/data/`、`src/assets/` 与 `public/` 到目标目录；
2. 根据当前站点配置生成 `config/site.yaml`、`config/profile.yaml` 与 `footer.html`，其余配置领域保持默认；
3. 在主题仓根目录生成 `shirone.content.json`，将内容源指向目标目录；
4. 在主题仓的 `.gitignore` 中追加忽略规则，并取消这些文件的 Git 跟踪，本地文件完整保留；
5. 在内容仓中生成 `shirone.content.json`、README 与 `.github/workflows/trigger-build.yml`。

完成后在主题仓提交本次改动：

```bash
git add -A
git commit -m "chore: 迁移为双仓模式"
```

> 本地文件未被删除，运行 `pnpm dev` 依然可以正常预览。区别仅在于这些文件不再由主题仓跟踪管理。

### 推送到 GitHub

1. 在 GitHub 上新建一个**空白私有仓库**，不要勾选创建 README、`.gitignore` 或 License。
2. 进入迁出的内容目录，完成初始化并推送到远端：

```bash
cd ../shirone-content
git init -b main
git add .
git commit -m "chore: 初始化内容仓"
git remote add origin git@github.com:你的用户名/my-blog-content.git
git push -u origin main
```

![GitHub 新建私有仓库界面](/images/content-separation/01-quickstart/02-init/01-github-create-repo.png)

仓库属性必须设置为 Private。公开仓库会导致草稿、相册原图和站点配置对外暴露。

## 方式二：从官方模板开始

1. 在 GitHub 上新建一个空白私有仓库。
2. 克隆官方模板，并将远程仓库地址修改为您自己的仓库：

```bash
git clone https://github.com/LyraVoid/Shirone-Content.git my-blog-content
cd my-blog-content
git remote set-url origin git@github.com:你的用户名/my-blog-content.git
git remote -v
git push -u origin main
```

模板内置示例文章、图片资源与完整的配置文件，后续可以按需替换。

## 内容仓目录与映射

```file-tree title="内容仓结构与主题仓的对应关系"
shirone-content/
├── config/                  # 站点配置，编译为 src/user/user-config.ts
│   ├── site.yaml            # 站点名称、域名、主题色、横幅
│   ├── profile.yaml         # 头像、昵称、社交链接
│   ├── nav-bar.yaml         # 顶部导航
│   ├── sidebar.yaml         # 侧栏布局与组件
│   └── ...                  # 其余配置文件见配置覆盖页
├── content/                 # 文章与页面文案，映射到 src/content/
│   ├── posts/               # 博客文章
│   ├── moments/             # 说说
│   ├── series/              # 系列
│   └── spec/                # 关于页、友链页文案
├── data/                    # 结构化数据，映射到 src/data/
│   ├── projects.ts          # 项目
│   ├── friends.ts           # 友链
│   ├── skills.ts            # 技能
│   └── ...
├── assets/                  # 参与压缩的图片，映射到 src/assets/
│   └── images/
├── public/                  # 原样发布的文件，映射到 public/
│   ├── images/
│   └── assets/
└── shirone.content.json     # 内容仓元数据（主题不会读取它）
```

注意事项：

- `assets/` 目录可以完全删除，删除后站点将回退使用主题自带图片。若保留该目录，必须放齐正在引用的图片（横幅、头像、封面等），只留空占位文件会导致图片加载失败。
- 内容仓根目录的 `shirone.content.json` 仅记录仓库自身元数据，**不参与构建**。真正决定内容源的是主题仓根目录的同名文件，详见[内容源配置](/guide/content-separation/content-sources/#清单文件)。
- `docs/`、`.github/`、`.vscode/` 与 `scripts/` 不会同步到主题仓，放置在内容仓中不会影响构建。

## 验证

在主题仓执行：

```bash
pnpm content:status
```

输出信息会显示当前内容源类型、路径或 Git 地址，以及解析到的 commit SHA。显示 `external` 表明内容仓已正确连接；显示 `local` 则表示仍在读取主题仓自带内容。

随后执行一次同步命令：

```bash
pnpm content:sync
```

终端会输出同步的文件数量和内容 commit SHA。

## 下一步

[本地预览与调试](/guide/content-separation/local-preview/)：确认文章能正常渲染显示，再开展日常写作。
