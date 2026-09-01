---
title: Initializing Private Content Repo
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/init-repo/
---

# Initializing Private Content Repo

There are two recommended methods to set up your standalone content repository:

- **Method 1 (Recommended): One-click Eject with `content:eject`**: If you have already cloned or forked the theme repo, a single command extracts your posts, photos, data entities, and configurations into a structured content repository;
- **Method 2: Clone from the Official Template**: Best for users starting from scratch with a dual-repo setup.

---

## Method 1: Using content:eject (Recommended)

### Key Features
- **Automated Structure Assembly**: Automatically extracts posts, moments, albums, and data files, and generates a valid `shirone.content.json` manifest and GitHub Actions trigger workflow;
- **Minimal Config Export**: Exports only essential identity settings in `site.yaml` and `profile.yaml`, avoiding hardcoded defaults to ensure seamless future upgrades;
- **Theme Repo Protection**: Adds gitignore rules and safely unstages content files from Git while keeping physical files intact for local preview;
- **Automatic Local Binding**: Connects your theme development workspace to the newly created external directory.

### Step 1: Run Eject Command

Open your terminal in the **theme code repository** root:

::: tabs
@tab Windows (PowerShell)
```powershell
# 1. Dry run: preview files to be ejected (zero disk changes)
pnpm.cmd content:eject

# 2. Confirm and execute eject (default destination: ../shirone-content)
pnpm.cmd content:eject --yes

# Or specify a custom output directory:
pnpm.cmd content:eject --yes --out "D:\Code\my-blog-content"
```

@tab Linux / macOS (Bash)
```bash
# 1. Dry run: preview files to be ejected
pnpm content:eject

# 2. Confirm and execute eject
pnpm content:eject --yes

# Custom output path:
pnpm content:eject --yes --out "/Users/yourname/Code/my-blog-content"
```
:::

### Step 2: Create a Blank Private Repo on GitHub

1. Log in to GitHub;
2. Click the **+** icon in the top right corner and select **New repository**;
3. Fill in details:
   - **Repository name**: e.g., `my-blog-content` or `shirone-content`;
   - **Visibility**: **Must select Private**;
   - **Initialize with**: **Do not select** any initialization files (keep completely empty);
4. Click **Create repository**.

![GitHub Create Private Repo](/images/content-separation/01-quickstart/02-init/01-github-create-repo.png)

### Step 3: Push Content Repository to GitHub

In your terminal, navigate to the ejected directory and push:

```bash
# 1. Enter the external content directory
cd ../shirone-content

# 2. Initialize Git repository and commit
git init -b main
git add .
git commit -m "feat: initialize private blog content repo"

# 3. Add remote origin and push
git remote add origin git@github.com:YOUR_USERNAME/my-blog-content.git
git push -u origin main
```

---

## Method 2: Clone from Official Template

### Step 1: Create a Blank Private Repo on GitHub
Create an empty private repository on GitHub without adding a README or gitignore.

![GitHub Initial Page](/images/content-separation/01-quickstart/02-init/02-repo-initial-page.png)

### Step 2: Clone the Template Repository
Run in your terminal:

```bash
# 1. Clone the template
git clone https://github.com/LyraVoid/Shirone-Content.git my-blog-content

# 2. Enter the directory
cd my-blog-content
```

![Git Clone Output](/images/content-separation/01-quickstart/02-init/03-git-clone-output.png)

### Step 3: Reset Remote URL to Your Private Repo

```bash
# Point remote origin to your new private repository
git remote set-url origin git@github.com:YOUR_USERNAME/my-blog-content.git

# Verify remote URL
git remote -v
```

![Git Remote Output](/images/content-separation/01-quickstart/02-init/04-git-remote-output.png)

### Step 4: Push to Your Private Repository

```bash
git push -u origin main
```

![Git Push Output](/images/content-separation/01-quickstart/02-init/05-git-push-output.png)

Refresh your GitHub page to see the repository ready for authoring:

![GitHub Repo Final Page](/images/content-separation/01-quickstart/02-init/06-repo-final-page.png)

---

## Content Repository Structure and Mapping

```file-tree title="Content Repository Structure & Mount Mapping"
shirone-content/
├── .github/workflows/       # GitHub Actions workflows
│   └── trigger-build.yml.example # Trigger workflow template
├── config/                  # YAML configurations -> Compiled to src/user/user-config.ts
│   ├── site.yaml            # Site identity, colors, and banner settings
│   ├── profile.yaml         # Author profile and social links
│   └── footer.html          # Custom footer HTML -> Mapped to src/config/FooterConfig.html
├── content/                 # Posts and moments -> Mapped to src/content/
│   ├── posts/               # Markdown and MDX articles
│   ├── moments/             # Microblog moments
│   └── spec/                # About and spec pages
├── data/                    # Structured data entities -> Mapped to src/data/
│   ├── projects.ts          # Open source projects
│   ├── skills.ts            # Technical skills
│   ├── devices.ts           # Hardware devices
│   ├── timeline.ts          # Career milestones
│   └── friends.ts           # Friends and blogroll
├── assets/                  # High-resolution media -> Mapped to src/assets/ (Built-in optimization)
│   └── images/
├── public/                  # Raw static assets -> Mapped to public/ (Published as-is)
│   ├── images/
│   └── assets/
└── shirone.content.json     # Content repo metadata identifier
```

---

## Next Steps

- Head to [Local Preview & Debugging](/en/guide/content-separation/local-preview/): Start local development server with real-time watch mode
