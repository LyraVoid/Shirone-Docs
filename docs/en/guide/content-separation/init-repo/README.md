---
title: Creating a Content Repository
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/init-repo/
---

You can create the content repository yourself or start from the official template. Both produce identical structures; only the starting point differs.

| Method | Best for | Retains existing posts |
| --- | --- | --- |
| `content:eject` | Already wrote posts in the theme repo | Yes, posts and configuration move together |
| Clone template | Starting from scratch | No, contains sample content only |

## Option 1: move content out of the theme repo

Run this command from the **theme repo root**. Preview the plan first, then apply:

```bash
pnpm content:eject          # print the plan without modifying files
pnpm content:eject --yes    # write to ../shirone-content by default
```

::: warning Commit your work first
`content:eject` modifies `.gitignore` and the Git index. It refuses to run when the working tree has uncommitted changes. Commit or stash your changes before running the command.
:::

Use `--out` to specify a different directory:

```bash
pnpm content:eject --yes --out ../my-blog-content
```

On Windows PowerShell, use `pnpm.cmd`.

The command executes five actions:

1. Copies `src/content/`, `src/data/`, `src/assets/`, and `public/` to the target directory.
2. Generates `config/site.yaml`, `config/profile.yaml`, and `footer.html` from the current site configuration. Other domains remain default.
3. Writes `shirone.content.json` in the theme repo root, pointing the content source to the target directory.
4. Appends ignore rules to `.gitignore` and untracks these files from the Git index. Local files remain on disk.
5. Writes `shirone.content.json`, a README, and `.github/workflows/trigger-build.yml` in the content repo.

Commit this change in the theme repo:

```bash
git add -A
git commit -m "chore: switch to a dual-repo setup"
```

> Local files are not deleted. `pnpm dev` still works as expected. The only difference is that the theme repo no longer tracks these files.

### Push to GitHub

1. Create an **empty private repository** on GitHub. Do not initialize it with a README, `.gitignore`, or license.
2. Enter the exported directory and push:

```bash
cd ../shirone-content
git init -b main
git add .
git commit -m "chore: initialize content repository"
git remote add origin git@github.com:YOUR_NAME/my-blog-content.git
git push -u origin main
```

![Creating a private repository on GitHub](/images/content-separation/01-quickstart/02-init/01-github-create-repo.png)

The repository must be private. A public repository exposes drafts, original photos, and site configuration.

## Option 2: start from the official template

1. Create an empty private repository on GitHub.
2. Clone the official template and point its remote URL to your repository:

```bash
git clone https://github.com/LyraVoid/Shirone-Content.git my-blog-content
cd my-blog-content
git remote set-url origin git@github.com:YOUR_NAME/my-blog-content.git
git remote -v
git push -u origin main
```

The template includes sample posts, sample images, and complete configuration files. Replace them as needed.

## Content repo layout and mapping

```file-tree title="Content repo and its targets in the theme repo"
shirone-content/
├── config/                  # site config, compiled into src/user/user-config.ts
│   ├── site.yaml            # site name, URL, theme color, banner
│   ├── profile.yaml         # avatar, name, social links
│   ├── nav-bar.yaml         # top navigation
│   ├── sidebar.yaml         # sidebar layout and widgets
│   └── ...                  # other domains, see Configuration Overlay
├── content/                 # posts and page copy, mapped to src/content/
│   ├── posts/               # blog posts
│   ├── moments/             # short posts
│   ├── series/              # series
│   └── spec/                # about and friends page copy
├── data/                    # structured data, mapped to src/data/
│   ├── projects.ts          # projects
│   ├── friends.ts           # friend links
│   ├── skills.ts            # skills
│   └── ...
├── assets/                  # images to optimize, mapped to src/assets/
│   └── images/
├── public/                  # files served as-is, mapped to public/
│   ├── images/
│   └── assets/
└── shirone.content.json     # repo metadata (not read by the theme)
```

Important details:

- The `assets/` directory can be deleted entirely; the site then falls back to the theme's default images. If you keep it, include every image the site references (banner, avatar, covers). A folder containing only a placeholder breaks image loading.
- `shirone.content.json` in the content repo only describes the repository itself. It is **not used during the build**. The file that selects the content source lives in the theme repo root. See [Content Sources](/en/guide/content-separation/content-sources/#manifest).
- `docs/`, `.github/`, `.vscode/`, and `scripts/` are not copied to the theme repo, so placing them in the content repo will not impact the build.

## Verify

In the theme repo:

```bash
pnpm content:status
```

The output shows the content source type, path or Git URL, and the resolved commit SHA. `external` means the content repo is connected; `local` means the theme's own content is still in use.

Run a sync command:

```bash
pnpm content:sync
```

The command prints the number of files synced and the content commit SHA.

## Next steps

[Local Preview & Debugging](/en/guide/content-separation/local-preview/): verify posts render properly before writing regularly.
