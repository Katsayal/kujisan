import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col font-sans selection:bg-[#064e3b] selection:text-white">
      <Navbar />

      <main className="grow flex flex-col items-center justify-center p-4 text-center relative">
        {/* Background "404" Watermark */}
        <h1 className="text-[12rem] font-serif font-bold text-[#064e3b]/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          404
        </h1>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#064e3b] mb-4 font-serif">Page Not Found</h2>
          <p className="text-stone-600 mb-8 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been moved, deleted, or doesn't exist in the family archives.
          </p>
          
          <Link 
            href="/" 
            className="inline-block px-8 py-3 bg-[#b45309] text-white rounded-full font-medium hover:bg-[#92400e] transition shadow-lg shadow-orange-900/20"
          >
            Return Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}