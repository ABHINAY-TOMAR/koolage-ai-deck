import { Trophy, Lock } from "lucide-react";
import { useGamificationStore } from "@/stores/useGamificationStore";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tierBorder: Record<string, string> = {
  bronze: 'border-amber-700/40',
  silver: 'border-gray-400/60',
  gold: 'border-yellow-500/60',
  diamond: 'border-neon/60',
};

const tierBg: Record<string, string> = {
  bronze: 'bg-amber-700/10',
  silver: 'bg-gray-400/10',
  gold: 'bg-yellow-500/10',
  diamond: 'bg-neon/10',
};

export function AchievementsList() {
  const { achievements } = useGamificationStore();
  const unlocked = achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink flex items-center gap-2">
          <Trophy className="h-4 w-4 text-spark" />
          Achievements
        </h3>
        <span className="text-xs text-ink-faint">{unlocked}/{achievements.length}</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {achievements.map((a) => {
          const isUnlocked = !!a.unlockedAt;
          return (
            <Tooltip key={a.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex h-14 w-full items-center justify-center rounded-xl border-2 transition-all",
                    isUnlocked 
                      ? `${tierBorder[a.tier]} ${tierBg[a.tier]} shadow-sm cursor-default` 
                      : 'border-border bg-muted/50 opacity-40 cursor-default'
                  )}
                >
                  {isUnlocked ? (
                    <span className="text-xl">{a.icon}</span>
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.description}</p>
                {isUnlocked && (
                  <p className="text-xs text-spark mt-1">
                    ✅ Unlocked {new Date(a.unlockedAt!).toLocaleDateString()}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
