import Link from "next/link";
import Image from "next/image";
import { getGalleryAlbums, PhotoAlbum } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Visual History | KUJISAN',
  description: 'A curated gallery of moments, events, and memories from the Sani Abubakar Nadede lineage.',
};

export default async function GalleryDirectory() {
  const albums: PhotoAlbum[] = await getGalleryAlbums();

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col font-sans text-stone-900">
      <Navbar />
      
      <main className="grow p-4 md:p-8">
        <header className="mb-10 max-w-6xl mx-auto text-center">
          <span className="text-[#b45309] font-bold tracking-wider text-xs uppercase mb-2 block">
            The Archives
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#064e3b] mb-4">
            Visual History
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            A collection of moments, reunions, and milestones that define our shared journey.
          </p>
        </header>

        {albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {albums.map((album) => (
              <Link 
                key={album._id} 
                href={`/gallery/${album.slug.current}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                {/* Cover Image */}
                <div className="relative aspect-4/3 bg-stone-200 overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                  {album.coverImage ? (
                    <Image
                      src={urlFor(album.coverImage).width(800).height(600).url()}
                      alt={album.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-100">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                </div>

                {/* Info Card */}
                <div className="p-6 relative">
                  {/* Date Badge */}
                  {album.date && (
                    <div className="absolute -top-4 right-6 bg-[#b45309] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {new Date(album.date).getFullYear()}
                    </div>
                  )}
                  
                  <h2 className="text-xl font-bold text-[#064e3b] mb-2 group-hover:text-[#b45309] transition-colors">
                    {album.title}
                  </h2>
                  {album.description && (
                    <p className="text-stone-500 text-sm line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    View Album →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-stone-300 rounded-3xl">
            <p className="text-stone-400">No albums have been created yet.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}