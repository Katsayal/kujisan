"use client";

import { useEffect, useCallback, useState, useMemo } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  ReactFlowProvider,
  Controls,
  Background,
  Node,
  Edge,
  useReactFlow
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
  const { fitView } = useReactFlow();
  
  // FIX: Stable nodeTypes to prevent re-render warnings
  const nodeTypes = useMemo(() => ({
    passport: PassportNode,
  }), []);

  // Data State: Maps are faster for lookups/deletions than Arrays
  const nodesMap = useState(() => new Map<string, Node>())[0];
  const edgesMap = useState(() => new Map<string, Edge>())[0];

  // --- ACTIONS ---

  const refreshLayout = useCallback(async () => {
    const currentNodes = Array.from(nodesMap.values());
    const currentEdges = Array.from(edgesMap.values());
    
    const layouted = await getLayoutedElements(currentNodes, currentEdges);
    
    // @ts-ignore
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }, [nodesMap, edgesMap, getLayoutedElements, setNodes, setEdges]);

  // --- TOGGLE LOGIC: EXPAND OR COLLAPSE ---
  const onNodeExpand = useCallback(async (personId: string) => {
    const parentNode = nodesMap.get(personId);
    if (!parentNode) return;

    // CASE 1: COLLAPSE (Hide Branch)
    if (parentNode.data.expanded) {
      const currentEdges = Array.from(edgesMap.values());

      // Recursive helper: Find all IDs below this node
      const getDescendants = (id: string): string[] => {
        const childrenIds = currentEdges
          .filter((e) => e.source === id)
          .map((e) => e.target);
        
        return [
          ...childrenIds,
          ...childrenIds.flatMap((childId) => getDescendants(childId))
        ];
      };

      const descendantsToRemove = getDescendants(personId);

      // 1. Delete Nodes
      descendantsToRemove.forEach((id) => nodesMap.delete(id));

      // 2. Delete Edges (Connecting to or inside the branch)
      const edgesToRemove = currentEdges.filter(
        (e) =>
          e.source === personId || // Edge from Parent to Child
          descendantsToRemove.includes(e.source) || // Edges deeper in branch
          descendantsToRemove.includes(e.target)
      );
      edgesToRemove.forEach((e) => edgesMap.delete(e.id));

      // 3. Mark Parent as Collapsed
      nodesMap.set(personId, {
        ...parentNode,
        data: { ...parentNode.data, expanded: false },
      });
    } 
    
    // CASE 2: EXPAND (Show Branch)
    else {
      // Fetch fresh data
      const personData = await getTreeBranch(personId);
      if (!personData) return;

      // Add to maps
      transformBranch(personData, nodesMap, edgesMap);

      // Mark Parent as Expanded
      // Note: Re-get node in case transform updated it
      const updatedNode = nodesMap.get(personId);
      if (updatedNode) {
        nodesMap.set(personId, {
          ...updatedNode,
          data: { ...updatedNode.data, expanded: true },
        });
      }
    }

    // Update Visuals
    await refreshLayout();
  }, [nodesMap, edgesMap, refreshLayout]);

  const handleResetView = () => {
    fitView({ duration: 800, padding: 0.2 });
  };

  // --- INITIALIZATION ---

  useEffect(() => {
    const initTree = async () => {
      const roots = await getTreeRoot();
      roots.forEach(root => transformBranch(root, nodesMap, edgesMap));
      await refreshLayout();
      
      // Gentle center after load
      setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 100);
    };
    initTree();
  }, []); // Run once on mount

  // Ensure nodes always have the latest click handler
  useEffect(() => {
     nodes.forEach(node => {
       if (node.type === 'passport') {
         node.data.onExpand = onNodeExpand;
       }
     });
  }, [nodes, onNodeExpand]);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-stone-50 relative group/canvas">
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
        {/* Controls moved up slightly */}
        <Controls showInteractive={false} className="mb-16 md:mb-0" />
      </ReactFlow>

      {/* --- FEATURE 1: LEGEND (Top Right) --- */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-stone-100 text-xs font-medium space-y-2 opacity-50 hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-900"></div>
          <span className="text-stone-600">Gen 1 (Root)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#b45309]"></div>
          <span className="text-stone-600">Gen 2 (Children)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-stone-200 border border-stone-300"></div>
          <span className="text-stone-600">Gen 3+</span>
        </div>
      </div>

      {/* --- FEATURE 2: RESET BUTTON (Bottom Right) --- */}
      <button 
        onClick={handleResetView}
        className="absolute bottom-6 right-4 md:bottom-8 md:right-8 bg-white hover:bg-stone-50 text-stone-600 p-3 rounded-full shadow-lg border border-stone-200 transition-transform active:scale-95 flex items-center gap-2 z-20"
        title="Reset View"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span className="hidden md:inline font-medium text-sm">Back to Root</span>
      </button>

      {/* --- FEATURE 3: MOBILE HINT (Bottom Center) --- */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-10 pointer-events-none flex justify-center opacity-80">
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