import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col">
      <Navbar />
      <main className="grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Header Skeleton */}
        <div className="mb-12 text-center md:text-left space-y-4">
          <Skeleton className="h-4 w-32 md:mx-0 mx-auto" />
          <Skeleton className="h-10 w-64 md:mx-0 mx-auto" />
          <Skeleton className="h-6 w-full max-w-xl md:mx-0 mx-auto" />
        </div>

        {/* Filter Bar Skeleton */}
        <Skeleton className="h-16 w-full rounded-3xl mb-12" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-stone-100 space-y-4">
              <Skeleton className="aspect-square rounded-xl w-full" />
              <div className="space-y-2 flex flex-col items-center">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}