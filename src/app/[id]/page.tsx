"use client";
import { useEffect, useState, use } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const URL = 'https://bhpxwadyvudhfqnkklir.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocHh3YWR5dnVkaGZxbmtrbGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTc0MTQsImV4cCI6MjA4NzM3MzQxNH0.0XT10Md4LodUak5FreZKyy4W8CXQFyZPAewVgUF6EZg'; 
const supabase = createClient(URL, KEY);

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [drink, setDrink] = useState<any>(null);
  const [fullImage, setFullImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    async function getDrink() {
      const { data } = await supabase.from('energy_drinks').select('*').eq('id', id).single();
      if (data) setDrink(data);
    }
    if (id) getDrink();
  }, [id]);

  const copyToClipboard = () => {
    if (drink?.name) {
      navigator.clipboard.writeText(drink.name).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!drink) return (
    <div className="min-h-screen bg-black flex items-center justify-center font-black text-yellow-400 uppercase italic animate-pulse text-xl tracking-tighter text-left">
      DEKODOWANIE DANYCH...
    </div>
  );

  const folderName = drink.name.toLowerCase().trim().replace(/\s+/g, '_');
  const coverUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folderName}/cover.JPG`;
  const ingredientsImgUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folderName}/ingredients.JPG`;

  const marketAvgCaffeine = 32;
  const caffeinePower = Math.min((drink.caffeine_mg_100ml / marketAvgCaffeine) * 100, 100);
  const caffeineDiff = drink.caffeine_mg_100ml - marketAvgCaffeine;

  // --- Zsynchronizowane wykrywanie ZERO SUGAR ---
  const isZeroSugar = (() => {
    if (drink.kcal !== undefined && drink.kcal !== null) {
      return drink.kcal < 6;
    }
    if (!drink.name) return false;
    const nameLower = drink.name.toLowerCase();
    const zeroKeywords = ['bezcukru', 'zero', 'bez cukru', 'no sugar', 'diet', 'ultra', 'sugarfree', 'sugar free'];
    return zeroKeywords.some(keyword => nameLower.includes(keyword));
  })();

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 font-sans uppercase p-4 md:p-8 text-left relative pt-20 md:pt-24">
      
      {/* ZUNIFIKOWANY NAGŁÓWEK */}
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
        <nav className="hidden md:flex gap-8 text-[12px] font-black tracking-widest italic items-center">
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
          
          {/* Opcjonalny przycisk powrotu wkomponowany w menu dla wygody */}
          <Link href="/ranking" className="ml-4 text-[9px] font-black text-zinc-400 hover:text-white border border-zinc-800 px-4 py-2 rounded-full transition-all tracking-widest bg-zinc-900/50">
            POWRÓT DO RANKINGU
          </Link>
        </nav>

        {/* Mały przycisk powrotu widoczny tylko na telefonach (gdy menu się ukryje) */}
        <Link href="/ranking" className="md:hidden text-[9px] font-black text-zinc-400 hover:text-white border border-zinc-800 px-4 py-2 rounded-full transition-all tracking-widest bg-zinc-900/50">
          POWRÓT
        </Link>
      </header>

      {fullImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setFullImage(null)}>
          <img src={fullImage} className="max-w-full max-h-full rounded-xl border border-zinc-800 shadow-2xl" alt="Widok etykiety" />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-start text-left">
          <div className="rounded-[40px] overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-2xl aspect-square cursor-zoom-in group" onClick={() => setFullImage(coverUrl)}>
            <img 
              src={coverUrl} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              onError={(e: any) => { if (!e.target.src.includes('.jpg')) e.target.src = coverUrl.replace('.JPG', '.jpg'); }} 
            />
          </div>
          
          <div className="flex flex-col h-full justify-center text-left min-w-0">
            <div className="flex gap-2 mb-4 text-left">
              {isZeroSugar && <span className="bg-blue-500/20 text-blue-400 text-[9px] px-3 py-1 rounded-full font-black tracking-widest border border-blue-500/30">ZERO SUGAR</span>}
            </div>

            <p className="text-yellow-400 font-black italic tracking-[0.4em] text-xs mb-3 text-left">{drink.brand}</p>
            
            {/* 1. KOPIOWANIE NAZWY */}
            <div className="flex items-center gap-3 mb-10 relative text-left">
              <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-tight break-words text-left">
                {drink.name}
              </h1>
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
              </button>
              {copied && <span className="absolute -top-6 left-0 text-[8px] text-green-400 font-black tracking-widest animate-bounce">SKOPIOWANO!</span>}
            </div>
            
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 mb-10 text-left">
              <h3 className="text-[10px] font-black tracking-widest text-zinc-500 mb-6 italic underline decoration-yellow-400 decoration-2 text-left uppercase">STĘŻENIE KOFEINY</h3>
              <div className="space-y-6 text-left">
                <div className="flex justify-between text-[11px] font-bold mb-3 tracking-widest uppercase text-left">
                  <span>MOC PRODUKTU</span>
                  <span className={caffeineDiff >= 0 ? "text-yellow-400" : "text-zinc-500"}>{drink.caffeine_mg_100ml} MG / 100ML</span>
                </div>
                <div className="h-3 bg-black rounded-full overflow-hidden border border-zinc-800 text-left">
                  <div className={`h-full transition-all duration-1000 ${drink.caffeine_mg_100ml >= 32 ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'bg-zinc-700'}`} style={{ width: `${caffeinePower}%` }}></div>
                </div>
                <p className="text-[9px] text-zinc-600 font-bold italic uppercase tracking-tight text-left">
                  {caffeineDiff < 0 ? `BRAKUJE ${Math.abs(caffeineDiff)}MG DO STANDARDU RYNKOWEGO (32MG)` : `PRODUKT O PEŁNEJ MOCY RYNKOWEJ`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-left">
                <p className="text-[10px] text-zinc-500 font-black mb-1 tracking-widest uppercase text-left">CUKIER</p>
                <p className={`text-3xl font-black italic text-left ${isZeroSugar ? 'text-blue-400' : 'text-white'}`}>{drink.sugar !== undefined ? `${drink.sugar} G` : "—"}</p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-left">
                <p className="text-[10px] text-zinc-500 font-black mb-1 tracking-widest uppercase text-left">ENERGIA</p>
                <p className="text-3xl font-black text-white italic text-left">{drink.kcal !== undefined ? `${drink.kcal} KCAL` : "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 border-t border-zinc-900 pt-16 mb-20 text-left text-left">
          <div className="md:col-span-2 text-left text-left">
            <h2 className="text-2xl font-black text-white italic mb-6 tracking-tighter uppercase underline decoration-yellow-400 decoration-4 text-left">SKŁAD SUROWCOWY</h2>
            <div className="bg-zinc-900/20 p-8 rounded-[32px] border border-zinc-800 text-left">
              <p className="text-sm text-zinc-400 leading-relaxed lowercase italic text-left">
                {drink.Ingredients || drink.ingredients || "Brak szczegółowych danych."}
              </p>
            </div>
          </div>
          <div className="text-left text-left">
            <h2 className="text-2xl font-black text-white italic mb-6 tracking-tighter uppercase text-left">DOKUMENTACJA</h2>
            <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-zoom-in aspect-[3/4] text-left" onClick={() => setFullImage(ingredientsImgUrl)}>
              <img src={ingredientsImgUrl} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" onError={(e: any) => { if (!e.target.src.includes('.jpg')) e.target.src = ingredientsImgUrl.replace('.JPG', '.jpg'); }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}