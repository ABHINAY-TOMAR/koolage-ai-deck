import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

function getTheme(): Theme {
  return (localStorage.getItem("kolage-theme") as Theme) || "system";
}

function applyTheme(theme: Theme) {
  localStorage.setItem("kolage-theme", theme);
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const themes: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function SettingsDialog({ open, onOpenChange }: Props) {
  const [theme, setTheme] = useState<Theme>(getTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (getTheme() === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleReset = () => {
    if (confirm("Reset all local data (gamification, purchases, settings)?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Theme */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Appearance</Label>
            <div className="flex gap-2">
              {themes.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={theme === id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(id)}
                  className={cn("gap-2 flex-1", theme === id && "bg-spark hover:bg-spark/90")}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* About */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">About</Label>
            <p className="text-sm text-muted-foreground">
              Kolage v1.0 — Your AI-powered study companion. Built with ❤️
            </p>
          </div>

          <Separator />

          {/* Reset */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-destructive">Danger Zone</Label>
            <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset All Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Initialize theme on load
applyTheme(getTheme());
