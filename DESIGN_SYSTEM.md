# Tessa Design System

> A liquid glass inspired virtual assistant app design system

## Overview

Tessa is a personal virtual assistant focused on task management, reminders, and proactive context-aware suggestions. The design follows Apple's "Liquid Glass" aesthetic with glassmorphism effects, subtle animations, and a modern, approachable feel.

---

## Design Principles

1. **Liquid Glass Aesthetic** - Translucent surfaces with backdrop blur, creating depth
2. **Subtle Motion** - Gentle animations that feel alive but not distracting
3. **Contextual Warmth** - Friendly, approachable UI that feels personal
4. **Progressive Disclosure** - Show what's needed, reveal more on scroll/interaction

---

## Color System

### Base Colors (Dark Mode)
```javascript
bg: '#0a0a0f'              // Main background
surface: 'rgba(255,255,255,0.05)'      // Subtle surface
surfaceGlass: 'rgba(255,255,255,0.08)' // Glass card background
surfaceSolid: '#151519'    // Solid surface when needed
text: '#FFFFFF'            // Primary text
textMuted: '#a1a1aa'       // Secondary text
textSecondary: '#71717a'   // Tertiary/hint text
border: 'rgba(255,255,255,0.1)'        // Subtle borders
borderGlass: 'rgba(255,255,255,0.15)'  // Glass card borders
```

### Base Colors (Light Mode)
```javascript
bg: '#fafafa'
surface: 'rgba(0,0,0,0.03)'
surfaceGlass: 'rgba(255,255,255,0.7)'
surfaceSolid: '#ffffff'
text: '#18181b'
textMuted: '#52525b'
textSecondary: '#71717a'
border: 'rgba(0,0,0,0.08)'
borderGlass: 'rgba(255,255,255,0.5)'
```

### Accent Color Palettes

Each palette has: `primary`, `light`, `dark`, `secondary`, `gradient`

#### 1. Sunset (Default)
```javascript
primary: '#fb923c'    // Orange
light: '#fdba74'
dark: '#ea580c'
secondary: '#f472b6'  // Pink
gradient: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #a78bfa 100%)'
```

#### 2. Ocean
```javascript
primary: '#38bdf8'    // Sky blue
light: '#7dd3fc'
dark: '#0284c7'
secondary: '#22d3ee'  // Cyan
gradient: 'linear-gradient(135deg, #38bdf8 0%, #22d3ee 50%, #a78bfa 100%)'
```

#### 3. Forest
```javascript
primary: '#4ade80'    // Green
light: '#86efac'
dark: '#16a34a'
secondary: '#2dd4bf'  // Teal
gradient: 'linear-gradient(135deg, #4ade80 0%, #2dd4bf 50%, #38bdf8 100%)'
```

#### 4. Lavender
```javascript
primary: '#a78bfa'    // Purple
light: '#c4b5fd'
dark: '#7c3aed'
secondary: '#f472b6'  // Pink
gradient: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb7185 100%)'
```

#### 5. Rose
```javascript
primary: '#fb7185'    // Rose
light: '#fda4af'
dark: '#e11d48'
secondary: '#f472b6'  // Pink
gradient: 'linear-gradient(135deg, #fb7185 0%, #f472b6 50%, #e879f9 100%)'
```

#### 6. Midnight
```javascript
primary: '#6366f1'    // Indigo
light: '#818cf8'
dark: '#4f46e5'
secondary: '#8b5cf6'  // Violet
gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)'
```

#### 7. Ember
```javascript
primary: '#f87171'    // Red
light: '#fca5a5'
dark: '#dc2626'
secondary: '#fb923c'  // Orange
gradient: 'linear-gradient(135deg, #f87171 0%, #fb923c 50%, #fbbf24 100%)'
```

#### 8. Mint
```javascript
primary: '#2dd4bf'    // Teal
light: '#5eead4'
dark: '#0d9488'
secondary: '#4ade80'  // Green
gradient: 'linear-gradient(135deg, #2dd4bf 0%, #4ade80 50%, #a3e635 100%)'
```

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
```javascript
xs: '11px'      // Labels, hints
sm: '12px'      // Secondary text, badges
base: '13px'    // Body text
md: '14px'      // Emphasized body
lg: '16px'      // Subtitles
xl: '18px'      // Section headers
'2xl': '20px'   // Modal titles
'3xl': '22px'   // Quotes, large text
'4xl': '28px'   // Page titles
```

### Font Weights
```javascript
normal: 400
medium: 500
semibold: 600
bold: 700
```

---

## Spacing

```javascript
xs: '4px'
sm: '8px'
md: '10px'
base: '12px'
lg: '14px'
xl: '16px'
'2xl': '18px'
'3xl': '20px'
'4xl': '24px'
'5xl': '32px'
'6xl': '40px'
```

---

## Border Radius

```javascript
sm: '8px'
md: '10px'
base: '12px'
lg: '14px'
xl: '16px'
'2xl': '20px'
'3xl': '24px'
full: '9999px'  // Circular
```

---

## Shadows

### Glass Shadow (Dark Mode)
```css
box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
```

### Glass Shadow with Glow
```css
box-shadow: 0 8px 32px rgba(251,146,60,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
```

### Elevated Shadow
```css
box-shadow: 0 10px 40px rgba(0,0,0,0.3);
```

### Button Glow (Accent)
```css
box-shadow: 0 4px 16px rgba(251,146,60,0.4);
```

---

## Components

### GlassCard

