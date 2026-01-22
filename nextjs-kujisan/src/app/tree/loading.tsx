import Navbar from "@/components/Navbar";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="grow bg-stone-50 flex flex-col items-center justify-center p-8">
        
        {/* Mimic the "Sani" Node */}
        <div className="flex items-center gap-4 p-2 bg-white rounded-full shadow-sm border border-stone-100 w-50 mb-8">
           <Skeleton className="w-10 h-10 rounded-full shrink-0" /> {/* Avatar */}
           <div className="space-y-2 grow">
             <Skeleton className="h-3 w-3/4" /> {/* Name */}
             <Skeleton className="h-2 w-1/2" /> {/* Gen */}
           </div>
        </div>

        {/* Mimic the Connecting Line */}
        <div className="w-px h-12 bg-stone-300 mb-8"></div>

        {/* Mimic the Children Row */}
        <div className="flex gap-8 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-full shadow-sm border border-stone-100 w-42.5 opacity-70">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-2 grow">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}