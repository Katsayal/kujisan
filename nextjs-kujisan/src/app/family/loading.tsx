import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col">
      <Navbar />
      
      <main className="grow p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-12 max-w-7xl mx-auto text-center md:text-left space-y-4">
          <Skeleton className="h-4 w-24 md:mx-0 mx-auto" /> {/* "The Directory" Label */}
          <Skeleton className="h-10 w-64 md:mx-0 mx-auto" /> {/* Title */}
          <Skeleton className="h-6 w-full max-w-xl md:mx-0 mx-auto" /> {/* Description */}
        </div>

        {/* Family Cards Grid */}
        <div className="max-w-7xl mx-auto pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm flex flex-col">
                
                {/* Cover Image */}
                <Skeleton className="w-full aspect-video" />

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" /> {/* Family Name */}
                    <Skeleton className="h-4 w-1/2" /> {/* Head of Family Name */}
                  </div>

                  {/* Stats Pills */}
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}