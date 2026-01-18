import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getFamily, FamilyPageData } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const family = await getFamily(slug);
  
  if (!family) return { title: 'Family Not Found' };

  const ogImage = family.mainImage 
    ? urlFor(family.mainImage).width(1200).height(630).url()
    : null;
  
  return {
    title: family.familyName,
    description: `The history and members of the ${family.familyName}.`,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function FamilyPage({ params }: Props) {
  const { slug } = await params;
  const family: FamilyPageData | null = await getFamily(slug);

  if (!family) return notFound();

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col font-sans selection:bg-[#064e3b] selection:text-white">
      <Navbar />

      <main className="grow pb-24">
        
        {/* --- HERO SECTION --- */}
        <div className="relative w-full h-[50vh] md:h-[60vh] bg-stone-900 overflow-hidden shadow-2xl">
          {family.mainImage ? (
            <Image
              src={urlFor(family.mainImage).width(1600).height(900).url()}
              alt={family.familyName}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-90"
            />
          ) : (
             // Fallback Pattern if no image
            <div className="w-full h-full bg-[#064e3b] flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
               <span className="text-9xl opacity-10">🏡</span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-[#064e3b] via-black/40 to-black/30" />
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10 max-w-6xl mx-auto">
             <span className="inline-block py-1 px-3 border border-[#fbbf24]/50 rounded-full text-[#fbbf24] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
                Family Unit
             </span>
             <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-3 drop-shadow-md">
               {family.familyName}
             </h1>
             <div className="flex flex-wrap items-center gap-6 text-emerald-100/90 font-medium">
                <span className="flex items-center gap-2">
                   <span>👑</span> Head: {family.headOfFamily.fullName}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                <span>{family.children.length} Children</span>
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                <span>{family.wives.length > 0 ? `${family.wives.length} Wives` : 'Nuclear Family'}</span>
             </div>

             {/* Audio Player (Floating) */}
             {family.familyAudioUrl && (
                <div className="mt-8">
                  <audio controls className="h-10 w-full max-w-xs rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-2">
                    <source src={family.familyAudioUrl} type="audio/mpeg" />
                  </audio>
                </div>
             )}
          </div>
        </div>


        <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT SIDEBAR (Head & Mothers) --- */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* 1. HEAD OF HOUSE */}
            <section className="bg-white rounded-2xl shadow-sm border-t-4 border-[#064e3b] p-6">
               <h3 className="text-xs font-bold text-[#b45309] uppercase tracking-widest mb-4 flex items-center gap-2">
                 <span>👑</span> Mai-Gida
               </h3>
               <Link href={`/person/${family.headOfFamily.slug.current}`} className="flex items-center gap-4 group">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-stone-200 border-2 border-[#064e3b] shadow-md group-hover:scale-105 transition-transform">
                    {family.headOfFamily.profileImage && (
                      <Image 
                        src={urlFor(family.headOfFamily.profileImage).width(150).url()} 
                        fill 
                        sizes="64px" 
                        alt="" 
                        className="object-cover" 
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-lg group-hover:text-[#064e3b] transition-colors">
                      {family.headOfFamily.fullName}
                    </h4>
                    <span className="text-[10px] text-white bg-[#064e3b] px-2 py-0.5 rounded-full uppercase tracking-wide">Mahaifi</span>
                  </div>
               </Link>
            </section>

            {/* 2. MOTHERS / WIVES (Sorted by Marriage Date) */}
            {family.wives.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <h3 className="text-xs font-bold text-[#b45309] uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span>💍</span> {family.wives.length > 1 ? 'Uwaye' : 'Mahaifiya'}
                </h3>
                <div className="space-y-4">
                  {family.wives.map((wife, index) => (
                    <Link key={wife._id} href={`/person/${wife.slug.current}`} className="flex items-center gap-4 group p-2 rounded-xl hover:bg-stone-50 transition-colors">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-200 group-hover:border-[#b45309] transition-colors">
                         {wife.profileImage && (
                            <Image 
                              src={urlFor(wife.profileImage).width(100).url()} 
                              fill 
                              sizes="48px" 
                              alt="" 
                              className="object-cover" 
                            />
                         )}
                      </div>
                      <div>
                        {family.wives.length > 1 && (
                           <span className="text-[9px] font-bold text-stone-400 uppercase block mb-0.5">
                             {index === 0 ? '1st Wife' : index === 1 ? '2nd Wife' : index === 2 ? '3rd Wife' : `${index + 1}th Wife`}
                           </span>
                        )}
                        <span className="font-bold text-stone-800 group-hover:text-[#b45309] transition-colors">
                          {wife.fullName}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 3. FAMILY STORY */}
            {family.familyBio && (
              <section className="bg-[#e7e5e4]/30 rounded-2xl p-6 border border-stone-200/50">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Family Story</h3>
                <div className="prose prose-stone prose-sm max-w-none text-stone-600 leading-relaxed">
                  <PortableText value={family.familyBio} />
                </div>
              </section>
            )}
          </div>


          {/* --- RIGHT CONTENT (Children) --- */}
          <div className="lg:col-span-8">
            <section>
              <div className="flex items-end justify-between mb-8 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#064e3b] flex items-center gap-2">
                    ƳAƳA
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">Yaran Gida</p>
                </div>
                <div className="bg-stone-100 text-stone-500 text-xs font-bold px-3 py-1 rounded-full">
                  {family.children.length} Children
                </div>
              </div>
              
              {family.children.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {family.children.map((child, index) => (
                    <Link key={child._id} href={`/person/${child.slug.current}`} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-100 hover:shadow-lg hover:border-[#064e3b]/30 hover:-translate-y-1 transition-all duration-300 group">
                      
                      {/* Numbering */}
                      <span className="text-2xl font-serif font-bold text-stone-200 group-hover:text-[#064e3b]/20 transition-colors w-8 text-center shrink-0">
                        {index + 1}
                      </span>
                      
                      {/* Avatar */}
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-stone-200 shrink-0 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                         {child.profileImage && (
                            <Image 
                              src={urlFor(child.profileImage).width(100).url()} 
                              fill 
                              sizes="56px" 
                              alt="" 
                              className="object-cover" 
                            />
                         )}
                      </div>
                      
                      {/* Info */}
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-stone-800 truncate group-hover:text-[#064e3b] transition-colors">
                          {child.fullName}
                        </h4>
                        {child.birthDate && (
                          <p className="text-xs text-stone-400 font-mono mt-0.5">
                            Born {new Date(child.birthDate).getFullYear()}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300 text-stone-400">
                  <span className="text-4xl block mb-2 opacity-50">🌱</span>
                  No children recorded in this family unit yet.
                </div>
              )}
            </section>

            {/* FAMILY GALLERY */}
            {(family.gallery?.length ?? 0) > 0 && (
              <section className="mt-16 pt-8 border-t border-stone-200">
                <h3 className="text-xl font-serif font-bold text-[#064e3b] mb-6">Family Moments</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {family.gallery?.map((image, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group shadow-sm">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                      <Image 
                        src={urlFor(image).width(600).height(600).url()} 
                        alt={`Family Gallery ${i}`} 
                        fill 
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}