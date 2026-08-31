---
title: Announcement
createTime: 2026/09/01 00:41:00
permalink: /en/guide/widgets/announcement/
---

The announcement widget shows one site notice at the top of the sidebar, with a dismiss button and local memory. Content and behavior are configured in `announcementConfig.ts`.

## Configuration

```ts title="src/config/announcementConfig.ts"
export const announcementConfig = withUserConfig("announcement", {
  title: "",    // announcement title; empty uses the i18n default
  content: "The only way to do great work is to love what you do",
  closable: true,   // allow visitors to dismiss
  link: {
    enable: true,   // enable the trailing link
    text: "GitHub",
    url: "https://github.com",
    external: true, // open external links in a new window
  },
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `""` | Title; empty falls back to the i18n key Key.announcement |
| `content` | `string` | Sample text | Announcement body |
| `closable` | `boolean` | `true` | Show the close button |
| `link.enable` | `boolean` | `true` | Enable the trailing link |
| `link.text` | `string` | `GitHub` | Link text |
| `link.url` | `string` | GitHub | Link URL |
| `link.external` | `boolean` | `true` | Marked as external |

## Rendering and Behavior

- **Plain card form**: the announcement doesn't use the `WidgetLayout` title shell (unlike list-type widgets)—visually lighter
- **Dismiss with memory**: with `closable: true`, visitors can dismiss the announcement; the dismissed state is stored in localStorage and won't bother them again
- **Zero overhead**: no DOM is rendered when content is empty or already dismissed

## Placement in the Sidebar

Display is orchestrated by `sidebarConfig`. The default:

```ts title="src/config/sidebarConfig.ts"
{ type: "announcement", enable: true, slot: "top", pages: ["home"] }
```

By default it shows only on the **home page**, pinned at the top of the sidebar. For sitewide display, omit `pages`:

```ts
{ type: "announcement", enable: true, slot: "top" }  // all pages
```

## Practical Examples

**Event notice (with link)**

```ts title="src/config/announcementConfig.ts"
{
  title: "Blog Turns Two",
  content: "Thanks for two years of support! The anniversary event is live.",
  closable: true,
  link: {
    enable: true,
    text: "See the event",
    url: "/posts/anniversary/",
    external: false,   // internal links use Swup smooth navigation
  },
}
```

**Standing disclaimer (non-dismissible)**

```ts title="src/config/announcementConfig.ts"
{
  title: "Note",
  content: "Content here is personal study notes. Please credit when sharing.",
  closable: false,
  link: { enable: false, text: "", url: "", external: false },
}
```

## FAQ

::: collapse
- I changed the content but visitors can't see it

  If a visitor dismissed the previous announcement with `closable: true`, the stored memory hides the new one too. Either ask readers to clear their storage, or resend with `closable` off.

- Multilingual announcements

  An empty `title` uses i18n; `content` is plain text—multilingual content needs handling on your side.

- Announcement vs. Moments

  The announcement is one standing notice in the sidebar (site-level messages); Moments is a dynamic feed (daily records). Different purposes.
:::
