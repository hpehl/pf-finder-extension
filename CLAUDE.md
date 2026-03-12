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
- `.pf-v6-c-finder` - Root flex container with horizontal overflow scroll
- `.pf-v6-c-finder__column` - Individual navigable column (header, optional search, item list)
- `.pf-v6-c-finder__column-item` - Selectable row with icon, text, optional actions, optional folder chevron
- `.pf-v6-c-finder__preview` - Right-side preview pane (flex-grows to fill remaining space)
- Modifiers: `.pf-m-selected`, `.pf-m-folder`, `.pf-m-expanded`

### Demo JavaScript (`src/finder.js`)
`Finder` class that imperatively builds DOM. Takes a container element and options (`data`, `onSelect`, `renderPreview`, `showSearch`). Data nodes follow shape: `{ id, name, icon, children?, meta?, actions? }`.

### Build
Vite is configured to build only `src/finder.css` as the entry point (no JS bundle). Output uses flat filenames (`[name][extname]`).

## Conventions

- Use PatternFly 6 design token variables (`--pf-t--global--*`) instead of hardcoded values
- Follow PatternFly BEM naming: `pf-v6-c-{component}__{element}--{modifier}`
- Icons use Font Awesome 6 classes (`fas fa-*`)
