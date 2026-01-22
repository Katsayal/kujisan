import Navbar from "@/components/Navbar";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      {/* Hero */}
      <div className="relative h-[60vh] bg-stone-200">
         <Skeleton className="w-full h-full opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
             <Skeleton className="h-10 w-1/2" />
             <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
             <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}