# Claude Code - Tessa App Starter Prompt

Copy and paste this prompt when starting Claude Code with the Tessa repository:

---

## Prompt:

```
I'm building Tessa, a personal virtual assistant mobile app with a liquid glass design aesthetic. The repository contains:

**Documentation:**
- `DESIGN_SYSTEM.md` - Complete design system with colors, typography, components, animations
- `FEATURES.md` - Detailed feature specifications and data models
- `CLAUDE_CODE_PROMPT.md` - This file

**Existing Code:**
- `src/styles/themes.js` - Theme system with 8 color palettes, dark/light modes
- `src/context/ThemeContext.jsx` - React context for app-wide theming
- `src/components/ui/GlassCard.jsx` - Reusable glass card component
- `src/components/voice/TessaOrb.jsx` - Animated Tessa orb component
- `tessa-demo-v13.jsx` - Working prototype with full UI (reference implementation)

**Tech Stack:**
- React Native (or React for web prototype)
- Context API for state management
- CSS-in-JS (inline styles currently, can migrate to styled-components)

**Design Characteristics:**
- Liquid glass/glassmorphism aesthetic
- backdrop-filter blur effects
- Gradient accents
- Subtle pulse and shimmer animations
- Dark and light mode support
- 8 selectable accent color palettes

**Current Priority:**
1. Set up proper project structure with the existing components
2. Implement Settings screen with Color Theme picker
3. Create Notes system (UI + basic data structure)
4. Ensure all overlays work correctly (voice modal, briefing modal)

**Key Design Patterns:**
- GlassCard component for all card-like containers
- Theme accessed via useTheme() hook
- Overlays use semi-transparent backdrop with blur
- Animations defined as CSS keyframes

Please start by reviewing the DESIGN_SYSTEM.md and FEATURES.md files to understand the full context. Then help me implement the Settings screen with the color theme picker.
```

---

## Quick Reference Commands

### First Session Setup
```
Review the documentation first:
- Read DESIGN_SYSTEM.md for visual specs
- Read FEATURES.md for functionality specs
- Check tessa-demo-v13.jsx for reference implementation
```

### Common Tasks

**Add new color palette:**
```
Add a new accent palette to src/styles/themes.js following the existing pattern.
Include: primary, primaryLight, primaryDark, secondary, tertiary, gradient, glassGradient, glowColor
```

**Create new screen:**
```
Create a new screen component following the glass design system.
Use GlassCard for containers, useTheme() for colors, 
and maintain consistent spacing from DESIGN_SYSTEM.md
```

**Add animation:**
```
Add a new animation using CSS keyframes.
Follow the patterns in DESIGN_SYSTEM.md (pulse, shimmer, bounce).
Keep animations subtle - 2-3s duration, ease-in-out timing.
```

---

## File Structure Target

```
/tessa-app
├── /src
│   ├── /components
│   │   ├── /ui
│   │   │   ├── GlassCard.jsx ✅
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Input.jsx
│   │   ├── /home
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── MorningBrief.jsx
│   │   │   ├── QuoteSection.jsx
│   │   │   └── AttentionCards.jsx
│   │   ├── /voice
│   │   │   ├── VoiceOverlay.jsx
│   │   │   ├── TessaOrb.jsx ✅
│   │   │   └── WaveAnimation.jsx
│   │   ├── /settings
│   │   │   ├── SettingsScreen.jsx
│   │   │   ├── ColorThemePicker.jsx
│   │   │   └── SettingsItem.jsx
│   │   ├── /notes
│   │   │   ├── NotesScreen.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   └── QuickNoteInput.jsx
│   │   └── /briefing
│   │       └── BriefingOverlay.jsx
│   ├── /context
│   │   ├── ThemeContext.jsx ✅
│   │   └── AppContext.jsx
│   ├── /hooks
│   │   ├── useTheme.js
│   │   ├── useNotes.js
│   │   └── useScrollFade.js
│   ├── /styles
│   │   └── themes.js ✅
│   ├── /utils
│   │   └── helpers.js
│   └── App.jsx
├── DESIGN_SYSTEM.md ✅
├── FEATURES.md ✅
├── CLAUDE_CODE_PROMPT.md ✅
├── tessa-demo-v13.jsx ✅ (reference)
└── README.md
```

✅ = Already created

---

## Notes for Claude Code

1. **Reference Implementation:** `tessa-demo-v13.jsx` contains a working prototype. Extract patterns from here but refactor into proper component structure.

2. **Theme Usage:** Always use `useTheme()` hook to access colors. Never hardcode color values.

3. **Glass Effect Pattern:**
```jsx
background: theme.surfaceGlass,
backdropFilter: 'blur(20px)',
WebkitBackdropFilter: 'blur(20px)',
border: `1px solid ${theme.borderGlass}`,
```

4. **Overlay Pattern:**
```jsx
position: 'fixed',
inset: 0,
background: theme.overlayBg,
backdropFilter: 'blur(24px)',
zIndex: 1000,
```

5. **Animation Classes:** Define keyframes in component or global styles, apply via className or inline animation property.
