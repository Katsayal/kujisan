"use client";

import { useEffect, useCallback, useState, useMemo } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  ReactFlowProvider,
  Controls,
  Background,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css'; 

import Navbar from "@/components/Navbar";
import { useLayout } from "@/hooks/useLayout";
import PassportNode from "@/components/tree/PassportNode";
import { getTreeRoot, getTreeBranch } from "@/sanity/client";
import { transformBranch } from "@/utils/tree-transformer";

function AncestryCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { getLayoutedElements } = useLayout();
  
  // FIX: Define nodeTypes with useMemo to prevent re-creation warnings during Dev/HMR
  const nodeTypes = useMemo(() => ({
    passport: PassportNode,
  }), []);

  // Data State
  const nodesMap = useState(() => new Map<string, Node>())[0];
  const edgesMap = useState(() => new Map<string, Edge>())[0];

  const refreshLayout = useCallback(async () => {
    const currentNodes = Array.from(nodesMap.values());
    const currentEdges = Array.from(edgesMap.values());
    
    const layouted = await getLayoutedElements(currentNodes, currentEdges);
    
    // @ts-ignore
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }, [nodesMap, edgesMap, getLayoutedElements, setNodes, setEdges]);

  const onNodeExpand = useCallback(async (personId: string) => {
    const personData = await getTreeBranch(personId);
    if (!personData) return;

    transformBranch(personData, nodesMap, edgesMap);

    const parentNode = nodesMap.get(personId);
    if (parentNode) {
      nodesMap.set(personId, {
        ...parentNode,
        data: { ...parentNode.data, expanded: true }
      });
    }

    await refreshLayout();
  }, [nodesMap, edgesMap, refreshLayout]);

  useEffect(() => {
    const initTree = async () => {
      const roots = await getTreeRoot();
      roots.forEach(root => transformBranch(root, nodesMap, edgesMap));
      await refreshLayout();
    };
    initTree();
  }, []);

  useEffect(() => {
     nodes.forEach(node => {
       if (node.type === 'passport') {
         node.data.onExpand = onNodeExpand;
       }
     });
  }, [nodes, onNodeExpand]);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-stone-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} 
        fitView
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="#e5e5e5" gap={40} />
        {/* Controls moved slightly up to not overlap with our new hint */}
        <Controls showInteractive={false} className="mb-12 md:mb-0" />
      </ReactFlow>

      {/* --- REVISED: Subtle Mobile Orientation Hint --- */}
      {/* Positioned at bottom, semi-transparent, completely ignorable */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 pointer-events-none flex justify-center opacity-80">
        <div className="bg-stone-800/80 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-sm border border-white/5 flex items-center gap-2">
          <span className="text-sm">📲</span>
          <span>Rotate for wider view</span>
        </div>
      </div>
    </div>
  );
}

export default function TreePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ReactFlowProvider>
        <AncestryCanvas />
      </ReactFlowProvider>
    </div>
  );
}