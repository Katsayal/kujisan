import Navbar from "@/components/Navbar";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-stone-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full opacity-50" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 pb-20">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-end">
          <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-lg border-4 border-white shrink-0" />
          <div className="space-y-3 w-full text-center md:text-left">
            <Skeleton className="h-8 w-3/4 md:w-1/2" />
            <Skeleton className="h-4 w-1/3 md:mx-0 mx-auto" />
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-6">
             <Skeleton className="h-64 w-full rounded-2xl" /> {/* Bio */}
             <Skeleton className="h-40 w-full rounded-2xl" /> {/* Audio */}
           </div>
           <div className="space-y-6">
             <Skeleton className="h-40 w-full rounded-2xl" /> {/* Info Box */}
             <Skeleton className="h-60 w-full rounded-2xl" /> {/* Family List */}
           </div>
        </div>
      </div>
    </div>
  );
}