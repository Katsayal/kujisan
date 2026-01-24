import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPerson, PersonDetail } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPerson(slug);
  if (!person) return { title: 'Not Found' };

  const ogImage = person.profileImage 
    ? urlFor(person.profileImage).width(1200).height(630).url()
    : null; // Fallback to default if no photo
  
  return {
    title: person.fullName,
    description: person.bio 
      ? `Read the biography and lineage of ${person.fullName}.` 
      : `Family profile of ${person.fullName}`,
    // 2. Pass it to OpenGraph
    openGraph: {
      title: `${person.fullName} | KUJISAN`,
      description: `Family profile of ${person.fullName}`,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const person: PersonDetail | null = await getPerson(slug);

  if (!person) return notFound();

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col font-sans selection:bg-[#064e3b] selection:text-white">
      <Navbar />

      <main className="grow pb-24">
        
        {/* --- HEADER --- */}
        <div className="bg-[#064e3b] text-white relative overflow-hidden pb-12 pt-12 shadow-xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            {/* Avatar */}
            <div className="relative w-44 h-44 mx-auto mb-6 rounded-full p-1 bg-linear-to-tr from-[#b45309] via-[#fbbf24] to-[#064e3b] shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 border-4 border-[#064e3b] relative">
                {person.profileImage ? (
                  <Image
                    src={urlFor(person.profileImage).width(400).height(400).url()}
                    alt={person.fullName}
                    fill
                    priority
                    sizes="180px"
                    className="object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-5xl ${person.sex === 'female' ? 'bg-rose-50 text-rose-300' : 'bg-slate-50 text-slate-300'}`}>
                     {person.sex === 'female' ? '🧕' : '👤'}
                  </div>
                )}
              </div>
              
              {person.generation && (
                <div className="absolute bottom-2 right-2 bg-[#b45309] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20">
                  Gen {person.generation}
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 tracking-wide">
              {person.fullName}
            </h1>
            
            {/* DATE LOGIC: Only show if deceased */}
            {person.isDeceased && (
              <div className="flex flex-col items-center gap-1">
              <p className="text-emerald-100/70 font-mono text-sm tracking-wider uppercase">
                {person.birthDate ? new Date(person.birthDate).getFullYear() : "?"} — {person.deathDate ? new Date(person.deathDate).getFullYear() : "Deceased"}
              </p>
              <p className="text-emerald-200/80 font-serif italic text-sm">
                Allah jiƙansu da Rahama, AMEEN
              </p>
              </div>
            )}

            {/* AUDIO PLAYERS */}
            {person.audioGallery && person.audioGallery.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                {person.audioGallery.map((audio, index) => (
                  <div key={index} className="w-full max-w-sm">
                    <div className="text-xs text-emerald-200/80 mb-1 font-bold uppercase tracking-wider text-left pl-4">
                      {audio.title}
                    </div>
                    <audio controls className="h-10 w-full rounded-full bg-white/10 backdrop-blur-sm px-4 border border-white/10 text-white">
                      <source src={audio.url} type="audio/mpeg" />
                    </audio>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-12 relative z-20">
          
          {/* === BIOGRAPHY CARD === */}
          {person.bio && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-[#b45309]">
              <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
                <span className="text-2xl">📜</span>
                <h3 className="text-xl font-serif font-bold text-[#064e3b]">Biography</h3>
              </div>
              <article className="prose prose-stone prose-lg max-w-none leading-relaxed text-stone-800 font-medium">
                <PortableText value={person.bio} />
              </article>
            </div>
          )}

          {/* === HERITAGE & FAMILY SECTION === */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌳</span>
                <h3 className="text-2xl font-serif font-bold text-[#064e3b]">Lineage</h3>
              </div>
              
              {person.relevantFamily && (
                <Link 
                  href={`/family/${person.relevantFamily.slug.current}`}
                  className="group flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-[#064e3b] text-stone-600 hover:text-white rounded-full transition-all duration-300 shadow-sm"
                  title={`View ${person.relevantFamily.familyName} Family Page`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">Gidanmu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                    <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h2.5A2.25 2.25 0 0 1 9 4.25v2.5A2.25 2.25 0 0 1 6.75 9h-2.5A2.25 2.25 0 0 1 2 6.75v-2.5ZM2 13.25A2.25 2.25 0 0 1 4.25 11h2.5A2.25 2.25 0 0 1 9 13.25v2.5A2.25 2.25 0 0 1 6.75 18h-2.5A2.25 2.25 0 0 1 2 15.75v-2.5ZM11 4.25A2.25 2.25 0 0 1 13.25 2h2.5A2.25 2.25 0 0 1 18 4.25v2.5A2.25 2.25 0 0 1 15.75 9h-2.5A2.25 2.25 0 0 1 11 6.75v-2.5ZM15.25 11.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
                  </svg>
                </Link>
              )}
            </div>

            <div className="space-y-10">
              
              {/* 1. PARENTS & SIBLINGS & GRANDPARENTS (Origin) */}
              {person.parentsData?.map((union) => (
                <div key={union._id} className="relative pl-8 border-l-2 border-stone-200">
                  <span className="absolute -left-2.5 top-0 w-4 h-4 bg-stone-200 rounded-full border-2 border-[#f5f5f4]"></span>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Iyaye</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {union.partners.map((parent) => (
                      <div key={parent._id} className="flex flex-col gap-2">
                        {/* Parent Card */}
                        <Link href={`/person/${parent.slug.current}`} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-100 hover:border-[#b45309] transition-colors group">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-200 border border-stone-100">
                             {parent.profileImage && <Image src={urlFor(parent.profileImage).width(100).url()} fill sizes="50px" alt="" className="object-cover"/>}
                          </div>
                          <div>
                             <span className="text-[10px] text-[#b45309] font-bold block uppercase">{parent.sex === 'male' ? 'Mahaifi' : 'Mahaifiya'}</span>
                             <span className="font-serif font-bold text-stone-900 group-hover:text-[#064e3b] transition-colors">{parent.fullName}</span>
                          </div>
                        </Link>

                        {/* RESTORED: Grandparents List */}
                        {parent.parents && parent.parents.length > 0 && (
                          <div className="pl-4 ml-4 border-l border-stone-200 space-y-1">
                             <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Grandparents</span>
                             {parent.parents.map(gp => (
                               <Link key={gp._id} href={`/person/${gp.slug.current}`} className="block text-xs text-stone-500 hover:text-[#064e3b] transition-colors truncate">
                                 {gp.fullName}
                               </Link>
                             ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* SIBLINGS */}
                  {union.children && union.children.length > 1 && (
                    <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-100">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-3">Ƴan-Uwa</span>
                      <div className="flex flex-wrap gap-2">
                        {union.children
                          .filter(child => child._id !== person._id) // Filter out self
                          .map(sib => (
                            <Link key={sib._id} href={`/person/${sib.slug.current}`} className="px-3 py-1.5 bg-white rounded-lg text-sm text-stone-700 font-medium hover:bg-[#064e3b] hover:text-white transition shadow-sm border border-stone-100">
                              {sib.fullName}
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* 2. FAMILY UNITS (Unions) */}
              {person.unionsData?.length > 0 && (
                 <div className="relative pl-8 border-l-2 border-stone-200">
                   <span className="absolute -left-2.5 top-0 w-4 h-4 bg-[#b45309] rounded-full border-2 border-[#f5f5f4] shadow-sm"></span>
                   <h4 className="text-xs font-bold text-[#b45309] uppercase tracking-widest mb-6">Family Units</h4>

                   <div className="space-y-8">
                     {person.unionsData.map((union, index) => {
                       const spouse = union.partners.find(p => p._id !== person._id);
                       
                       return (
                         <div key={union._id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                           {/* Header */}
                           <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-b border-stone-100">
                             <div className="flex items-center gap-3">
                               <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                                 أُسرَة {index + 1}
                                 {union.marriageDate && <span className="text-stone-300 ml-1 font-normal">({new Date(union.marriageDate).getFullYear()})</span>}
                               </span>
                               {spouse ? (
                                 <Link href={`/person/${spouse.slug.current}`} className="flex items-center gap-2 group">
                                    <span className="text-stone-300">مع</span>
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-stone-200 border border-stone-300">
                                      {spouse.profileImage && <Image src={urlFor(spouse.profileImage).width(50).url()} fill sizes="30px" alt="" className="object-cover"/>}
                                    </div>
                                    <span className="font-serif font-bold text-stone-800 group-hover:text-[#064e3b] transition-colors">{spouse.fullName}</span>
                                 </Link>
                               ) : <span className="text-stone-400 italic">Unknown Partner</span>}
                             </div>
                           </div>

                           {/* Children */}
                           <div className="p-6">
                             {union.children?.length > 0 ? (
                               <div className="flex flex-wrap gap-2">
                                 {union.children.map(child => (
                                   <Link key={child._id} href={`/person/${child.slug.current}`} className="flex items-center gap-2 pl-1 pr-3 py-1.5 bg-stone-50 rounded-full hover:bg-[#064e3b] hover:text-white transition-all group border border-stone-200">
                                      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-white">
                                         {child.profileImage && <Image src={urlFor(child.profileImage).width(50).url()} fill sizes="30px" alt="" className="object-cover"/>}
                                      </div>
                                      <span className="text-sm font-semibold text-stone-800 group-hover:text-white">{child.fullName}</span>
                                   </Link>
                                 ))}
                               </div>
                             ) : (
                               <p className="text-sm text-stone-400 italic">No children recorded.</p>
                             )}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
              )}
            </div>
          </section>

          {/* === GALLERY === */}
          {(person.gallery?.length ?? 0) > 0 && (
            <section className="pt-8 border-t border-stone-200">
              <h3 className="text-xl font-serif font-bold text-[#064e3b] mb-6">Personal Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {person.gallery?.map((image, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm group">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                    <Image 
                      src={urlFor(image).width(600).height(600).url()} 
                      alt={`Gallery ${i}`} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}