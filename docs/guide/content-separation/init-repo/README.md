---
title: 初始化私有内容仓库
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/init-repo/
---

# 初始化私有内容仓库

构建独立的内容仓库有两种途径：

- **方式一（推荐）：使用 `content:eject` 一键解耦迁出** <Badge text="推荐" type="tip" />：如果你已经克隆或分叉了主题代码仓库，一条命令即可将文章、相册、自定义页面数据与基础配置自动抽离为标准的内容仓库；
- **方式二：从官方模板仓库克隆初始化** <Badge text="从零建站" type="info" />：适合从零开始、直接以双仓形态建站的博主。

---

## 方式一：使用 content:eject 一键解耦迁出 <Badge text="官方推荐" type="tip" />

如果你已经在本地拥有主题代码仓库，使用主题内置的解耦向导是最便捷的初始化方式。

### 核心特性
- **全自动结构组装**：自动提取文章、动态、相册、数据实体，并生成合规的 `shirone.content.json` 清单与自动化触发工作流；
- **最小化配置安全导出**：仅导出 `site.yaml` 与 `profile.yaml` 等核心身份标识，==绝不硬编码主题默认值==，保障未来主题升级平滑；
- **代码仓安全防护**：自动在代码仓的 `.gitignore` 中追加忽略规则并安全取消 Git 跟踪，同时物理保留本地文件，本地开发预览完全不受影响；
- **自动绑定本地路径**：自动将代码仓的开发环境与迁出的外部目录建立本地关联。

> [!TIP] 零风险预演机制
> `pnpm.cmd content:eject` 在未携带 `--yes` 参数时处于 ==预演模式=={.secondary}，仅在控制台打印迁移计划，不会修改磁盘中的任何文件。

### 操作步骤

:::: steps
1. **在代码仓运行一键解耦命令**

   打开终端进入你的**主题代码仓库**根目录，运行解耦命令：

   ::: tabs
   @tab Windows (PowerShell)
   ```powershell title="PowerShell"
   # 1. 预演模式：查看即将迁出的文件清单（不修改磁盘文件）
   pnpm.cmd content:eject

   # 2. 确认无误后执行迁出（默认导出至上一级目录的 ../shirone-content）
   pnpm.cmd content:eject --yes // [!code highlight]

   # 也可以通过 --out 参数指定自定义导出路径：
   pnpm.cmd content:eject --yes --out "D:\\Code\\my-blog-content"
   ```

   @tab Linux / macOS (Bash)
   ```bash title="Bash"
   # 1. 预演模式：查看即将迁出的文件清单（不修改磁盘文件）
   pnpm content:eject

   # 2. 确认无误后执行迁出
   pnpm content:eject --yes // [!code highlight]

   # 自定义导出路径
   pnpm content:eject --yes --out "/Users/yourname/Code/my-blog-content"
   ```
   :::

2. **在 GitHub 上创建空白私有仓库**

   - 登录 GitHub 账号，点击右上角 **+** 号选择 **New repository**；
   - **Repository name**：建议命名为 `my-blog-content` 或 `shirone-content`；
   - **Visibility**：==务必勾选 Private（私有仓库）=={.error}；
   - **Initialize this repository with**：**不要勾选**任何初始化选项（保持完全空白）；
   - 点击底部的 **Create repository** 创建仓库。

   ![GitHub 新建私有仓库界面](/images/content-separation/01-quickstart/02-init/01-github-create-repo.png)

   > [!IMPORTANT] 必须勾选 Private
   > 为了确保你的草稿文章、相册原图和站点私密配置不被公网抓取，==仓库可见性必须选择 Private=={.error}。

3. **将导出的内容仓库推送到 GitHub**

   打开终端进入刚刚导出的内容仓库目录，执行 Git 初始化与推送：

   ```bash title="Git Push"
   # 1. 进入导出的外部内容目录
   cd ../shirone-content

   # 2. 初始化 Git 仓库并提交
   git init -b main
   git add .
   git commit -m "feat: 初始化博客私有内容仓库"

   # 3. 关联你的 GitHub 私有仓库地址并推送
   git remote add origin git@github.com:你的用户名/my-blog-content.git
   git push -u origin main
   ```
::::

至此，你的独立私有内容仓库已初始化完毕。

---

## 方式二：从官方模板仓库克隆初始化 <Badge text="从零建站" type="info" />

