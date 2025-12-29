# Tessa - Personal Virtual Assistant

> A liquid glass inspired virtual assistant app for task management, reminders, and proactive context-aware suggestions.

![Tessa App](https://via.placeholder.com/800x400/0a0a0f/fb923c?text=Tessa+App)

## ✨ Features

- 🎤 **Voice Interaction** - Talk naturally with Tessa
- 📝 **Smart Notes** - Context-aware note taking with proactive reminders
- 📅 **Calendar Integration** - Unified view of your schedule
- 📧 **Email Management** - Urgent items at a glance
- 🎨 **Liquid Glass Design** - Beautiful glassmorphism UI
- 🌓 **Dark/Light Mode** - With 8 accent color palettes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tessa-app.git

# Navigate to project
cd tessa-app

# Install dependencies
npm install

# Start development server
npm start
```

## 📁 Project Structure

```
/src
├── /components     # React components
│   ├── /ui         # Reusable UI components
│   ├── /home       # Home screen components
│   ├── /voice      # Voice modal components
│   ├── /settings   # Settings screen
│   └── /notes      # Notes system
├── /context        # React Context providers
├── /hooks          # Custom hooks
├── /styles         # Theme and styling
└── /utils          # Helper functions
```

## 📖 Documentation

- [Design System](./DESIGN_SYSTEM.md) - Colors, typography, components, animations
- [Features](./FEATURES.md) - Complete feature specifications
- [Claude Code Prompt](./CLAUDE_CODE_PROMPT.md) - AI development guide

## 🎨 Design System

### Color Palettes

| Palette | Preview |
|---------|---------|
| 🌅 Sunset | Orange → Pink → Purple |
| 🌊 Ocean | Blue → Cyan → Purple |
| 🌲 Forest | Green → Teal → Blue |
| 💜 Lavender | Purple → Pink → Rose |
| 🌸 Rose | Rose → Pink → Fuchsia |
| 🌙 Midnight | Indigo → Violet → Purple |
| 🔥 Ember | Red → Orange → Yellow |
| 🍃 Mint | Teal → Green → Lime |

### Glass Effect

```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.15);
```

## 🛠️ Tech Stack

- **Framework:** React / React Native
- **State:** Context API
- **Styling:** CSS-in-JS
- **Animations:** CSS Keyframes

## 📱 Screens

1. **Home** - Dashboard with morning brief, schedule, emails
2. **Voice Modal** - Talk with Tessa overlay
3. **Settings** - Theme, voice, notifications
4. **Notes** - Smart context-aware notes
5. **Calendar** - Schedule management
6. **Tasks** - Todo list with priorities
7. **Mail** - Email overview

## 💎 PRO Features

- Continuous voice conversation (no push-to-talk)
- "Hey Tessa" wake word
- Web search & research
- Home screen widgets
- Siri/Google Assistant integration
- Audio briefing playback

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

Made with ❤️ and ☕
