---
title: CLI Workflows & Toolchain
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/cli-workflows/
---

# CLI Workflows & Toolchain

Shirone provides a dedicated suite of CLI commands engineered for content separation. From external drafting to ==zero-disk memory validation=={.tip}, and bi-directional synchronization to safe snapshot resets, everything is executable via intuitive commands.

---

## CLI Command Quick Reference

| Command | Purpose | Typical Use Case | Disk Mutation |
| :--- | :--- | :--- | :--- |
| `pnpm content:sync` <Badge text="Frequent" type="tip" /> | Single full or incremental sync | Pre-preview sync or CI build content materialization | Writes to theme workspace |
| `pnpm content:watch` <Badge text="Frequent" type="tip" /> | Live incremental file watcher | External editor drafting with live browser preview | Auto writes on file save |
| `pnpm content:validate` <Badge text="Safety Check" type="info" /> | In-memory schema & type validation | Fast syntax and typo diagnosis after editing YAML | ==In-memory check, zero disk writes=={.tip} |
| `pnpm content:status` <Badge text="Inspection" type="info" /> | Repository and diff inspection | Check content source, branch, commit SHA, and uncommitted diffs | Read-only inspection |
| `pnpm content:export` <Badge text="Export" type="warning" /> | Reverse config export | Export modified YAML settings back into content repository | Writes to content repo |
| `pnpm content:clean` <Badge text="Snapshot Reset" type="warning" /> | Clean reset with auto backup | Restore clean theme workspace with automatic snapshot backup | Cleans local cache |
| `pnpm content:eject` <Badge text="One-Time Eject" type="tip" /> | One-click decoupling eject | Upgrade monolithic repository to decoupled dual repositories | Generates standalone repo |

---

## 1. Single Sync: `content:sync` <Badge text="Core" type="tip" />

```bash title="content:sync"
# 1. Incremental sync (fast incremental copy based on mtime)
pnpm content:sync

# 2. Full clean sync (re-materialize all posts, albums, and configs)
pnpm content:sync --clean-temp // [!code highlight]
```

### Key Mechanics
- **Automatic Content Source Detection**: Checks `CONTENT_DIR` first, falling back to `CONTENT_REPO_URL` for remote Git cloning;
- **Smart Incremental Diffing**: Only copies changed files to eliminate unnecessary disk I/O;
- **Automated Config Compilation**: Compiles YAML files into typed `src/user/user-config.ts` bridge module.

---

## 2. Live Watch Mode: `content:watch` <Badge text="Recommended for Writing" type="tip" />

```bash title="content:watch"
pnpm content:watch
```

### Key Mechanics
- Millisecond-level debounced watcher syncing only modified files;
- Modifying any `config/*.yaml` automatically recompiles TypeScript bridge and triggers ==hot module replacement=={.tip};
- Pairs with `pnpm dev` running in a companion terminal window.

---

## 3. In-Memory Validation: `content:validate` <Badge text="Zero Disk Writes" type="info" />

```bash title="content:validate"
pnpm content:validate
```

### Key Mechanics
- **Pure In-Memory Validation**: Parses YAML, validates schemas, and checks TypeScript types in memory;
- **Zero Disk Writes**: ==Never writes temporary files to disk=={.tip};
- **Intelligent Typo Suggestions**: Outputs line numbers and suggests correct property names for misspelled keys.

> [!TIP] Recommended Before Committing
> Run `pnpm content:validate` before pushing commits to catch YAML formatting or typo mistakes early.

---

## 4. Status Inspection: `content:status`

```bash title="content:status"
pnpm content:status

# Inspect remote Git connection and latest commit:
pnpm content:status --remote // [!code highlight]
```

---

## 5. Reverse Config Export: `content:export`

```bash title="content:export"
pnpm content:export          # Dry run: prints export plan
pnpm content:export --yes    # Execute export // [!code highlight]
```

### Key Mechanics
- **Minimal Overlay Export**: Only exports keys differing from theme defaults, ==avoiding hardcoded default bloat==;
- **Protects Future Upgrades**: Unmodified keys inherit upstream improvements automatically.

---

## 6. Safe Reset: `content:clean`

```bash title="content:clean"
pnpm content:clean          # Dry run: prints clean plan
pnpm content:clean --yes    # Execute clean // [!code highlight]
```

### Snapshot Backup & Recovery
- **Automatic Snapshot Backup**: Automatically archives current local content to `.content-backup/clean-<timestamp>/` before removal;
- **Reset Theme Workspace**: Cleans synced files and restores default demo content;
- **Source Repository Untouched**: External content repository remains completely unaffected.

> [!NOTE] Restoring Snapshot Backup
> To restore workspace state from backup:
>
> ::: tabs
> @tab Windows (PowerShell)
> ```powershell
> Copy-Item -Recurse -Force .\.content-backup\clean-<timestamp>\* .
> ```
> @tab Linux / macOS (Bash)
> ```bash
> cp -a .content-backup/clean-<timestamp>/. .
> ```
> :::

---

## Manifest & Environment Precedence

### Manifest File: `shirone.content.json`

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

### Environment Precedence

Precedence order: ==Process Env > .env.local > .env > shirone.content.json==.

| Variable | Description |
| :--- | :--- |
| `CONTENT_DIR` | Local content repository path |
| `CONTENT_REPO_URL` | Remote Git repository URL |
| `CONTENT_REPO_REF` | Target branch, tag, or commit SHA (default: `main`) |
| `SHIRONE_CONTENT_SYNC` | Set to `0` or `false` to disable sync and return to monolithic mode |
| `CONTENT_SYNC_PULL` | Set to `false` to reuse local cache without network pull |

::: details Expand to View Advanced CLI Flags
- `--dry-run`: Supported by mutating commands; prints execution plan without modifying disk;
- `--verbose`: Outputs per-file timing, MD5, and mtime comparison details;
- `--force`: Overrides conflict checks and forces synchronization;
- `--json`: Emits machine-readable JSON output for CI pipeline parsing.
:::

---

## Next Steps

- Head to [Config Overlay Principles](/en/guide/content-separation/config-overlay/): Understand minimal overlay rules, object merging, and array replacements
