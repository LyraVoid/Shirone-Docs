---
title: CLI Toolchain
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/cli-workflows/
---

Content separation commands run in the theme repo root. Day-to-day writing only requires `content:watch`; use `content:status` and `content:validate` when debugging configuration or structure issues.

## Commands

| Command | Purpose | Modifies files |
| --- | --- | --- |
| `pnpm content:sync` | Copy content repo into theme repo | Yes, writes to `src/content/` and targets |
| `pnpm content:watch` | Watch content repo and sync on save | Yes |
| `pnpm content:validate` | Check directory structure and YAML fields | No for `src/`; remote sources update `.content-src/` |
| `pnpm content:status` | Show active content source and commit SHA | No |
| `pnpm content:export` | Export tuned configuration back to content repo | Yes, writes into content repo |
| `pnpm content:clean` | Remove materialized copies and restore samples | Yes, creates a backup by default |
| `pnpm content:eject` | Split a single repo into two | Yes, creates the content repo |
| `pnpm anime:sync` | Download anime lists and covers | Yes, writes local snapshots |

## Common commands

### content:sync

```bash
pnpm content:sync
pnpm content:sync --dry-run   # compare only, write nothing
```

Reads the declared content source, copies files into the theme repo's standard directories, and compiles `config/*.yaml` into `src/user/user-config.ts`. Both `pnpm dev` and `pnpm build` run this automatically before starting.

Supported flags: `--dry-run`, `--no-prune`, `--quiet`.

### content:watch

```bash
pnpm content:watch
```

Watches the local content directory and incrementally syncs modified files on save. Run it alongside `pnpm dev` in a separate terminal window. It only operates with local directory sources.

### content:validate

```bash
pnpm content:validate
```

Checks the content repo's directory structure, mount conflicts, and YAML field types. It is functionally equivalent to `content:sync --dry-run`.

This command does **not** validate post frontmatter. Frontmatter schemas are verified by `astro sync` or during full site builds.

With a remote Git source, this command still fetches and updates `.content-src/`, requiring network access on the initial run. It only skips writing to `src/` and generating the configuration bridge.

The official validation workflow executes two steps: `content:validate`, followed by `content:sync && astro sync`. The second step provides comprehensive diagnostics when debugging post metadata.

### content:status

```bash
pnpm content:status
pnpm content:status --remote   # also check remote branch over the network
```

Outputs diagnostic information for the active content source:

- Running mode (`local` or `external`);
- Local directory path or remote Git URL;
- Resolved commit SHA;
- Active configuration overrides and total post count.

Run this command when verifying which repository is active. It runs offline by default and only contacts the remote when passed `--remote`.

## Other commands

::: details Show the four less common commands

### content:export

Use this command when configuration adjustments made in the theme repo need to be exported back to the content repo:

```bash
pnpm content:export         # preview mode, list files to export
pnpm content:export --yes   # apply export
```

Only fields differing from default values are exported, ensuring YAML files do not freeze default values permanently and future theme updates apply smoothly. Supported flags: `--config`, `--posts`, `--prune`, `--out`, `--force`.

### content:clean

Restores the theme repo to clean sample content:

```bash
pnpm content:clean          # preview mode, print cleanup plan
pnpm content:clean --yes    # apply, backing up to .content-backup/clean-<timestamp>/
```

This command only cleans materialized copies inside the theme repo; the content repo remains untouched. To revert, copy files back from the backup directory. `--no-backup` skips snapshots and is generally not recommended.

### content:eject

Migrates a single-repo blog to a dual-repo setup. See [Creating a Content Repository](/en/guide/content-separation/init-repo/).

```bash
pnpm content:eject                        # preview mode
pnpm content:eject --yes                  # apply, default output ../shirone-content
pnpm content:eject --yes --out ../my-content
```

### anime:sync

```bash
pnpm anime:sync --if-stale           # skip if snapshot is fresh; use in builds
pnpm anime:sync                      # force full refresh
pnpm anime:sync --provider bangumi   # sync single provider only
```

Snapshot freshness is controlled by `snapshot.staleAfterDays` in `config/anime.yaml`, defaulting to 30 days. When no providers are configured, the command exits cleanly without interrupting builds. See [Anime Page](/en/guide/pages/anime/).

:::

## Manifest

`shirone.content.json` in the theme repo root pins the content source and mount mappings. Field definitions are available in [Content Sources](/en/guide/content-separation/content-sources/#manifest); the template is `shirone.content.example.json`.

## Next steps

[Configuration Overlay](/en/guide/content-separation/config-overlay/): object merge, array replacement rules, and file categorization.
