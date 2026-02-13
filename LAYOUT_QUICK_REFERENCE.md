# Quick Layout Reference

## ✅ What Was Fixed

### Problem 1: Form Stuck to Left
**Before:**
```
┌─────────────────────────────────┐
│ FORM  │                         │
│ CARD  │      EMPTY SPACE        │
│       │                         │
└─────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────┐
│                                 │
│         ┌─────────────┐         │
│         │  FORM CARD  │         │
│         │   550px     │         │
│         └─────────────┘         │
│                                 │
└─────────────────────────────────┘
```

---

## Key CSS Classes

### `page-wrapper` (NEW)
```css
display: flex;
align-items: center;
justify-content: center;
min-height: 100vh;
```
**Handles:** Full-screen centering for homepage

### `container`
```css
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
```
**Handles:** Flex column layout, centers children

### `hero-container` (NEW)
```css
max-width: 550px;
display: flex;
flex-direction: column;
align-items: center;
```
**Handles:** Form card constraints, centering

### `glass-card`
```css
width: 100%;
max-width: 550px;
backdrop-filter: blur(15px);
border: 1px solid rgba(0, 217, 255, 0.4);
```
**Handles:** Premium form styling, glassmorphism

---

## HTML Structure

```
page-wrapper ─────────────────────────
  ├─ stars (background)
  ├─ stars2 (background)
  ├─ stars3 (background)
  └─ container
     └─ view (homepage OR results)
        ├─ hero-container (homepage only)
        │  ├─ hero-section (title, subtitle)
        │  └─ glass-card form-card
        │     └─ form with inputs
        │
        └─ results-container (results only)
           ├─ comparison-layout
           │  ├─ path-card current-path
           │  └─ path-card alternate-reality
           ├─ timeline
           ├─ hidden-costs
           └─ meter-section
```

---

## Responsive Breakpoints

| Breakpoint | Layout | Form Width |
|-----------|--------|-----------|
| 1200px+ | Full side-by-side | 550px |
| 1024px | Columns, gap reduced | 550px |
| 768px | Stack vertically | Full width |
| 480px | Stack vertically | Full width - padding |

---

## Color System

```css
--neon-blue: #00d9ff      /* Primary accent, borders */
--neon-purple: #b000d9    /* Secondary, timeline gradient */
--neon-amber: #ffaa00     /* Hidden costs highlight */
--neon-green: #00ff88     /* Current path indicator */

--glass-light: rgba(255, 255, 255, 0.05)    /* Card background */
--glass-lighter: rgba(255, 255, 255, 0.08)  /* Lighter variant */
```

---

## Premium Effects

```css
/* Glassmorphism */
backdrop-filter: blur(15px);
border: 1px solid rgba(0, 217, 255, 0.4);

/* Neon Glow */
box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);

/* Dual Shadow */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(0, 217, 255, 0.1);

/* Focus Glow */
box-shadow: var(--border-glow), 
            inset 0 0 10px rgba(0, 217, 255, 0.1);
```

---

## Button States

### Default
```css
background: linear-gradient(135deg, #00d9ff, #b000d9);
box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
```

### Hover
```css
transform: translateY(-2px);
box-shadow: 0 0 40px rgba(0, 217, 255, 0.5);
```

### Disabled
```css
opacity: 0.6;
cursor: not-allowed;
```

---

## Forms

### Input Default
```css
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(0, 217, 255, 0.2);
border-radius: 10px;
```

### Input Focus
```css
background: rgba(255, 255, 255, 0.08);
border-color: #00d9ff;
box-shadow: glow + inset glow;
```

---

## Testing Tips

1. **Desktop Test:**
   - Open http://localhost:5000
   - Form should be centered, not on the left
   - Plenty of space on both sides

2. **Tablet Test:**
   - Resize browser to 768px width
   - Form should still be centered
   - Cards should reflow gracefully

3. **Mobile Test:**
   - Resize browser to 480px width
   - Form takes full width with padding
   - Results stack vertically

4. **Glassmorphism Check:**
   - Look for the blurred background effect
   - See the neon glow around card border

5. **Animation Check:**
   - Click "Simulate" button
   - Watch for smooth fade-in animations
   - Timeline cards should slide in with delays

---

## File Locations

```
life-simulator/
├── templates/
│   └── index.html          (UPDATED: Added page-wrapper, hero-container)
├── static/
│   └── css/
│       └── style.css        (REWRITTEN: Complete layout overhaul)
└── app.py                   (No changes)
```

---

## Common Issues & Fixes

### "Form is still on the left"
✓ Clear browser cache (Ctrl+Shift+Delete)
✓ Hard refresh (Ctrl+F5)
✓ Check if CSS loaded (DevTools → Network)

### "Form extends off-screen on mobile"
✓ Check viewport meta tag in HTML
✓ Test at actual 480px width
✓ Check page-wrapper padding

### "Cards not centered on desktop"
✓ Check `max-width` on comparison-layout
✓ Check `margin-left: auto; margin-right: auto;`
✓ Check browser zoom is 100%

### "Glassmorphism not visible"
✓ Check `backdrop-filter: blur(15px);`
✓ Check browser supports backdrop-filter
✓ Check border opacity is visible

---

## Performance Notes

- 🟢 CSS-only animations (no JavaScript)
- 🟢 Hardware-accelerated transforms
- 🟢 Single CSS file, no external libraries
- 🟢 Mobile-optimized (60fps animations)
- 🟢 Light DOM structure

---

## Version Info

- **Layout Fix Date:** 2026-02-13
- **CSS Version:** 2.0 (Complete rewrite)
- **HTML Changes:** 2 divs added (page-wrapper, hero-container)
- **Status:** ✅ Complete and tested

---

**All layout issues resolved! The form is now perfectly centered with a premium startup aesthetic.** 🚀
