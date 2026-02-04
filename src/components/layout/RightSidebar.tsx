import { 
  Sparkles,
  Wand2,
  Download,
  Share2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";

export function RightSidebar() {
  const { rightSidebarOpen, setRightSidebarOpen, mode, activeTabId, boardTabs } = useAppStore();
  
  const activeTab = boardTabs.find(t => t.id === activeTabId);
  
  if (!rightSidebarOpen) return null;

  // Context-aware tools based on active mode/tab
  const getContextTools = () => {
    if (mode === 'board' && activeTab) {
      switch (activeTab.type) {
        case 'whiteboard':
          return [
            { icon: Sparkles, label: 'Generate Map', action: 'generate-map' },
            { icon: Wand2, label: 'Auto Layout', action: 'auto-layout' },
          ];
        case 'slide':
          return [
            { icon: Sparkles, label: 'Generate Deck', action: 'generate-deck' },
            { icon: Download, label: 'Export PPTX', action: 'export-pptx' },
          ];
        case 'page':
          return [
            { icon: Wand2, label: 'AI Write', action: 'ai-write' },
            { icon: Download, label: 'Export PDF', action: 'export-pdf' },
          ];
        case 'sheet':
          return [
            { icon: Sparkles, label: 'AI Formula', action: 'ai-formula' },
            { icon: Download, label: 'Export CSV', action: 'export-csv' },
          ];
      }
    }
    
    // Default tools
    return [
      { icon: Share2, label: 'Share', action: 'share' },
    ];
  };

  const tools = getContextTools();

  return (
    <aside className="w-64 border-l border-border bg-sidebar animate-slide-in-right">
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <span className="font-medium text-sidebar-foreground">Tools</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setRightSidebarOpen(false)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-2">
        {tools.map((tool) => (
          <Button
            key={tool.action}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <tool.icon className="h-4 w-4 text-spark" />
            <span>{tool.label}</span>
          </Button>
        ))}
      </div>

      {/* Context info */}
      {mode === 'board' && activeTab && (
        <div className="mx-4 mt-4 rounded-lg bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">
            Active: <span className="font-medium text-foreground">{activeTab.title}</span>
          </p>
        </div>
      )}
    </aside>
  );
}
