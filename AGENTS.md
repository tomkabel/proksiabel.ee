# AGENTS.md - Agent Guidelines for ProksiAbel.ee

This document provides guidelines for AI agents working on this codebase.

## Project Overview

- **Project Type**: Vite + React + TypeScript website
- **Purpose**: Security consultancy landing page (ProksiAbel OÜ)
- **Output Directory**: `pub/` (not default `dist`)
- **No tests currently configured**
- **i18n**: EN + ET, both in `src/i18n/translations.ts`; default language is Estonian
- **Deploy**: Cloudflare Workers static assets (`wrangler deploy --assets=pub`); GitHub Pages workflow exists but is not the live origin

---

## Build / Lint / Test Commands

### Development
```bash
npm run dev          # Start Vite dev server
```

### Building
```bash
npm run build        # tsc -b && vite build, then postbuild (updates sitemap lastmod, copies 404.html, prerenders every route from sitemap.xml into pub/ via system Chromium)
npm run preview      # Preview production build locally
```

### Linting
```bash
npm run lint         # Run oxlint + biome check on all files
```

### Type Checking
```bash
npx tsc -b     # Run TypeScript compiler check (project references; also runs in npm run build)
```

### Single File Linting
```bash
npx oxlint src/components/Navbar.tsx     # Lint specific file (fast, zero-config)
npx biome check src/components/Navbar.tsx  # Format + lint + import organization
```

### Lint Toolchain
The repo uses **oxlint** (fast linting, zero-config, respects .gitignore) and
**biome** (formatting, import organization, a11y/quality rules, config in
`biome.json`). Build artifacts in `pub/` are excluded from both.

Documented biome exceptions (see `biome.json` `overrides` / rule config):
- `a11y/useValidAnchor` off globally: in-page hash navigation (skip link,
  `#services`, `#contact`) is a legitimate anchor use, not a JS button.
- `public/**` has `a11y` off: static assets (favicon, og-image) are not part
  of the rendered DOM's accessibility surface.
- `src/index.css`: `noUnknownAtRules` off (Tailwind v3 `@tailwind` directives)
  and `noImportantStyles` off (reduced-motion block needs `!important`).
- `src/components/Venn/VennDiagram.tsx`: `noStaticElementInteractions` off —
  the Venn is a pointer-explored visualization inside `role="img"`; zone
  content is reachable without interaction.

### Images / Cloudflare
```bash
npm run optimize-images        # Optimize images (requires ImageMagick; see scripts/check-imagemagick.sh)
scripts/cloudflare-apply.sh    # Apply Cloudflare zone config (SSL, cache rules, redirects); reads wrangler OAuth token
```

### No Test Framework
This project does NOT currently have a test framework (Vitest/Jest) configured. Do not write tests unless explicitly instructed.

---

## Code Style Guidelines

### General Principles

- Use TypeScript with `strict: true` enabled (see tsconfig.app.json)
- Prefer functional components with hooks over class components
- Keep components small and focused on a single responsibility
- Use meaningful, descriptive names for all identifiers

### File Organization

```
src/
├── components/       # React components (incl. guides: Fido2PasskeysGuide.tsx, SsrfGuide.tsx; SEOMeta.tsx for per-route head)
├── config/           # Static config (images.ts)
├── data/             # Static data (contact.tsx, projects.ts)
├── i18n/             # translations.ts (en + et), LanguageProvider/useTranslation
├── App.tsx           # Root component (routes)
├── main.tsx          # Entry point
└── index.css         # Global styles (Tailwind directives)
```

### Imports

**Order (top to bottom):**
1. React import: `import React from 'react';`
2. External libraries (lucide-react, etc.)
3. Internal components/hooks/utils
4. CSS/style imports

**Example:**
```typescript
import React from 'react';
import { Shield, Menu, X } from 'lucide-react';
import Navbar from './components/Navbar';
import './index.css';
```

### Component Patterns

**Default export with function declaration (preferred):**
```typescript
export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  // ...
}
```

**Or arrow function with variable declaration:**
```typescript
const Pgp = () => {
  return (
    // ...
  );
};

export default Pgp;
```

Pick one style and be consistent within a file.

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `Navbar`, `HeroSection` |
| Functions | camelCase | `toggleMenu`, `handleClick` |
| Variables | camelCase | `isMenuOpen`, `servicesData` |
| Constants | camelCase or UPPER_SNAKE | `servicesData` or `MAX_SIZE` |
| Props interfaces | PascalCase + Props suffix | `NavbarProps` |
| Files | PascalCase | `Navbar.tsx`, `data.ts` |

### TypeScript Usage

