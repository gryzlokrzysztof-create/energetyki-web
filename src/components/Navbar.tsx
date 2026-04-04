"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Ukrywamy pasek na głównej, jeśli masz tam wielkie logo
  if (pathname === "/") return null;

  const links = [
    { href: "/", label: "Strona Główna" },
    { href: "/ranking", label: "Ranking" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Eleganckie Logo */}
        <Link href="/" className="flex items-center group">
          <span className="text-2xl font-extrabold text-white tracking-wide transition-colors group-hover:text-zinc-300">
            energetyki<span className="text-yellow-400">.pl</span>
          </span>
          <span className="text-3xl ml-1 text-yellow-400 group-hover:scale-110 transition-transform">⚡</span>
        </Link>
        
        {/* Zaokrąglone, nowoczesne menu */}
        <div className="flex gap-2 md:gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}