# Serene Ink — Project Guide

## Project Overview

**Serene Ink** is a personal blog built with [Astro](https://astro.build), featuring MDX-powered content, Tailwind CSS v4 styling, and a refined reading experience. The site is deployed on Cloudflare Pages at `https://serene-ink.pages.dev/`.

### Key Technologies

| Layer | Technology |
| --- | --- |
| **Framework** | Astro 6 (SSG, client transitions) |
| **Content** | MDX via `@astrojs/mdx` |
| **Styling** | Tailwind CSS v4 via `@tailwindcss/vite` |
| **Syntax Highlighting** | `astro-expressive-code` (GitHub light/dark themes) |
| **Icons** | `@lucide/astro` |
| **Analytics** | Umami (configurable, currently disabled) |
| **SEO** | `@astrojs/sitemap`, Open Graph, JSON-LD structured data |
| **RSS** | `@astrojs/rss` |
| **Language** | TypeScript + Astro components |

### High-Level Architecture

```text
src/
├── config.ts              # Site-wide configuration (nav, author, socials)
├── content.config.ts      # Astro content collections (post, story)
├── types.ts               # TypeScript interfaces
├── layouts/
│   └── Layout.astro       # Single shared layout (nav, footer, search, theme toggle)
├── pages/
│   ├── index.astro        # Home → Writing listing
│   ├── about.astro        # About page
│   ├── posts/             # Blog post pages
│   ├── stories/           # Story pages (longer-form)
│   ├── tags/              # Tag listing & individual tag pages
│   ├── page/[page].astro  # Pagination for writing
│   ├── feed.xml.ts        # RSS feed endpoint
│   ├── search.json.ts     # Client-side search index endpoint
│   └── robots.txt.ts      # Robots.txt endpoint
├── components/            # Reusable Astro components
│   ├── ui/                # UI primitives (Badge, Callout, Steps, Tabs, etc.)
│   ├── posts/             # Post-specific (TOC, ShareButtons)
│   └── about/             # About-specific (Timeline, ActivityCard)
├── posts/                 # Blog post MDX files
├── stories/               # Story MDX files
├── scripts/               # Cursor scripts
├── styles/
│   └── global.css         # Tailwind + custom theme + prose-blog styles
└── utils/
    ├── date.ts            # Date parsing (MM/DD/YYYY → UTC)
    └── reading-time.ts    # Word-count → read time calculation
```

---

## Getting Started

### Prerequisites

- **Node.js >= 22.12.0** (enforced in `package.json` engines)
- **pnpm** (recommended package manager)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev          # Start dev server at localhost:4321
pnpm build        # Production build → dist/
pnpm preview      # Preview production build locally
```

### Creating Content

```bash
# Blog post (with tags, date, draft support)
pnpm new-post "My New Post Title"

# Story (longer-form, no tags)
pnpm new-story "A Story About Something"
```

Posts live in `src/posts/` and stories in `src/stories/` as `.mdx` files.

### Linting & Formatting

```bash
pnpm lint         # ESLint (JS, TS, Astro)
pnpm format       # Prettier + prettier-plugin-astro
```

---

## Project Structure

### Content Collections (`src/content.config.ts`)

Two collections are defined using Astro's `glob` loader:

| Collection | Pattern | Schema Fields |
| --- | --- | --- |
| **`post`** | `src/posts/**/*.mdx` | `title`, `date` (MM/DD/YYYY), `frontmatter`, `tags`, `image?`, `draft?`, `updatedDate?` |
| **`story`** | `src/stories/**/*.mdx` | `title`, `date` (MM/DD/YYYY), `frontmatter`, `image?`, `draft?` |

### Key Configuration (`src/config.ts`)

Single source of truth for site metadata:

```ts
siteConfig = {
    title, description, siteUrl,
    author: { name, bio },
    nav: [{ label, href }],       // Navigation links
    socials: { github?, twitter?, linkedin? },
    postsPerPage: 5,               // Pagination for writing index
    analytics: { umami: { websiteId?, src? } },
    rss: { title, description }
}
```

### Layout (`src/layouts/Layout.astro`)

The **only** layout component. Handles:

- SEO meta tags (OG, Twitter cards, canonical URLs)
- Dark/light theme toggle with `View Transitions API` animation
- Client-side search (fetches `/search.json`, Cmd+K shortcut)
- Scroll-aware navbar (hides on scroll down, shows blur backdrop after 100px)
- RSS feed link
- Umami analytics injection (when configured)

---

## Development Workflow

### Coding Conventions

- **No semicolons** (consistent across all TS/JS files)
- **2-space indentation**
- **Double quotes** for strings
- **Path alias `@/`** → resolves to `src/` (configured in `tsconfig.json`)
- **Astro components** use `---` frontmatter blocks for framework code
- **Client JS** lives in `<script>` blocks within Astro files, bound to `astro:page-load` / `astro:before-swap` lifecycle events

### Date Format

All content dates use **`MM/DD/YYYY`** format (e.g., `"06/15/2025"`). Parse with `parseDate()` from `src/utils/date.ts` which returns a **UTC** Date object.

### Theme System

- CSS custom properties in `:root` (light) and `.dark` selector
- Tailwind v4 `@custom-variant dark` for conditional classes
- Theme persisted in `localStorage("theme")`, falls back to `prefers-color-scheme`
- View Transitions API used for animated theme switching (ripple effect from click point)

### Content Styling

Blog posts and stories use the `.prose-blog` utility class for typographic styling:

- Max width `68ch`, `18px` font, `1.75` line-height
- `.drop-cap` first-letter styling on content
- Custom link, heading, and list styles

---

## Key Concepts

### Astro Content Collections

Content is loaded at build time via `glob` patterns. Use `getCollection()` in pages to access entries. Filter drafts with `!entry.data.draft`.

### Client Transitions

`<ClientRouter />` in the layout enables client-side navigation. Lifecycle events:

- `astro:page-load` — attach event listeners
- `astro:before-swap` — cleanup event listeners

### Search

Client-side search index generated at build time (`src/pages/search.json.ts`). Searches across `title`, `frontmatter`, and `tags`. Opened via search icon or `Cmd+K` / `Ctrl+K`.

### Pagination

Writing index paginates at `siteConfig.postsPerPage` (5). Paginated URLs: `/page/2`, `/page/3`, etc. The home nav item stays active on paginated pages.

---

## Common Tasks

### Add a Navigation Link

Edit `src/config.ts` → `nav` array:

```ts
nav: [
    { label: "Writing", href: "/" },
    { label: "Stories", href: "/stories" },
    { label: "New Section", href: "/new-section" }  // ← add here
]
```

### Add a New MDX Component

1. Create component in `src/components/ui/ComponentName.astro`
2. Import directly in `.mdx` files using `@/components/ui/ComponentName`

Existing UI components: `Badge`, `Callout`, `Divider`, `Figure`, `LinkCard`, `ProsCons`, `Quote`, `Separator`, `Steps`, `TabItem`, `Tabs`, `YouTube`.

### Change the Color Theme

Edit CSS custom properties in `src/styles/global.css`:

- `:root` block for light mode
- `.dark` block for dark mode
- Key variables: `--primary`, `--background`, `--foreground`, `--accent`, `--border`

### Add a New Content Collection

1. Define in `src/content.config.ts` with `defineCollection()` + `glob()` loader
2. Add to `export const collections`
3. Create pages under `src/pages/<collection>/`
4. Create `index.astro` (listing) and `[...slug].astro` (detail)

---

## Troubleshooting

### TypeScript path alias not resolving in editor

Ensure your editor recognizes `tsconfig.json`. The `@/*` alias maps to `./src/*`. Restart the TS server if needed.

### Content not appearing on the site

- Check `draft: false` in the MDX frontmatter
- Verify the file matches the glob pattern (`src/posts/**/*.mdx` or `src/stories/**/*.mdx`)
- Check the date format is `MM/DD/YYYY`

### Theme toggle not persisting

The theme is stored in `localStorage("theme")`. Check browser settings for local storage being blocked.

### Build errors with MDX

- Verify all imported components in MDX files exist and have correct paths
- Check frontmatter matches the Zod schema in `content.config.ts`
- Run `pnpm build` for full error output (dev server may not catch all issues)

### Search not finding content

The search index is generated at build time from posts. Stories are not included in search. Rebuild after adding new content.

---

## References

- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro MDX Integration](https://docs.astro.build/en/guides/markdown-content/)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Expressive Code](https://expressive-code.com)
- [Lucide Icons](https://lucide.dev)
