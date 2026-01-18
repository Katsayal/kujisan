import Link from "next/link";
import Image from "next/image";
import { getHomepageData } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function LandingPage() {
  const data = await getHomepageData();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f4] font-sans text-stone-900 selection:bg-[#064e3b] selection:text-white">
      <Navbar />

      {/* === SECTION 1: HERO === */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          {data.hero.heroImage ? (
            <Image
              src={urlFor(data.hero.heroImage).width(1920).height(1080).url()}
              alt="Family Heritage"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-stone-800" />
          )}
          {/* Professional Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-[#064e3b]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-white/80 text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-6 backdrop-blur-sm animate-fade-in">
            {data.hero.subtitle || "The Lineage of Sani Abubakar Nadede"}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight drop-shadow-lg">
            {data.hero.title}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/members" 
              className="px-8 py-4 bg-[#b45309] text-white rounded-full font-medium tracking-wide hover:bg-[#92400e] transition-all shadow-lg hover:shadow-[#b45309]/30 hover:-translate-y-1"
            >
              Zurriyya
            </Link>
            <Link 
              href="/family" 
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-medium tracking-wide hover:bg-white/20 transition-all"
            >
              Gida Gida
            </Link>
          </div>
        </div>
      </section>


      {/* === SECTION 2: LIVE STATS (Deep Green Bar) === */}
      {/* Moved negative margin up to overlap hero slightly, creating a seamless connection */}
      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-4 mb-0">
        <div className="bg-[#064e3b] rounded-t-3xl md:rounded-3xl shadow-2xl shadow-stone-900/20 p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {/* Tile 1 */}
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-serif font-bold text-[#fbbf24] mb-2">
                {data.stats.children}
              </span>
              <span className="text-xs uppercase tracking-widest text-emerald-100/70">Children</span>
            </div>
            {/* Tile 2 */}
            <div className="flex flex-col items-center pl-4">
              <span className="text-4xl md:text-5xl font-serif font-bold text-[#fbbf24] mb-2">
                {data.stats.grandchildren}
              </span>
              <span className="text-xs uppercase tracking-widest text-emerald-100/70">Grandchildren</span>
            </div>
            {/* Tile 3 */}
            <div className="flex flex-col items-center pl-4">
              <span className="text-4xl md:text-5xl font-serif font-bold text-[#fbbf24] mb-2">
                {data.stats.greatGrandchildren}
              </span>
              <span className="text-xs uppercase tracking-widest text-emerald-100/70">Great-Grand</span>
            </div>
             {/* Tile 4 (Total) */}
             <div className="flex flex-col items-center pl-4">
              <span className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                {data.stats.children + data.stats.grandchildren + data.stats.greatGrandchildren}+
              </span>
              <span className="text-xs uppercase tracking-widest text-emerald-100/70">Total Descendants</span>
            </div>
          </div>
        </div>
      </section>


      {/* === SECTION 3: THE ORIGIN (About) === */}
      {/* Added bg-stone-200/50 to create a distinct but warm section background */}
      {/* Removed top padding on mobile to merge with stats bar visually */}
      <section className="py-24 px-4 bg-[#e7e5e4] -mt-4 pt-16 md:mt-0 md:pt-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative aspect-3/4 md:aspect-square rounded-2xl overflow-hidden shadow-xl border-8 border-white bg-stone-300 rotate-1 hover:rotate-0 transition-transform duration-700">
             {data.about.image ? (
               <Image 
                 src={urlFor(data.about.image).width(800).height(800).url()} 
                 alt="Portrait" 
                 fill 
                 className="object-cover sepia-[.15]" 
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-stone-300 text-stone-500">
                 Portrait Placeholder
               </div>
             )}
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-[#b45309] uppercase tracking-widest">The Origin</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#064e3b] leading-tight">
              {data.about.title}
            </h3>
            <div className="prose prose-stone prose-lg text-stone-700 leading-relaxed">
              {data.about.content && <PortableText value={data.about.content} />}
            </div>
          </div>
        </div>
      </section>


      {/* === SECTION 4: FEATURED GALLERY === */}
      {/* Changed bg-white to bg-[#f0fdf4] (Very light green tint) or bg-stone-100 to separate it */}
      {data.latestAlbums.length > 0 && (
        <section className="py-24 bg-stone-100 border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-sm font-bold text-[#b45309] uppercase tracking-widest mb-2">Visual History</h2>
                <h3 className="text-3xl md:text-4xl font-serif text-[#064e3b]">Recent Moments</h3>
              </div>
              <Link href="/gallery" className="hidden md:inline-flex items-center gap-2 text-stone-500 hover:text-[#b45309] transition-colors font-medium">
                View All Albums →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.latestAlbums.map((album) => (
                <div key={album._id} className="group cursor-pointer bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-200 mb-4 shadow-inner">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                    {album.coverImage && (
                      <Image
                        src={urlFor(album.coverImage).width(600).height(450).url()}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-stone-900 group-hover:text-[#b45309] transition-colors">
                    {album.title}
                  </h4>
                  {album.date && (
                    <p className="text-sm text-stone-500 mt-1">
                      {new Date(album.date).getFullYear()}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link href="/gallery" className="inline-block px-6 py-3 bg-[#064e3b] text-white rounded-full font-medium shadow-lg hover:bg-[#064e3b]/90">
                View All Albums
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}