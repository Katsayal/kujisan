import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#042f2e] text-stone-400 border-t border-[#064e3b] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Column 1: Identity */}
        <div className="space-y-4">
          <h3 className="text-white font-serif text-lg tracking-wide">KUJISAN</h3>
          <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0 opacity-80">
            Ƙungiyar Jikokin Sani Abubakar Nadede. <br/>
            Preserving our lineage, connecting our future.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-2 text-sm">
          <h4 className="text-[#b45309] font-bold uppercase tracking-widest text-xs mb-2">Explore</h4>
          <Link href="/members" className="hover:text-white transition-colors">Directory (Zurriya)</Link>
          <Link href="/family" className="hover:text-white transition-colors">Families (Gida-Gida)</Link>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
        </div>

        {/* Column 3: Copyright & Info */}
        <div className="flex flex-col justify-end text-xs space-y-2">
          <p>© {new Date().getFullYear()} Sani Abubakar Nadede Family.</p>
          <p className="opacity-50">Built with pride for the family.</p>
        </div>
      </div>
      
      {/* Decorative Bottom Bar */}
      <div className="h-1 bg-gradient-to-r from-[#064e3b] via-[#b45309] to-[#064e3b] w-full opacity-30"></div>
    </footer>
  );
}