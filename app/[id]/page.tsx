"use client";
import { useEffect, useState, use } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const URL = 'https://bhpxwadyvudhfqnkklir.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocHh3YWR5dnVkaGZxbmtrbGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTc0MTQsImV4cCI6MjA4NzM3MzQxNH0.0XT10Md4LodUak5FreZKyy4W8CXQFyZPAewVgUF6EZg'; 
const supabase = createClient(URL, KEY);

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [drink, setDrink] = useState<any>(null);
  const [fullImage, setFullImage] = useState<string | null>(null);

  useEffect(() => {
    async function getDrink() {
      const { data } = await supabase.from('energy_drinks').select('*').eq('id', id).single();
      if (data) setDrink(data);
    }
    if (id) getDrink();
  }, [id]);

  if (!drink) return <div className="min-h-screen bg-black flex items-center justify-center font-black text-yellow-400 uppercase tracking-tighter italic">Ładowanie danych...</div>;

  const folderName = drink.name.toLowerCase().trim().replace(/\s+/g, '_');
  const coverUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folderName}/cover.JPG`;
  const ingredientsUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folderName}/ingredients.JPG`;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 font-sans uppercase p-4 md:p-8 text-left">
      
      {/* Podgląd pełnego zdjęcia */}
      {fullImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setFullImage(null)}>
          <img src={fullImage} className="max-w-full max-h-full rounded-xl border border-zinc-800" alt="Widok" />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* NAGŁÓWEK - Wraca do strony głównej */}
        <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
          <Link href="/" className="hover:opacity-80 transition-all active:scale-95">
            <h1 className="text-3xl md:text-4xl font-black text-yellow-400 italic tracking-tighter">⚡ ENERGETYKI.PL</h1>
          </Link>
          <Link href="/" className="text-[10px] font-black text-zinc-500 hover:text-yellow-400 tracking-widest border border-zinc-800 px-6 py-2 rounded-full transition-all">
            POWRÓT
          </Link>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-start">
          {/* FOTO PUSZKI */}
          <div 
            className="rounded-[40px] overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-2xl aspect-square cursor-zoom-in group"
            onClick={() => setFullImage(coverUrl)}
          >
            <img 
              src={coverUrl} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt={drink.name}
              onError={(e: any) => { 
                if (!e.target.src.includes('.jpg')) {
                    e.target.src = coverUrl.replace('.JPG', '.jpg');
                }
              }} 
            />
          </div>
          
          <div className="flex flex-col h-full justify-center">
            <p className="text-yellow-400 font-black italic tracking-[0.4em] text-xs mb-3">{drink.brand}</p>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-[0.9] mb-12">
              {drink.name}
            </h1>
            
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-black mb-2 tracking-widest text-left">CENA ŚREDNIA</p>
                <p className="text-3xl font-black text-green-400 italic">{drink.avg_price} PLN</p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-black mb-2 tracking-widest text-left">KOFEINA / 100ML</p>
                <p className="text-3xl font-black text-white italic">{drink.caffeine_mg_100ml} MG</p>
              </div>
            </div>

            <div className="border-l-4 border-yellow-400 pl-8">
              <p className="text-lg text-zinc-400 italic lowercase first-letter:uppercase leading-relaxed">
                {drink.description || "Brak dodatkowych informacji w bazie danych."}
              </p>
            </div>
          </div>
        </div>

        {/* SKŁAD */}
        <div className="border-t border-zinc-900 pt-16 mb-20">
          <h2 className="text-2xl font-black text-white italic mb-10 tracking-tighter">SKŁAD I WARTOŚCI</h2>
          <div 
            className="max-w-xs rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-zoom-in hover:border-yellow-400 transition-all shadow-xl"
            onClick={() => setFullImage(ingredientsUrl)}
          >
            <img 
              src={ingredientsUrl} 
              className="w-full h-auto opacity-60 hover:opacity-100 transition-opacity" 
              alt="Skład"
              onError={(e: any) => { 
                if (!e.target.src.includes('.jpg')) {
                    e.target.src = ingredientsUrl.replace('.JPG', '.jpg');
                }
              }} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}