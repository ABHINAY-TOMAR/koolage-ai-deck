import { useState, useEffect, useCallback, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Play, Pause, Volume2, VolumeX, Youtube, Speech } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DockPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const DEFAULT_POSITION: DockPosition = {
  x: window.innerWidth - 420,
  y: window.innerHeight - 320,
  width: 400,
  height: 300,
};

const MIN_SIZE = { width: 280, height: 200 };

export function FloatingDock() {
  const { dockVisible, dockContent, hideDock } = useAppStore();
  const [position, setPosition] = useState<DockPosition>(() => {
    const saved = localStorage.getItem('kolage-dock-position');
    return saved ? JSON.parse(saved) : DEFAULT_POSITION;
  });
  const [minimized, setMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('kolage-dock-position', JSON.stringify(position));
  }, [position]);

  // Handle TTS
  const startTTS = useCallback(() => {
    if (dockContent?.type === 'tts' && dockContent.text) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(dockContent.text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsPlaying(false);
      speechRef.current = utterance;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  }, [dockContent]);

  const toggleTTS = useCallback(() => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      startTTS();
    }
  }, [isPlaying, startTTS]);

  const stopTTS = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  // Stop TTS when dock hides
  useEffect(() => {
    if (!dockVisible) {
      stopTTS();
    }
  }, [dockVisible, stopTTS]);

  if (!dockVisible || !dockContent) return null;

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match?.[1] || '';
  };

  return (
    <Rnd
      position={{ x: position.x, y: position.y }}
      size={{ width: position.width, height: minimized ? 48 : position.height }}
      minWidth={MIN_SIZE.width}
      minHeight={MIN_SIZE.height}
      bounds="window"
      dragHandleClassName="dock-handle"
      onDragStop={(_, d) => {
        setPosition(prev => ({ ...prev, x: d.x, y: d.y }));
      }}
      onResizeStop={(_, __, ref, ___, pos) => {
        setPosition({
          x: pos.x,
          y: pos.y,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
      }}
      enableResizing={!minimized}
      className="z-50"
    >
      <div className={cn(
        "flex flex-col rounded-xl border border-border bg-background shadow-2xl overflow-hidden",
        "transition-all duration-200",
        minimized ? "h-12" : "h-full"
      )}>
        {/* Header */}
        <div className="dock-handle flex h-12 items-center justify-between border-b border-border bg-secondary/50 px-3 cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2 text-sm font-medium">
            {dockContent.type === 'youtube' ? (
              <>
                <Youtube className="h-4 w-4 text-destructive" />
                <span>Video Player</span>
              </>
            ) : (
              <>
                <Speech className="h-4 w-4 text-spark" />
                <span>Text to Speech</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setMinimized(!minimized)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
              onClick={hideDock}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!minimized && (
          <div className="flex-1 overflow-hidden">
            {dockContent.type === 'youtube' && dockContent.url && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYouTubeId(dockContent.url)}?autoplay=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            )}

            {dockContent.type === 'tts' && (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
                <div className="max-h-32 overflow-y-auto rounded-lg bg-secondary/30 p-3 text-sm text-muted-foreground">
                  {dockContent.text?.slice(0, 200)}
                  {(dockContent.text?.length || 0) > 200 && '...'}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-spark hover:bg-spark/90"
                    onClick={toggleTTS}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  {isPlaying ? 'Playing...' : 'Press play to listen'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Rnd>
  );
}
