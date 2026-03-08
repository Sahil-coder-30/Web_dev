# 📐 DESIGN SYSTEM — Instagram Clone
### Antigravity UI Component Library
> **Status: FINAL** — Extends the approved Auth UI design system.
> All tokens, fonts, colors, and animation principles from the Auth UI are preserved exactly.
> This file adds every component Antigravity needs to build the full app UI.
> **Auth/logic is handled separately. UI must never break regardless of data.**

---

## 🎨 DESIGN TOKENS

> These are the single source of truth. Every component uses only these values.

### Backgrounds & Surfaces

| Token            | Hex / Value | Usage                                     |
|------------------|-------------|-------------------------------------------|
| `$bg`            | `#0e0e10`   | Page background — warm dark charcoal      |
| `$surface`       | `#1c1c1f`   | Card / container surface                  |
| `$surface-raise` | `#252528`   | Elevated surface (hover states, chips)    |
| `$border`        | `#313135`   | Card and divider borders                  |
| `$input-bg`      | `#252528`   | Input field background                    |
| `$input-border`  | `#3a3a3e`   | Input field border                        |
| `$overlay`       | `rgba(0,0,0,0.65)` | Modal backdrop, hover overlays     |

### Text

| Token        | Hex       | Usage                              |
|--------------|-----------|------------------------------------|
| `$text`      | `#f5f5f5` | Primary / body text                |
| `$text-sub`  | `#737373` | Secondary, placeholders, hints     |
| `$text-muted`| `#4a4a4e` | Timestamps, disabled states        |
| `$text-link` | `#c084fc` | Soft purple — links, website URLs  |
| `$text-danger`| `#ff453a` | Destructive actions, errors        |
| `$text-success`| `#30d158`| Success states, verified badges    |

### Brand Accent — Instagram Gradient

Used **only** on the logo, primary buttons, and story rings. Never as a background wash.

| Token       | Hex       | Position           |
|-------------|-----------|-------------------|
| `$ig-start` | `#f58529` | Start — Orange    |
| `$ig-mid`   | `#dd2a7b` | Mid — Pink/Magenta |
| `$ig-end`   | `#8134af` | End — Purple      |

```scss
// Logo text
background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af);

// Button (animated)
background: linear-gradient(90deg, #f58529, #dd2a7b 50%, #8134af);
background-size: 200% auto;

// Story / highlight ring
background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
```

### Focus / Interactive

| Token          | Value                       | Usage              |
|----------------|-----------------------------|--------------------|
| `$focus-ring`  | `rgba(131, 58, 180, 0.35)`  | Input focus glow   |
| `$focus-border`| `#8134af`                   | Input focus border |

---

## ✍️ TYPOGRAPHY

### Fonts

| Role       | Family       | Weights       | Source       |
|------------|--------------|---------------|--------------|
| Logo / H1  | `Grand Hotel`| 400           | Google Fonts |
| UI / Body  | `Inter`      | 400, 500, 600 | Google Fonts |

```scss
@import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&family=Inter:wght@400;500;600&display=swap');
```

### Type Scale

| Element          | Font        | Size       | Weight | Notes                                    |
|------------------|-------------|------------|--------|------------------------------------------|
| Page logo        | Grand Hotel | `3rem`     | 400    | Gradient text, `pb: 0.45rem`             |
| Section heading  | Inter       | `1rem`     | 600    |                                          |
| Nav username     | Inter       | `1rem`     | 700    |                                          |
| Body / captions  | Inter       | `0.875rem` | 400    | `line-height: 1.5`                       |
| Button label     | Inter       | `0.9rem`   | 600    | `letter-spacing: 0.02em`                 |
| Input text       | Inter       | `0.875rem` | 400    |                                          |
| Placeholder      | Inter       | `0.85rem`  | 400    | Color: `$text-sub`                       |
| Secondary label  | Inter       | `0.8rem`   | 400    | Color: `$text-sub`                       |
| Micro / timestamp| Inter       | `0.7rem`   | 400    | `letter-spacing: 0.3px`, uppercase       |
| Footer links     | Inter       | `0.825rem` | 400/600| Subdued + bold link                      |

---

## 📐 SPACING & SIZING

| Token                   | Value                    | Usage                       |
|-------------------------|--------------------------|-----------------------------|
| Card max-width (auth)   | `360px`                  | Login / register form       |
| Card max-width (feed)   | `614px`                  | Feed column max-width       |
| Card padding (auth)     | `3rem 2.25rem 2.25rem`   | Top / sides / bottom        |
| Card padding (surface)  | `1rem 1.25rem`           | General content cards       |
| Input padding           | `0.78rem 0.9rem`         | Vertical / horizontal       |
| Input gap               | `0.65rem`                | Between each input field    |
| Border radius (card)    | `16px`                   | All cards and surfaces      |
| Border radius (input/btn)| `8px`                   | Inputs, buttons, chips      |
| Border radius (avatar)  | `50%`                    | All avatars                 |
| Border radius (pill)    | `9999px`                 | Badges, tags, highlight rings|

