# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A macOS Finder-style column browser component built as a PatternFly 6 extension. The **primary deliverable is the CSS** (`src/finder.css`); the JavaScript (`src/finder.js`) is a demo-only implementation to showcase the component.

## Commands

- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production (outputs `dist/finder.css` only, per Vite config)
- `pnpm preview` - Preview production build

No tests or linting configured.

## Architecture

### CSS Component (`src/finder.css`)
The core deliverable. Follows PatternFly 6 BEM conventions with `pf-v6-c-finder` prefix. All design tokens reference PatternFly 6 CSS custom properties (`--pf-t--global--*`). Component-scoped custom properties are defined on `.pf-v6-c-finder` root.

Key CSS structure:
- `.pf-v6-c-finder` - Root flex container
- `.pf-v6-c-finder__columns` - Scrollable columns wrapper (horizontal overflow, max visible columns controlled by `--pf-v6-c-finder-MaxColumns`)
- `.pf-v6-c-finder__column` - Individual column (header, optional search, item list)
  - `.pf-v6-c-finder__column-header` - Header with text and action buttons
  - `.pf-v6-c-finder__column-search` - Optional search/filter input
  - `.pf-v6-c-finder__column-items` - Scrollable `<ul>` item list
- `.pf-v6-c-finder__item` - Selectable list item (`<li>`)
  - `.pf-v6-c-finder__item-row` - Flex row layout inside each item
  - `.pf-v6-c-finder__item-icon` - Leading icon
  - `.pf-v6-c-finder__item-content` - Wraps text and optional description
  - `.pf-v6-c-finder__item-actions` - Action buttons (visible on hover/selected)
  - `.pf-v6-c-finder__item-pin` - Pin/unpin button with icon swap
  - `.pf-v6-c-finder__item-folder-icon` - Trailing chevron for folders
- `.pf-v6-c-finder__preview` - Right-side preview pane (flex-grows to fill remaining space)
- Modifiers: `.pf-m-selected`, `.pf-m-folder`, `.pf-m-active` (column), `.pf-m-pinned`

### Demo JavaScript (`src/finder.js`)
`Finder` class that imperatively builds DOM. Takes a container element and options (`data`, `onSelect`, `renderPreview`, `showSearch`). Data nodes follow shape: `{ id, name, icon, description?, children?, meta?, actions? }`. Supports keyboard navigation (arrow keys), item pinning, and column filtering.

### Build
Vite 8 (uses Rolldown) is configured to build only `src/finder.css` as the entry point (no JS bundle). Config uses `rolldownOptions` (not `rollupOptions`). Output uses flat filenames (`[name][extname]`).

## Conventions

- Use PatternFly 6 design token variables (`--pf-t--global--*`) instead of hardcoded values
- Follow PatternFly BEM naming: `pf-v6-c-{component}__{element}--{modifier}`
- Icons use Font Awesome 6 classes (`fas fa-*`)
