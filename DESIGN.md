# DESIGN SYSTEM — Swiss Minimalist Layout
> Synthesised from all 5 reference images. This document is the single source of truth for visual decisions.

---

## 0 · Design Philosophy

**Swiss International Style meets editorial boldness.**  
Pure grid discipline, zero decoration, type as the primary graphic element — but broken at deliberate moments by a single large-format photograph that bleeds to the edge. Every pixel earns its place. Whitespace is the loudest thing on the page.

The design is **light-dominant** (off-white ground), with one warm accent pulled from the interiors palette and one structural dark tone for hard contrast. No gradients. No shadows beyond a 1px rule. No rounded corners on layout containers (images may use `4px` only).

**Signature element:** A single oversize section number (e.g. `01`, `04`) set at `clamp(120px, 20vw, 240px)`, hairline weight, that acts as a watermark behind the section headline — borrowed from the profile UI (image copy.png) and scaled to full-page editorial drama.

---

## 1 · Color Tokens

| Token | Hex | Role | Source image |
|---|---|---|---|
| `--color-ground` | `#F2F0EB` | Page background | image copy.png, image copy 3.png |
| `--color-ink` | `#111110` | Primary text, borders | image.png, image copy 4.png |
| `--color-ink-muted` | `#6B6860` | Labels, captions, metadata | image copy.png |
| `--color-rule` | `#D9D6CF` | Horizontal dividers, grid lines | image copy.png, image copy 3.png |
| `--color-accent` | `#C8773A` | CTA buttons, active states, accent dot | image copy 3.png (warm cognac leather) |
| `--color-accent-light` | `#EFD9C2` | Button hover fill, tag background | derived from image copy 3.png |
| `--color-surface` | `#E8E5DF` | Card / panel background | image copy.png connect card |
| `--color-white` | `#FAFAF8` | Inverse panels, nav bar | |

**No** pure `#000000` or `#FFFFFF`. Everything stays within the warm neutral family.

---

## 2 · Typography

### Typeface Pairing

| Role | Family | Weight(s) | Notes |
|---|---|---|---|
| **Display / Hero** | `Neue Haas Grotesk Display` or `Inter Tight` | 800 (Black) | Swiss grotesque — echoes image.png hero "Ideas That Move" |
| **Body / UI** | `Inter` | 400, 500 | Clean, neutral, workhorse |
| **Label / Eyebrow** | `Inter` | 600, letter-spacing `0.12em` | All-caps small labels like "ABOUT", "PROFILE" from image copy.png |
| **Watermark numerals** | Same as Display | 100–200 (Thin/ExtraLight) | Oversize section numbers, decorative only |

### Type Scale (fluid, `clamp`)

```css
--text-hero:    clamp(52px, 9vw, 120px);   /* Hero headline — "Ideas That Move" scale */
--text-h1:      clamp(36px, 5vw, 64px);    /* Section headings */
--text-h2:      clamp(24px, 3vw, 40px);    /* Sub-headings */
--text-h3:      clamp(18px, 2vw, 24px);    /* Card titles */
--text-body:    16px;                       /* Body text */
--text-small:   13px;                       /* Labels, captions */
--text-micro:   11px;                       /* Timestamps, metadata */
--text-numeral: clamp(120px, 20vw, 240px); /* Watermark section numbers */
```

### Line Heights & Tracking

```css
--lh-display: 0.92;   /* Tight, editorial — image.png hero reference */
--lh-heading: 1.1;
--lh-body:    1.65;
--lh-label:   1.2;

--ls-label:   0.12em; /* ALL-CAPS labels */
--ls-body:    0;
--ls-hero:    -0.03em; /* Slight optical tightening at large scale */
```

---

## 3 · Grid System

Pure **12-column CSS Grid**. Swiss layout means the grid is visible in structure, not as lines.

```
Desktop (>=1280px):  12 col · 24px gutter · 80px margin
Laptop  (>=1024px):  12 col · 20px gutter · 48px margin
Tablet  (>=768px):   8  col · 16px gutter · 32px margin
Mobile  (<768px):    4  col · 16px gutter · 20px margin
```

### Column Allocations (key layout cells)

