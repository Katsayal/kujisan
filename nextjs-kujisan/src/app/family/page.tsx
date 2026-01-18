import Link from "next/link";
import Image from "next/image";
import { getFamilies, FamilyDirectoryItem } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Family Units | KUJISAN',
  description: 'Browse the nuclear family units and households of the lineage.',
};

export default async function FamiliesDirectory() {
  const families: FamilyDirectoryItem[] = await getFamilies();

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col selection:bg-[#064e3b] selection:text-white">
      <Navbar />
      
      <main className="grow p-4 md:p-8">
        <header className="mb-12 max-w-6xl mx-auto text-center md:text-left">
          <span className="text-[#b45309] font-bold tracking-wider text-xs uppercase mb-3 block">
            The Households
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#064e3b] font-bold mb-4">
            Family Units
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl leading-relaxed">
            A chronological collection of the households established within the lineage.
          </p>
        </header>

        {families.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pb-20">
            {families.map((family) => (
              <Link 
                key={family._id} 
                href={`/family/${family.slug.current}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-100"
              >
                {/* Card Image Header */}
                <div className="relative h-64 bg-stone-200">
                  {family.mainImage ? (
                    <Image
                      src={urlFor(family.mainImage).width(800).height(600).url()}
                      alt={family.familyName}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#064e3b]/5 text-[#064e3b]/20">
                      <span className="text-5xl mb-2">🏡</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-90" />
                  
                  {/* Floating Info (Bottom Left) */}
                  <div className="absolute bottom-5 left-6 right-6 text-white">
                    <p className="text-[#fbbf24] text-xs font-bold uppercase tracking-widest mb-2">
                       {/* Heuristic: Est date is roughly 25 years after birth */}
                       Est. {family.headOfFamily.birthDate ? new Date(family.headOfFamily.birthDate).getFullYear() + 25 : 'Unknown'}
                    </p>
                    <h2 className="text-2xl font-serif font-bold leading-tight group-hover:text-[#fbbf24] transition-colors">
                      {family.familyName}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Head of Family Row */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-lg border border-stone-200">
                       👑
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Mai-Gida</p>
                      <p className="text-sm font-bold text-stone-800">{family.headOfFamily.fullName}</p>
                    </div>
                  </div>

                  {/* Stats Badges */}
                  <div className="flex gap-2 pt-4 border-t border-stone-100">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0fdf4] border border-[#dcfce7] text-[#15803d] text-xs font-bold">
                      <span>👥</span>
                      {family.childrenCount} Children
                    </span>
                    
                    {family.wivesCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fffbeb] border border-[#fef3c7] text-[#b45309] text-xs font-bold">
                        <span>💍</span>
                        {family.wivesCount === 1 ? 'Married' : `${family.wivesCount} Wives`}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 max-w-4xl mx-auto shadow-sm">
             <p className="text-stone-400 text-lg">No family units found.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}