- Always define types for component props:
```typescript
interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  // ...
}
```

- Use `strict: true` - no `any` types allowed
- Enable `noUnusedLocals` and `noUnusedParameters` in TypeScript

### Tailwind CSS

- Use `slate` color palette for dark backgrounds: `bg-slate-900`, `bg-slate-800`
- Use `cyan` for accent colors: `text-cyan-500`, `bg-cyan-600`
- Use `gray` for secondary text: `text-gray-300`, `text-gray-400`
- Use `white` for primary text on dark backgrounds: `text-white`

**Common classes used in this project:**
```tsx
<div className="min-h-screen bg-slate-900">
<div className="text-white font-bold text-xl">
<div className="text-gray-300 hover:text-white transition-colors">
<button className="bg-cyan-500 text-white hover:bg-cyan-600">
```

### JSX Guidelines

- Always use self-closing tags for elements without children: `<Component />`
- Use parentheses for multi-line JSX returns
- Prefer ternary operators or `&&` for conditional rendering:
```tsx
{isOpen && <MobileMenu />}
{isLoggedIn ? <Dashboard /> : <Login />}
```

### Error Handling

- This is a simple static website; no complex error handling required
- For component errors, consider using Error Boundaries if needed
- Use optional chaining (`?.`) when accessing potentially undefined properties

### React Hooks

- Use `useState` for local component state
- Keep hook calls at the top of the component (after React import)
- Group related state together when appropriate:
```typescript
const [isMenuOpen, setIsMenuOpen] = React.useState(false);
const [isLoading, setIsLoading] = React.useState(true);
```

### Accessibility

- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<button>`)
- Include `alt` text for images (or use decorative images appropriately)
- Ensure interactive elements have focus states
- Use `aria-label` for icon-only buttons

---

## Configuration Files Reference

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration (output: `pub/`) |
| `tsconfig.json` | Solution-style root (references only — see Pitfalls) |
| `tsconfig.app.json` | TypeScript config (strict mode) |
| `biome.json` | Biome config (format + lint + import organization) |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `scripts/prerender.js` | Post-build prerender (puppeteer-core + system Chromium) |
| `scripts/postbuild-seo.js` | Post-build sitemap lastmod + 404.html |
| `.github/workflows/static.yml` | GitHub Pages deploy (CI: npm ci → tsc --noEmit → lint → build) |

---

## Common Tasks

### Adding a new component
1. Create file in `src/components/`
2. Use function declaration with default export
3. Import React and needed dependencies
4. Use Tailwind CSS classes for styling
5. Export types if component accepts props
6. Import and use in `App.tsx`

### Adding a new icon
1. Import from `lucide-react`: `import { IconName } from 'lucide-react';`
2. Use in JSX: `<IconName className="h-6 w-6 text-cyan-500" />`

### Adding a new guide (e.g. /guides/foo)
1. Add route in `App.tsx` + component in `src/components/` (with SEOMeta for per-route title/canonical/JSON-LD)
2. Wire it into `Footer.tsx`, `pub/sitemap.xml`, and `pub/llms.txt`
3. Rebuild so prerender generates the route HTML
4. Guides are English-only by design (English search cluster)

### Modifying styles
- Tailwind classes go directly in JSX `className` attributes
- Global styles go in `src/index.css` (Tailwind directives only)

---

## Notes for Agents

- Do NOT create tests unless explicitly requested
- The build output is `pub/`, not `dist/` - remember this for deployment
- This is a marketing website, not a complex web application
- Keep dependencies minimal - this project uses React, Tailwind, and Lucide icons only

## Pitfalls

- **`pub/` is regenerated on every build** (postbuild + prerender rewrite HTML, assets, sitemap, llms.txt). Don't hand-edit it; change `src/` and rebuild. Rebuilt `pub/` is committed per convention (see recent commits).
- **`npx tsc --noEmit` at the root is a no-op** — the root `tsconfig.json` is solution-style (`"files": []`, references only). Use `npx tsc -b`. (CI's `static.yml` still runs the no-op form.)
- **Stale dev servers on shared ports serve old code.** If a dev server is already running on a port (e.g. from another session), Vite won't start and the old build keeps serving. Use a fresh port + `--strictPort` (`npm run dev -- --port <new> --strictPort`) and verify the served module, not just the HTTP 200.
- **`pub/full_exploit_final_v2_release.zip` must be kept** — it is a deployment artifact the site links to; don't delete it when rebuilding/cleaning pub/.
- **Deploying** (real origin is Cloudflare Workers static assets, not GitHub Pages): build, then `wrangler deploy --assets=pub`, then purge the zone cache (bare paths can need a targeted purge).
