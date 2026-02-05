

# 🎨 Phase 3: The AI Brain - Implementation Plan

## Overview
Phase 3 implements Lovable AI integration for intelligent content generation across all Board tabs, plus a floating draggable dock for multitasking. This phase bridges the gap between user intent and AI-powered creation.

---

## 🔴 Critical Pre-Implementation Note

**Firebase vs Supabase Conflict:**
You specified Firebase as your backend, but Lovable AI requires **Supabase Edge Functions** to work. Here are your options:

1. **Recommended**: Switch to **Lovable Cloud** (Supabase-managed) for the MVP. Firebase can be added post-MVP for authentication persistence.
2. **Alternative**: Keep Firebase for auth/data, but use Supabase *only* for Edge Functions (AI calls). These are two separate backends working in parallel.
3. **Not feasible**: Using only Firebase cannot access Lovable AI.

**Assumption for this plan**: Proceeding with **Lovable Cloud** for streamlined AI integration. Firebase auth/Firestore can be migrated in Phase 5 if needed.

---

## 📋 Implementation Sequence

### 3.1 - Lovable Cloud & Edge Function Setup
**Objective:** Enable Lovable AI access via serverless Edge Functions.

**Tasks:**
1. **Enable Lovable Cloud** - Activate Cloud database (automatic Supabase project creation)
2. **Create Edge Function: `chat`** - General-purpose Lovable AI proxy
   - Endpoint: `POST /functions/v1/chat`
   - Request body: `{ messages: Message[] }`
   - Response: Streaming SSE with token-by-token output
   - Error handling: 429 (rate limit), 402 (credits), 500 (server)
   
3. **Create Edge Function: `generate-mindmap`** - Specialized for React Flow JSON
   - Endpoint: `POST /functions/v1/generate-mindmap`
   - Input: Topic/prompt string
   - Output: `{ nodes: Node[], edges: Edge[] }` (React Flow compatible)
   - Tool calling (function) to enforce structured JSON output
   
4. **Create Edge Function: `generate-slides`** - Specialized for slide deck creation
   - Endpoint: `POST /functions/v1/generate-slides`
   - Input: Topic/prompt string
   - Output: `{ slides: Slide[] }` (SlideTab compatible)
   - Tool calling to ensure consistent slide structure
   
5. **Create Edge Function: `expand-text`** - For text generation & editing
   - Endpoint: `POST /functions/v1/expand-text`
   - Input: `{ text: string, action: 'expand' | 'shorten' | 'fix-grammar' | 'translate' }`
   - Output: Streaming text for token-by-token insertion into Tiptap editor

6. **Environment Variables:**
   - `LOVABLE_API_KEY` - Auto-provisioned by Lovable Cloud
   - No manual setup required (Cloud handles it)

---

### 3.2 - Update WhiteboardTab for Mind Map Generation

**Tasks:**
1. **Replace mock `generateMap()` with AI call**
   - User clicks "Generate Map" button
   - Prompt modal appears: "What topic would you like a mind map for?"
   - On submit: Call `/functions/v1/generate-mindmap` with topic
   - Display loading spinner while streaming
   - Animate node appearance with staggered "bloom" effect (CSS @keyframes)
   
2. **Add streaming response handler**
   - Parse SSE stream from edge function
   - Build nodes/edges incrementally as JSON arrives
   - Update React Flow state in real-time
   
3. **Error handling**
   - Catch 429: Show toast "Rate limited. Try again in a moment."
   - Catch 402: Show toast "Out of credits. Add funds in Settings."
   - Catch 500: Show toast "AI error. Please try again."

4. **Store integration**
   - Save generated mind map to Zustand store (tab-specific state)
   - Persist across tab switches

---

### 3.3 - Update SlideTab for Deck Generation

**Tasks:**
1. **Replace mock `generateDeck()` with AI call**
   - User clicks "Generate Deck" button
   - Modal: "Topic for your deck?" with style selector (Professional / Creative / Academic)
   - Call `/functions/v1/generate-slides` with topic + style
   - Generate 5-7 slides by default
   
2. **Insert generated slides**
   - Replace all current slides with AI-generated ones
   - Set first slide as active
   - Animate slide thumbnails appearing in sidebar
   
3. **Customization panel (optional)**
   - Right sidebar shows: "Regenerate with different tone"
   - Quick actions: "Add title slide," "Add conclusion slide"

4. **Error handling & persistence**
   - Same as WhiteboardTab
   - Store slides in Zustand

---

### 3.4 - Update PageTab for AI Text Co-Author

**Tasks:**
1. **Add "AI Write" functionality**
   - User clicks "AI Write" button in toolbar
   - Modal: "What would you like AI to write?" or "Expand this selection?"
   - Two modes:
     - **Generate**: Create new content from scratch
     - **Expand**: Extend selected text (highlight → action menu)
   
2. **Action menu on text selection**
   - Right-click or toolbar menu with options:
     - "Expand this"
     - "Shorten this"
     - "Fix grammar"
     - "Translate to..."
   
