"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Kontakt() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans uppercase flex flex-col pt-20 md:pt-24">
      
      {/* NAGŁÓWEK - Wersja kompaktowa i ujednolicona */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-zinc-900 px-4 md:px-8 py-3 flex justify-between items-center text-left">
        <Link href="/" className="hover:opacity-80 transition-all text-left">
          <div className="flex items-center gap-2">
            <span className="text-3xl text-yellow-400 font-extrabold italic">⚡</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-400 italic uppercase tracking-tighter text-left">
              ENERGETYKI.PL
            </h1>
          </div>
        </Link>
        
        {/* Linki */}
        <nav className="hidden md:flex gap-8 text-[12px] font-black tracking-widest italic">
          <Link 
            href="/" 
            className={`transition-colors ${isActive('/') ? 'text-yellow-400' : 'text-zinc-500 hover:text-yellow-400'}`}
          >
            STRONA GŁÓWNA
          </Link>
          <Link 
            href="/ranking" 
            className={`transition-colors ${isActive('/ranking') ? 'text-yellow-400' : 'text-zinc-500 hover:text-yellow-400'}`}
          >
            RANKING
          </Link>
          <Link 
            href="/kontakt" 
            className={`transition-colors ${isActive('/kontakt') ? 'text-yellow-400' : 'text-zinc-500 hover:text-yellow-400'}`}
          >
            KONTAKT
          </Link>
        </nav>
      </header>

      {/* GŁÓWNA ZAWARTOŚĆ STRONY */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 pb-20">
        <div className="max-w-xl w-full border border-zinc-800 p-12 rounded-[40px] bg-zinc-900/20 backdrop-blur-sm shadow-2xl">
          <h1 className="text-5xl font-black text-yellow-400 italic tracking-tighter mb-10">KONTAKT</h1>
          <div className="space-y-10 text-left">
            <div>
              <p className="text-[10px] text-zinc-600 font-black tracking-[0.3em] mb-2 uppercase">ADRES E-MAIL</p>
              <p className="text-2xl font-black text-white italic border-b border-zinc-800 pb-2">kontakt@energetyki.pl</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 font-black tracking-[0.3em] mb-2 uppercase">REKLAMA I DANE</p>
              <p className="text-sm font-bold leading-relaxed text-zinc-400 italic">
                ZNALAZŁEŚ BŁĄD W CENIE? CHCESZ DODAĆ SWÓJ PRODUKT? <br/>
                PISZ ŚMIAŁO. ODPOWIADAMY PO TRZECIEJ KAWIE.
              </p>
            </div>
          </div>
          <Link href="/" className="inline-block mt-16 text-[10px] font-black text-zinc-500 border-zinc-800 border-2 px-8 py-3 rounded-full hover:text-yellow-400 hover:border-yellow-400 transition-all uppercase italic">
            POWRÓT DO STARTU
          </Link>
        </div>
      </main>
      
    </div>
  );
}