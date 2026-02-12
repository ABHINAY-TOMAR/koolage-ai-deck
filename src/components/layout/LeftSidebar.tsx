import { useState } from "react";
import { 
  LayoutGrid, 
  ListMusic, 
  History, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GamificationPanel } from "@/components/gamification";

const navItems = [
  { icon: LayoutGrid, label: "Gallery", id: "gallery" },
  { icon: ListMusic, label: "Playlists", id: "playlists" },
  { icon: History, label: "History", id: "history" },
];

export function LeftSidebar() {
  const { leftSidebarOpen, toggleLeftSidebar } = useAppStore();
  const [showGamification, setShowGamification] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out",
        leftSidebarOpen ? "w-56" : "w-16"
      )}
    >
      {/* Logo/Brand */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        {leftSidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fire-start to-fire-end">
              <span className="text-sm font-bold text-white">K</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">Kolage</span>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fire-start to-fire-end mx-auto">
            <span className="text-sm font-bold text-white">K</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Tooltip key={item.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !leftSidebarOpen && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {leftSidebarOpen && <span>{item.label}</span>}
              </Button>
            </TooltipTrigger>
            {!leftSidebarOpen && (
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>

      {/* Gamification Panel (expandable) */}
      {leftSidebarOpen && showGamification && (
        <div className="flex-1 overflow-hidden border-t border-sidebar-border">
          <GamificationPanel />
        </div>
      )}

      {/* Bottom actions */}
      <div className="border-t border-sidebar-border p-2 space-y-1">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => leftSidebarOpen && setShowGamification(!showGamification)}
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !leftSidebarOpen && "justify-center px-2",
                showGamification && leftSidebarOpen && "bg-sidebar-accent"
              )}
            >
              <Trophy className="h-5 w-5 shrink-0 text-spark" />
              {leftSidebarOpen && <span>Quests & Stats</span>}
            </Button>
          </TooltipTrigger>
          {!leftSidebarOpen && (
            <TooltipContent side="right" className="font-medium">
              Quests & Stats
            </TooltipContent>
          )}
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !leftSidebarOpen && "justify-center px-2"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {leftSidebarOpen && <span>Settings</span>}
            </Button>
          </TooltipTrigger>
          {!leftSidebarOpen && (
            <TooltipContent side="right" className="font-medium">
              Settings
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleLeftSidebar}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-secondary transition-colors"
      >
        {leftSidebarOpen ? (
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
