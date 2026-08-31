---
title: Friends Page
createTime: 2026/09/01 00:22:00
permalink: /en/guide/pages/friends/
---

The friends page (`/friends/`) is managed by `src/data/friends.ts`—the data is the content, with no extra behavior config. Entry `tags` aggregate automatically into the filter chips at the top of the page.

## Data Structure

```ts title="src/data/friends.ts"
export interface FriendItem {
  id: number;
  title: string;     // site name
  imgurl: string;    // avatar/icon URL
  desc: string;      // one-line description
  siteurl: string;   // site URL
  tags: string[];    // tags (aggregated into filter chips)
}

export const friendsData: FriendItem[] = [
  {
    id: 1,
    title: "Mizuki",
    imgurl: "https://avatars.githubusercontent.com/u/…",
    desc: "Another Fuwari-based blog theme with docs",
    siteurl: "https://mizuki.mysqil.com",
    tags: ["Blog", "Theme"],
  },
  // …
];
```

## Adding a Friend

Append one entry to the `friendsData` array—the page and filter chips generate automatically:

```ts
{
  id: 4,                            // incrementing unique number
  title: "Friend's Blog",
  imgurl: "https://friend.example.com/avatar.png",
  desc: "Life and tech notes",
  siteurl: "https://friend.example.com",
  tags: ["Blog", "Life"],
}
```

## Tag Filtering

The filter chips at the top aggregate from all entries' `tags` (deduplicated). Selecting multiple tags uses **OR matching**—friends hitting any selected tag are shown.

Plan a few broad tags (like `Blog`, `Tool`, `Design`); too many tags makes the filter bar crowded.

## Ordering

- `getFriendsList()`: stable order (array declaration order), reproducible for tests
- `getShuffledFriendsList()`: random order (used by the page as needed) to avoid a fixed ranking

The page displays randomly by default, so visitors see different orders and friend links get fairer exposure.

## Avatar Tips

- Use square images (cropped to circles/rounded corners on the page)
- At least 128×128, square, to avoid blur
- Broken icons appear when a friend's site is down—cleaning up dead links regularly is good hygiene

## FAQ

::: collapse
- I want to change the page URL

  The `Friends` preset `url` can be overridden via a custom link (see [Navigation Bar](/en/guide/layout/navbar/)); the page file lives at `src/pages/friends.astro`—routing needs to be handled together.

- Where does friends data live in dual-repo mode

  `friends.ts` belongs to the Data layer. In content-separation deployments it can be overridden along with the content repo—see the Content Separation guide in the theme repository for boundaries.

- How to remove the filter bar

  The bar is generated from tags—omit `tags` on all entries (or use one uniform tag) and it naturally goes away.
:::
