---
title: CLI Workflows & Toolchain
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/cli-workflows/
---

# CLI Workflows & Toolchain

Shirone provides a dedicated CLI toolchain tailored for the decoupled content architecture. Whether writing in external editors, checking YAML schemas without writing to disk, or synchronizing between repositories, everything can be executed via unified CLI commands.

---

## Core Command Reference

| Command | Primary Role | When to Use | Disk Write Behavior |
| :--- | :--- | :--- | :--- |
| `pnpm content:sync` | Materialize content | Before local preview or during CI build | Incremental write to theme copy |
| `pnpm content:watch` | Incremental watcher | Live authoring in external editors | Automatic write on save |
| `pnpm content:validate` | In-memory safety check | Quick YAML syntax and schema checks | In-memory only, zero disk writes |
| `pnpm content:status` | Status diagnostics | Check connection, branches, and diffs | Read-only inspection |
| `pnpm content:export` | Reverse diff export | Export local config tweaks back to content repo | Writes minimal YAML to content repo |
| `pnpm content:clean` | Safe reset and cleanup | Clean materialized copies and restore theme demo | Restores demo with automatic backup snapshot |
| `pnpm content:eject` | One-click migration wizard | Decouple single-repo setup into dual repos | Exports full content structure |

---

## 1. Materialize Content: `content:sync`

```bash
pnpm content:sync
```

- **Incremental Sync**: Compares file size and modification timestamps to skip unchanged files;
- **Config Compilation**: Compiles `config/*.yaml` into strongly-typed `src/user/user-config.ts`;
- **Protected Derivatives**: Moment thumbnails, anime covers, and font subsets are preserved.

---

## 2. Incremental Watcher: `content:watch`

```bash
pnpm content:watch
```

- Listens to changes in your external content directory with debounced synchronization;
- Recompiles TypeScript bridge files and triggers Astro hot reloading instantly;
- Used alongside `pnpm dev` in a separate terminal.

---

## 3. In-Memory Validation: `content:validate`

```bash
pnpm content:validate
```

- Performs in-memory YAML parsing, schema matching, and TypeScript diagnostics;
- Does not modify any disk files;
- Displays exact file lines and suggestions if a property name contains a typo.

---

## 4. Status Diagnostics: `content:status`

```bash
pnpm content:status
# Or inspect remote Git repository connection and latest commit:
pnpm content:status --remote
```

- Outputs the active `CONTENT_DIR` or `CONTENT_REPO_URL`;
- Summarizes total materialized articles and active config overrides;
- Checks freshness against the remote commit SHA.

---

## 5. Reverse Diff Export: `content:export`

```bash
pnpm content:export          # Dry run: view export plan
pnpm content:export --yes    # Execute export
```

- Exports only modified properties relative to theme defaults;
- Preserves clean YAML structure for seamless future theme updates.

---

## 6. Safe Reset and Cleanup: `content:clean`

```bash
pnpm content:clean          # Dry run: view cleanup plan
pnpm content:clean --yes    # Execute cleanup
```

- Automatically creates a full backup snapshot in `.content-backup/clean-<timestamp>/`;
- Cleans materialized content copies and restores the theme demo state;
- Your actual content repository remains untouched.

To restore a snapshot:

::: tabs
@tab Windows (PowerShell)
```powershell
Copy-Item -Recurse -Force .\.content-backup\clean-<timestamp>\* .
```
@tab Linux / macOS (Bash)
```bash
cp -a .content-backup/clean-<timestamp>/. .
```
:::

---

## 7. One-Click Eject: `content:eject`

```bash
pnpm content:eject          # Dry run
pnpm content:eject --yes    # Execute eject
pnpm content:eject --yes --out ../my-content  # Custom output path
```

---

## Manifest and Environment Variables

### Manifest: `shirone.content.json`

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

### Environment Variable Precedence

`Process ENV` > `.env.local` > `.env` > `shirone.content.json`

| Variable | Description |
| :--- | :--- |
| `CONTENT_DIR` | Local content repository path |
| `CONTENT_REPO_URL` | Remote Git repository URL |
| `CONTENT_REPO_REF` | Target branch, tag, or commit SHA (default: `main`) |
| `SHIRONE_CONTENT_SYNC` | Set to `0` or `false` to disable sync |
| `CONTENT_SYNC_PULL` | Set to `false` to reuse cached local copy offline |

---

## Next Steps

- Head to [Configuration Overlay Principles](/en/guide/content-separation/config-overlay/): Understand minimal overrides, object merging, and array replacement rules
