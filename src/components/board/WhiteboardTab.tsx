import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAI } from '@/hooks/useAI';
import { useGamificationStore } from '@/stores/useGamificationStore';

interface WhiteboardTabProps {
  tabId: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

// Node styling based on design system
const getNodeStyle = (isCenter: boolean) => ({
  background: isCenter ? 'hsl(var(--spark))' : 'hsl(var(--paper-elevated))',
  color: isCenter ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))',
  border: isCenter ? 'none' : '2px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  padding: isCenter ? '12px' : '10px',
  fontWeight: isCenter ? 'bold' : 'normal',
  fontSize: '12px',
  fontFamily: 'Inter, sans-serif',
});

export function WhiteboardTab({ tabId, initialNodes = [], initialEdges = [], onSave }: WhiteboardTabProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topic, setTopic] = useState('');
  const { generateMindMap, isLoading } = useAI();
  const { trackAction } = useGamificationStore();

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, edges);
      setEdges(newEdges);
      onSave?.(nodes, newEdges);
    },
    [edges, nodes, setEdges, onSave]
  );

  const onNodesChangeWrapper = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      setTimeout(() => onSave?.(nodes, edges), 0);
    },
    [onNodesChange, nodes, edges, onSave]
  );

  const addNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      data: { label: 'New Node' },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      style: getNodeStyle(false),
    };
    setNodes([...nodes, newNode]);
  };

  const handleGenerateMap = async () => {
    if (!topic.trim()) return;
    
    setShowTopicModal(false);
    
    const result = await generateMindMap(topic);
    
    if (result) {
      // Style the nodes appropriately
      const styledNodes = result.nodes.map((node, index) => ({
        ...node,
        style: getNodeStyle(index === 0), // First node is center
      }));
      
      setNodes(styledNodes);
      setEdges(result.edges);
      onSave?.(styledNodes, result.edges);
      trackAction('mindmap');
    }
    
    setTopic('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border bg-paper-elevated px-4 py-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addNode}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Node
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowTopicModal(true)}
          disabled={isLoading}
          className="gap-2 bg-spark hover:bg-spark/90 text-accent-foreground"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isLoading ? 'Generating...' : 'Generate Map'}
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-paper dot-grid">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeWrapper}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Topic Modal */}
      <Dialog open={showTopicModal} onOpenChange={setShowTopicModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-spark" />
              Generate Mind Map
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter a topic (e.g., 'Photosynthesis', 'World War II')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateMap()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTopicModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateMap} 
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
