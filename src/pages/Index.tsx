import { useEffect } from "react";
import { AppShell } from "@/components/layout";
import { ChatView, BoardView, ExploreView } from "@/components/views";
import { RewardsView } from "@/components/views/RewardsView";
import { useAppStore } from "@/stores/useAppStore";
import { useGamificationStore } from "@/stores/useGamificationStore";

const Index = () => {
  const { mode, streakDays } = useAppStore();
  const { refreshDailyQuests, checkStreakOnLogin } = useGamificationStore();

  // Initialize gamification on mount
  useEffect(() => {
    // Bridge streak to gamification store via window
    const w = window as unknown as Record<string, unknown>;
    w.__kolage_streak = streakDays;
    refreshDailyQuests();
    checkStreakOnLogin();
  }, [refreshDailyQuests, checkStreakOnLogin, streakDays]);

  return (
    <AppShell>
      {mode === "chat" && <ChatView />}
      {mode === "board" && <BoardView />}
      {mode === "explore" && <ExploreView />}
      {mode === "rewards" && <RewardsView />}
    </AppShell>
  );
};

export default Index;
