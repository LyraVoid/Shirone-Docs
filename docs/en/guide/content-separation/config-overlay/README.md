---
title: Configuration Overlays
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/config-overlay/
---

In a single-repo blog setup, site settings are scattered across TypeScript configuration files inside the theme source (such as `src/config/siteConfig.ts`).

In a separated repository architecture, all site settings are centralized inside the `config/` directory of your content repository and formatted as clean, readable YAML files. Whenever a local preview or cloud deployment runs, Shirone reads these YAML files, merges them with the theme default settings, and compiles the final `src/user/user-config.ts`.

You do not need to modify a single line of theme code. When future theme versions are released, you can upgrade cleanly without risking overwritten configuration settings.

## Two Merging Rules

Understanding configuration overlays requires only two rules:

### Rule 1: Declare on Demand (Only write what you change)

When writing YAML configuration files, you only need to specify the keys you wish to customize. Any settings omitted from your YAML automatically inherit the theme's default values.

For example, to change only the blog title and home typewriter speed in `config/site.yaml`:

```yaml title="config/site.yaml"
title: "My Tech Blog"

banner:
  homeText:
    typewriter:
      speed: 150
```

Banner background images, overlay opacity, and other typewriter settings are not mentioned here, so they cleanly retain their default theme styles.

This "declare on demand" design provides an essential advantage: when newer theme versions introduce additional options, your site adopts the updated defaults automatically instead of breaking due to an outdated monolithic configuration file.

### Rule 2: Objects Merge, Arrays Replace

Configuration keys merge according to their data type:

| Data Type | Merge Strategy | Behavior |
| --- | --- | --- |
| **Objects / Nested dictionaries** | Recursive merge | Only declared child keys are overridden; unmentioned sibling keys keep defaults |
| **Arrays / Lists** | Complete replacement | Declaring an array replaces the default list entirely with your declared items |

Why are arrays replaced completely? Navigation menus and sidebar widgets function as ordered units. Appending custom items to default lists frequently leads to unwanted duplicates or scrambled menu ordering.

When editing files containing lists (such as `config/nav-bar.yaml` or `config/sidebar.yaml`), provide the complete list of items you want displayed:

```yaml title="config/sidebar.yaml"
# Sidebar widget list (completely replaces default configuration)
components:
  - "profile"      # Author profile card
  - "toc"          # Table of contents
  - "recent-posts" # Recent articles
  - "tags"         # Tag cloud
```

## Core Configuration Files

Inside your content repository's `config/` directory, the most frequently customized configuration files include:

### 1. Site Basics and Appearance (`config/site.yaml`)

Controls basic blog metadata, domain, primary color palette, and homepage banner:

```yaml title="config/site.yaml"
title: "Shirone"
subtitle: "Clean and elegant static blog"
description: "Notes on software development and daily thoughts"
site: "https://example.com"

# Primary brand accent color (Hex color code)
primaryColor: "#3B82F6"

# Homepage banner and typewriter text
banner:
  enable: true
  homeText:
    enable: true
    title: "Hello, traveler"
    subtitle:
      - "Welcome to my personal blog"
      - "Glad you stopped by"
```

For full option details, see the [Site Configuration Guide](/en/guide/config/site/).

### 2. Author Profile Card (`config/profile.yaml`)

Displays author information, avatar, bio, and social links in sidebars and footers:

```yaml title="config/profile.yaml"
avatar: "https://github.com/USERNAME.png"
name: "Your Nickname"
bio: "A frontend developer passionate about open source"

# Social media links (icons support the Iconify collection)
socialLinks:
  - name: "GitHub"
    icon: "ri:github-line"
    url: "https://github.com/USERNAME"
  - name: "X"
    icon: "ri:twitter-x-line"
    url: "https://x.com/USERNAME"
```

### 3. Top Navigation Bar (`config/nav-bar.yaml`)

Defines header links and dropdown menus. Uses array replacement rules:

```yaml title="config/nav-bar.yaml"
links:
  - title: "Home"
    url: "/"
    icon: "ri:home-4-line"
  - title: "Archives"
    url: "/archives/"
    icon: "ri:archive-line"
  - title: "About"
    url: "/about/"
    icon: "ri:user-3-line"
```

See [Navigation Bar Configuration](/en/guide/layout/navbar/).

### 4. Custom Pages and Integrations

Activate specific blog features by adjusting their dedicated YAML files:

- **Comment System (`config/comment.yaml`)**: Supports Twikoo, Waline, and other backends. See [Comment Settings](/en/guide/article/comments/);
- **Anime Tracking (`config/anime.yaml`)**: Connects Bilibili or Bangumi accounts. See [Anime Page](/en/guide/pages/anime/);
- **Music Player (`config/music.yaml`)**: Configures background music playlists. See [Music Player](/en/guide/plugins/music/);
- **Friends Page (`config/friends.yaml`)**: Page switch, title and items per page; the actual friend entries still live in `data/friends.ts`.

::: tip Syncing anime data
After editing accounts in `config/anime.yaml`, run `pnpm anime:sync --if-stale` to download watch lists and cover assets.
:::

## Complete File Reference

Additional configuration files in `config/` and their roles:

| Group | File | Purpose |
| --- | --- | --- |
| Fonts & Typography | `font.yaml` | Font families and font subsetting optimizations |
| Footer | `footer.yaml`, `footer.html` | Footer copyright text and custom HTML injections |
| Visual Effects | `image-bloom.yaml`, `context-menu.yaml` | Image bloom effects, custom right-click context menu |
| Reading Experience | `article.yaml` | Estimated read time, update notices, recommended posts |
| Post Listing | `post-list.yaml` | Pagination sizes and card display formats |
| URL Structure | `permalink.yaml` | Permanent post link formatting |
| Code Highlighting | `expressive-code.yaml` | Code block themes and line number toggles |
| Custom Page Lists | `devices.yaml`, `games.yaml`, `projects.yaml`, `skills.yaml` | Data sources for gear, gaming, projects, and skills pages |

## Validation and Effect

### Syntax and Type Validation

After editing YAML files, run the validation command from the theme repository root to verify syntax and field spelling:

```bash
pnpm content:validate
```

This runs a dry-run check without modifying workspace files. If you misspell `title` as `titel`, the validator points directly to the line and suggests the correct field:

```text
config/site.yaml's banner.homeText: Type '{ titel: string }' is not assignable to type 'DeepPartial<HomeTextConfig>'
  Did you mean "title"?
```

### When Configurations Take Effect

Configurations compile and take effect automatically in two scenarios:

1. **Running builds or local dev servers**: Every `pnpm dev` or `pnpm build` execution automatically runs the sync step first;
2. **Manual synchronization**: Running `pnpm content:sync` reads all YAML files and outputs `src/user/user-config.ts`.

`src/user/user-config.ts` is an ephemeral file generated during builds; never edit it manually.

## Next steps

- [CLI Workflows](/en/guide/content-separation/cli-workflows/): Commands for sync, watch, and status checks
- [Site Configuration](/en/guide/config/site/): Full catalog of site configuration properties
- [Navigation Bar](/en/guide/layout/navbar/): Learn dropdown menus and navigation icon settings
