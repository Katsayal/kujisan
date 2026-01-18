import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Ancestry Tree | KUJISAN',
  description: 'Interactive family tree visualization - Coming Soon.',
};

export default function AncestryTreePage() {
  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col font-sans selection:bg-[#064e3b] selection:text-white">
      <Navbar />
      
      <main className="grow flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-stone-100 max-w-lg w-full">
          <div className="w-24 h-24 bg-[#064e3b]/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">🌳</span>
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-[#064e3b] mb-4">
            Ancestry Chart
          </h1>
          
          <p className="text-stone-600 mb-8 leading-relaxed">
            We are currently building an interactive visual tree to explore the lineage connections dynamically.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fbbf24]/20 text-[#b45309] rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 bg-[#b45309] rounded-full animate-pulse"></span>
            Under Construction
          </div>

          <div className="flex justify-center">
            <Link 
              href="/members" 
              className="px-8 py-3 bg-[#064e3b] text-white rounded-full font-medium hover:bg-[#053d2e] transition shadow-lg shadow-[#064e3b]/20"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}