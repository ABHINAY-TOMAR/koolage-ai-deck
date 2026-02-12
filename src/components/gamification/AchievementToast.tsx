import { useEffect, useRef } from "react";
import { useGamificationStore } from "@/stores/useGamificationStore";
import { useToast } from "@/hooks/use-toast";

export function AchievementToast() {
  const { getNewlyUnlocked } = useGamificationStore();
  const { toast } = useToast();
  const shownRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const newlyUnlocked = getNewlyUnlocked();
      for (const a of newlyUnlocked) {
        if (!shownRef.current.has(a.id)) {
          shownRef.current.add(a.id);
          toast({
            title: `🏆 Achievement Unlocked!`,
            description: `${a.icon} ${a.title} — ${a.description}`,
          });
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
