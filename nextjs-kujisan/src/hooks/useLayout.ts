import { useCallback } from 'react';
import ReactFlow, { Node, Edge } from 'reactflow';
import ELK from 'elkjs/lib/elk.bundled';

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '60', // Horizontal gap
  'elk.layered.spacing.nodeNodeBetweenLayers': '100', // Vertical gap
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
};

export function useLayout() {
  const getLayoutedElements = useCallback(async (nodes: Node[], edges: Edge[]) => {
    // 1. SAFETY FILTER: Remove any nodes with missing IDs (Fixes the 'null' crash)
    const safeNodes = nodes.filter(n => n.id && n.id !== 'null' && n.id !== 'undefined');
    
    // 2. Ensure edges only connect to existing nodes
    const safeEdges = edges.filter(e => 
      e.id && 
      e.source && 
      e.target && 
      safeNodes.find(n => n.id === e.source) && 
      safeNodes.find(n => n.id === e.target)
    );

    if (safeNodes.length === 0) return { nodes: [], edges: [] };

    const graph = {
      id: 'root',
      layoutOptions: elkOptions,
      children: safeNodes.map((node) => ({
        id: node.id,
        width: 170, 
        height: 70, 
      })),
      edges: safeEdges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    try {
      const layout = await elk.layout(graph);

      const layoutNodes = safeNodes.map((node) => {
        const elkNode = layout.children?.find((n) => n.id === node.id);
        
        if (!elkNode) return node;

        return {
          ...node,
          targetPosition: 'top',
          sourcePosition: 'bottom',
          position: {
            x: elkNode.x || 0,
            y: elkNode.y || 0,
          },
        };
      });

      return { nodes: layoutNodes, edges: safeEdges };
    } catch (error) {
      console.error('ELK Layout Crash:', error);
      // Return un-layouted nodes so content is visible even if stacking occurs
      return { nodes: safeNodes, edges: safeEdges };
    }
  }, []);

  return { getLayoutedElements };
}