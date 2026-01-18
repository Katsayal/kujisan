"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MinimalPerson } from "@/sanity/client";
import { urlFor } from "@/sanity/image";

interface Props {
  initialPeople: MinimalPerson[];
}

type SortType = 'oldest' | 'youngest' | 'az';

export default function MembersBrowser({ initialPeople }: Props) {
  const [search, setSearch] = useState("");
  const [showInLaws, setShowInLaws] = useState(false);
  const [sort, setSort] = useState<SortType>('oldest');
  
  // --- UI STATES ---
  const [isNavbarVisible, setIsNavbarVisible] = useState(true); // Scroll visibility
  const [isMinimized, setIsMinimized] = useState(false); // Manual hide (Chevron)
  const [showSortMenu, setShowSortMenu] = useState(false); // Sort Dropdown toggle
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Click outside to close sort menu
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- SCROLL LOGIC ---
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Always show if at top
      if (currentScrollY < 50) {
        setIsNavbarVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Hide on scroll down, Show on scroll up
      if (currentScrollY > lastScrollY) {
        setIsNavbarVisible(false);
        // Also auto-close sort menu on scroll
        setShowSortMenu(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);


  // --- GROUPING LOGIC ---
  const groupedPeople = useMemo(() => {
    // 1. Filter
    const filtered = initialPeople.filter((person) => {
      const matchesSearch = person.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesInLaw = showInLaws 
        ? true 
        : (person.isDescendant || person.generation === 1); // Always show Sani's wives (Gen 1)

      return matchesSearch && matchesInLaw;
    });

    // 2. Group
    const groups: { [key: number]: MinimalPerson[] } = {};
    filtered.forEach(person => {
      const gen = person.generation || 99; 
      if (!groups[gen]) groups[gen] = [];
      groups[gen].push(person);
    });

    // 3. Sort
    Object.keys(groups).forEach(gen => {
      groups[parseInt(gen)].sort((a, b) => {
        if (sort === 'az') return a.fullName.localeCompare(b.fullName);
        
        const dateA = a.birthDate ? new Date(a.birthDate).getTime() : 0;
        const dateB = b.birthDate ? new Date(b.birthDate).getTime() : 0;
        
        if (dateA === 0 && dateB === 0) return 0;
        if (dateA === 0) return 1;
        if (dateB === 0) return -1;

        return sort === 'oldest' ? dateA - dateB : dateB - dateA;
      });
    });

    return groups;
  }, [initialPeople, search, showInLaws, sort]);

  const sortedGenerations = Object.keys(groupedPeople)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-12 min-h-screen">
      
      {/* --- SMART FLOATING BAR --- */}
      <div 
        className={`fixed left-0 right-0 z-40 px-4 transition-all duration-500 ease-in-out flex justify-center ${
          isNavbarVisible ? 'top-20 opacity-100' : '-top-20 opacity-0'
        }`}
      >
        <div className={`bg-white/95 backdrop-blur-xl border border-white/50 ring-1 ring-black/5 shadow-2xl transition-all duration-300 overflow-visible ${
          isMinimized ? 'rounded-full p-2 w-auto' : 'rounded-3xl p-3 w-full max-w-2xl'
        }`}>
          
          {/* EXPANDED STATE */}
          {!isMinimized ? (
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="grow relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-stone-400 group-focus-within:text-[#064e3b] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search family..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-100/50 border-none rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-[#064e3b]/20 transition-all outline-none text-sm font-medium h-10"
                />
              </div>

              <div className="h-6 w-px bg-stone-200 shrink-0"></div>

              {/* Custom Sort Menu */}
              <div className="relative" ref={sortRef}>
                <button 
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className={`p-2 rounded-full transition-colors relative ${showSortMenu ? 'bg-stone-100 text-[#064e3b]' : 'hover:bg-stone-100 text-stone-500'}`}
                  title="Sort Order"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
                   
                   {/* Sort Label (Desktop Only) */}
                   {sort !== 'oldest' && (
                     <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#b45309] rounded-full"></span>
                   )}
                </button>

                {/* Dropdown Popup */}
                {showSortMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-1 animate-fade-in origin-top-right overflow-hidden">
                    <button 
                      onClick={() => { setSort('oldest'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-stone-50 ${sort === 'oldest' ? 'text-[#064e3b] font-bold bg-stone-50' : 'text-stone-600'}`}
                    >
                      <span>📅</span> Oldest First
                    </button>
                    <button 
                      onClick={() => { setSort('youngest'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-stone-50 ${sort === 'youngest' ? 'text-[#064e3b] font-bold bg-stone-50' : 'text-stone-600'}`}
                    >
                      <span>👶</span> Youngest First
                    </button>
                    <button 
                      onClick={() => { setSort('az'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-stone-50 ${sort === 'az' ? 'text-[#064e3b] font-bold bg-stone-50' : 'text-stone-600'}`}
                    >
                      <span>🔤</span> Name (A-Z)
                    </button>
                  </div>
                )}
              </div>

              {/* In-Laws Toggle */}
              <button 
                onClick={() => setShowInLaws(!showInLaws)}
                className={`p-2 rounded-full transition-all duration-300 relative shrink-0 ${
                  showInLaws 
                    ? 'bg-[#b45309] text-white shadow-lg shadow-orange-900/20' 
                    : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                }`}
                title={showInLaws ? "Hide In-Laws" : "Show In-Laws"}
              >
                <span className="text-lg leading-none">💍</span>
              </button>

              {/* Collapse Button (Chevron Up) */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors shrink-0"
                title="Minimize Bar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
              </button>
            </div>
          ) : (
            /* MINIMIZED STATE (Small Pill) */
            <button 
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-2 px-2 text-stone-500 hover:text-[#064e3b] transition-colors"
              title="Expand Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span className="text-sm font-medium pr-1">Search</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          )}

        </div>
      </div>

      {/* --- CONTENT --- */}
      {/* Added pt-12 to push content down so title isn't hidden immediately */}
      <div className="pt-12 space-y-16">
        {sortedGenerations.map((gen) => (
          <section key={gen} className="animate-fade-in">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl md:text-3xl font-serif text-[#064e3b] font-bold">
                {gen === 1 && "Generation 1"}
                {gen === 2 && "Generation 2"}
                {gen === 3 && "Generation 3"}
                {gen === 4 && "Generation 4"}
                {gen > 4 && `Gen ${gen}`}
              </h2>
              <div className="h-px bg-stone-200 grow mt-1"></div>
              <span className="text-xs font-bold bg-[#064e3b] text-white px-2 py-1 rounded-md shadow-sm">
                {groupedPeople[gen].length}
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {groupedPeople[gen].map((person) => (
                <Link 
                  key={person._id} 
                  href={`/person/${person.slug.current}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-100 relative"
                >
                  {/* Badge for Spouses */}
                  {!person.isDescendant && (
                    <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm text-[#b45309] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm border border-stone-100">
                      In-Law
                    </div>
                  )}

                  <div className="relative aspect-square bg-stone-200 overflow-hidden">
                    {person.profileImage ? (
                      <Image
                        src={urlFor(person.profileImage).width(400).height(400).url()}
                        alt={person.fullName}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority={gen === 1} 
                      />
                    ) : (
                      <div className={`flex items-center justify-center h-full text-4xl ${
                          person.sex === 'female' ? 'bg-rose-50' : 'bg-[#f0fdf4]'
                        }`}>
                        <span className="opacity-80 grayscale group-hover:grayscale-0 transition-all">
                          {person.sex === 'female' ? '🧕' : '👤'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-[#064e3b] transition-colors">
                      {person.fullName}
                    </h3>
                    {person.birthDate && (
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5 opacity-70">
                        {new Date(person.birthDate).getFullYear()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty State */}
      {sortedGenerations.length === 0 && (
        <div className="text-center py-24 bg-stone-100 rounded-3xl border-2 border-dashed border-stone-200 mt-20">
          <p className="text-stone-500 text-lg mb-2">No members found.</p>
          <button 
             onClick={() => {setSearch(''); setShowInLaws(false)}}
             className="mt-4 px-6 py-2 bg-[#064e3b] text-white rounded-full text-sm font-medium hover:bg-[#064e3b]/90 transition"
          >
             Clear Search
          </button>
        </div>
      )}
    </div>
  );
}