The primary container component with liquid glass effect.

```jsx
<GlassCard glow={false} onClick={handler} style={customStyles}>
  {children}
</GlassCard>
```

**CSS Properties:**
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-radius: 24px;
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
position: relative;
overflow: hidden;
```

**Glass Highlight (inner element):**
```css
position: absolute;
top: 0;
left: 0;
right: 0;
height: 50%;
background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%);
pointer-events: none;
```

### Overlay/Modal

For Voice Modal and Briefing Modal.

```css
position: fixed;
inset: 0;
background: rgba(10, 10, 15, 0.75);  /* Semi-transparent */
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
z-index: 1000;
display: flex;
align-items: center;
justify-content: center;
padding: 20px;
```

**Modal Content:** Uses GlassCard with max-width: 380px

### TessaOrb

The animated Tessa avatar/indicator.

**Structure:**
1. Outer glow (blur)
2. Pulsing ring
3. Core with gradient
4. Highlight reflection

```css
/* Glow */
.orb-glow {
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  background: var(--gradient);
  filter: blur(24px);
  opacity: 0.25;
  animation: glow-pulse 3s ease-in-out infinite;
}

/* Ring */
.orb-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid var(--accent-primary);
  opacity: 0.3;
  animation: ring-pulse 3s ease-in-out infinite;
}

/* Core */
.orb-core {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--gradient);
  box-shadow: inset 0 -8px 16px rgba(0,0,0,0.3), 
              inset 0 4px 8px rgba(255,255,255,0.2);
  animation: core-pulse 3s ease-in-out infinite;
}
```

### Wave Animation (Voice)

SVG-based animated waves for voice modal.

```jsx
<svg width={240} height={50}>
  {[0, 1, 2].map(i => (
    <path
      d={generateWavePath(i, wavePhase, isListening)}
      fill="none"
      stroke={colors[i]}
      strokeWidth={2.5 - i * 0.5}
      opacity={0.8 - i * 0.2}
      strokeLinecap="round"
    />
  ))}
</svg>
```

---

## Animations

### Keyframes

```css
/* Pulse - for floating button */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

/* Bounce - for scroll indicator */
@keyframes bounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(6px); opacity: 0.6; }
}

/* Shimmer - for text highlight effect */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Orb Glow Pulse */
@keyframes glow-pulse {
  0%, 100% { transform: scale(1); opacity: 0.25; }
  50% { transform: scale(1.15); opacity: 0.4; }
}

/* Orb Ring Pulse */
@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.15; }
}

/* Orb Core Pulse */
@keyframes core-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Audio Bars */
@keyframes bar {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}
```

### Shimmer Text Effect

```css
.shimmer {
  background: linear-gradient(90deg, 
    var(--text-secondary) 0%, 
    var(--text-secondary) 35%, 
    var(--text-primary) 50%, 
    var(--text-secondary) 65%, 
    var(--text-secondary) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s ease-in-out infinite;
}
```

---

## Scroll Behavior

### Quote Fade Out
```javascript
const scrollThreshold = 250;
const quoteOpacity = Math.max(0, 1 - scrollY / scrollThreshold);
```

### Content Fade In
```javascript
const contentOpacity = Math.min(1, (scrollY - 80) / 150);
```

Apply with `transition: opacity 0.6s ease-out`

---

## Ambient Background

Subtle gradient orbs in the background:

```jsx
{/* Purple orb - top right */}
<div style={{
  position: 'fixed',
  top: '-20%',
  right: '-20%',
  width: '70%',
  height: '50%',
  background: `radial-gradient(circle, ${purple}15 0%, transparent 70%)`,
  pointerEvents: 'none',
}} />

{/* Orange orb - bottom left */}
<div style={{
  position: 'fixed',
  bottom: '-10%',
  left: '-20%',
  width: '60%',
  height: '40%',
  background: `radial-gradient(circle, ${orange}10 0%, transparent 70%)`,
  pointerEvents: 'none',
}} />
```

---

## Mobile Considerations

- Max width: 430px (iPhone Pro Max)
- Touch targets: minimum 44x44px
- Status bar padding: 70px top
- Bottom safe area: 24px + floating button height
- Backdrop filter performance: use sparingly

---

## Accessibility Notes

- Ensure text contrast ratio meets WCAG AA (4.5:1)
- Glass effects should have fallback solid backgrounds
- Reduce motion option should disable animations
- Voice features need visual feedback

---

## File Structure Reference

```
/src
├── /components
│   ├── /ui
│   │   ├── GlassCard.jsx
│   │   ├── Button.jsx
│   │   ├── Avatar.jsx
│   │   └── Badge.jsx
│   ├── /home
│   │   ├── Header.jsx
│   │   ├── MorningBrief.jsx
│   │   ├── QuoteSection.jsx
│   │   └── AttentionCards.jsx
│   ├── /voice
│   │   ├── VoiceOverlay.jsx
│   │   ├── TessaOrb.jsx
│   │   └── WaveAnimation.jsx
│   ├── /settings
│   │   ├── SettingsScreen.jsx
│   │   └── ColorThemePicker.jsx
│   ├── /notes
│   │   ├── NotesScreen.jsx
│   │   └── NoteCard.jsx
│   └── /briefing
│       └── BriefingOverlay.jsx
├── /hooks
│   ├── useTheme.js
│   └── useScrollFade.js
├── /context
│   ├── ThemeContext.jsx
│   └── AppContext.jsx
├── /styles
│   └── themes.js
└── App.jsx
```
