import { 
  MessageSquare, 
  LayoutDashboard, 
  Compass,
  Flame,
  Coins,
  User,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, AppMode } from "@/stores/useAppStore";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const modeItems: { mode: AppMode; icon: typeof MessageSquare; label: string }[] = [
  { mode: "chat", icon: MessageSquare, label: "Chat" },
  { mode: "board", icon: LayoutDashboard, label: "Board" },
  { mode: "explore", icon: Compass, label: "Explore" },
  { mode: "rewards", icon: ShoppingBag, label: "Shop" },
];

export function TopNav() {
  const { mode, setMode, coins, streakDays } = useAppStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      {/* Mode Switcher */}
      <div className="flex items-center">
        <div className="flex items-center rounded-lg bg-secondary p-1">
          {modeItems.map((item) => (
            <Button
              key={item.mode}
              variant="ghost"
              size="sm"
              onClick={() => setMode(item.mode)}
              className={cn(
                "gap-2 rounded-md px-3 py-1.5 transition-all",
                mode === item.mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Right side: Streak, Coins, Profile */}
      <div className="flex items-center gap-2">
        {/* Streak Fire */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 rounded-lg bg-spark-muted px-3 py-1.5">
              <Flame 
                className={cn(
                  "h-5 w-5 text-spark",
                  streakDays > 0 && "animate-fire-pulse"
                )} 
              />
              <span className="font-semibold text-sm text-spark">{streakDays}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{streakDays} day streak! 🔥</p>
          </TooltipContent>
        </Tooltip>

        {/* Coins */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
              <Coins className="h-5 w-5 text-spark" />
              <span className="font-semibold text-sm">{coins}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{coins} coins available</p>
          </TooltipContent>
        </Tooltip>

        {/* Level Badge */}
        <LevelBadge compact />

        {/* Profile Avatar */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </div>
    </header>
  );
}
