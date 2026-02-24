# Design System — Instagram Clone

> **Status: FINAL** — Auth UI (Login & Register) is approved. All future pages should follow these tokens.

---

## Color Palette

### Background & Surfaces

| Token        | Hex       | Usage                                      |
|--------------|-----------|--------------------------------------------|
| `$bg`        | `#0e0e10` | Page background — warm dark charcoal       |
| `$surface`   | `#1c1c1f` | Card / container surface (Apple dark mode) |
| `$border`    | `#313135` | Card and divider borders                   |
| `$input-bg`  | `#252528` | Input field background                     |
| `$input-border` | `#3a3a3e` | Input field border                      |

### Text

| Token       | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| `$text`     | `#f5f5f5` | Primary / body text            |
| `$text-sub` | `#737373` | Secondary, placeholders, hints |

### Brand Accent — Instagram Gradient

Used **only** on the logo (`h1`) and primary buttons. Not on backgrounds.

| Token       | Hex       | Position in gradient |
|-------------|-----------|----------------------|
| `$ig-start` | `#f58529` | Start — Orange       |
| `$ig-mid`   | `#dd2a7b` | Mid — Pink/Magenta   |
| `$ig-end`   | `#8134af` | End — Purple         |

**Gradient definition:**
```scss
// Logo text
background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af);

// Button
background: linear-gradient(90deg, #f58529, #dd2a7b 50%, #8134af);
background-size: 200% auto;
```

### Focus / Interactive

| Token         | Value                        | Usage              |
|---------------|------------------------------|--------------------|
| `$focus-ring` | `rgba(131, 58, 180, 0.35)`   | Input focus glow   |

---

## Typography

### Fonts

| Role      | Family        | Import source                          |
|-----------|---------------|----------------------------------------|
| Logo / H1 | `Grand Hotel` | Google Fonts                           |
| UI / Body | `Inter`       | Google Fonts — weights: 400, 500, 600  |

```html
<!-- In SCSS or index.html -->
@import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&family=Inter:wght@400;500;600&display=swap');
```

### Type Scale

| Element        | Font          | Size          | Weight | Notes                         |
|----------------|---------------|---------------|--------|-------------------------------|
| Page logo / H1 | Grand Hotel   | `3rem`        | 400    | Gradient text, `pb: 0.45rem` to prevent descender clip |
| Button label   | Inter         | `0.9rem`      | 600    | `letter-spacing: 0.02em`      |
| Input text     | Inter         | `0.875rem`    | 400    |                               |
| Placeholder    | Inter         | `0.85rem`     | 400    | Color: `#737373`              |
| Footer link text | Inter       | `0.825rem`    | 400 / 600 | Subdued + bold link      |

---

## Spacing & Sizing

| Token      | Value      | Usage                     |
|------------|------------|---------------------------|
| Card max-w | `360px`    | Auth form card width      |
| Card padding | `3rem 2.25rem 2.25rem` | Top / sides / bottom |
| Input padding | `0.78rem 0.9rem` | Vertical / horizontal |
| Input gap  | `0.65rem`  | Between each input field  |
| Border radius (card) | `16px` | Form container  |
| Border radius (input/btn) | `8px` | Inputs & button |

---

## Component Tokens

### Card

```scss
background: #1c1c1f;
border: 1px solid #313135;
border-radius: 16px;
animation: cardIn 0.35s ease both;

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Input (default → focus)

```scss
background: #252528;
border: 1px solid #3a3a3e;
border-radius: 8px;
color: #f5f5f5;
transition: border-color 0.2s ease, box-shadow 0.2s ease;

&:focus {
  border-color: #8134af;
  box-shadow: 0 0 0 3px rgba(131, 58, 180, 0.35);
}
```

### Primary Button

```scss
background: linear-gradient(90deg, #f58529, #dd2a7b 50%, #8134af);
background-size: 200% auto;
border-radius: 8px;
color: #fff;
font-weight: 600;
transition: background-position 0.4s ease, opacity 0.2s ease, transform 0.2s ease;

&:hover {
  background-position: right center;
  opacity: 0.92;
}

&:active {
  transform: scale(0.98);
  opacity: 0.85;
}
```

---

## Page Layout

```scss
main {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;   // always true vertical center
  padding: 2rem 1rem;
  background: #0e0e10;
}
```

---

## Global Base (`style.scss`)

```scss
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  background: #0e0e10;
}
```

---

## Design Principles

1. **Minimal color** — Instagram gradient is an accent, not a background wash.
2. **Dark gray, not black** — `#0e0e10` reads as premium; pure `#000` feels flat.
3. **One typeface for UI** — `Inter` everywhere except the decorative logo (`Grand Hotel`).
4. **Interaction-only animations** — hover, focus, active states only. No continuous loops.
5. **Generous whitespace** — cards breathe; inputs aren't cramped.
