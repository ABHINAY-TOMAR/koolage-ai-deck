import { useState } from "react";
import { Send, Paperclip, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // TODO: Connect to Lovable AI
    // For now, just show a placeholder response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm your Kolage AI assistant! Once connected, I can help you generate mind maps, create slide decks, and expand your notes. What would you like to work on today?",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  return (
    <div className="flex h-full flex-col bg-paper">
      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fire-start to-fire-end shadow-desk">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-ink">Welcome to Kolage</h2>
            <p className="max-w-md text-ink-light">
              Your AI-powered study companion. Upload a PDF, ask questions, or generate a mind map to get started.
            </p>
            
            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                "📚 Generate a Mind Map",
                "📝 Create a Slide Deck",
                "✍️ Expand my notes",
                "🧠 Quiz me on a topic",
              ].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  className="h-auto py-3 px-4 text-left justify-start bg-paper-elevated hover:bg-secondary"
                  onClick={() => setInput(action.replace(/^[^\s]+\s/, ""))}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-paper-elevated shadow-desk"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-paper-elevated p-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message Kolage..."
              className="min-h-[40px] max-h-[200px] flex-1 resize-none border-0 bg-transparent p-2 focus-visible:ring-0"
              rows={1}
            />
            
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-9 w-9 shrink-0 rounded-xl bg-spark hover:bg-spark/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="mt-2 text-center text-xs text-ink-faint">
            Kolage can make mistakes. Consider checking important info.
          </p>
        </div>
      </div>
    </div>
  );
}
