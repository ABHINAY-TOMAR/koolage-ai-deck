import { Progress } from "@/components/ui/progress";
import { useGamificationStore, LEVELS } from "@/stores/useGamificationStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tierColors: Record<string, string> = {
  Freshman: 'from-gray-400 to-gray-500',
  Sophomore: 'from-green-400 to-green-600',
  Junior: 'from-blue-400 to-blue-600',
  Senior: 'from-purple-400 to-purple-600',
  Scholar: 'from-spark to-fire-start',
  Expert: 'from-fire-start to-fire-end',
  Master: 'from-red-500 to-pink-500',
  Grandmaster: 'from-pink-500 to-purple-600',
  Sage: 'from-yellow-400 to-spark',
  Legend: 'from-spark-glow to-neon',
};

export function LevelBadge({ compact = false }: { compact?: boolean }) {
  const { xp, getCurrentLevel, getNextLevel, getLevelProgress } = useGamificationStore();
  const current = getCurrentLevel();
  const next = getNextLevel();
  const progress = getLevelProgress();
  const gradient = tierColors[current.title] || 'from-spark to-fire-start';

  if (compact) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className={`flex h-7 items-center gap-1.5 rounded-full bg-gradient-to-r ${gradient} px-2.5 cursor-default`}>
            <span className="text-xs font-bold text-white">Lv.{current.level}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{current.title}</p>
          <p className="text-xs text-muted-foreground">
            {xp} XP {next ? `/ ${next.xpRequired} XP` : '(MAX)'}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-paper-elevated p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-desk`}>
          <span className="text-sm font-bold text-white">{current.level}</span>
        </div>
        <div>
          <p className="font-semibold text-ink">{current.title}</p>
          <p className="text-xs text-ink-faint">{xp} XP total</p>
        </div>
      </div>
      {next ? (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-ink-faint">Next: {next.title}</span>
            <span className="text-xs font-medium text-ink-light">
              {xp - current.xpRequired} / {next.xpRequired - current.xpRequired} XP
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      ) : (
        <p className="text-xs text-spark font-semibold text-center">✨ Max Level Reached!</p>
      )}
    </div>
  );
}
