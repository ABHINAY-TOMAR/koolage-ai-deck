import { MessageSquare, Brain, Presentation, PenTool, ShoppingBag } from "lucide-react";
import { useGamificationStore } from "@/stores/useGamificationStore";

const statItems = [
  { key: 'chats' as const, label: 'Chats', icon: MessageSquare },
  { key: 'mindmaps' as const, label: 'Maps', icon: Brain },
  { key: 'slides' as const, label: 'Decks', icon: Presentation },
  { key: 'writes' as const, label: 'Writes', icon: PenTool },
  { key: 'purchases' as const, label: 'Buys', icon: ShoppingBag },
];

export function StatsOverview() {
  const { stats } = useGamificationStore();

  return (
    <div className="grid grid-cols-5 gap-2">
      {statItems.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex flex-col items-center rounded-xl bg-secondary/50 p-2">
          <Icon className="h-4 w-4 text-ink-light mb-1" />
          <span className="text-sm font-bold text-ink">{stats[key]}</span>
          <span className="text-[10px] text-ink-faint">{label}</span>
        </div>
      ))}
    </div>
  );
}
