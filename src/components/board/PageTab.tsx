import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './PageTab.css';

interface PageTabProps {
  tabId: string;
  initialContent?: string;
  onSave?: (content: string) => void;
}

export function PageTab({ tabId, initialContent = '', onSave }: PageTabProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || '<p>Start typing your notes here...</p>',
    onUpdate: ({ editor }) => {
      onSave?.(editor.getHTML());
    },
  });

  const aiWrite = useCallback(() => {
    // Placeholder for AI integration
    alert('AI Writing assistant coming in Phase 3');
  }, []);

  if (!editor) {
    return <div className="h-full bg-paper" />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border bg-paper-elevated px-4 py-3 flex gap-2 flex-wrap">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          Bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          Italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          H1
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          H2
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          List
        </Button>
        <div className="ml-auto flex gap-2">
          <Button
            onClick={aiWrite}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI Write
          </Button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 overflow-auto bg-paper p-8">
        <div className="bg-white rounded-lg shadow-desk p-12 min-h-full max-w-2xl mx-auto">
          <EditorContent editor={editor} className="page-editor" />
        </div>
      </div>
    </div>
  );
}
