import React, { useCallback } from 'react';
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
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhiteboardTabProps {
  tabId: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

export function WhiteboardTab({ tabId, initialNodes = [], initialEdges = [], onSave }: WhiteboardTabProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
      style: {
        background: 'hsl(var(--paper-elevated))',
        border: '2px solid hsl(var(--border))',
        borderRadius: '0.75rem',
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
      },
    };
    setNodes([...nodes, newNode]);
  };

  const generateMap = () => {
    // Mock AI call - placeholder for Lovable AI integration
    const mockNodes: Node[] = [
      {
        id: '1',
        data: { label: 'Topic' },
        position: { x: 250, y: 0 },
        style: {
          background: 'hsl(var(--spark))',
          color: 'hsl(var(--accent-foreground))',
          border: 'none',
          borderRadius: '0.75rem',
          padding: '12px',
          fontWeight: 'bold',
        },
      },
      {
        id: '2',
        data: { label: 'Subtopic 1' },
        position: { x: 100, y: 100 },
        style: {
          background: 'hsl(var(--paper-elevated))',
          border: '2px solid hsl(var(--border))',
          borderRadius: '0.75rem',
          padding: '10px',
        },
      },
      {
        id: '3',
        data: { label: 'Subtopic 2' },
        position: { x: 400, y: 100 },
        style: {
          background: 'hsl(var(--paper-elevated))',
          border: '2px solid hsl(var(--border))',
          borderRadius: '0.75rem',
          padding: '10px',
        },
      },
    ];

    const mockEdges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
    ];

    setNodes(mockNodes);
    setEdges(mockEdges);
    onSave?.(mockNodes, mockEdges);
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
          onClick={generateMap}
          className="gap-2 bg-spark hover:bg-spark/90 text-accent-foreground"
        >
          <Sparkles className="h-4 w-4" />
          Generate Map
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
    </div>
  );
}
