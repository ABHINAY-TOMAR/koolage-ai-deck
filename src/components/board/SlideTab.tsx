import React, { useState } from 'react';
import { Plus, Trash2, Download, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAI } from '@/hooks/useAI';
import { useGamificationStore } from '@/stores/useGamificationStore';

interface Slide {
  id: string;
  title: string;
  content: string;
}

interface SlideTabProps {
  tabId: string;
  initialSlides?: Slide[];
  onSave?: (slides: Slide[]) => void;
}

type SlideStyle = 'professional' | 'creative' | 'academic';

export function SlideTab({ tabId, initialSlides = [], onSave }: SlideTabProps) {
  const [slides, setSlides] = useState<Slide[]>(
    initialSlides.length > 0
      ? initialSlides
      : [{ id: '1', title: 'Title Slide', content: 'Subtitle goes here' }]
  );
  const [activeSlideId, setActiveSlideId] = useState(slides[0]?.id || '1');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<SlideStyle>('professional');
  const { generateSlides, isLoading } = useAI();
  const { trackAction } = useGamificationStore();

  const activeSlide = slides.find((s) => s.id === activeSlideId);

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      content: 'Your content here',
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveSlideId(newSlide.id);
    onSave?.(updated);
  };

  const deleteSlide = (id: string) => {
    if (slides.length === 1) return;
    const updated = slides.filter((s) => s.id !== id);
    setSlides(updated);
    setActiveSlideId(updated[0].id);
    onSave?.(updated);
  };

  const updateSlide = (id: string, field: 'title' | 'content', value: string) => {
    const updated = slides.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    setSlides(updated);
    onSave?.(updated);
  };

  const downloadPPTX = () => {
    // Placeholder for PptxGenJS integration
    alert('Export to PPTX coming in Phase 3');
  };

  const handleGenerateDeck = async () => {
    if (!topic.trim()) return;
    
    setShowGenerateModal(false);
    
    const result = await generateSlides(topic, style);
    
    if (result && result.slides.length > 0) {
      setSlides(result.slides);
      setActiveSlideId(result.slides[0].id);
      onSave?.(result.slides);
      trackAction('slides');
    }
    
    setTopic('');
  };

  return (
    <div className="h-full flex">
      {/* Left Sidebar: Slide Sorter */}
      <div className="w-32 border-r border-border bg-paper-elevated overflow-y-auto">
        <div className="p-2 space-y-2">
          {slides.map((slide) => (
            <div
              key={slide.id}
              onClick={() => setActiveSlideId(slide.id)}
              className={`p-2 rounded cursor-pointer transition-colors text-xs truncate ${
                activeSlideId === slide.id
                  ? 'bg-spark text-accent-foreground'
                  : 'bg-paper border border-border hover:bg-secondary'
              }`}
              title={slide.title}
            >
              {slide.title}
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={addSlide}
            className="w-full gap-2 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
      </div>

      {/* Right: Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-border bg-paper-elevated px-4 py-3 flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowGenerateModal(true)}
            disabled={isLoading}
            className="gap-2 bg-spark hover:bg-spark/90 text-accent-foreground"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Generate Deck'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadPPTX}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          {slides.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteSlide(activeSlideId)}
              className="gap-2 ml-auto text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Editor Canvas */}
        {activeSlide && (
          <div className="flex-1 overflow-auto bg-paper p-8">
            <div className="bg-white rounded-lg shadow-desk p-12 w-full max-w-2xl mx-auto aspect-video flex flex-col justify-between">
              <div>
                <Input
                  value={activeSlide.title}
                  onChange={(e) =>
                    updateSlide(activeSlideId, 'title', e.target.value)
                  }
                  className="text-3xl font-bold mb-6 border-0 bg-transparent p-0 focus-visible:ring-0"
                  placeholder="Slide Title"
                />
              </div>
              <textarea
                value={activeSlide.content}
                onChange={(e) =>
                  updateSlide(activeSlideId, 'content', e.target.value)
                }
                className="text-lg text-ink-light resize-none flex-1 mb-4 p-0 bg-transparent focus:outline-none border-0"
                placeholder="Slide content..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-spark" />
              Generate Slide Deck
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter your presentation topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoFocus
            />
            <Select value={style} onValueChange={(v) => setStyle(v as SlideStyle)}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateDeck} 
              disabled={!topic.trim() || isLoading}
              className="bg-spark hover:bg-spark/90 text-accent-foreground"
            >
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