3. **Streaming text insertion**
   - Call `/functions/v1/expand-text` with action
   - Stream tokens directly into Tiptap editor
   - Replace selected text or insert at cursor
   - Animation: Subtle fade-in for new text
   
4. **State management**
   - Track in-flight requests to prevent duplicate calls
   - Show loading indicator in editor

---

### 3.5 - Build Floating Dock (PIP Window)

**Objective:** Draggable, resizable window for YouTube embeds & text-to-speech playback.

**Tasks:**
1. **Create `FloatingDock.tsx` component**
   - Use `react-rnd` for drag + resize functionality
   - Default position: bottom-right corner
   - Default size: 400x300px
   - Min size: 250x200px
   - Persist position/size to localStorage
   
2. **Dock content modes**
   - **YouTube mode**: Embed via iframe (origin: `https://www.youtube.com`)
   - **TTS mode**: Audio player + waveform visualization
   
3. **Zustand store integration**
   - Already defined: `dockVisible`, `dockContent`, `showDock()`, `hideDock()`
   - Add to store: `dockPosition`, `dockSize`, `updateDockPosition()`
   
4. **Close & minimize**
   - X button to close
   - Minimize toggle (shrink to title bar only)
   - Open dock from right sidebar "Tools" section
   
5. **YouTube embed example**
   ```tsx
   <iframe
     width="100%"
     height="100%"
     src={`https://www.youtube.com/embed/${videoId}`}
     frameBorder="0"
     allowFullScreen
   />
   ```

6. **TTS (Text-to-Speech) example**
   - Use browser `SpeechSynthesis` API (native, no dependencies)
   - Play audio while user edits elsewhere
   - Show play/pause controls + current time

---

### 3.6 - UI Additions for Dock Access

**Tasks:**
1. **Update `RightSidebar.tsx`**
   - Add "Open Dock" button to tool list
   - Trigger `showDock({ type: 'youtube', url: '...' })`
   
2. **Update `ChatView.tsx`**
   - Add "Watch" quick-action prompt
   - When clicked, opens dock with YouTube embedding
   
3. **Update `AppShell.tsx`**
   - Render `<FloatingDock />` at root level (always available)
   - Z-index: 40 (above content, below modals)

---

## 🛠 Technical Details: Edge Function Skeleton

### File: `supabase/functions/chat/index.ts`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are Kolage, a study assistant." },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      throw new Error(`AI API error [${response.status}]: ${text}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

### Streaming Handler Pattern (Frontend)
```typescript
async function streamAI(prompt: string, onToken: (text: string) => void) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx: number;
    while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIdx);
      buffer = buffer.slice(newlineIdx + 1);

      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") return;

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onToken(content);
      } catch {
        // Partial JSON, buffer and continue
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
}
```

---

## 📊 Component Changes Summary

```
WhiteboardTab
├── Add modal for topic input
├── Replace generateMap() with AI call
└── Add bloom animation for nodes

SlideTab
├── Add modal for topic + style selection
├── Replace generateDeck() with AI call
└── Add slide insertion animation

PageTab
├── Add selection-based action menu
├── Replace aiWrite() with streaming handler
└── Add inline text streaming

FloatingDock (NEW)
├── react-rnd draggable wrapper
├── YouTube embed mode
├── TTS audio player mode
└── localStorage persistence

RightSidebar
├── Add "Open Dock" button
└── Wire showDock() actions

AppShell
├── Render FloatingDock at root
└── Maintain z-index layering

useAppStore
├── Add dockPosition state
├── Add dockSize state
└── Add updateDockPosition() action
```

---

## ⏱ Estimated Timeline

- **3.1 Edge Functions**: 45 min (4 functions + streaming setup)
- **3.2 Whiteboard AI**: 30 min (modal + streaming + bloom animation)
- **3.3 Slides AI**: 25 min (similar to whiteboard, less complex)
- **3.4 Page AI**: 40 min (action menu + text insertion is tricky)
- **3.5 Floating Dock**: 45 min (react-rnd setup + localStorage)
- **3.6 UI Wiring**: 20 min (buttons, modals, sidebar updates)

**Total Phase 3**: ~3-4 hours of focused work.

---

## ✅ Acceptance Criteria

1. ✓ Whiteboard: "Generate Map" works and produces React Flow-compatible nodes
2. ✓ Slides: "Generate Deck" creates 5+ slides with text
3. ✓ Page: "AI Write" generates text and inserts into editor
4. ✓ Floating Dock: Draggable, resizable, persists position
5. ✓ YouTube: Can embed video URLs in dock
6. ✓ Streaming: All AI responses stream token-by-token (no buffering)
7. ✓ Error handling: Rate limits & credit errors show user-friendly toasts
8. ✓ Persistence: Generated content survives page reload (via Zustand)

---

## 🚨 Known Constraints

1. **Lovable Cloud migration**: Requires switching from Firebase to Supabase
2. **Streaming complexity**: Token-by-token rendering requires careful SSE parsing
3. **Edge function secrets**: LOVABLE_API_KEY must be configured in Cloud
4. **Rate limiting**: Phase 4+ may hit rate limits with high activity

