---
title: Automated Build and Deployment Workflows
createTime: 2026/09/01 04:00:00
permalink: /en/guide/development/workflows/
---

If you use dual-repo mode (one repo for theme code, another for articles) or want GitHub to build and publish your site automatically on code push, you will use GitHub Actions workflows.

The entire automated publishing process relies on three workflow files:

1. **`deploy.yml.example`** (in the theme repo): Pulls articles, installs dependencies, builds static pages, and copies output files to your server;
2. **`trigger-build.yml.example`** (in the content repo): Notifies the theme repo to start building when you push new posts;
3. **`content-validate.yml`** (in the theme repo): Checks article and configuration formatting before building starts.

::: info Note
The theme code repository also includes a `ci.yml` file used for automated testing when developing theme code. Routine writing and site deployment do not require it.
:::

---

## 1. Automated Build and Deployment: `deploy.yml.example`

Located at `.github/workflows/deploy.yml.example` in the theme repository, copy and rename it to `.github/workflows/deploy.yml` (removing `.example`) to enable it.

### Complete File Content

```yaml title=".github/workflows/deploy.yml.example"
name: Deploy

on:
  # Triggers when code updates (documentation edits excluded)
  push:
    branches: [main]
    paths-ignore:
      - "docs/**"
      - "rules/**"
      - "*.md"
  # Triggers on notification from the content repository
  repository_dispatch:
    types: [content-updated]
  # Allows manual triggers via GitHub web UI
  workflow_dispatch:
    inputs:
      content_ref:
        description: "Content commit SHA or ref (leave empty for main)"
        required: false
        default: ""
  # Runs once daily to avoid missing updates
  schedule:
    - cron: "17 4 * * *"

# Runs only one build task at a time; new pushes cancel older running tasks
concurrency:
  group: deploy
  cancel-in-progress: true

permissions:
  contents: read

env:
  CONTENT_REPOSITORY: OWNER/shirone-content
  CONTENT_WORKING_COPY: .content-src

jobs:
  deploy:
    name: Build and deploy
    runs-on: ubuntu-latest
    timeout-minutes: 20
    env:
      CI: true
      CONTENT_DIR: .content-src

    steps:
      # Identify the content commit version to pull
      - name: Resolve content ref
        id: target
        env:
          PAYLOAD_SHA: ${{ github.event.client_payload.sha }}
          INPUT_REF: ${{ github.event.inputs.content_ref }}
        run: |
          set -euo pipefail
          ref="${PAYLOAD_SHA:-}"
          [ -n "$ref" ] || ref="${INPUT_REF:-}"
          [ -n "$ref" ] || ref="main"
          echo "ref=$ref" >> "$GITHUB_OUTPUT"

      # Download theme code
      - name: Checkout theme
        uses: actions/checkout@v4

      # Download content posts
      - name: Checkout content
        uses: actions/checkout@v4
        with:
          repository: ${{ env.CONTENT_REPOSITORY }}
          ref: ${{ steps.target.outputs.ref }}
          path: ${{ env.CONTENT_WORKING_COPY }}
          token: ${{ secrets.CONTENT_REPO_TOKEN }}
          persist-credentials: false

      # Record content commit version
      - name: Record content commit
        id: content
        run: |
          set -euo pipefail
          echo "sha=$(git -C '${{ env.CONTENT_WORKING_COPY }}' rev-parse HEAD)" >> "$GITHUB_OUTPUT"

      # Install Node.js and pnpm
      - name: Set up pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: false

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 26.13.0
          cache: pnpm
          cache-dependency-path: pnpm-lock.yaml

      # Cache existing image thumbnails to avoid redundant processing
      - name: Restore build caches
        uses: actions/cache@v4
        with:
          path: public/assets/moments/thumbnails
          key: ${{ runner.os }}-shirone-thumbnails-${{ hashFiles('pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-shirone-thumbnails-

      # Install dependencies
      - name: Install dependencies
        run: pnpm install --frozen-lockfile --prefer-offline

      # Copy content and configurations into theme directory
      - name: Materialize content and config
        run: pnpm content:sync

      # Build static web pages into dist/ directory
      - name: Build site
        run: pnpm build

      # Synchronize dist/ web files to server
      - name: Deploy to server
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          DEPLOY_DIR: /var/www/shirone
        run: |
          set -euo pipefail
          mkdir -p ~/.ssh && chmod 700 ~/.ssh
          printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H "$DEPLOY_HOST" >> ~/.ssh/known_hosts
          rsync -az --delete -e "ssh -i ~/.ssh/deploy_key" \
            dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR/dist/"

      # Display summary on GitHub UI
      - name: Summarize
        if: always()
        run: |
          set -euo pipefail
          {
            echo "### Shirone deploy"
            echo "- Content repo: \`${CONTENT_REPOSITORY}\`"
            echo "- Content ref: \`${{ steps.target.outputs.ref }}\`"
            echo "- Content commit: \`${{ steps.content.outputs.sha }}\`"
          } >> "$GITHUB_STEP_SUMMARY"
```

