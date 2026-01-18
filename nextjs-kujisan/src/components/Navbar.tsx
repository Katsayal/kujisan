import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#064e3b]/95 backdrop-blur-md border-b border-[#b45309]/30 h-16 shadow-lg transition-all">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link href="/" className="font-serif font-bold text-xl tracking-wide text-white flex items-center gap-2 group shrink-0">
          <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:border-[#b45309] group-hover:bg-[#b45309] transition-all duration-500">
            🌿
          </span>
          <span className="hidden sm:inline">KUJISAN</span>
          <span className="sm:hidden">KUJISAN</span>
        </Link>

        {/* Navigation Links (Scrollable on very small screens) */}
        <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-white/80 overflow-x-auto no-scrollbar ml-4">
          <Link href="/members" className="hover:text-[#fbbf24] transition-colors relative group py-1 whitespace-nowrap">
            Zurriya
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fbbf24] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/family" className="hover:text-[#fbbf24] transition-colors relative group py-1 whitespace-nowrap">
            Gida-Gida
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fbbf24] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/gallery" className="hover:text-[#fbbf24] transition-colors relative group py-1 whitespace-nowrap">
            Album
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fbbf24] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/tree" className="hover:text-[#fbbf24] transition-colors relative group py-1 whitespace-nowrap">
            Nasaba
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fbbf24] transition-all group-hover:w-full"></span>
          </Link>
        </div>

      </div>
    </nav>
  );
}