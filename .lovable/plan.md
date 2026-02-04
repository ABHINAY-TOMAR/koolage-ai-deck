

# 🎨 Kolage Implementation Plan
## The "Operating System for Learning" - MVP in 14 Days

---

## 🌟 Vision Recap
A multi-modal AI workspace merging content discovery with active creation, styled with the **"Warm Paper & Ink"** aesthetic for Gen Z students.

---

## 📅 Phase 1: Foundation (Days 1-3)
### App Shell & Core Layout

**1.1 - Design System Setup**
- Implement "Warm Paper & Ink" theme with Stone/Amber/Charcoal palette
- Configure Inter font for UI, JetBrains Mono for code/data
- Add subtle paper texture and dot-grid backgrounds

**1.2 - Global Navigation Shell**
- **Left Sidebar**: Collapsible menu with Gallery, Playlists, History icons
- **Top Navigation Bar**: Mode Switcher (Chat | Board | Explore), Profile avatar, Streak Fire icon 🔥
- **Dynamic Right Sidebar**: Context-aware tools that change based on active tab

**1.3 - Firebase Integration**
- Setup Firebase Auth (Google Sign-in)
- Configure Firestore database with user, workspace, and tab schemas
- Connect Firebase Storage for user uploads

**1.4 - State Management**
- Zustand store for app routing, active workspace, and player visibility
- Persist workspace state across tab switches

---

## 📅 Phase 2: The Board Engine (Days 4-7)
### The Core Multi-Tab Workspace

**2.1 - Tab Management System**
- Browser-style tabs with add/remove functionality
- State persistence when switching between tabs
- Default "Whiteboard 1" tab on workspace entry

**2.2 - Tab A: Whiteboard (The Brain)**
- Infinite canvas using React Flow library
- Custom styled nodes with "Warm Paper" aesthetic
- Zoom and pan controls
- "Sliding Card" expansion on node click with AI action icons

**2.3 - Tab B: Slide Deck (The Presenter)**
- CSS Grid layout for slide preview
- Left sidebar with slide sorter/thumbnails
- Simple text editing on slides
- Export to .pptx using PptxGenJS

**2.4 - Tab C: The Page (The Writer)**
- Rich text editor using Tiptap
- Toolbar with formatting options (H1-H3, Bold, Lists, etc.)
- A4/Letter page layout view
- Floating "AI Write" button for text expansion

**2.5 - Tab D: The Sheet (The Analyst)**
- Data grid using react-data-grid library
- Standard spreadsheet interface (columns/rows)
- Basic formula support
- AI Formula input placeholder

---

## 📅 Phase 3: The AI Brain (Days 8-10)
### Lovable AI Integration

**3.1 - Edge Function Setup**
- Create Supabase Edge Function for Lovable AI proxy
- Secure API key handling on backend
- Streaming response support

**3.2 - Mind Map Generation**
- "Generate Map" button in Whiteboard toolbar
- Prompt engineering to output React Flow-compatible JSON
- Source selection: Chat history or fresh file upload
- Animated node expansion (flower bloom effect)

**3.3 - Slide AI Generation**
- "Prompt-to-Deck" feature: "Make a deck on [topic]"
- AI generates slide JSON → Renders in slide preview
- Customization panel for style/tone selection

**3.4 - Page AI Co-Author**
- Inline text generation and expansion
- Highlight-to-action menu: "Shorten," "Fix Grammar," "Translate"
- AI streams text directly onto the page

**3.5 - The Floating Dock (Multitasking)**
- Draggable, resizable PIP window using react-rnd
- YouTube embed support
- Browser native Text-to-Speech for "podcast" simulation
- Smooth physics-based movement (60fps)

---

## 📅 Phase 4: Explore & Gamification (Days 11-12)
### Discovery + Engagement Loop

**4.1 - Explore View (Mock Content)**
- Grid layout with static content cards
- Card types: Videos, PDF Notes, Templates, Slides
- Preview cards with Thumbnail + Type Icon + Coin Price
- "Buy" button that deducts mock coins

**4.2 - Gamification System**
- **Streak Tracking**: Compare lastLogin timestamp, update Fire icon with pulse animation
- **Coin Economy**: Display user.coins, earn/spend mechanics
- **Daily Quests Modal**: Checklist popup (Open App, Generate Map, etc.)
- **Weekly Chest**: Bonus for 7-day streaks

**4.3 - Chat Interface**
- ChatGPT-style center chat
- File upload support (drag-and-drop)
- Chat history persistence
- Context awareness for Board generation

---

## 📅 Phase 5: Polish & Deploy (Days 13-14)
### The Vibe Check

**5.1 - Visual Refinement**
- Apply "Warm Paper" CSS variables consistently
- Add subtle animations and micro-interactions
- Sticker-style badges for empty states (anime vibe)
- Deep shadows for layered "desk" feel

**5.2 - Responsive Design**
- Desktop-first optimization
- Mobile "View Only" mode with disabled editing
- Tablet-friendly Board interactions

**5.3 - Testing & Bug Fixes**
- Cross-browser testing
- AI response validation
- Firestore read/write rules testing
- Performance optimization for smooth dock dragging

**5.4 - Deployment**
- Build optimization
- Deploy to Firebase Hosting (per your TRD)
- Final smoke testing on live URL

---

## 🛠 Technical Architecture Summary

| Component | Technology |
|-----------|------------|
| Framework | React + Vite + TypeScript |
| UI Library | shadcn/ui + Tailwind CSS |
| State | Zustand |
| Backend | Firebase (Auth, Firestore, Storage) |
| AI | Lovable AI Gateway (Gemini) |
| Whiteboard | React Flow |
| Rich Text | Tiptap |
| Slides | PptxGenJS |
| Spreadsheet | react-data-grid |
| Floating Dock | react-rnd |
| Icons | Lucide React |

---

## ✅ MVP Success Criteria

1. **Auth**: User can sign in with Google
2. **Navigation**: Can switch between Chat, Board, and Explore views
3. **Board Tabs**: Can create and edit content in all 4 tab types
4. **AI Generation**: Can generate a Mind Map from a prompt
5. **Multitasking**: Can watch content in the Dock while editing
6. **Gamification**: Streak updates on login, coins display, quests visible
7. **Persistence**: Content survives page reload
8. **Deployed**: Live URL accessible

---

## 🚨 What's Deferred to Post-MVP

- Real video generation (using slideshow + audio only)
- Real payments (using mock coins)
- Mobile editing (view-only on mobile)
- Social features (no sharing/friends)
- Classrooms/Home Rooms in Explore
- Full creator upload system

