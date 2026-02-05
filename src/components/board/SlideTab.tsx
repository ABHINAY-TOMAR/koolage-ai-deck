import React, { useState } from 'react';
import { Plus, Trash2, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export function SlideTab({ tabId, initialSlides = [], onSave }: SlideTabProps) {
  const [slides, setSlides] = useState<Slide[]>(
    initialSlides.length > 0
      ? initialSlides
      : [{ id: '1', title: 'Title Slide', content: 'Subtitle goes here' }]
  );
  const [activeSlideId, setActiveSlideId] = useState(slides[0]?.id || '1');

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

  const generateDeck = () => {
    // Placeholder for AI integration
    alert('AI Deck generation coming in Phase 3');
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
            onClick={generateDeck}
            className="gap-2 bg-spark hover:bg-spark/90 text-accent-foreground"
          >
            <Sparkles className="h-4 w-4" />
            Generate Deck
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
    </div>
  );
}
