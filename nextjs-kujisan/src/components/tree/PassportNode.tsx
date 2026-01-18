import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import Router

// Color mapping for generations (Roots -> Newest)
const GEN_COLORS: Record<number, string> = {
  1: 'border-emerald-700 bg-emerald-50', // Roots (Sani)
  2: 'border-[#b45309] bg-amber-50',     // Children (Gold)
  3: 'border-stone-400 bg-stone-50',     // Grandchildren
  4: 'border-stone-300 bg-white',        // Great-Grand
};

const PassportNode = ({ data }: NodeProps) => {
  const router = useRouter(); // Initialize Router
  const gen = data.generation || 3;
  const borderColor = GEN_COLORS[gen] || 'border-stone-200';
  const bgColor = gen === 1 ? 'bg-emerald-900' : gen === 2 ? 'bg-[#b45309]' : 'bg-stone-200';

  // Navigation Handler
  const handleNodeClick = () => {
    if (data.slug) {
      router.push(`/person/${data.slug}`);
    }
  };

  return (
    <div className="relative group">
      {/* 1. The Card Body - Now Clickable */}
      <div 
        onClick={handleNodeClick} // <--- CLICK ACTION
        className={`flex items-center gap-3 pr-4 pl-1 py-1 rounded-full bg-white shadow-md border-2 transition-all duration-300 w-42.5 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${borderColor}`}
      >
        {/* Avatar */}
        <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-stone-100 ${bgColor}`}>
          {data.image ? (
            <Image 
              src={data.image} 
              alt={data.label} 
              fill 
              sizes="40px"
              priority // <--- Fixes LCP Warning
              className="object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-white/50">
              {data.sex === 'female' ? '🧕' : '👤'}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-stone-800 truncate leading-tight">
            {data.label}
          </p>
          <p className="text-[9px] text-stone-400 font-mono mt-0.5">
            Gen {gen}
          </p>
        </div>
      </div>

      {/* 2. Expansion Button */}
      {data.hasChildren && (
        <button 
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center shadow-sm text-stone-500 hover:text-emerald-600 hover:border-emerald-600 transition-colors z-20"
          onClick={(e) => {
            e.stopPropagation(); // Stop click from triggering navigation
            data.onExpand?.(data.id);
          }}
        >
          {data.expanded ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          )}
        </button>
      )}

      {/* 3. Handles */}
      <Handle type="target" position={Position.Top} className="bg-transparent! border-none!" />
      <Handle type="source" position={Position.Bottom} className="bg-transparent! border-none!" />
    </div>
  );
};

export default memo(PassportNode);