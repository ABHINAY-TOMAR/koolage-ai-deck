import { Plus, X, PenTool, Presentation, FileText, Table } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, BoardTabType } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tabTypeIcons: Record<BoardTabType, typeof PenTool> = {
  whiteboard: PenTool,
  slide: Presentation,
  page: FileText,
  sheet: Table,
};

const tabTypeLabels: Record<BoardTabType, string> = {
  whiteboard: "Whiteboard",
  slide: "Slides",
  page: "Page",
  sheet: "Sheet",
};

export function BoardView() {
  const { boardTabs, activeTabId, addBoardTab, removeBoardTab, setActiveTab } = useAppStore();

  const activeTab = boardTabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex h-full flex-col bg-paper">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-border bg-paper-elevated px-2 pt-2">
        {boardTabs.map((tab) => {
          const Icon = tabTypeIcons[tab.type];
          const isActive = tab.id === activeTabId;

          return (
            <div
              key={tab.id}
              className={cn(
                "group flex items-center gap-2 rounded-t-lg border border-b-0 px-3 py-2 text-sm transition-colors cursor-pointer",
                isActive
                  ? "border-border bg-background text-foreground"
                  : "border-transparent bg-transparent text-muted-foreground hover:bg-secondary/50"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="max-w-[120px] truncate">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBoardTab(tab.id);
                }}
                className="ml-1 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-secondary transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}

        {/* Add Tab Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(Object.keys(tabTypeIcons) as BoardTabType[]).map((type) => {
              const Icon = tabTypeIcons[type];
              return (
                <DropdownMenuItem
                  key={type}
                  onClick={() => addBoardTab(type)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tabTypeLabels[type]}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab ? (
          <div className="h-full">
            {activeTab.type === "whiteboard" && <WhiteboardPlaceholder />}
            {activeTab.type === "slide" && <SlidePlaceholder />}
            {activeTab.type === "page" && <PagePlaceholder />}
            {activeTab.type === "sheet" && <SheetPlaceholder />}
          </div>
        ) : (
          <EmptyBoardState onAddTab={addBoardTab} />
        )}
      </div>
    </div>
  );
}

function EmptyBoardState({ onAddTab }: { onAddTab: (type: BoardTabType) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-8">
      <div className="mb-6 text-6xl">📋</div>
      <h2 className="mb-2 text-2xl font-semibold text-ink">Your Board is Empty</h2>
      <p className="mb-8 max-w-md text-ink-light">
        Create a new tab to start working. Choose from Whiteboard, Slides, Page, or Sheet.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(tabTypeIcons) as BoardTabType[]).map((type) => {
          const Icon = tabTypeIcons[type];
          return (
            <Button
              key={type}
              variant="outline"
              onClick={() => onAddTab(type)}
              className="h-auto flex-col gap-2 py-6 px-8 bg-paper-elevated hover:bg-secondary shadow-desk"
            >
              <Icon className="h-8 w-8 text-spark" />
              <span className="font-medium">{tabTypeLabels[type]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// Placeholder components - will be replaced with actual implementations
function WhiteboardPlaceholder() {
  return (
    <div className="h-full dot-grid flex items-center justify-center">
      <div className="text-center p-8 bg-paper-elevated rounded-2xl shadow-desk">
        <PenTool className="h-12 w-12 mx-auto mb-4 text-spark" />
        <h3 className="text-lg font-semibold mb-2">Whiteboard</h3>
        <p className="text-sm text-muted-foreground">React Flow canvas coming soon...</p>
      </div>
    </div>
  );
}

function SlidePlaceholder() {
  return (
    <div className="h-full bg-secondary/30 flex items-center justify-center">
      <div className="text-center p-8 bg-paper-elevated rounded-2xl shadow-desk">
        <Presentation className="h-12 w-12 mx-auto mb-4 text-spark" />
        <h3 className="text-lg font-semibold mb-2">Slides</h3>
        <p className="text-sm text-muted-foreground">Slide deck editor coming soon...</p>
      </div>
    </div>
  );
}

function PagePlaceholder() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center p-8 bg-paper-elevated rounded-2xl shadow-desk">
        <FileText className="h-12 w-12 mx-auto mb-4 text-spark" />
        <h3 className="text-lg font-semibold mb-2">Page</h3>
        <p className="text-sm text-muted-foreground">Tiptap editor coming soon...</p>
      </div>
    </div>
  );
}

function SheetPlaceholder() {
  return (
    <div className="h-full bg-secondary/20 flex items-center justify-center">
      <div className="text-center p-8 bg-paper-elevated rounded-2xl shadow-desk">
        <Table className="h-12 w-12 mx-auto mb-4 text-spark" />
        <h3 className="text-lg font-semibold mb-2">Sheet</h3>
        <p className="text-sm text-muted-foreground">Data grid coming soon...</p>
      </div>
    </div>
  );
}