---

## 🛡️ GLOBAL RESILIENCE RULES

> Applied globally. These rules make the UI **unbreakable** regardless of image size, text length, or data variance.

```scss
// 1. Box model
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// 2. Root
html, body, #root {
  width: 100%;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background: #0e0e10;
  color: #f5f5f5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 3. Images — NEVER break layout
img {
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  background-color: #1c1c1f; // fallback while loading or if broken
}

// 4. Text truncation utilities
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0; // CRITICAL inside flex containers
}

.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 5. Flex children never overflow
.flex-safe {
  display: flex;
  min-width: 0;
}

// Long words (URLs, hashtags) never overflow
.word-safe {
  word-break: break-word;
  overflow-wrap: anywhere;
}
```

---

## 🧩 COMPONENT LIBRARY

---

### 1. AVATAR

**Sizes:** `xs` 24px · `sm` 32px · `md` 44px · `lg` 64px · `xl` 86px · `2xl` 150px

```html
<!-- With story ring -->
<div class="avatar-wrap avatar-wrap--story">
  <img class="avatar avatar--lg"
       src="https://i.pravatar.cc/150?img=1"
       alt="@alexjohnson" />
</div>

<!-- Without ring -->
<div class="avatar-wrap">
  <img class="avatar avatar--md"
       src="https://i.pravatar.cc/150?img=2"
       alt="@sara_m" />
</div>

<!-- Text fallback (when no image) -->
<div class="avatar avatar--md avatar--fallback">AJ</div>
```

```scss
.avatar-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

// Story ring uses the IG gradient
.avatar-wrap--story {
  padding: 2px;
  background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
  border-radius: 50%;
}

.avatar-wrap--story .avatar {
  border: 2px solid #0e0e10; // gap between ring and image
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
  background-color: #1c1c1f; // fallback color
  flex-shrink: 0;
  overflow: hidden;
  display: block;
}

// Sizes
.avatar--xs  { width: 24px;  height: 24px;  }
.avatar--sm  { width: 32px;  height: 32px;  }
.avatar--md  { width: 44px;  height: 44px;  }
.avatar--lg  { width: 64px;  height: 64px;  }
.avatar--xl  { width: 86px;  height: 86px;  }
.avatar--2xl { width: 150px; height: 150px; }

// Text fallback
.avatar--fallback {
  background: #252528;
  color: #737373;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
}
```

---

### 2. BUTTON

```html
<!-- Primary (gradient — same as auth) -->
<button class="btn btn--primary">Follow</button>

<!-- Outline -->
<button class="btn btn--outline">Edit Profile</button>

<!-- Ghost -->
<button class="btn btn--ghost">Cancel</button>

<!-- Danger -->
<button class="btn btn--danger">Remove</button>

<!-- Full width -->
<button class="btn btn--primary btn--full">Save Changes</button>

<!-- Small -->
<button class="btn btn--outline btn--sm">Following</button>

<!-- Loading -->
<button class="btn btn--primary btn--loading" disabled>
  <span class="btn__spinner"></span>
</button>
```

```scss
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.78rem 1rem;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  border: none;
  outline: none;
  white-space: nowrap;
  user-select: none;
  text-decoration: none;
  transition: background-position 0.4s ease, opacity 0.2s ease, transform 0.2s ease;
}

.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn:active   { transform: scale(0.98); opacity: 0.85; }

// Primary — same gradient as auth button
.btn--primary {
  background: linear-gradient(90deg, #f58529, #dd2a7b 50%, #8134af);
  background-size: 200% auto;
  color: #fff;
}
.btn--primary:hover {
  background-position: right center;
  opacity: 0.92;
}

// Outline
.btn--outline {
  background: transparent;
  color: #f5f5f5;
  border: 1px solid #313135;
}
.btn--outline:hover { background: #252528; }

// Ghost
.btn--ghost   { background: transparent; color: #c084fc; }
.btn--ghost:hover { color: #a855f7; }

// Danger
.btn--danger  { background: transparent; color: #ff453a; }

// Modifiers
.btn--full { width: 100%; }
.btn--sm   { padding: 0.45rem 0.85rem; font-size: 0.8rem; }

// Spinner
.btn--loading { pointer-events: none; }

.btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
```

---

### 3. ICON BUTTON

```html
<button class="icon-btn" aria-label="Like">
  <!-- SVG icon -->
  <span class="badge">3</span>
</button>
```

```scss
.icon-btn {
  background: none;
  border: none;
  color: #f5f5f5;
  cursor: pointer;
  padding: 0.35rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: background 0.15s ease;
  flex-shrink: 0;
}
.icon-btn:hover { background: #252528; }
.icon-btn svg   { width: 24px; height: 24px; }

// Notification badge
.badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 16px;
  height: 16px;
  background: #ff453a;
  color: #fff;
  font-size: 0.625rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  border-radius: 9999px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

### 4. TOP NAVIGATION BAR

```html
<!-- Feed navbar -->
<nav class="navbar">
  <span class="navbar__wordmark">Instaclone</span>
  <div class="navbar__actions">
    <button class="icon-btn" aria-label="Notifications">
      <!-- heart svg -->
      <span class="badge">3</span>
    </button>
    <button class="icon-btn" aria-label="Messages">
      <!-- messenger svg -->
    </button>
  </div>
