import { Gift, Check, Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGamificationStore } from "@/stores/useGamificationStore";
import { useAppStore } from "@/stores/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function DailyQuests() {
  const { dailyQuests, refreshDailyQuests, claimQuest, checkStreakOnLogin, getStreakMultiplier } = useGamificationStore();
  const { addCoins, streakDays } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    // Bridge streak to gamification store
    (window as any).__kolage_streak = streakDays;
    refreshDailyQuests();
    checkStreakOnLogin();
  }, [streakDays]);

  const multiplier = getStreakMultiplier();

  const handleClaim = (questId: string) => {
    const result = claimQuest(questId);
    if (result) {
      addCoins(result.coins);
      toast({
        title: "Quest Complete! 🎉",
        description: `+${result.coins} coins & +${result.xp} XP earned!`,
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink flex items-center gap-2">
          <Gift className="h-4 w-4 text-spark" />
          Daily Quests
        </h3>
        {multiplier > 1 && (
          <span className="flex items-center gap-1 rounded-full bg-spark-muted px-2 py-0.5 text-xs font-semibold text-spark">
            <Zap className="h-3 w-3" />
            {multiplier}x streak bonus
          </span>
        )}
      </div>

      {dailyQuests.map((quest) => (
        <div
          key={quest.id}
          className="rounded-xl border border-border bg-paper-elevated p-3 shadow-sm transition-all hover:shadow-desk"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{quest.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-ink">{quest.title}</p>
                <span className="flex items-center gap-1 text-xs font-semibold text-spark">
                  <Coins className="h-3 w-3" />
                  {Math.round(quest.reward * multiplier)}
                </span>
              </div>
              <p className="text-xs text-ink-faint mt-0.5">{quest.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <Progress 
                  value={(quest.progress / quest.target) * 100} 
                  className="h-1.5 flex-1"
                />
                <span className="text-xs text-ink-faint whitespace-nowrap">
                  {quest.progress}/{quest.target}
                </span>
              </div>
            </div>
            {quest.completed && !quest.claimed && (
              <Button
                size="sm"
                onClick={() => handleClaim(quest.id)}
                className="bg-spark hover:bg-spark/90 h-7 px-2 text-xs shrink-0"
              >
                Claim
              </Button>
            )}
            {quest.claimed && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-spark-muted">
                <Check className="h-3.5 w-3.5 text-spark" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
