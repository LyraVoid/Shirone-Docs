---
title: 本地预览与实时调试
createTime: 2026/09/01 10:00:00
permalink: /guide/content-separation/local-preview/
---

# 本地预览与实时调试

在将文章或配置推送到远端之前，你可以在本地启动开发服务器，实时查看 Markdown 排版与样式效果。

---

## 准备工作

确保电脑上已具备两个本地目录：
1. **主题代码仓库**（例如本地路径为 `D:\Code\Shirone`）；
2. **个人内容仓库**（例如本地路径为 `D:\Code\my-blog-content`）。

并在主题代码仓库目录下已经执行过依赖安装：
- Windows：`pnpm.cmd install`
- Linux / macOS：`pnpm install`

---

## 方式一：快速单次同步预览

### 1. 配置路径并启动

进入**主题代码仓库**根目录，依次执行：

::: tabs
@tab Windows (PowerShell)
```powershell
# 1. 设置内容仓库的本地路径（请替换为你电脑上的真实绝对路径）
$env:CONTENT_DIR = "D:\Code\my-blog-content"

# 2. 执行一次内容同步与配置合并
pnpm.cmd content:sync

# 3. 启动本地开发服务器
pnpm.cmd dev
```

@tab Linux / macOS (Bash / Zsh)
```bash
# 1. 设置内容仓库的本地路径
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"

# 2. 执行一次内容同步与配置合并
pnpm content:sync

# 3. 启动本地开发服务器
pnpm dev
```
:::

设置内容路径并执行同步：

![设置内容仓库路径与执行同步](/images/content-separation/01-quickstart/03-preview/01-local-preview-content.png)

启动开发服务器并在终端查看输出：

![终端启动开发服务器输出界面](/images/content-separation/01-quickstart/03-preview/02-local-preview-terminal.png)

### 2. 在浏览器中查看效果

终端输出本地访问地址后：

```text
  Local    http://localhost:4321/
```

在浏览器中打开 `http://localhost:4321/`，即可看到由你的私有内容仓库驱动的博客页面：

![本地浏览器预览博客效果](/images/content-separation/01-quickstart/03-preview/03-local-preview-browser.png)

---

## 方式二：双终端边写边看（实时增量监听）

如果你正在频繁撰写 Markdown 文章或调试 YAML 配置，反复手动执行同步命令较为繁琐。
你可以开启**实时增量监听模式**：

1. **终端窗口 1**（启动本地预览服务）：
   ```powershell
   $env:CONTENT_DIR = "D:\Code\my-blog-content"
   pnpm.cmd dev
   ```
2. **终端窗口 2**（启动实时增量监听）：
   ```powershell
   $env:CONTENT_DIR = "D:\Code\my-blog-content"
   pnpm.cmd content:watch
   ```

此时，只要你在外部编辑器（如 Obsidian、VS Code、Typora）中按 `Ctrl + S` 保存任何 Markdown 文件或修改 YAML 配置，监听器会自动捕获增量变更并同步至代码仓，触发浏览器的局部热重载，体验与单仓开发完全一致。

::: tip 简化环境变量配置
你也可以直接在主题代码仓根目录下新建 `.env` 文件，写入内容仓库路径，这样无需每次在终端手动设置环境变量：

```ini
# .env
CONTENT_DIR="D:/Code/my-blog-content"
```
:::

---

## 常见疑问排查

### 1. 如何退出本地开发？
在对应终端窗口中按下快捷键 `Ctrl + C` 即可停止开发服务器或监听器。

### 2. 报错提示找不到路径
请检查 `CONTENT_DIR` 的路径是否为有效的绝对路径，且该目录下包含合规的 `config/` 或 `content/` 文件夹。

### 3. 修改了外部图片但浏览器未更新
确保图片放置在内容仓的 `assets/` 或 `public/` 目录下。若属于深层嵌套目录中的新增文件，重新运行一次 `pnpm content:sync` 即可完成全量索引刷新。

---

## 下一步

- 前往 [CLI 命令行工具链](/guide/content-separation/cli-workflows/)：掌握预检、状态检查、反向导出与安全重置命令体系
