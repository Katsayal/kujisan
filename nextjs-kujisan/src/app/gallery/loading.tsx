import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col">
      <Navbar />
      <main className="grow p-4 md:p-8 max-w-7xl mx-auto w-full">
         <div className="text-center space-y-4 mb-12">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-12 w-64 mx-auto" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="aspect-4/3 rounded-2xl bg-white p-4 border border-stone-100">
                  <Skeleton className="w-full h-full rounded-xl" />
               </div>
            ))}
         </div>
      </main>
      <Footer />
    </div>
  );
}