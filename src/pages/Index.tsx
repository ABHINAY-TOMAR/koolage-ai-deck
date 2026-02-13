import { AppShell } from "@/components/layout";
import { ChatView, BoardView, ExploreView } from "@/components/views";
import { RewardsView } from "@/components/views/RewardsView";
import { useAppStore } from "@/stores/useAppStore";

const Index = () => {
  const { mode } = useAppStore();

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
