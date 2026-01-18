import { getPeople, MinimalPerson } from "@/sanity/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MembersBrowser from "./MembersBrowser";
import { Metadata } from "next";

// FIX: Check for new content every 60 seconds
export const revalidate = 60; 

export const metadata: Metadata = {
  title: 'Zurriya Directory | KUJISAN',
  description: 'The complete directory of the Sani Abubakar Nadede lineage, organized by generation.',
};

export default async function MembersDirectory() {
  const people: MinimalPerson[] = await getPeople();

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col selection:bg-[#064e3b] selection:text-white">
      <Navbar />
      
      <main className="grow p-4 md:p-8">
        <header className="mb-12 max-w-7xl mx-auto text-center md:text-left">
          <span className="text-[#b45309] font-bold tracking-wider text-xs uppercase mb-3 block">
            The Family Tree
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#064e3b] font-bold mb-4">
            Zurriya Directory
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl leading-relaxed">
            A chronological registry of the lineage, honoring those who came before and celebrating those who continue the legacy.
          </p>
        </header>

        <div className="max-w-7xl mx-auto pb-20">
          {/* We pass the data to the Client Component */}
          <MembersBrowser initialPeople={people} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}