---
title: CLI Workflows
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/cli-workflows/
---

In a separated repository architecture, all content-related CLI commands are executed from the **root directory of your theme code repository**.

For everyday writing, you generally only need to remember one command: `pnpm content:watch`. The remaining commands handle configuration validation, data synchronization, and repository migration.

## Quick Reference Table

| Command | Primary Role | Modifies Files | Common Scenario |
| --- | --- | --- | --- |
| `pnpm content:watch` | Watches content changes and synchronizes in real time | Yes | Local writing and live preview |
| `pnpm content:sync` | Manually synchronizes content into the theme repo | Yes | Single-run manual sync or diff inspection |
| `pnpm content:validate` | Validates directory structure and YAML syntax | No (fetches temporary cache only) | Pre-push checks and CI pipelines |
| `pnpm content:status` | Outputs diagnostics for the active content source | No | Identifying active repository or branch |
| `pnpm anime:sync` | Synchronizes anime watch lists and cover assets | Yes | Initial anime page setup or data refresh |
| `pnpm content:clean` | Removes synchronized content and restores sample blog | Yes (creates automatic backup) | Resetting theme repo or testing clean state |
| `pnpm content:eject` | Migrates a single-repo blog to a dual-repo setup | Yes | Transitioning from single to dual repo |
| `pnpm content:export` | Exports modifications from the theme repo to content repo | Yes | Writing back local adjustments |

---

## Common Commands

### 1. content:watch (Real-Time Watcher)

The primary command for local writing:

```bash
pnpm content:watch
```

**How it works**: Continuously monitors the local content directory for file changes. Whenever you edit and save an article or a YAML configuration file in your editor, it automatically synchronizes the change to the theme repo.

**Recommended Workflow (Dual Terminal Windows)**:

When writing on your computer, keep two terminal tabs open:

1. **Terminal 1**: Run `pnpm dev` to start the Astro live preview server;
2. **Terminal 2**: Run `pnpm content:watch` to monitor content file changes.

Saving a file in your content repository triggers an immediate sync in Terminal 2, followed by Astro's hot module reload, displaying your updated layout in the browser within seconds.

::: tip Local directory sources only
`content:watch` operates exclusively with local content sources (configured with `CONTENT_DIR`). It does not monitor remote Git changes over the network.
:::

### 2. content:sync (Single-Run Sync)

Manually copies posts, assets, and configurations from the content source into the theme repository:

```bash
pnpm content:sync

# Preview mode: displays diffs without modifying files
pnpm content:sync --dry-run
```

**Execution steps**:

1. Identifies the content source (prefers `CONTENT_DIR`, then fetches `CONTENT_REPO_URL` to `.content-src/`);
2. Copies posts, assets, and data to theme target directories (`src/content/`, `src/data/`, etc.);
3. Parses `config/*.yaml` files and compiles `src/user/user-config.ts`;
4. Removes theme files that were deleted from the content repo (unless `--no-prune` is passed).

Both `pnpm dev` and `pnpm build` automatically run this synchronization step before starting.

### 3. content:validate (Format and Syntax Checking)

Checks for formatting and syntax errors before pushing commits:

```bash
pnpm content:validate
```

**Key features**:

- **Read-only validation**: Verifies directory structure, mount collisions, and YAML field types without modifying project files;
- **Remote cache update**: When pointing to a remote Git repo, this command updates the local `.content-src/` cache to validate against the newest commit;
- **CI pipeline integration**: Content repository GitHub Actions workflows include this check to intercept malformed configurations before deployment.

### 4. content:status (Content Source Diagnostics)

Inspects which content directory, branch, or commit is currently active:

```bash
pnpm content:status

# Query the remote repository for latest commits
pnpm content:status --remote
```

**Output details**:

- Active operation mode (`local` directory or `external` remote Git repository);
- Matched file path or Git remote URL;
- Checked-out commit SHA;
- Active configuration file count and detected article totals.

---

## Other Commands

The following commands are displayed openly without default folding for easy reading and searching:

### 5. anime:sync (Anime Data Synchronization)

When using the anime tracking page (`config/anime.yaml`), use this command to download watch list progress and cover art:

```bash
# Smart sync: skips fetch if local snapshot is still fresh (recommended for CI builds)
pnpm anime:sync --if-stale

# Force full re-download
pnpm anime:sync

# Synchronize a specific provider only
pnpm anime:sync --provider bangumi
pnpm anime:sync --provider bilibili
```

Snapshots default to a 30-day freshness window. When no accounts are configured, the command exits cleanly without halting site builds. See [Anime Page Settings](/en/guide/pages/anime/).

### 6. content:clean (Reset Theme Repository)

Removes synchronized post copies and data from the theme repo, returning it to clean sample content:

```bash
# Preview mode: displays files marked for cleanup
pnpm content:clean

# Apply cleanup
pnpm content:clean --yes
```

**Safety safeguards**:

- This command only cleans local copies inside the theme code repository; **it never modifies or deletes your content repository**;
- Before deletion, a backup snapshot is automatically created under `.content-backup/clean-<timestamp>/`. To restore, copy the backup files back into place.

### 7. content:eject (Eject Single-Repo to Dual-Repo)

Transitions a standard single-repo blog into an independent dual-repo architecture:

```bash
# Preview mode
pnpm content:eject

# Apply ejection (default destination: ../shirone-content)
pnpm content:eject --yes

# Eject to a custom directory path
pnpm content:eject --yes --out ../my-blog-content
```

Copies posts, images, page data, and configuration files into an initialized content repository directory. For detailed setup, see [Initializing Content Repositories](/en/guide/content-separation/init-repo/).

### 8. content:export (Write Back Theme Adjustments)

In rare local development scenarios where YAML adjustments were made directly inside the theme workspace, this command exports differences back to the content repo:

```bash
# Preview mode
pnpm content:export

# Apply export
pnpm content:export --yes
```

Extracts only modified delta fields to avoid hardcoding full default values. Requires a local directory content source with a clean git working tree.

---

## Next steps

- [Local Preview](/en/guide/content-separation/local-preview/): Start writing with the real-time watch workflow
- [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/): Learn how automated cloud workflows run sync commands
- [Configuration Overlays](/en/guide/content-separation/config-overlay/): Master YAML merging rules