</nav>

<!-- Own profile navbar -->
<nav class="navbar">
  <div class="navbar__username-row">
    <span class="navbar__username">alexjohnson</span>
    <!-- chevron-down svg -->
  </div>
  <div class="navbar__actions">
    <button class="icon-btn"><!-- plus svg --></button>
    <button class="icon-btn"><!-- menu svg --></button>
  </div>
</nav>

<!-- Settings / back navbar -->
<nav class="navbar navbar--centered">
  <button class="icon-btn"><!-- arrow-left svg --></button>
  <span class="navbar__title">Notifications</span>
  <div class="navbar__spacer"></div>
</nav>
```

```scss
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 44px;
  background: #0e0e10;
  border-bottom: 1px solid #313135;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

// Grand Hotel wordmark — same as auth logo
.navbar__wordmark {
  font-family: 'Grand Hotel', cursive;
  font-size: 1.6rem;
  padding-bottom: 0.25rem;
  background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar__username-row {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.navbar__username {
  font-size: 1rem;
  font-weight: 700;
  color: #f5f5f5;
}

.navbar__title {
  font-size: 1rem;
  font-weight: 700;
  color: #f5f5f5;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.navbar__spacer { width: 36px; } // balances back button
```

---

### 5. BOTTOM NAVIGATION BAR (Mobile)

```html
<nav class="bottom-nav">
  <a href="#" class="bottom-nav__item bottom-nav__item--active" aria-label="Home">
    <!-- home svg -->
  </a>
  <a href="#" class="bottom-nav__item" aria-label="Search">
    <!-- search svg -->
  </a>
  <a href="#" class="bottom-nav__item" aria-label="Reels">
    <!-- reels svg -->
  </a>
  <a href="#" class="bottom-nav__item" aria-label="Notifications">
    <!-- heart svg -->
  </a>
  <a href="#" class="bottom-nav__item" aria-label="Profile">
    <img class="avatar avatar--xs" src="https://i.pravatar.cc/150?img=1" alt="Profile" />
  </a>
</nav>
```

```scss
.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 49px;
  background: #0e0e10;
  border-top: 1px solid #313135;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom); // iPhone notch
}

.bottom-nav__item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #f5f5f5;
  text-decoration: none;
}

.bottom-nav__item svg { width: 24px; height: 24px; }

// Active profile pic — gradient ring
.bottom-nav__item--active .avatar {
  outline: 2px solid transparent;
  background:
    linear-gradient(#0e0e10, #0e0e10) padding-box,
    linear-gradient(45deg, #f58529, #dd2a7b, #8134af) border-box;
  border: 2px solid transparent;
}
```

---

### 6. LEFT SIDEBAR (Tablet / Desktop)

```html
<aside class="sidebar">
  <span class="navbar__wordmark sidebar__logo">Instaclone</span>

  <nav class="sidebar__nav">
    <a href="#" class="sidebar__item sidebar__item--active">
      <!-- home svg -->
      <span class="sidebar__label">Home</span>
    </a>
    <a href="#" class="sidebar__item">
      <!-- search svg -->
      <span class="sidebar__label">Search</span>
    </a>
    <a href="#" class="sidebar__item">
      <!-- explore svg -->
      <span class="sidebar__label">Explore</span>
    </a>
    <a href="#" class="sidebar__item">
      <!-- reels svg -->
      <span class="sidebar__label">Reels</span>
    </a>
    <a href="#" class="sidebar__item">
      <!-- messages svg -->
      <span class="sidebar__label">Messages</span>
    </a>
    <a href="#" class="sidebar__item">
      <!-- heart svg -->
      <span class="sidebar__label">Notifications</span>
    </a>
    <a href="#" class="sidebar__item">
      <!-- plus svg -->
      <span class="sidebar__label">Create</span>
    </a>
    <a href="#" class="sidebar__item">
      <div class="avatar-wrap">
        <img class="avatar avatar--sm" src="https://i.pravatar.cc/150?img=1" alt="Profile" />
      </div>
      <span class="sidebar__label">Profile</span>
    </a>
  </nav>

  <div class="sidebar__bottom">
    <a href="#" class="sidebar__item">
      <!-- menu svg -->
      <span class="sidebar__label">More</span>
    </a>
  </div>
</aside>
```

```scss
.sidebar {
  width: 245px;
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid #313135;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.75rem;
  flex-shrink: 0;
  background: #0e0e10;
}

.sidebar__logo {
  font-size: 1.6rem;
  padding: 0.75rem 0.75rem 1.5rem;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: #f5f5f5;
  text-decoration: none;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s ease;
}
.sidebar__item:hover { background: #1c1c1f; }
.sidebar__item--active { font-weight: 600; }
.sidebar__item svg { width: 24px; height: 24px; flex-shrink: 0; }

.sidebar__bottom { padding-top: 0.5rem; border-top: 1px solid #313135; }
.sidebar__label  { white-space: nowrap; }

// Tablet — icon only
@media (min-width: 768px) and (max-width: 1023px) {
  .sidebar { width: 72px; }
  .sidebar__label { display: none; }
  .sidebar__logo  { font-size: 1.2rem; text-align: center; }
}
```

---

### 7. POST CARD

> 🛡️ Image always fills width. Username always truncates. Caption never breaks layout.

```html
<article class="post-card">

  <!-- Header -->
  <header class="post-card__header">
    <div class="post-card__user flex-safe">
      <div class="avatar-wrap avatar-wrap--story">
        <img class="avatar avatar--md"
             src="https://i.pravatar.cc/150?img=3"
             alt="@travel_diaries" />
      </div>
      <div class="post-card__user-info flex-safe">
        <span class="post-card__username truncate">travel_diaries</span>
        <span class="post-card__location truncate">Santorini, Greece</span>
      </div>
    </div>
    <div class="post-card__header-right">
      <button class="btn btn--outline btn--sm">Follow</button>
      <button class="icon-btn" aria-label="More">
        <!-- three-dots svg -->
      </button>
    </div>
  </header>

  <!-- Media -->
  <div class="post-card__media">
    <img class="post-card__image"
         src="https://picsum.photos/seed/santorini/600/600"
         alt="Post by travel_diaries" />
    <!-- Carousel dots (if multiple) -->
    <div class="post-card__dots">
      <span class="post-card__dot post-card__dot--active"></span>
      <span class="post-card__dot"></span>
      <span class="post-card__dot"></span>
    </div>
  </div>

  <!-- Actions -->
  <div class="post-card__actions">
    <div class="post-card__actions-left">
      <button class="icon-btn" aria-label="Like"><!-- heart svg --></button>
      <button class="icon-btn" aria-label="Comment"><!-- comment svg --></button>
      <button class="icon-btn" aria-label="Share"><!-- paper-plane svg --></button>
    </div>
    <button class="icon-btn" aria-label="Save"><!-- bookmark svg --></button>
  </div>

  <!-- Footer -->
  <div class="post-card__footer">
    <span class="post-card__likes">
      <strong>1,234 likes</strong>
    </span>
    <div class="post-card__caption">
      <span class="post-card__caption-user">travel_diaries</span>
      <span class="post-card__caption-text truncate-2">
        Golden hour in Santorini 🌅 Nothing beats this view after a long hike.
        The colors at sunset are absolutely unreal ✨
      </span>
      <button class="post-card__more-btn">more</button>
    </div>
    <button class="post-card__comments-btn">View all 89 comments</button>
    <span class="post-card__timestamp">2 HOURS AGO</span>
  </div>

</article>
```

```scss
.post-card {
  background: #0e0e10;
  border-bottom: 1px solid #313135;
  width: 100%;
  animation: cardIn 0.35s ease both;
}

.post-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.75rem;
  gap: 0.5rem;
  min-width: 0;
}

.post-card__user {
  align-items: center;
  gap: 0.65rem;
  flex: 1;
  min-width: 0;
}

.post-card__user-info {
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.post-card__username {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f5f5f5;
  display: block;
}

.post-card__location {
  font-size: 0.75rem;
  color: #737373;
  display: block;
}

.post-card__header-right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

// Media — CRITICAL: aspect-ratio locks the box, image fills it
.post-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #1c1c1f; // shimmer background while loading
}

.post-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

// Carousel dots
.post-card__dots {
  position: absolute;
  bottom: 0.65rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.post-card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
}

.post-card__dot--active {
  // Active dot uses gradient as solid color
  background: #dd2a7b;
}

.post-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
}

.post-card__actions-left {
  display: flex;
  align-items: center;
}

.post-card__footer {
  padding: 0 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.post-card__likes {
  font-size: 0.875rem;
  color: #f5f5f5;
}

.post-card__caption {
  font-size: 0.875rem;
  color: #f5f5f5;
  line-height: 1.5;
}

.post-card__caption-user {
  font-weight: 700;
  margin-right: 0.35rem;
}

.post-card__caption-text { word-break: break-word; }

.post-card__more-btn,
.post-card__comments-btn {
  background: none;
  border: none;
  color: #737373;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.post-card__timestamp {
  font-size: 0.7rem;
  color: #4a4a4e;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
```

---

### 8. STORY HIGHLIGHTS ROW

```html
<section class="highlights">
  <div class="highlights__scroll">

    <!-- New -->
    <div class="highlight-item">
      <div class="highlight-item__ring highlight-item__ring--new">
        <div class="highlight-item__inner">
          <!-- plus svg -->
        </div>
      </div>
      <span class="highlight-item__label">New</span>
    </div>

    <!-- Existing highlights -->
    <div class="highlight-item">
      <div class="highlight-item__ring highlight-item__ring--gradient">
        <img class="highlight-item__img"
             src="https://picsum.photos/seed/travel/120/120"
             alt="Travel" />
      </div>
      <span class="highlight-item__label truncate">Travel</span>
    </div>

  </div>
</section>
```

```scss
.highlights {
  width: 100%;
  border-bottom: 1px solid #313135;
}

.highlights__scroll {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.highlights__scroll::-webkit-scrollbar { display: none; }

.highlight-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  cursor: pointer;
}

.highlight-item__ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.highlight-item__ring--new {
  background: #1c1c1f;
  border: 1px solid #313135;
}

.highlight-item__ring--gradient {
  background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
}

.highlight-item__inner {
  width: 100%;
  height: 100%;
  background: #252528;
  border-radius: 50%;
  border: 2px solid #0e0e10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.highlight-item__img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0e0e10;
}

.highlight-item__label {
  font-size: 0.7rem;
  color: #f5f5f5;
  font-family: 'Inter', sans-serif;
  text-align: center;
  max-width: 64px;
}
```

---

### 9. PROFILE HEADER (Own Account)

```html
<section class="profile-header">

  <div class="profile-header__top">
    <div class="avatar-wrap avatar-wrap--story">
      <img class="avatar avatar--xl"
           src="https://i.pravatar.cc/150?img=1"
           alt="@alexjohnson" />
    </div>
    <div class="profile-header__stats">
      <div class="stat-item">
        <span class="stat-item__value">47</span>
        <span class="stat-item__label">posts</span>
      </div>
      <div class="stat-item">
        <span class="stat-item__value">2,847</span>
        <span class="stat-item__label">followers</span>
      </div>
      <div class="stat-item">
        <span class="stat-item__value">312</span>
        <span class="stat-item__label">following</span>
      </div>
    </div>
  </div>

  <div class="profile-header__bio">
    <p class="profile-header__name">Alex Johnson</p>
    <p class="profile-header__category">Digital Creator</p>
    <p class="profile-header__bio-text word-safe">
      📍 NYC | Photographer &amp; traveler ✈️<br />
      Capturing moments that last forever 📸
    </p>
    <a href="#" class="profile-header__link">linktr.ee/alexjohnson</a>
  </div>

  <div class="profile-header__actions">
    <button class="btn btn--outline profile-header__btn">Edit Profile</button>
    <button class="btn btn--outline profile-header__btn">Share Profile</button>
    <button class="btn btn--outline profile-header__icon-btn" aria-label="Discover people">
      <!-- person-add svg -->
    </button>
  </div>

</section>
```

```scss
.profile-header {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.profile-header__top {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-header__stats {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}

.stat-item__value {
  font-size: 1rem;
  font-weight: 700;
  color: #f5f5f5;
}

.stat-item__label {
  font-size: 0.8rem;
  color: #737373;
}

.profile-header__bio {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-header__name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #f5f5f5;
  margin: 0;
}

.profile-header__category {
  font-size: 0.8rem;
  color: #737373;
  margin: 0;
}

.profile-header__bio-text {
  font-size: 0.875rem;
  color: #f5f5f5;
  margin: 0;
  line-height: 1.5;
}

.profile-header__link {
  font-size: 0.875rem;
  color: #c084fc; // soft purple — matches $text-link
  text-decoration: none;
  font-weight: 600;
}
.profile-header__link:hover { text-decoration: underline; }

.profile-header__actions {
  display: flex;
  gap: 0.5rem;
}

.profile-header__btn { flex: 1; min-width: 0; }

.profile-header__icon-btn {
  width: 38px;
  height: 38px;
  padding: 0;
  flex-shrink: 0;
}
```

---

### 10. PROFILE TAB BAR

```html
<div class="profile-tabs">
  <button class="profile-tabs__tab profile-tabs__tab--active" aria-label="Posts">
    <!-- grid svg -->
  </button>
  <button class="profile-tabs__tab" aria-label="Reels">
    <!-- reels svg -->
  </button>
  <button class="profile-tabs__tab" aria-label="Tagged">
    <!-- tag svg -->
  </button>
</div>
```

```scss
.profile-tabs {
  display: flex;
  border-top: 1px solid #313135;
  border-bottom: 1px solid #313135;
}

.profile-tabs__tab {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #737373;
  border-top: 2px solid transparent;
  transition: color 0.2s ease;
}

.profile-tabs__tab svg { width: 22px; height: 22px; }

.profile-tabs__tab--active {
  color: #f5f5f5;
  border-top-color: #f5f5f5;
}
```

---

### 11. POST GRID

> 🛡️ `minmax(0, 1fr)` prevents column overflow. `aspect-ratio: 1/1` prevents image height issues.

```html
<section class="post-grid">

  <!-- Pinned + carousel -->
  <div class="post-grid__item post-grid__item--pinned">
    <img src="https://picsum.photos/seed/p1/300/300" alt="Post" />
    <div class="post-grid__badges">
      <span class="post-grid__badge">📌</span>
      <span class="post-grid__badge"><!-- layers svg --></span>
    </div>
    <div class="post-grid__overlay">
      <span>❤️ 1.2K</span>
      <span>💬 89</span>
    </div>
  </div>

  <!-- Video post -->
  <div class="post-grid__item">
    <img src="https://picsum.photos/seed/p2/300/300" alt="Post" />
    <div class="post-grid__badges">
      <span class="post-grid__badge"><!-- video svg --></span>
    </div>
  </div>

  <!-- Normal post -->
  <div class="post-grid__item">
    <img src="https://picsum.photos/seed/p3/300/300" alt="Post" />
  </div>

</section>
```

```scss
.post-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)); // NEVER overflows
  gap: 2px;
}

.post-grid__item {
  position: relative;
  aspect-ratio: 1 / 1; // always square
  overflow: hidden;
  background: #1c1c1f; // loading fallback
  cursor: pointer;
}

.post-grid__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.post-grid__item:hover img { transform: scale(1.04); }

.post-grid__badges {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.post-grid__badge {
  color: #fff;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));
  display: flex;
  align-items: center;
}
.post-grid__badge svg { width: 18px; height: 18px; }

// Hover overlay — desktop only
.post-grid__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.post-grid__item:hover .post-grid__overlay { opacity: 1; }
```

---

### 12. SETTINGS LIST ROW

```html
<div class="settings-list">
  <p class="settings-section__title">Account Privacy</p>

  <!-- Toggle row -->
  <div class="settings-row">
    <div class="settings-row__content">
      <span class="settings-row__label">Private account</span>
      <span class="settings-row__sublabel">Only approved followers can see your content</span>
    </div>
    <label class="toggle">
      <input type="checkbox" checked />
      <span class="toggle__track"></span>
    </label>
  </div>

  <!-- Chevron row -->
  <div class="settings-row settings-row--pressable">
    <span class="settings-row__label">Blocked accounts</span>
    <!-- chevron-right svg -->
  </div>

  <!-- Danger row -->
  <div class="settings-row settings-row--pressable settings-row--danger">
    <span class="settings-row__label">Delete account</span>
  </div>

</div>
```

```scss
.settings-list { display: flex; flex-direction: column; }

.settings-section__title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #4a4a4e;
  padding: 0.65rem 1rem 0.35rem;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #1c1c1f;
  gap: 0.75rem;
  min-height: 52px;
}

.settings-row--pressable {
  cursor: pointer;
  transition: background 0.15s ease;
}
.settings-row--pressable:hover { background: #1c1c1f; }

.settings-row--danger .settings-row__label { color: #ff453a; }

.settings-row__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.settings-row__label {
  font-size: 0.9375rem;
  color: #f5f5f5;
  font-family: 'Inter', sans-serif;
}

.settings-row__sublabel {
  font-size: 0.8rem;
  color: #737373;
  line-height: 1.4;
  word-break: break-word;
}

.settings-row__chevron {
  width: 16px;
  height: 16px;
  color: #4a4a4e;
  flex-shrink: 0;
}

// Toggle Switch
.toggle { position: relative; display: inline-block; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; position: absolute; }

.toggle__track {
  display: block;
  width: 51px;
  height: 31px;
  background: #313135;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.25s ease;
  position: relative;
}

.toggle__track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 27px;
  height: 27px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.25s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

// Toggle ON — uses gradient start color as accent
.toggle input:checked ~ .toggle__track {
  background: #8134af;
}

.toggle input:checked ~ .toggle__track::after {
  transform: translateX(20px);
}
```

---

### 13. FORM INPUT FIELDS

> Same spec as Auth UI — extended with textarea and char counter.

```html
<!-- Text input -->
<div class="input-group">
  <label class="input-group__label" for="username">Username</label>
  <input class="input-group__field"
         id="username"
         type="text"
         value="alexjohnson"
         maxlength="30" />
  <span class="input-group__hint">30 characters max</span>
</div>

<!-- Textarea -->
<div class="input-group">
  <label class="input-group__label" for="bio">Bio</label>
  <textarea class="input-group__field input-group__field--textarea"
            id="bio"
            placeholder="Write a bio..."
            maxlength="150"
            rows="4">📍 NYC | Photographer & traveler ✈️</textarea>
  <span class="input-group__char-count">40 / 150</span>
</div>
```

```scss
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0.65rem;
}

.input-group__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #737373;
  font-family: 'Inter', sans-serif;
}

// Exact same spec as Auth UI inputs
.input-group__field {
  width: 100%;
  background: #252528;
  border: 1px solid #3a3a3e;
  border-radius: 8px;
  color: #f5f5f5;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  padding: 0.78rem 0.9rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-group__field:focus {
  border-color: #8134af;
  box-shadow: 0 0 0 3px rgba(131, 58, 180, 0.35);
}

.input-group__field::placeholder { color: #737373; font-size: 0.85rem; }

.input-group__field--textarea {
  resize: none;
  line-height: 1.5;
  min-height: 90px;
}

.input-group__hint {
  font-size: 0.7rem;
  color: #4a4a4e;
  font-family: 'Inter', sans-serif;
}

.input-group__char-count {
  font-size: 0.7rem;
  color: #4a4a4e;
  text-align: right;
  font-family: 'Inter', sans-serif;
}
```

---

### 14. CARD SURFACE

> Same spec as Auth UI card — reused across settings pages, modals, info banners.

```html
<div class="card">
  <!-- any content -->
</div>
```

```scss
// Exact same card spec as Auth UI
.card {
  background: #1c1c1f;
  border: 1px solid #313135;
  border-radius: 16px;
  padding: 1.5rem;
  animation: cardIn 0.35s ease both;
}

// Small variant (settings info banners)
.card--sm {
  padding: 0.875rem 1rem;
  border-radius: 12px;
}

// Info card (blue tint for informational messages)
.card--info {
  background: rgba(129, 52, 175, 0.12);
  border-color: rgba(129, 52, 175, 0.3);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

### 15. BOTTOM SHEET / MODAL

```html
<div class="modal-overlay">
  <div class="modal-sheet">
    <div class="modal-sheet__handle"></div>
    <div class="modal-sheet__item modal-sheet__item--danger">Report</div>
    <div class="modal-sheet__item modal-sheet__item--danger">Unfollow</div>
    <div class="modal-sheet__divider"></div>
    <div class="modal-sheet__item">Share to...</div>
    <div class="modal-sheet__item">Copy link</div>
    <div class="modal-sheet__divider"></div>
    <div class="modal-sheet__item modal-sheet__item--cancel">Cancel</div>
  </div>
</div>
```

```scss
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.2s ease;
}

.modal-sheet {
  width: 100%;
  background: #1c1c1f;
  border: 1px solid #313135;
  border-radius: 16px 16px 0 0;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-sheet__handle {
  width: 36px;
  height: 4px;
  background: #3a3a3e;
  border-radius: 9999px;
  margin: 0.65rem auto 0.75rem;
}

.modal-sheet__item {
  padding: 1rem;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  color: #f5f5f5;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s ease;
}
.modal-sheet__item:hover  { background: #252528; }

// Gradient accent on danger — subtle reference to brand
.modal-sheet__item--danger  { color: #ff453a; font-weight: 600; }
.modal-sheet__item--cancel  { color: #c084fc; font-weight: 600; }

.modal-sheet__divider { height: 6px; background: #0e0e10; }

@keyframes fadeIn  { from { opacity: 0; }              to { opacity: 1; }   }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
```

---

### 16. SKELETON LOADER

```html
<div class="skeleton-post">
  <div class="skeleton-post__header">
    <div class="skeleton skeleton--circle skeleton--avatar-md"></div>
    <div class="skeleton-post__lines">
      <div class="skeleton skeleton--line skeleton--w55"></div>
      <div class="skeleton skeleton--line skeleton--w35"></div>
    </div>
  </div>
  <div class="skeleton skeleton--media"></div>
  <div class="skeleton-post__footer">
    <div class="skeleton skeleton--line skeleton--w70"></div>
    <div class="skeleton skeleton--line skeleton--w90"></div>
  </div>
</div>
```

```scss
@keyframes shimmer {
  0%   { background-position: -800px 0; }
  100% { background-position: 800px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #1c1c1f 25%,
    #252528 50%,
    #1c1c1f 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

// Shapes
.skeleton--circle      { border-radius: 50%; }
.skeleton--avatar-md   { width: 44px; height: 44px; flex-shrink: 0; }
.skeleton--media       { width: 100%; aspect-ratio: 1/1; border-radius: 0; }
.skeleton--line        { height: 11px; border-radius: 9999px; }

// Widths
.skeleton--w35 { width: 35%; }
.skeleton--w55 { width: 55%; }
.skeleton--w70 { width: 70%; }
.skeleton--w90 { width: 90%; }

// Post skeleton layout
.skeleton-post__header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.75rem;
}
.skeleton-post__lines  {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.skeleton-post__footer {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

---

### 17. TOAST NOTIFICATION

```html
<div class="toast toast--success" role="alert">
  <!-- check svg -->
  <span class="toast__message">Profile updated successfully</span>
</div>

<div class="toast toast--error" role="alert">
  <!-- warning svg -->
  <span class="toast__message">Something went wrong. Try again.</span>
</div>
```

```scss
.toast {
  position: fixed;
  bottom: calc(60px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  background: #1c1c1f;
  border: 1px solid #313135;
  color: #f5f5f5;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 300;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  animation: toastIn 0.3s ease;
  white-space: nowrap;
  max-width: calc(100vw - 2rem);
}

.toast--success { border-left: 3px solid #30d158; }
.toast--error   { border-left: 3px solid #ff453a; }
.toast svg      { width: 18px; height: 18px; flex-shrink: 0; }

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(16px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

---

## 📐 PAGE LAYOUT & RESPONSIVE SYSTEM

```scss
// App shell
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #0e0e10;
}

.app-layout__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

// Content area
.page__content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: calc(49px + env(safe-area-inset-bottom));
}

// Feed / content column max-width
.content-column {
  max-width: 614px;
  margin: 0 auto;
  width: 100%;
}

// ── Breakpoints ──

// Base = mobile (375px+)

// Large mobile (430px+)
@media (min-width: 430px) {
  .post-card__media { aspect-ratio: 1 / 1; }
}

// Tablet (768px+) — icon sidebar appears, bottom nav hidden
@media (min-width: 768px) {
  .bottom-nav  { display: none; }
  .sidebar     { display: flex; }
  .page__content { padding-bottom: 0; }
}

// Large tablet (1024px+) — sidebar shows labels
@media (min-width: 1024px) {
  .sidebar { width: 220px; }
  .sidebar__label { display: block; }
}

// Desktop (1280px+)
@media (min-width: 1280px) {
  .sidebar { width: 245px; }
}

// Wide desktop (1440px+)
@media (min-width: 1440px) {
  .sidebar { width: 275px; }
}
```

---

## ✅ UI RESILIENCE CHECKLIST

| Rule | How It's Enforced |
|---|---|
| Images never break layout | `aspect-ratio: 1/1` + `object-fit: cover` on all media |
| Broken images have fallback | `background: #1c1c1f` on all image wrappers |
| Text never overflows | `.truncate` + `word-break: break-word` everywhere |
| Flex children never overflow | `min-width: 0` on every flex child |
| Avatars always stay circular | `flex-shrink: 0` + `overflow: hidden` on `.avatar` |
| Safe areas respected | `env(safe-area-inset-bottom)` on bottom nav and toasts |
| Horizontal scroll hidden | `scrollbar-width: none` on highlights row |
| Inputs never overflow | `box-sizing: border-box` + `width: 100%` |
| Grid never overflows | `repeat(3, minmax(0, 1fr))` — never fixed widths |
| Long bios / captions safe | `.word-safe` class with `overflow-wrap: anywhere` |
| Modals safe on all screens | `max-width: calc(100vw - 2rem)` on toast |
| Bottom bar iPhone notch | `env(safe-area-inset-bottom)` on bottom nav |
| Cards animate in | `cardIn` keyframe on every `.card` and `.post-card` |
| Loading states exist | Skeleton shimmer for all async feed content |

---

## 📦 DUMMY DATA REFERENCE

```js
// Current user
const ME = {
  id: "u_001",
  username: "alexjohnson",
  displayName: "Alex Johnson",
  avatar: "https://i.pravatar.cc/150?img=1",
  bio: "📍 NYC | Photographer & traveler ✈️\nCapturing moments that last forever 📸",
  website: "linktr.ee/alexjohnson",
  category: "Digital Creator",
  posts: 47,
  followers: 2847,
  following: 312,
};

// Feed post
const POST = {
  id: "p_001",
  username: "travel_diaries",
  userAvatar: "https://i.pravatar.cc/150?img=3",
  location: "Santorini, Greece",
  images: ["https://picsum.photos/seed/santorini/600/600"],
  caption: "Golden hour in Santorini 🌅 Nothing beats this view.",
  likes: 1234,
  comments: 89,
  timestamp: "2 hours ago",
  isLiked: false,
  isSaved: false,
  isPinned: false,
  isCarousel: true,
  isVideo: false,
};

// Story highlights
const HIGHLIGHTS = [
  { id: "h_001", label: "Travel",  cover: "https://picsum.photos/seed/travel/120/120"  },
  { id: "h_002", label: "Food",    cover: "https://picsum.photos/seed/food/120/120"    },
  { id: "h_003", label: "NYC",     cover: "https://picsum.photos/seed/nyc/120/120"     },
  { id: "h_004", label: "Work",    cover: "https://picsum.photos/seed/work/120/120"    },
  { id: "h_005", label: "Fitness", cover: "https://picsum.photos/seed/fitness/120/120" },
];

// Post grid
const GRID = Array.from({ length: 15 }, (_, i) => ({
  id: `g_${String(i).padStart(3, "0")}`,
  thumbnail: `https://picsum.photos/seed/grid${i}/300/300`,
  isVideo:    i % 5 === 0,
  isCarousel: i % 4 === 0,
  isPinned:   i < 2,
  likes:    Math.floor(Math.random() * 5000) + 100,
  comments: Math.floor(Math.random() * 200) + 5,
}));
```

---

## 🎨 DESIGN PRINCIPLES (from Auth UI — applies everywhere)

1. **Minimal color** — Instagram gradient is an accent, not a background wash.
2. **Dark gray, not black** — `#0e0e10` reads as premium; pure `#000` feels flat.
3. **One typeface for UI** — `Inter` everywhere except the decorative logo (`Grand Hotel`).
4. **Interaction-only animations** — hover, focus, active, cardIn only. No continuous loops (except skeleton shimmer).
5. **Generous whitespace** — cards breathe; inputs aren't cramped.
6. **Gradient is sacred** — only on logo, primary buttons, story rings, and active toggle. Never anywhere else.
7. **Resilience over beauty** — if an image breaks or text is too long, layout must hold. Always.