### Core Steps Explanation

- **Trigger conditions (`on`)**: Covers four events. Triggers when theme code updates, when the content repo pushes posts, during daily scheduled runs, or on manual web UI clicks;
- **Avoid conflicts (`concurrency`)**: When multiple updates are pushed in rapid succession, older runs are canceled so only the newest content builds;
- **Download content (`Checkout content`)**: Downloads posts and configurations into a temporary folder using the passed commit version ID;
- **Reuse thumbnails (`Restore build caches`)**: Photo compression is time-consuming; generated thumbnails are cached so new posts do not trigger re-compressing existing photos;
- **Sync files (`pnpm content:sync`)**: Places downloaded articles, assets, and configurations into corresponding theme paths;
- **Build site (`pnpm build`)**: Compiles Markdown posts and styles into final HTML pages inside `dist/`;
- **Sync to server (`rsync`)**: Connects to your server, uploading only modified files and removing outdated files.

---

## 2. Notify Build After Content Update: `trigger-build.yml.example`

Located at `.github/workflows/trigger-build.yml.example` in the content repository, rename it to `trigger-build.yml` in your content repo.

Its role is simple: after pushing articles to the content repo, verify formatting first, then notify the code repo to build.

### Complete File Content

```yaml title=".github/workflows/trigger-build.yml.example"
name: Trigger Theme Build

on:
  push:
    branches:
      - main
    # Triggers only when posts, configs, data, or images change
    paths:
      - "content/**"
      - "config/**"
      - "data/**"
      - "assets/**"
      - "public/**"
      - "shirone.content.json"
  workflow_dispatch: {}

# Keeps only the newest task if pushed multiple times in short succession
concurrency:
  group: trigger-build
  cancel-in-progress: true

jobs:
  # Step 1: Check format of posts and configs
  validate:
    uses: LyraVoid/Shirone/.github/workflows/content-validate.yml@main
    with:
      theme_repository: LyraVoid/Shirone
      theme_ref: main

  # Step 2: Notify theme code repository to build once checks pass
  dispatch:
    needs: validate
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      # Option 1: Send dispatch event to theme repository
      - name: Dispatch build event to theme repository
        env:
          DISPATCH_TOKEN: ${{ secrets.DISPATCH_TOKEN }}
        if: ${{ env.DISPATCH_TOKEN != '' }}
        uses: peter-evans/repository-dispatch@v4
        with:
          token: ${{ env.DISPATCH_TOKEN }}
          repository: LyraVoid/Shirone
          event-type: content-updated
          # Send the commit version ID to ensure accurate build content
          client-payload: '{"sha": "${{ github.sha }}"}'

      # Option 2: Trigger platform deploy hooks (skipped if secret is unset)
      - name: Trigger Cloudflare Pages deploy hook
        env:
          CLOUDFLARE_DEPLOY_HOOK: ${{ secrets.CLOUDFLARE_DEPLOY_HOOK }}
        if: ${{ env.CLOUDFLARE_DEPLOY_HOOK != '' }}
        run: |
          curl -s -S -X POST "${{ env.CLOUDFLARE_DEPLOY_HOOK }}"

      - name: Trigger Vercel deploy hook
        env:
          VERCEL_DEPLOY_HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK }}
        if: ${{ env.VERCEL_DEPLOY_HOOK != '' }}
        run: |
          curl -s -S -X POST "${{ env.VERCEL_DEPLOY_HOOK }}"
```