| Zone | Desktop | Notes |
|---|---|---|
| Logo / wordmark | col 1–2 | Left-anchored, always |
| Nav links | col 7–11 | Right-aligned cluster |
| Hero headline | col 1–6 | Bleeds left margin |
| Hero image | col 5–12 | Right bleed, overlaps headline column |
| Section label (eyebrow) | col 1–2 | Small, top-left of every section |
| Section numeral watermark | col 10–12 | Hairline, right-anchored behind headline |
| Body copy | col 1–4 | Max width `52ch` always |
| Service list / index | col 7–12 | Right column, numbered — image.png services style |
| Profile card | col 1–4 | Full-height portrait flush left |
| Data / stat block | col 5–8 | Centred in mid-column |
| CTA row | col 1–12 | Full width, bottom-anchored |

---

## 4 · Spacing Scale

Based on an **8px base unit**. All spacing is a multiple of 8.

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  24px;
--space-6:  32px;
--space-7:  48px;
--space-8:  64px;
--space-9:  96px;
--space-10: 128px;
--space-11: 192px;  /* Section vertical padding */
```

Sections use `padding-block: var(--space-11)`. Hero uses `min-height: 100svh`.

---

## 5 · Borders & Rules

```css
--border-rule:   1px solid var(--color-rule);   /* Horizontal dividers between sections */
--border-strong: 1px solid var(--color-ink);    /* Nav underlines, active states */
--border-radius-image: 4px;                      /* Images only — square feel but not harsh */
--border-radius-btn:   2px;                      /* Pill-less buttons */
```

Absolutely **no box-shadows**. Depth is created through spatial offset and tonal contrast only.

---

## 6 · Component Library

### 6.1 Navigation Bar

```
[ LOGO / wordmark ]          [ Work  Studio  Services  Journal  Contact ]   [ -> ]
-----------------------------------------------------------------------------------
```

- Fixed top, `height: 56px`
- Background: `var(--color-ground)` at full opacity — **no blur**
- Border-bottom: `var(--border-rule)`
- Links: `--text-small`, letter-spaced labels, `color: var(--color-ink-muted)` -> hover `var(--color-ink)`
- Arrow icon button (top-right): `32x32px` circle, `border: var(--border-strong)`, no fill — from image.png top-right arrow
- On scroll: border-bottom transitions from transparent -> `var(--color-rule)` in `200ms`

### 6.2 Hero Section

```
+------------------------------------------------+
|                                                |
|  EYEBROW LABEL                                 |
|                                                |
|  Enormous                    +--------------+  |
|  Headline                    |              |  |
|  That Breaks                 |  PHOTOGRAPH  |  |
|  The Grid                    |  full bleed  |  |
|                              |              |  |
|  Body copy max 52ch here.    +--------------+  |
|                                                |
|  [ CTA Button ]  Secondary link ->             |
|                                                |
|                              Scroll v          |
+------------------------------------------------+
```

- Headline: `--text-hero`, `--lh-display`, `--ls-hero`, weight 800
- Eyebrow: `--text-small`, `--ls-label`, `text-transform: uppercase`, `color: var(--color-ink-muted)`
- Photo: `border-radius: var(--border-radius-image)`, `object-fit: cover`, aspect ratio `4/5` (portrait)
- Scroll indicator: small `--text-micro` label + arrow, `color: var(--color-ink-muted)` — from image.png

### 6.3 Stat / Data Row

Drawn from image copy.png large numeral "04" and image copy 4.png stat blocks:

```
+------------------------------------------------------------+
|  25+                500+               98%             15+ |
|  Years of           Projects           Client          Countries
|  Excellence         Completed          Retention       with Projects
+------------------------------------------------------------+
```

- Numeral: `--text-h1`, weight 800, `color: var(--color-ink)`
- Descriptor: `--text-micro`, `--ls-label`, `color: var(--color-ink-muted)`
- Dividers: `var(--border-rule)` vertical lines between stats
- Layout: 4-column grid, equal width

### 6.4 Profile / About Card

Drawn from image copy.png:

```
+---------------------------------------------------------+
|  PROFILE                                            01  |
|  -------------------------------------------------------  |
|                                                         |
|  +--------------+     o  ACTIVE NOW          BIG NUM   |
|  |   Portrait   |        Visible in 350 m              |
|  |   Photo      |                                       |
|  +--------------+                                       |
|                                                         |
|  Full Name.                                             |
|  ROLE                                                   |
|  City, Country  ->                                      |
|  -------------------------------------------------------  |
|  ABOUT                                                  |
|  Body copy describing the person or brand...            |
|  -------------------------------------------------------  |
|  INTERESTS (or SERVICES)                                |
|  Tag  Tag  Tag  Tag                                     |
|  -------------------------------------------------------  |
|  CONNECTIONS        MOMENTS                             |
|  23 ->              07 ->                               |
+---------------------------------------------------------+
```

- Section label top-left: `--text-micro`, `--ls-label`, `color: var(--color-ink-muted)`
- Page index top-right: `--text-small`, `color: var(--color-ink-muted)`
- Accent dot: `6px` circle, `background: var(--color-accent)`
- All horizontal rules: `var(--border-rule)`
- Stat pairs at bottom: side-by-side, `50% each`, divided by rule

### 6.5 Services / Index List

Drawn from image.png services column:

```
  01 /  Brand Identity          -----------------
  02 /  Campaigns               -----------------
  03 /  Digital Experiences     -----------------
  04 /  Content & Social        -----------------
  05 /  Strategy                -----------------
