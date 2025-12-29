# Tessa App - Feature Specification

> Complete feature list and specifications for the Tessa virtual assistant app

---

## 1. Core Concept

**Tessa** is a personal virtual assistant focused on:
- Task management & reminders
- Proactive context-aware suggestions
- Natural voice interaction
- Information organization & recall

**Target Users:** Solopreneurs, busy professionals, productivity enthusiasts

---

## 2. Screens & Navigation

### 2.1 Home Screen
- **Header:** Greeting (time-based), user name, avatar, theme toggle
- **Morning Brief Card:** Quick summary, tap for details
- **Quote Section:** Daily motivation, fades on scroll
- **Your Stuff Indicator:** Shimmer text, scroll hint
- **Below Fold Content:**
  - Recent topics (horizontal scroll)
  - Attention cards (Schedule, Emails, Talk with Tessa)
- **Floating Button:** "Let Tessa help you" - always visible

### 2.2 Voice Modal (Overlay)
- Glass card overlay (not fullscreen)
- Background blur - content visible behind
- Tessa orb with pulse animation
- Wave visualization
- Mic button (push-to-talk for free, continuous for PRO)
- Quick suggestion chips
- Close button (X)

### 2.3 Morning Brief (Overlay)
- Summary statistics (meetings, urgent, overdue)
- PRO: Audio playback of summary
- Detailed text summary from Tessa
- "Ask Tessa" action

### 2.4 Settings Screen
- **Appearance:**
  - Dark/Light mode toggle
  - Color theme picker (8 palettes)
- **Voice & Sound:**
  - Tessa voice selection
  - "Hey Tessa" activation (PRO)
  - Continuous conversation (PRO)
- **Notifications:**
  - Reminders on/off
  - Proactive suggestions on/off
  - Daily summary time
- **Widget Settings (PRO):**
  - Widget type selection
  - Displayed information
- **Account:**
  - Profile info
  - PRO subscription status
  - Data export
  - Logout

### 2.5 Notes Screen
- List of all notes/info
- Filter by type (💡 Idea, 👤 Person, 🎁 Gift, ⚠️ Important, 📌 General)
- Search functionality
- Quick add floating button
- Note cards with context tags

### 2.6 Calendars Screen
- Day/Week/Month view toggle
- Events list
- Quick add event
- Calendar sync status (Google, Apple)

### 2.7 Mail Screen
- Inbox with urgent indicators
- Unread count badge
- Email preview cards
- Quick actions (archive, reply with Tessa)

### 2.8 Tasks Screen
- Todo list with checkboxes
- Priority indicators (high/medium/low)
- Due dates
- Project grouping
- Quick add task

### 2.9 Projects Screen
- Project folders/cards
- Task count per project
- Recent activity
- Quick access to related items

### 2.10 Account Screen
- Avatar upload
- Name/email display
- PRO badge if subscribed
- Subscription management link
- Privacy settings
- Delete account option

---

## 3. Core Features

### 3.1 Notes & Context System

**Quick Note Capture:**
```
User: "Feleségem említette, hogy tetszene neki egy film"
Tessa: "Noted! I'll remember this for gift ideas. 🎁"
```

**Note Types:**
| Type | Icon | Description |
|------|------|-------------|
| Idea | 💡 | Random thoughts, inspirations |
| Person | 👤 | Info about someone (preferences, allergies, etc.) |
| Gift | 🎁 | Gift ideas for specific people |
| Important | ⚠️ | Critical info to remember |
| General | 📌 | Miscellaneous notes |

**Context Engine:**
- Auto-categorization based on content
- Relationship mapping (person → preferences → events)
- Time-based relevance (activates near birthdays, anniversaries)
- Proactive surfacing of relevant notes

**Proactive Suggestions:**
```
Tessa: "Anna's birthday is next week. You mentioned she'd like 
       a new book. Would you like me to find some options?"
```

### 3.2 Voice Interaction

**Free Tier:**
- Push-to-talk activation
- Basic commands
- Limited daily interactions

**PRO Tier:**
- "Hey Tessa" wake word
- Continuous conversation mode
- Natural dialogue (Tessa asks follow-ups)
- Interruptible (say something while Tessa is talking)
- Context preserved across conversation