### Core Steps Explanation

- **Ignore unrelated edits (`paths`)**: If you only edit `README.md` in the content repo, the workflow will not run;
- **Validate before building (`needs: validate`)**: If an article frontmatter or YAML file has syntax errors, Step 1 halts with an error, preventing broken pages from being published;
- **Notify theme repo (Option 1)**: Transmits the commit version ID to the theme code repository so it pulls the exact new posts;
- **Trigger platform directly (Option 2)**: Calls hosting platform deploy hooks directly if using platform builds.

::: tip Deploy Hooks Note
Besides notifying theme repo Actions, you can trigger deploy hooks if you host your site on Cloudflare Pages, Vercel, EdgeOne, or Netlify.

The platform then pulls your content and builds the site on its own machines. For detailed setup steps, see [Deployment Hooks](/en/guide/content-separation/deploy-hooks/).
:::

---

## 3. Article Format Check: `content-validate.yml`

Located at `.github/workflows/content-validate.yml` in the theme repository.

This file does not run manually; it is called automatically by `trigger-build.yml` in Step 1.

### Execution Code

```yaml title=".github/workflows/content-validate.yml"
name: Validate content

on:
  workflow_call:
    inputs:
      theme_repository:
        description: "Theme repository path, e.g. OWNER/REPO"
        type: string
        required: true
      theme_ref:
        description: "Theme branch"
        type: string
        required: false
        default: main
    secrets:
      theme_token:
        description: "Token for private theme repositories"
        required: false

jobs:
  validate:
    name: Schema and structure
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      # Download content repo files
      - name: Checkout content
        uses: actions/checkout@v4
        with:
          path: content

      # Download theme code
      - name: Checkout theme
        uses: actions/checkout@v4
        with:
          repository: ${{ inputs.theme_repository }}
          ref: ${{ inputs.theme_ref }}
          path: theme
          token: ${{ secrets.theme_token || github.token }}

      - uses: pnpm/action-setup@v4
        with:
          package_json_file: theme/package.json
          run_install: false

      - uses: actions/setup-node@v4
        with:
          node-version: 26.13.0
          cache: pnpm
          cache-dependency-path: theme/pnpm-lock.yaml

      - run: pnpm install --frozen-lockfile --prefer-offline
        working-directory: theme

      # Check 1: Verify directory structure and config/*.yaml syntax
      - name: Validate content structure and config
        working-directory: theme
        env:
          CONTENT_DIR: ${{ github.workspace }}/content
        run: pnpm content:validate

      # Check 2: Verify post frontmatter fields like title, date, category
      - name: Validate frontmatter schemas
        working-directory: theme
        env:
          CONTENT_DIR: ${{ github.workspace }}/content
        run: |
          set -euo pipefail
          pnpm content:sync
          pnpm exec astro sync
```

### What Gets Checked

- **Configuration checks (`pnpm content:validate`)**: Checks files in `config/` and points out typos in configuration keys;
- **Article frontmatter checks (`astro sync`)**: Checks title, category, tag, and date formatting at the top of each article to prevent build errors.

---

## Next Steps

- [Server Deployment](/en/guide/deploy/server/): Learn how to synchronize built pages to your server with GitHub Actions
- [Cross-Repo CI Guide](/en/guide/content-separation/ci-dispatch/): Learn token setup steps between two repositories
- [Deployment Hooks](/en/guide/content-separation/deploy-hooks/): Learn how to trigger hosting platforms directly
- [Deployment Overview](/en/guide/deploy/overview/): Compare hosting on Vercel, Cloudflare, and other platforms
