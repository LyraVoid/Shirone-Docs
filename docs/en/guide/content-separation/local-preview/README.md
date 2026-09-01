---
title: Local Preview & Debugging
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/local-preview/
---

# Local Preview & Debugging

Before pushing articles or configurations to production, you can launch a local development server to preview typography and styling in real-time.

---

## Prerequisites

Ensure you have both repositories available on your computer:
1. **Theme Code Repository** (e.g., `D:\Code\Shirone`);
2. **Personal Content Repository** (e.g., `D:\Code\my-blog-content`).

Install dependencies in the theme repository:
- Windows: `pnpm.cmd install`
- Linux / macOS: `pnpm install`

---

## Method 1: Single Sync Preview

### 1. Configure Path and Start Server

Navigate to the **theme code repository** root and run:

::: tabs
@tab Windows (PowerShell)
```powershell
# 1. Set the absolute path of your content repository
$env:CONTENT_DIR = "D:\Code\my-blog-content"

# 2. Run a single sync to materialize content
pnpm.cmd content:sync

# 3. Start local development server
pnpm.cmd dev
```

@tab Linux / macOS (Bash / Zsh)
```bash
# 1. Set the path of your content repository
export CONTENT_DIR="/Users/yourname/Code/my-blog-content"

# 2. Run a single sync
pnpm content:sync

# 3. Start development server
pnpm dev
```
:::

Set content path and execute sync:

![Set Content Path and Run Sync](/images/content-separation/01-quickstart/03-preview/01-local-preview-content.png)

Start development server in terminal:

![Terminal Server Output](/images/content-separation/01-quickstart/03-preview/02-local-preview-terminal.png)

### 2. View in Browser

Once the terminal outputs the local URL:

```text
  Local    http://localhost:4321/
```

Open `http://localhost:4321/` in your browser to see your blog rendered from your private content repository:

![Browser Preview](/images/content-separation/01-quickstart/03-preview/03-local-preview-browser.png)

---

## Method 2: Live Incremental Watch Mode

When frequently drafting Markdown posts or tweaking YAML styles, running sync manually can be tedious.
Use **live incremental watch mode**:

1. **Terminal 1** (Development server):
   ```powershell
   $env:CONTENT_DIR = "D:\Code\my-blog-content"
   pnpm.cmd dev
   ```
2. **Terminal 2** (Incremental watcher):
   ```powershell
   $env:CONTENT_DIR = "D:\Code\my-blog-content"
   pnpm.cmd content:watch
   ```

Whenever you save (`Ctrl + S`) a file in your external editor (such as Obsidian, VS Code, or Typora), changes will be synced incrementally in milliseconds and trigger browser hot module replacement.

::: tip Simplify Environment Configuration
Create a `.env` file in the root of your theme repository so you do not need to set `$env:CONTENT_DIR` manually each time:

```ini
# .env
CONTENT_DIR="D:/Code/my-blog-content"
```
:::

---

## Next Steps

- Head to [CLI Workflows & Toolchain](/en/guide/content-separation/cli-workflows/): Learn validation, status inspection, export, and clean commands