**Voice Commands Examples:**
```
"What's my day look like?"
"Remind me to call mom at 3pm"
"Add milk to my shopping list"
"What did I note about Peter?"
"Search for best restaurants nearby"
```

### 3.3 Research & Web (PRO)

**Capabilities:**
- Web search for questions
- Multiple source aggregation
- Summary generation
- Link collection
- Browser handoff for detailed reading

**Example Flow:**
```
User: "Find me the best noise-canceling headphones under $300"
Tessa: "I found 5 top-rated options. The Sony WH-1000XM5 
       leads most reviews at $278. Should I show the 
       comparison or open the reviews?"
```

### 3.4 Widget System (PRO)

**Widget Types:**
1. **Quick Actions:** Mic button, quick note, next event
2. **Daily Summary:** Today's meetings, urgent count
3. **Tessa Mini:** Compact orb, tap to talk
4. **Notes:** Recent notes quick access

**Platforms:**
- iOS: Home screen, Lock screen, StandBy
- Android: Home screen, Lock screen

### 3.5 Integrations (PRO)

**Calendar Sync:**
- Google Calendar
- Apple Calendar
- Outlook Calendar

**Email Sync:**
- Gmail
- Apple Mail
- Outlook

**Voice Assistants:**
- Siri Shortcuts integration
- Google Assistant routines

---

## 4. PRO Features Summary

| Feature | Free | PRO |
|---------|------|-----|
| Push-to-talk voice | ✅ | ✅ |
| Continuous conversation | ❌ | ✅ |
| "Hey Tessa" activation | ❌ | ✅ |
| Daily interactions | Limited | Unlimited |
| Web search & research | ❌ | ✅ |
| Browser handoff | ❌ | ✅ |
| Audio briefing playback | ❌ | ✅ |
| Home screen widget | ❌ | ✅ |
| Lock screen widget | ❌ | ✅ |
| Siri/Google integration | ❌ | ✅ |
| Custom color themes | 8 presets | 8 + custom |
| Priority support | ❌ | ✅ |

---

## 5. Data Models

### 5.1 Note
```typescript
interface Note {
  id: string;
  content: string;
  type: 'idea' | 'person' | 'gift' | 'important' | 'general';
  relatedPerson?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  relevantDates?: Date[]; // birthdays, anniversaries
  isArchived: boolean;
}
```

### 5.2 Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  projectId?: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
}
```

### 5.3 Event
```typescript
interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  description?: string;
  calendarSource: 'google' | 'apple' | 'outlook' | 'local';
  reminders: number[]; // minutes before
}
```

### 5.4 Person (Context)
```typescript
interface Person {
  id: string;
  name: string;
  relationship?: string; // "wife", "boss", "friend"
  preferences: string[];
  allergies: string[];
  importantDates: {
    type: string; // "birthday", "anniversary"
    date: Date;
  }[];
  notes: string[]; // Note IDs
}
```

### 5.5 User Preferences
```typescript
interface UserPreferences {
  themeMode: 'dark' | 'light';
  accentPalette: string;
  language: string;
  notifications: {
    reminders: boolean;
    proactive: boolean;
    dailySummaryTime: string; // "08:00"
  };
  voice: {
    tessaVoice: string;
    heyTessaEnabled: boolean; // PRO
    continuousMode: boolean; // PRO
  };
  isPro: boolean;
}
```

---

## 6. Technical Considerations

### 6.1 Voice Processing
- Speech-to-text: Native platform APIs or cloud service
- Text-to-speech: Multiple voice options
- Wake word detection: On-device processing

### 6.2 AI/LLM Integration
- Intent classification
- Context understanding
- Proactive suggestion generation
- Web search summarization

### 6.3 Data Storage
- Local: Core data, preferences
- Cloud: Sync, backup, PRO features
- Encryption: All personal data

### 6.4 Platform Specifics
- iOS: WidgetKit, Shortcuts, SiriKit
- Android: App Widgets, Google Assistant Actions

---

## 7. Future Considerations

- Multi-language support
- Team/family sharing
- Smart home integration
- Wearable support (Watch)
- Desktop companion app
