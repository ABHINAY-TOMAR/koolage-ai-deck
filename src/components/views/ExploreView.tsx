import { useState } from "react";
import { Play, FileText, Presentation, Coins } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useGamificationStore } from "@/stores/useGamificationStore";
import { cn } from "@/lib/utils";

interface ExploreItem {
  id: string;
  title: string;
  type: "video" | "pdf" | "slides" | "template";
  thumbnail: string;
  price: number;
  creator: string;
}

const mockItems: ExploreItem[] = [
  { id: "1", title: "Calculus Fundamentals Mind Map", type: "template", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", price: 25, creator: "MathPro" },
  { id: "2", title: "World War II Complete Notes", type: "pdf", thumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=300&fit=crop", price: 15, creator: "HistoryBuff" },
  { id: "3", title: "Biology Cell Division", type: "video", thumbnail: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=400&h=300&fit=crop", price: 30, creator: "ScienceSimplified" },
  { id: "4", title: "Physics Formulas Deck", type: "slides", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", price: 20, creator: "PhysicsGeek" },
  { id: "5", title: "Psychology 101 Summary", type: "pdf", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", price: 10, creator: "MindMatters" },
  { id: "6", title: "Organic Chemistry Reactions", type: "video", thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", price: 35, creator: "ChemistryKing" },
];

const typeIcons = { video: Play, pdf: FileText, slides: Presentation, template: FileText };
const typeColors = { video: "bg-destructive", pdf: "bg-neon", slides: "bg-spark", template: "bg-spark-glow" };

type FilterCategory = "all" | "video" | "pdf" | "slides" | "template";

const categories: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "video", label: "Videos" },
  { id: "pdf", label: "PDFs" },
  { id: "slides", label: "Slides" },
  { id: "template", label: "Templates" },
];

export function ExploreView() {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const { coins, spendCoins } = useAppStore();
  const { toast } = useToast();
  const { trackAction } = useGamificationStore();

  const filteredItems = filter === "all" ? mockItems : mockItems.filter(i => i.type === filter);

  const handleBuy = (item: ExploreItem) => {
    if (spendCoins(item.price)) {
      trackAction('explore');
      toast({ title: "Purchase Successful! 🎉", description: `You bought "${item.title}" for ${item.price} coins.` });
    } else {
      toast({ title: "Not Enough Coins", description: `You need ${item.price - coins} more coins.`, variant: "destructive" });
    }
  };

  return (
    <div className="h-full overflow-auto bg-paper p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">Explore</h1>
        <p className="mt-2 text-ink-light">Discover study materials from the community</p>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map(({ id, label }) => (
          <Button
            key={id}
            variant={filter === id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(id)}
            className={cn(filter === id && "bg-spark hover:bg-spark/90")}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <Card key={item.id} className="group overflow-hidden bg-paper-elevated shadow-desk transition-all hover:shadow-dock hover:-translate-y-1">
              <div className="relative aspect-video overflow-hidden">
                <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <Badge className={cn("absolute left-2 top-2 border-0 text-white", typeColors[item.type])}>
                  <Icon className="mr-1 h-3 w-3" />
                  {item.type}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 font-semibold text-ink line-clamp-2">{item.title}</h3>
                <p className="mb-3 text-sm text-ink-light">by {item.creator}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-spark">
                    <Coins className="h-4 w-4" />
                    <span className="font-semibold">{item.price}</span>
                  </div>
                  <Button size="sm" onClick={() => handleBuy(item)} className="bg-spark hover:bg-spark/90">Buy</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center text-ink-faint">
            No items found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
