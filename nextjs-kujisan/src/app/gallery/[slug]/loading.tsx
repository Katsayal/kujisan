import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />

      <main className="grow">
        {/* Album Header */}
        <div className="bg-white border-b border-stone-100 px-4 py-12 md:py-16 text-center space-y-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
             <Skeleton className="h-4 w-32" /> {/* Date */}
             <Skeleton className="h-10 w-3/4 max-w-md" /> {/* Title */}
             <Skeleton className="h-6 w-full max-w-lg" /> {/* Description */}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="max-w-7xl mx-auto p-4 md:p-8">
           {/* Back Button */}
           <Skeleton className="h-8 w-24 mb-8 rounded-full" />

           {/* Masonry-style Grid */}
           <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
             {[...Array(9)].map((_, i) => (
               <div key={i} className="break-inside-avoid">
                 {/* Random heights to mimic masonry effect */}
                 <Skeleton 
                   className={`w-full rounded-2xl ${
                     i % 2 === 0 ? 'aspect-3/4' : 'aspect-square'
                   }`} 
                 />
               </div>
             ))}
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}