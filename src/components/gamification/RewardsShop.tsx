import { useState } from "react";
import { ShoppingBag, Check, Coins, Palette, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/useAppStore";
import { useGamificationStore } from "@/stores/useGamificationStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: "theme" | "avatar" | "boost" | "cosmetic";
  rarity: "common" | "rare" | "epic" | "legendary";
}

const SHOP_ITEMS: ShopItem[] = [
  { id: "theme-midnight", name: "Midnight Mode", description: "A deep blue-black theme for late-night study sessions", price: 50, icon: "🌙", category: "theme", rarity: "common" },
  { id: "theme-sakura", name: "Sakura Pink", description: "Cherry blossom-inspired warm pink accents", price: 75, icon: "🌸", category: "theme", rarity: "rare" },
  { id: "theme-forest", name: "Forest Green", description: "Calming forest tones for focused studying", price: 75, icon: "🌿", category: "theme", rarity: "rare" },
  { id: "theme-ocean", name: "Deep Ocean", description: "Cool ocean blue gradient theme", price: 100, icon: "🌊", category: "theme", rarity: "epic" },
  { id: "avatar-robot", name: "Robot Avatar", description: "A cute study robot profile frame", price: 30, icon: "🤖", category: "avatar", rarity: "common" },
  { id: "avatar-wizard", name: "Wizard Avatar", description: "A magical scholar profile frame", price: 60, icon: "🧙", category: "avatar", rarity: "rare" },
  { id: "avatar-dragon", name: "Dragon Avatar", description: "A legendary dragon profile frame", price: 150, icon: "🐉", category: "avatar", rarity: "legendary" },
  { id: "boost-xp2x", name: "XP Doubler", description: "Double XP for your next 5 actions", price: 40, icon: "⚡", category: "boost", rarity: "common" },
  { id: "boost-coins", name: "Coin Shower", description: "Earn +10 bonus coins instantly", price: 20, icon: "💰", category: "boost", rarity: "common" },
  { id: "cosmetic-sparkle", name: "Sparkle Trail", description: "Add sparkle effects to your cursor", price: 80, icon: "✨", category: "cosmetic", rarity: "rare" },
  { id: "cosmetic-confetti", name: "Confetti Burst", description: "Confetti on every achievement unlock", price: 120, icon: "🎊", category: "cosmetic", rarity: "epic" },
  { id: "cosmetic-crown", name: "Golden Crown", description: "A legendary crown badge next to your name", price: 200, icon: "👑", category: "cosmetic", rarity: "legendary" },
];

const rarityStyles: Record<string, string> = {
  common: "border-border",
  rare: "border-neon/40",
  epic: "border-spark/50",
  legendary: "border-spark-glow/60 shadow-[0_0_12px_hsl(var(--spark-glow)/0.2)]",
};

const rarityBadge: Record<string, string> = {
  common: "bg-muted text-muted-foreground",
  rare: "bg-neon-muted text-neon",
  epic: "bg-spark-muted text-spark",
  legendary: "bg-gradient-to-r from-spark to-spark-glow text-background",
};

type Category = "all" | "theme" | "avatar" | "boost" | "cosmetic";

export function RewardsShop() {
  const [category, setCategory] = useState<Category>("all");
  const [purchased, setPurchased] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("kolage-purchased-items");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const { coins, spendCoins, addCoins } = useAppStore();
  const { trackAction } = useGamificationStore();
  const { toast } = useToast();

  const categories: { id: Category; label: string; icon: typeof Palette }[] = [
    { id: "all", label: "All", icon: ShoppingBag },
    { id: "theme", label: "Themes", icon: Palette },
    { id: "avatar", label: "Avatars", icon: Crown },
    { id: "boost", label: "Boosts", icon: Zap },
    { id: "cosmetic", label: "Cosmetics", icon: Sparkles },
  ];

  const filteredItems = category === "all" ? SHOP_ITEMS : SHOP_ITEMS.filter(i => i.category === category);

  const handleBuy = (item: ShopItem) => {
    if (purchased.has(item.id)) return;

    if (item.id === "boost-coins") {
      // Special: coin shower gives coins back
      if (spendCoins(item.price)) {
        addCoins(item.price + 10);
        trackAction('explore');
        toast({ title: "Coin Shower! 💰", description: `+10 bonus coins earned!` });
      } else {
        toast({ title: "Not Enough Coins", description: `You need ${item.price - coins} more coins.`, variant: "destructive" });
      }
      return;
    }

    if (spendCoins(item.price)) {
      const newPurchased = new Set(purchased);
      newPurchased.add(item.id);
      setPurchased(newPurchased);
      localStorage.setItem("kolage-purchased-items", JSON.stringify([...newPurchased]));
      trackAction('explore');
      toast({ title: "Purchase Successful! 🎉", description: `You unlocked "${item.name}"!` });
    } else {
      toast({ title: "Not Enough Coins", description: `You need ${item.price - coins} more coins.`, variant: "destructive" });
    }
  };

  return (
    <div className="h-full overflow-auto bg-paper p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-spark" />
          Rewards Shop
        </h1>
        <p className="mt-2 text-ink-light">Spend your hard-earned coins on themes, avatars, and more!</p>
        <div className="mt-3 flex items-center gap-2 text-lg">
          <Coins className="h-5 w-5 text-spark" />
          <span className="font-bold text-spark">{coins}</span>
          <span className="text-ink-faint text-sm">coins available</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={category === id ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(id)}
            className={cn("gap-2", category === id && "bg-spark hover:bg-spark/90")}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => {
          const owned = purchased.has(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border-2 bg-paper-elevated p-4 transition-all hover:shadow-desk",
                rarityStyles[item.rarity],
                owned && "opacity-70"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{item.icon}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", rarityBadge[item.rarity])}>
                  {item.rarity}
                </span>
              </div>
              <h3 className="font-semibold text-ink text-sm">{item.name}</h3>
              <p className="text-xs text-ink-faint mt-1 mb-4 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-spark">
                  <Coins className="h-4 w-4" />
                  <span className="font-bold text-sm">{item.price}</span>
                </div>
                {owned ? (
                  <div className="flex items-center gap-1 text-spark text-xs font-semibold">
                    <Check className="h-4 w-4" />
                    Owned
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleBuy(item)}
                    className="bg-spark hover:bg-spark/90 h-7 px-3 text-xs"
                  >
                    Buy
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