```

- Number prefix: `--text-small`, `color: var(--color-ink-muted)`, monospaced numerals
- Service name: `--text-h3`, weight 500
- Full-width rule below each row
- Hover: entire row shifts `transform: translateX(8px)`, `transition: 200ms ease`
- Active/featured row: background `var(--color-surface)`, no border-radius

### 6.6 CTA Button

Primary:
```css
background: var(--color-accent);
color: var(--color-white);
padding: 12px 24px;
font-size: var(--text-small);
font-weight: 600;
letter-spacing: var(--ls-label);
text-transform: uppercase;
border-radius: var(--border-radius-btn);
border: none;
```

Secondary (ghost):
```css
background: transparent;
color: var(--color-ink);
border: var(--border-strong);
/* same padding/typography */
```

Hover (primary): `background: var(--color-ink)`, `transition: 200ms`
Hover (ghost): `background: var(--color-ink)`, `color: var(--color-white)`

### 6.7 Photograph / Image Tile

Derived from all reference images' photography treatment:

- **Hero**: full bleed, spans multiple columns, `aspect-ratio: 4/5` (portrait) or `16/9` (landscape)
- **Grid tiles**: uniform `aspect-ratio: 1/1` or `3/4`, `border-radius: var(--border-radius-image)`
- **Overlay label**: bottom-left, `--text-small`, `color: var(--color-white)`, no box — text directly on image
- All images: `object-fit: cover`, no filter, no colour grading in CSS
- Caption below (when needed): `--text-micro`, `--ls-label`, `color: var(--color-ink-muted)`

### 6.8 Connect / Feature Card

Drawn from image copy.png "Connect Card":

```
+-------------------------------------------------+
|  LABEL                                     01  |
|                                                 |
|  Large card title                  . . . . . . |
|  copy line two.                    . . . . . . |
|                                    . . . . . . |
|                                    . . . . . . |
|  TAP TO VIEW  ->                               |
+-------------------------------------------------+
```

- Background: `var(--color-surface)`
- Dot grid pattern (CSS `radial-gradient`): `color: var(--color-rule)`, `size: 4px`, spacing `12px` — pure CSS, no image
- Corner index: `--text-micro`, `color: var(--color-ink-muted)`
- Action label: `--text-micro`, `--ls-label`, uppercase, weight 600

### 6.9 Logo Mark Area

- Wordmark: `--text-small`, weight 700, `letter-spacing: 0.04em`
- Superscript mark at `0.5em` size
- No logomark icon — type only, per Swiss tradition

### 6.10 Watermark Section Number

The **signature element**:

```css
.section-numeral {
  font-size: var(--text-numeral);
  font-weight: 100;               /* Hairline */
  color: var(--color-rule);       /* Near-invisible on ground */
  line-height: 1;
  user-select: none;
  pointer-events: none;
  position: absolute;
  right: var(--margin);
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;                     /* Behind content */
}
```

Used: once per section, right-aligned, behind the section headline.

---

## 7 · Section Architecture

Every page section follows this strict anatomy:

```
+- section -----------------------------------------------------------------------+
|  border-top: var(--border-rule)                                                 |
|                                                                                 |
|  EYEBROW LABEL            [watermark numeral, far right, behind]                |
|                                                                                 |
|  Section Headline                                                               |
|                                                                                 |
|  [content area -- varies per section type]                                      |
|                                                                                 |
|  padding-block: var(--space-11)                                                 |
+---------------------------------------------------------------------------------+
```

### Page Section Order (recommended)

| # | Section | Layout pattern | Reference image |
|---|---|---|---|
| 0 | **Nav** | Full-width fixed bar | image.png |
| 1 | **Hero** | Offset 2-col, photo right bleed | image.png |
| 2 | **Logos / Trust** | Single row, equal spacing, muted | image.png (Google, Nike...) |
| 3 | **Services / Work** | Left-col text + right-col index list | image.png |
| 4 | **About / Profile** | Portrait left + data right | image copy.png |
| 5 | **Stats** | 4-col horizontal data row | image copy 4.png |
| 6 | **Featured Work / Portfolio** | Masonry or uniform tile grid | image copy 2.png, image copy 4.png |
| 7 | **Process** | Numbered vertical steps, left-col only | image copy 2.png, image copy 3.png |
| 8 | **Testimonial** | Full-width blockquote, large quote glyph | image copy 3.png |
| 9 | **CTA Banner** | Full-width, dark background panel | image copy 4.png |
| 10 | **Footer** | 4-col grid, brand left, links right | — |

---

## 8 · Motion & Interaction

Motion is **spare and purposeful**. The page feels alive, not restless.

### Rules
- All transitions: `cubic-bezier(0.16, 1, 0.3, 1)` (fast-out, slight overshoot)
- Duration: `200ms` micro, `400ms` reveals, `600ms` hero entrance
- **No parallax**. **No scroll-jacking.**
- `@media (prefers-reduced-motion: reduce)` removes all transitions

### Defined Interactions

| Element | Trigger | Effect |
|---|---|---|
| Nav links | hover | `color` fades from muted -> ink, `200ms` |
| Service rows | hover | `translateX(8px)`, `200ms` |
| CTA buttons | hover | background swap, `200ms` |
| Section headlines | scroll into view | `translateY(16px) -> 0`, `opacity 0 -> 1`, `400ms`, stagger children |
| Portfolio image tiles | hover | subtle `scale(1.02)`, `300ms` — image only, not container |
| Stat numerals | scroll into view | count-up animation from `0`, `600ms` |
| Watermark numerals | page load | `opacity: 0 -> 1`, `800ms`, no movement |

### No-go list
- No background video
- No cursor followers or custom cursors
- No scroll-hijack or horizontal scroll sections
- No parallax layers on images
- No page-load skeleton loaders (content should be SSR-ready)

---

## 9 · Photography Direction

Synthesised from all 5 references:

- **Colour**: Warm tones preferred — cognac, terracotta, off-white, deep teal. Avoid cold blues.
- **Subject**: Human figures (fashion, portrait, editorial) + still life / interior details
- **Framing**: Tight portrait crops OR environmental wide shots — avoid mid-range generic framing
- **Mood**: Quiet, confident, slightly editorial. Not staged-stock.
- **Black & white**: Permitted for profile/portrait only (image copy.png profile photo reference)
- **Mixing**: B&W portrait alongside full-colour environmental shots is deliberate and good — per image copy.png
- **No illustrations or icons** unless purely geometric (e.g. dot grid, arrow glyph)

---

## 10 · Iconography

- **Only glyph icons**: arrow-northeast, arrow-down, arrow-right, arrow-left, plus, times
- Rendered as plain Unicode characters or SVG path, never icon font libraries
- Size: matches the surrounding body text size
- Accent dot: only one per screen, `6px` circle, `background: var(--color-accent)`
- No decorative illustration, blob shapes, or wave dividers

---

## 11 · Implementation Notes (Next.js / CSS)

```css
/* globals.css: base reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-ground);
  color: var(--color-ink);
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; height: auto; }
```

- Use **CSS Custom Properties** (variables) for every token — no hardcoded hex values in components
- Use **CSS Grid + Flexbox**, never float or position hacks
- Use `clamp()` for all fluid type sizes
- Font loading: `next/font` with `Inter` and `Inter_Tight` (or local Neue Haas Grotesk if licensed)
- Images: `next/image` with `priority` on hero, `loading="lazy"` elsewhere
- Layouts: Server Components by default; Client Components only for interactive elements

---

## 12 · Do / Don't Summary

| Do | Don't |
|---|---|
| Let type do the graphic work | Add decorative shapes or blobs |
| Breathe — use enormous whitespace | Fill every zone with content |
| One accent colour, used sparingly | Rainbow or multi-accent palette |
| Photography that has character | Generic stock photography |
| Rules and grids as structure | Floating cards with heavy shadows |
| Animate one thing, do it well | Scatter micro-animations everywhere |
| Hairline watermark numerals | Large decorative numbers in bold |
| 2px border-radius max on controls | Pill buttons or heavy rounding |
| Uppercase tracking on labels only | ALL-CAPS body copy |
| Left-aligned text blocks | Centre-aligned body paragraphs |

---

*Last updated: September 2026 — synthesised from reference images: `image.png`, `image copy.png`, `image copy 2.png`, `image copy 3.png`, `image copy 4.png`.*
