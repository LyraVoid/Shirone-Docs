---
title: Mermaid Diagrams
createTime: 2026/08/31 23:25:00
permalink: /en/guide/writing/charts/mermaid/
---

Shirone integrates the Mermaid diagramming library, allowing you to render flowcharts, sequence diagrams, state charts, and Gantt charts directly from Markdown.

## Flowcharts

````markdown
```mermaid
flowchart TD
    A[User Request] --> B{Route Match}
    B -->|Static Hit| C[Return Pre-rendered HTML]
    B -->|Client Nav| D[Swup Smooth Transition]
    C --> E[Done]
    D --> E
```
````

## Sequence Diagrams

````markdown
```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor
    participant Browser as Browser
    participant Server as Edge Server

    User->>Browser: Click post link
    Browser->>Server: Fetch route assets
    Server-->>Browser: Return static HTML
    Browser-->>User: Render post with dynamic colors
```
````

## State Diagrams

````markdown
```mermaid
stateDiagram-v2
    [*] --> LightMode
    LightMode --> DarkMode: Toggle Theme
    DarkMode --> LightMode: Toggle Theme
    DarkMode --> [*]
```
````

## Highlights

- **Loaded On Demand**: Mermaid scripts load asynchronously only when diagrams are present in the current article.
- **Theme Synchronized**: Node strokes, fills, and text dynamically match the active Material 3 Expressive theme and dark mode.
