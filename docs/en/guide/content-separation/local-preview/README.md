---
title: Local Preview & Debugging
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/local-preview/
---

Before pushing posts or config changes to remote, you can run a local development server to preview Markdown rendering and styling in real time.

---

## Prerequisites

Ensure you have both repositories available on your computer:
1. **Theme Code Repository** (e.g., `D:\Code\Shirone`);
2. **Personal Content Repository** (e.g., `D:\Code\my-blog-content`).

Install dependencies in the theme repository:
- Windows: `pnpm.cmd install`
- Linux / macOS: `pnpm install`

---

## Method 1: Single Sync Preview <Badge text="Fast" type="info" />

:::: steps
1. **Configure Path and Sync Content**

   Navigate to the **theme code repository** root and run:

   ::: tabs
   @tab Windows (PowerShell)
   ```powershell title="PowerShell"
   # 1. Set the absolute path of your content repository
   $env:CONTENT_DIR = "<your-content-repo-path>" # e.g. "D:\Code\my-blog-content"

   # 2. Run a single sync to materialize content
   pnpm.cmd content:sync

   # 3. Start local development server
   pnpm.cmd dev
   ```

   @tab Linux / macOS (Bash / Zsh)
   ```bash title="Bash"
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

2. **Start Local Development Server**

   Start development server in terminal:

   ![Terminal Server Output](/images/content-separation/01-quickstart/03-preview/02-local-preview-terminal.png)

3. **View in Browser**

   Once the terminal outputs the local URL:

   ```text title="Local Server"
     Local    http://localhost:4321/
   ```

   Open `http://localhost:4321/` in your browser to see your blog rendered from your private content repository:

   ![Browser Preview](/images/content-separation/01-quickstart/03-preview/03-local-preview-browser.png)
::::

---

## Method 2: Live Incremental Watch Mode <Badge text="Recommended" type="tip" />

When frequently drafting Markdown posts or tweaking YAML styles, running sync manually can be tedious.
Use ==live incremental watch mode=={.tip}:

::: steps
1. **Launch Development Server (Terminal 1)**

   ```powershell title="Terminal 1 (Dev Server)"
   $env:CONTENT_DIR = "<your-content-repo-path>" # e.g. "D:\Code\my-blog-content"
   pnpm.cmd dev
   ```

2. **Launch Incremental Watcher (Terminal 2)**

   ```powershell title="Terminal 2 (Content Watcher)"
   $env:CONTENT_DIR = "<your-content-repo-path>" # e.g. "D:\Code\my-blog-content"
   pnpm.cmd content:watch
   ```
:::

Whenever you save (`Ctrl + S`) a file in your external editor (such as Obsidian, VS Code, or Typora), changes will be synced incrementally in milliseconds and trigger browser ==hot module replacement=={.tip}.

> [!TIP] Simplify Environment Configuration
> Create a `.env` file in the root of your theme repository so you do not need to set `$env:CONTENT_DIR` manually each time:
>
> ```ini title=".env"
> CONTENT_DIR="<your-content-repo-path>" # e.g. "D:/Code/my-blog-content"
> ```

---

## FAQ

::: collapse
- How to stop local development?

  Press `Ctrl + C` in the respective terminal window to stop the dev server or watcher.

- Error: Path not found

  Verify that `CONTENT_DIR` points to a valid absolute path containing a standard `config/` or `content/` directory.

- External images not updating in browser

  Ensure images reside in `assets/` or `public/` in your content repository. For newly added files in deep subdirectories, run `pnpm content:sync` once to refresh indices.
:::

---

## Next Steps

- Head to [CLI Workflows & Toolchain](/en/guide/content-separation/cli-workflows/): Learn validation, status inspection, export, and clean commands
