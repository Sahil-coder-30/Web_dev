# 💀 SKELETON LOADER — GUIDANCE FILE
### For Antigravity — Read This Before Building Any Skeleton
> **This file does NOT contain components.**
> It tells you the rules, logic, and decisions behind every skeleton
> you need to build for this Instagram clone.
> Your job is to create the skeletons. This file is your brain.

---

## WHAT IS A SKELETON LOADER

A skeleton loader is a placeholder UI that appears **while real content
is loading from the API**. It mimics the exact shape, size, spacing,
and layout of the real component it will be replaced by — but uses
animated shimmer blocks instead of real content.

The user sees the skeleton first. When data arrives, the skeleton
disappears and the real component fades in.

---

## THE ONE RULE THAT OVERRIDES EVERYTHING

> **The skeleton must be a perfect shadow of the real component.**
>
> Same padding. Same gap. Same avatar size. Same number of lines.
> Same button positions. Same grid columns.
> If the real component has a 44px avatar on the left and two lines
> of text to the right — the skeleton has a 44px circle on the left
> and two shimmer lines to the right.
> Nothing more. Nothing less.

If the skeleton looks different from the real component in
proportions or layout — it is wrong. Fix it.

---

## SHIMMER ANIMATION RULES

- The shimmer must move **left to right** across the element
- Use only `#1c1c1f` and `#252528` for the shimmer gradient
  — these are the exact surface tokens from DESIGN_SYSTEM.md
- Background must be `#0e0e10` (same as page background)
- Speed: `1.5s infinite linear` — not too fast, not too slow
- All shimmer elements share the same animation so they
  pulse together in sync, not independently

---

## SHAPE RULES

| Real element          | Skeleton shape         | Border radius  |
|-----------------------|------------------------|----------------|
| Avatar                | Circle                 | 50%            |
| Post image / media    | Square block           | 0px            |
| Text line             | Thin pill              | 9999px         |
| Button                | Rounded rectangle      | 8px            |
| Card                  | Rounded rectangle      | 16px           |
| Highlight ring        | Circle                 | 50%            |
| Grid thumbnail        | Square                 | 0px            |
| Input field           | Rounded rectangle      | 8px            |
| Badge / tag           | Small pill             | 9999px         |
| Icon button           | Circle                 | 50%            |

---

## TEXT LINE RULES

When replacing text with skeleton lines, follow these width rules
so the skeleton feels natural and not robotic:

| Text type             | Skeleton line width |
|-----------------------|---------------------|
| Username / name       | 40–55% of container |
| Secondary label       | 25–35% of container |
| Long caption line 1   | 85–90% of container |
| Long caption line 2   | 60–70% of container |
| Short timestamp       | 25–30% of container |
| Bio line 1            | 70–80% of container |
| Bio line 2            | 55–65% of container |
| Bio line 3            | 40–50% of container |
| Like count            | 35–40% of container |
| Comments link         | 45–55% of container |
| Website link          | 40–50% of container |
| Section title         | 30–40% of container |
| Button label (full)   | 100% of button      |

**Never make all lines the same width.**
Varying widths make the skeleton feel like real content at a glance.

---

## AVATAR SIZE RULES

Match these exactly to the real avatar sizes in DESIGN_SYSTEM.md:

| Usage                        | Size     |
|------------------------------|----------|
| Feed post header             | 44px     |
| Comment row                  | 32px     |
| Notification row             | 44px     |
| Story highlight ring         | 64px     |
| Profile header (own account) | 86px     |
| Profile header (desktop)     | 150px    |
| Bottom nav profile icon      | 24px     |
| Suggested user row           | 44px     |
| Liked-by overlap avatars     | 24px     |

If you use the wrong size, the skeleton will shift the layout
when the real component loads. That is a bug.

---

## WHICH SCREENS NEED SKELETONS

Build a skeleton for every screen that loads data asynchronously.
Here is the full list with what each skeleton must cover:

### FEED PAGE
- Navbar is real — never skeleton the navbar
- Each post card gets its own skeleton while loading
- Show 3 post card skeletons on first load
- Each post card skeleton must include:
  → Avatar circle (44px) + username line + location line + follow button shape
  → Full width square media block
  → Three icon circles in a row (actions)
  → Like count line
  → Two caption lines (different widths)
  → Comments link line
  → Timestamp line

### PROFILE PAGE
- Navbar is real
- Skeleton covers:
  → Profile header (avatar 86px + 3 stat columns + bio lines + button row)
  → Highlights row (5–6 circles with label lines below each)
  → Tab bar is real — never skeleton the tabs
  → Post grid (9 square blocks, 3 columns, 2px gap)

