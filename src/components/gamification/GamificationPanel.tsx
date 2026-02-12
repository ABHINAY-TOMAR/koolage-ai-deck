import { LevelBadge } from "./LevelBadge";
import { DailyQuests } from "./DailyQuests";
import { AchievementsList } from "./AchievementsList";
import { StatsOverview } from "./StatsOverview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function GamificationPanel() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-5 p-4">
        <LevelBadge />
        <Separator />
        <StatsOverview />
        <Separator />
        <DailyQuests />
        <Separator />
        <AchievementsList />
      </div>
    </ScrollArea>
  );
}
