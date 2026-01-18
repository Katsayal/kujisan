import { Node, Edge } from 'reactflow';
import { TreePerson } from '@/sanity/client';
import { urlFor } from '@/sanity/image';

export const transformBranch = (
  person: TreePerson, 
  nodesMap: Map<string, Node>, 
  edgesMap: Map<string, Edge>
) => {
  // SAFETY CHECK
  if (!person?._id) return;

  const unions = person.unions || [];

  // 1. Create Sani (Main Person)
  if (!nodesMap.has(person._id)) {
    nodesMap.set(person._id, {
      id: person._id,
      type: 'passport',
      position: { x: 0, y: 0 }, 
      data: {
        id: person._id, // <--- FIX: Added ID here so the button can find it
        slug: person.slug?.current,
        label: person.fullName || 'Unknown',
        image: person.profileImage ? urlFor(person.profileImage).width(100).height(100).url() : null,
        sex: person.sex,
        generation: person.generation,
        hasChildren: unions.some(u => u.children?.length > 0),
        expanded: true,
      },
    });
  }

  // 2. Process Families
  unions.forEach((union) => {
    const partner = union.partner;
    const children = union.children || [];
    let parentNodeId = person._id; 

    // HUSBAND -> WIFE -> CHILDREN LOGIC
    if (partner?._id) {
      parentNodeId = partner._id; 

      // Create Wife
      if (!nodesMap.has(partner._id)) {
        nodesMap.set(partner._id, {
          id: partner._id,
          type: 'passport',
          position: { x: 0, y: 0 },
          data: {
            id: partner._id, // <--- FIX: Added ID here
            slug: partner.slug?.current,
            label: partner.fullName || 'Unknown Partner',
            image: partner.profileImage ? urlFor(partner.profileImage).width(100).height(100).url() : null,
            sex: 'female', 
            generation: person.generation, 
            isSpouse: true,
            hasChildren: children.length > 0,
            expanded: true, 
          },
        });

        // Link Husband to Wife
        const edgeId = `e-${person._id}-${partner._id}`;
        edgesMap.set(edgeId, {
          id: edgeId,
          source: person._id,
          target: partner._id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#b45309', strokeWidth: 2 },
        });
      }
    }

    // 3. Create Children
    children.forEach((child) => {
      if (!child?._id) return;

      if (!nodesMap.has(child._id)) {
        nodesMap.set(child._id, {
          id: child._id,
          type: 'passport',
          position: { x: 0, y: 0 },
          data: {
            id: child._id, // <--- FIX: Added ID here
            slug: child.slug?.current,
            label: child.fullName || 'Unknown Child',
            image: child.profileImage ? urlFor(child.profileImage).width(100).height(100).url() : null,
            sex: child.sex,
            generation: child.generation,
            hasChildren: child.childCount > 0,
            expanded: false,
          },
        });

        // Link Parent (Wife or Husband) to Child
        const edgeId = `e-${parentNodeId}-${child._id}`;
        if (!edgesMap.has(edgeId)) {
          edgesMap.set(edgeId, {
            id: edgeId,
            source: parentNodeId,
            target: child._id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#78716c' },
          });
        }
      }
    });
  });
};