### POST DETAIL PAGE
- Top section: avatar (44px) + username line + location line
- Full width media block
- Action icons row
- Like count line
- Two caption lines
- Comments section: 3 comment rows
  → Each comment row: avatar (32px) + two lines of text

### NOTIFICATIONS PAGE
- Each notification row skeleton:
  → Avatar circle (44px) on left
  → Two lines of text (different widths)
  → Square image thumbnail (44px) on far right

### EXPLORE / SEARCH PAGE
- Search bar block at top (full width, 40px tall)
- Grid of square thumbnail blocks
  → 3 columns with 2px gap
  → Show 12 square skeleton blocks

### SETTINGS PAGES
- Each settings row skeleton:
  → One line of text (55–65% wide)
  → Either a toggle shape or chevron shape on the right
- Show 5–6 rows per section

### MESSAGES / DM LIST PAGE
- Each conversation row skeleton:
  → Avatar circle (56px) on left
  → Two lines (name + last message, different widths)
  → Timestamp line on far right (very short, ~20%)

### SUGGESTED USERS / FOLLOW LIST
- Each row:
  → Avatar (44px) on left
  → Two lines (username + full name)
  → Button shape on right

---

## WHAT TO NEVER SKELETON

These elements are always rendered immediately and must
never be replaced with a skeleton:

- Top navbar
- Bottom navigation bar
- Left sidebar
- Tab bars (profile tabs, explore tabs)
- Page titles
- Error states
- Empty states
- Already loaded content that is being refreshed

---

## TRANSITION RULES

When real content replaces the skeleton:

- The skeleton must fade out with `opacity: 0`
  and the real component must fade in with `opacity: 1`
- Transition duration: `0.3s ease`
- Never let the layout shift during this transition
- The real component must occupy the exact same space
  as the skeleton — no jumps, no reflows

---

## WHAT BREAKS A SKELETON — AVOID THESE

| Mistake                               | Why it is wrong                              |
|---------------------------------------|----------------------------------------------|
| Skeleton taller than real component   | Causes layout shift on load                  |
| Skeleton shorter than real component  | Same problem — layout jumps                  |
| All text lines the same width         | Looks robotic and fake                       |
| Wrong avatar size                     | Layout shifts when real avatar loads         |
| Media block without aspect-ratio      | Height unpredictable — breaks layout         |
| Using #000000 for skeleton bg         | Doesn't match page background #0e0e10        |
| Using white or light colors           | Breaks the dark theme entirely               |
| Independent shimmer timing per element| Looks chaotic — all must pulse together      |
| Skeleton on navbar or tabs            | These load instantly — no skeleton needed    |
| Fixed height on text lines            | Use line heights from the spec not px values |

---

## STACKING MULTIPLE SKELETONS

When showing a list of skeleton items (feed, notifications, DMs):

- Always show **3 items** for the feed
- Always show **5 items** for list pages (notifications, DMs, followers)
- Always show **9 blocks** for grids (3×3)
- Always show **5 circles** for highlights row
- Items must be separated by the same gap/divider as the real list
- Each item fades in with a slight stagger delay so they
  don't all appear at once:
  → Item 1: delay 0ms
  → Item 2: delay 75ms
  → Item 3: delay 150ms
  → Item 4: delay 225ms
  → Item 5: delay 300ms

---

## DESIGN SYSTEM REMINDER

Every skeleton you build must use only these values:

| Property        | Value                              |
|-----------------|------------------------------------|
| Shimmer base    | #1c1c1f                            |
| Shimmer shine   | #252528                            |
| Page background | #0e0e10                            |
| All borders     | #313135                            |
| Animation       | shimmer 1.5s infinite linear       |
| Gradient dir    | 90deg left to right                |
| Card radius     | 16px                               |
| Input radius    | 8px                                |
| Avatar radius   | 50%                                |
| Pill radius     | 9999px                             |
| Text line height| 11px (normal) / 14px (lg) / 18px (xl)|

**Never introduce any new color, radius, or animation value
that is not listed in DESIGN_SYSTEM.md.**

---

## QUICK REFERENCE SUMMARY

```
Real component loads?     → Show skeleton first
Skeleton shape?           → Mirror the real component exactly
Shimmer colors?           → #1c1c1f and #252528 only
Page background?          → #0e0e10
Avatar shape?             → Always 50% circle
Image/media shape?        → Always aspect-ratio 1/1, radius 0
Text lines?               → Vary widths, never all the same
Transition to real?       → opacity fade 0.3s ease, no layout shift
Navbar/tabs/sidebar?      → Never skeleton these
Feed skeletons?           → Show 3
List skeletons?           → Show 5
Grid skeletons?           → Show 9 (3×3)
Highlights skeletons?     → Show 5 circles
Stagger delay?            → 75ms between each item
```