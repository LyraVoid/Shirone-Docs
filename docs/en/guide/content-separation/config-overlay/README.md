---
title: Configuration Overlay
createTime: 2026/09/01 10:00:00
permalink: /en/guide/content-separation/config-overlay/
---

In the dual-repo setup, site configuration lives in the content repo's `config/` directory. During sync, the theme reads these YAML files, merges them with defaults, and generates `src/user/user-config.ts`. You do not need to modify theme source files.

## Declare only what changes

Write only the keys you want to override. Everything else inherits theme defaults.

```yaml title="config/site.yaml"
title: "My tech blog"

banner:
  homeText:
    typewriter:
      speed: 150
```

This configuration only modifies the site title and the typewriter speed. All other banner and typewriter properties keep their default values.

This structure ensures smooth upgrades: when a new theme release introduces new configuration options, your site adopts the new defaults automatically without conflicts caused by hardcoding every field.

## Object merge vs. array replace

Configuration merge rules depend on data types:

| Type | Rule |
| --- | --- |
| Nested object | Merged recursively; only declared keys are overridden |
| Array | Replaced entirely; your declared list wins |

Arrays are replaced as a whole because list items, ordering, and exclusions operate as a unified set. Partial appending would create ambiguous intent. When editing files with array definitions such as `nav-bar.yaml` or `sidebar.yaml`, specify the complete list.

```yaml title="config/sidebar.yaml"
components:
  - "profile"
  - "toc"
  - "recent-posts"
  - "tags"
```

This configuration **replaces** the default widget list rather than appending four items to it.

## Validation and activation

After modifying configurations, run the validation command in the theme repo:

```bash
pnpm content:validate
```

It checks directory structure, mount conflicts, and YAML field types without writing to `src/`. Misspelled keys trigger helpful suggestions, such as using `titel` instead of `title`:

```text
config/site.yaml's banner.homeText: Type '{ titel: string }' is not assignable to type 'DeepPartial<HomeTextConfig>'
  Did you mean "title"?
```

Configuration activates during two processes:

- Running `pnpm content:sync` compiles the YAML files into `src/user/user-config.ts`.
- Running `pnpm dev` or `pnpm build` triggers that sync step automatically beforehand.

`src/user/user-config.ts` is an auto-generated file overwritten on every sync; do not edit it manually. The generation process also bundles referenced icons locally and feeds title and nickname text into font subsetting, avoiding redundant network requests or missing glyphs.

## Configuration files

Configuration files in `config/` are organized into four groups:

**Basics and appearance**

| File | Purpose |
| --- | --- |
| `site.yaml` | Site name, URL, theme color, banner, background texture |
| `profile.yaml` | Avatar, nickname, bio, social links |
| `nav-bar.yaml` | Top navigation menu |
| `sidebar.yaml` | Sidebar layout and widget order |
| `font.yaml` | Fonts and font subsetting |
| `footer.yaml`, `footer.html` | Footer copy and custom HTML injection |
| `image-bloom.yaml`, `context-menu.yaml` | Image bloom effect, context menu |

**Posts and lists**

| File | Purpose |
| --- | --- |
| `article.yaml` | Reading time, update notices, recommendations, share cards |
| `post-list.yaml` | Pagination size and card display style |
| `permalink.yaml` | Post permalink format |
| `license.yaml` | Copyright license |
| `expressive-code.yaml` | Code block theme and line numbering |

**Pages and features**

| File | Purpose |
| --- | --- |
| `anime.yaml` | Anime data source settings |
| `music.yaml` | Music player |
| `comment.yaml` | Comment system |
| `announcement.yaml`, `fab.yaml` | Announcement bar, floating action buttons |
| `umami.yaml`, `llms.yaml` | Traffic analytics, LLM retrieval output |
| `devices.yaml`, `games.yaml`, `projects.yaml`, `skills.yaml`, `timeline.yaml`, `friends.yaml`, `series.yaml` | Categorization and filter rules for standalone pages |

For field-level documentation, consult the corresponding feature guide, such as [Navbar Configuration](/en/guide/layout/navbar/) or [Comment System](/en/guide/article/comments/).

::: warning Anime needs a separate sync
`config/anime.yaml` only declares accounts and data providers. After editing it, run `pnpm anime:sync --if-stale` to download anime entries and covers; otherwise the page will have no data. In build environments, run `pnpm anime:sync --if-stale && pnpm build`. See [Anime Page](/en/guide/pages/anime/).
:::

## Next steps

[CLI Toolchain](/en/guide/content-separation/cli-workflows/): sync, watch, validate, export, and clean commands.
