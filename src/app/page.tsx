import Link from "next/link";

const energyDefinition = "Specjalistyczny bezalkoholowy napój gazowany lub niegazowany, zawierający substancje stymulujące (najczęściej kofeinę, taurynę i witaminy), przeznaczony do podniesienia wydolności psychofizycznej i chwilowego pobudzenia organizmu.";

// Zmodernizowany komponent kafelka (pasujący do nowego, czystszego stylu)
const BigModernTile = ({ href, title, isSpecial = false }: { href: string; title: string; isSpecial?: boolean }) => (
  <Link 
    href={href} 
    className={`
      group flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-300 
      hover:scale-105 backdrop-blur-sm
      ${isSpecial 
        ? 'border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.1)] hover:border-yellow-400 hover:bg-yellow-400/20 hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]' 
        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800/80'}
    `}
  >
    <h3 className={`text-xl font-bold tracking-[0.2em] uppercase transition-colors ${isSpecial ? 'text-yellow-400 group-hover:text-yellow-300' : 'text-zinc-300 group-hover:text-white'}`}>
      {title}
    </h3>
  </Link>
);

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden font-sans bg-[#050505] text-zinc-300">
      
      {/* ZUNIFIKOWANY, SZKLANY NAGŁÓWEK (Sticky) Z NOWYM LOGO */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-zinc-900 px-4 md:px-8 py-5 flex justify-between items-center text-left">
        <Link href="/" className="hover:opacity-80 transition-all text-left">
          <div className="flex items-center gap-2">
            <span className="text-4xl text-yellow-400 font-extrabold italic">⚡</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 italic uppercase tracking-tighter text-left">
              ENERGETYKI.PL
            </h1>
          </div>
        </Link>
        <Link href="/ranking" className="text-[9px] font-black text-zinc-400 hover:text-white border border-zinc-800 px-4 py-2 rounded-full transition-all tracking-widest bg-zinc-900/50 text-left">
          RANKING
        </Link>
      </header>

      {/* Główna treść - wyśrodkowana */}
      <div className="z-10 flex flex-col items-center mt-16 max-w-3xl w-full">
        
        {/* DEFINICJA - zmodernizowana, miękka */}
        <section className="w-full p-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md shadow-xl mb-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span> DEFINICJA NAPOJU ENERGETYCZNEGO
          </h2>
          <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
            {energyDefinition}
          </p>
        </section>

        {/* KAFELKI DO PODSTRON */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <BigModernTile href="/ranking" title="Ranking" isSpecial={true} />
          <BigModernTile href="/kontakt" title="Kontakt" />
        </section>
        
      </div>
    </main>
  );
}