如果你希望从头开始建立一个全新的空白内容仓库，可以直接克隆官方模板仓库。

### 操作步骤

::: steps
1. **在 GitHub 上创建空白私有仓库**

   按照上述步骤在 GitHub 上创建一个空白的 ==Private 私有仓库==（保持完全空白，不勾选任何初始化选项）。

   ![GitHub 初始页面](/images/content-separation/01-quickstart/02-init/02-repo-initial-page.png)

2. **克隆官方内容模板到本地**

   在终端中运行：

   ```bash title="Git Clone"
   # 1. 克隆官方内容模板仓库
   git clone https://github.com/LyraVoid/Shirone-Content.git my-blog-content

   # 2. 进入克隆下来的目录
   cd my-blog-content
   ```

   ![终端运行克隆命令输出](/images/content-separation/01-quickstart/02-init/03-git-clone-output.png)

3. **将远程地址重定向为你自己的私有仓库**

   ```bash title="Git Remote"
   # 将远程仓库 origin 的地址更换为你第一步创建的私有仓库地址
   git remote set-url origin git@github.com:你的用户名/my-blog-content.git

   # 验证远程地址是否修改成功
   git remote -v
   ```

   ![个人仓库地址](/images/content-separation/01-quickstart/02-init/04-git-remote-output.png)

4. **推送首次提交到你的私有仓库**

   ```bash title="Git Push"
   # 将模板内容推送到你的私有仓库 main 分支
   git push -u origin main
   ```

   ![终端运行推送命令输出](/images/content-separation/01-quickstart/02-init/05-git-push-output.png)
:::

推送完成后，刷新 GitHub 页面即可看到完整的目录结构：

![GitHub 私有仓库最终页面](/images/content-separation/01-quickstart/02-init/06-repo-final-page.png)

---

## 内容仓库目录结构与映射关系

无论是通过一键解耦还是模板克隆创建的内容仓库，均遵循标准的目录映射规范：

```file-tree title="内容仓库标准结构与代码仓映射"
shirone-content/
├── .github/workflows/       # 自动化工作流定义
│   └── trigger-build.yml.example # 跨仓触发流水线模板
├── config/                  # 全站配置覆盖 YAML 文件群 -> 编译为 src/user/user-config.ts
│   ├── site.yaml            # 站点基本信息、色彩与横幅壁纸
│   ├── profile.yaml         # 博主头像、昵称与社交链接
│   └── footer.html          # 自定义页脚注入 HTML -> 映射至 src/config/FooterConfig.html
├── content/                 # 原创文章与生活动态 -> 映射至 src/content/
│   ├── posts/               # Markdown 与 MDX 博客长文
│   ├── moments/             # 动态生活说说
│   └── spec/                # 关于与自定义说明文案
├── data/                    # 结构化数据实体 -> 映射至 src/data/
│   ├── projects.ts          # 开源项目清单
│   ├── skills.ts            # 技能图谱
│   ├── devices.ts           # 硬件装备
│   ├── timeline.ts          # 大事记时间线
│   └── friends.ts           # 友情链接
├── assets/                  # 高清原始媒体 -> 映射至 src/assets/ (参与构建期压缩优化)
│   └── images/
├── public/                  # 静态多媒体资源 -> 映射至 public/ (原样发布不转码)
│   ├── images/
│   └── assets/
└── shirone.content.json     # 内容仓库元数据标识文件
```

### 映射与同步保护规则

1. **资源路径语义一致**：`assets/` 与 `public/` 保持了标准相对路径映射，在 Markdown 或配置中引用图片时路径写法无需额外转换；
2. **配置安全编译**：`config/` 目录下的 YAML 文件在同步时会自动提取并编译为带完整类型约束的 TypeScript 模块，防止格式错误；
3. **系统目录跳过**：内容仓中的 `.git/`、`.github/`、`.vscode/`、`scripts/` 以及 `README.md` 等辅助文件不会被同步到主题代码仓；
4. **派生资源隔离保护**：说说缩略图缓存、番剧封面缓存与中文字体子集抽取产物受系统保护，==不会被误删或覆盖=={.tip}。

---

## 下一步

- 前往 [本地预览与实时调试](/guide/content-separation/local-preview/)：在本地启动双仓开发服务器，体验边写边看实时重载
