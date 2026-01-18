import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlbum, PhotoAlbum } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) return { title: 'Not Found' };
  
  return {
    title: `${album.title} | KUJISAN Gallery`,
    description: album.description || `Photos from ${album.title}`,
  };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album: PhotoAlbum | null = await getAlbum(slug);

  if (!album) return notFound();

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col font-sans">
      <Navbar />

      <main className="grow">
        {/* --- Header Section --- */}
        <div className="bg-[#064e3b] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/gallery" className="inline-block mb-6 text-emerald-200/80 hover:text-white transition text-sm font-medium tracking-wide">
              ← Back to Album
            </Link>
            
            {album.date && (
               <span className="block text-[#fbbf24] font-bold tracking-widest uppercase text-xs mb-3">
                 {new Date(album.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
               </span>
            )}
            
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              {album.title}
            </h1>
            
            {album.description && (
              <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                {album.description}
              </p>
            )}
          </div>
        </div>

        {/* --- Photo Grid (Masonry Effect) --- */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {album.images && album.images.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {album.images.map((image, i) => (
                <div key={i} className="break-inside-avoid relative rounded-xl overflow-hidden group bg-stone-200">
                  <Image
                    src={urlFor(image).width(800).url()}
                    alt={`${album.title} photo ${i + 1}`}
                    width={800}
                    height={600} // This is just an aspect ratio placeholder, standard next/image behavior
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Optional: Add a subtle overlay or caption functionality here if needed */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
              <p className="text-stone-400">This album is currently empty.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}