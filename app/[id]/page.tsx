"use client";
import { useEffect, useState, use } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const URL = 'https://bhpxwadyvudhfqnkklir.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocHh3YWR5dnVkaGZxbmtrbGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTc0MTQsImV4cCI6MjA4NzM3MzQxNH0.0XT10Md4LodUak5FreZKyy4W8CXQFyZPAewVgUF6EZg'; 
const supabase = createClient(URL, KEY);

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [drink, setDrink] = useState<any>(null);
  const [fullImage, setFullImage] = useState<string | null>(null);

  useEffect(() => {
    async function getDrink() {
      // Pobieramy dane z Supabase
      const { data } = await supabase
        .from('energy_drinks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setDrink(data);
        console.log("Pobrane dane produktu:", data);
      }
    }
    if (id) getDrink();
  }, [id]);

  if (!drink) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="font-black text-yellow-400 uppercase italic animate-pulse text-xl">
        Wczytywanie szczegółów...
      </div>
    </div>
  );

  const folderName = drink.name.toLowerCase().trim().replace(/\s+/g, '_');
  const coverUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folderName}/cover.JPG`;
  const ingredientsImgUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folderName}/ingredients.JPG`;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 font-sans uppercase p-4 md:p-8">
      
      {/* Modal podglądu zdjęcia */}
      {fullImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer" 
          onClick={() => setFullImage(null)}
        >
          <img 
            src={fullImage} 
            className="max-w-full max-h-full rounded-xl border border-zinc-800 shadow-2xl" 
            alt="Powiększenie" 
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Nagłówek */}
        <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6 text-left">
          <Link href="/" className="hover:opacity-80 transition-all active:scale-95 text-left">
            <h1 className="text-3xl md:text-4xl font-black text-yellow-400 italic tracking-tighter text-left">⚡ ENERGETYKI.PL</h1>
          </Link>
          <Link href="/" className="text-[10px] font-black text-zinc-500 hover:text-yellow-400 tracking-widest border border-zinc-800 px-6 py-2 rounded-full transition-all">
            POWRÓT DO LISTY
          </Link>
        </header>
        
        {/* Sekcja główna produktu */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16 items-start text-left">
          <div 
            className="rounded-[40px] overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-2xl aspect-square cursor-zoom-in group"
            onClick={() => setFullImage(coverUrl)}
          >
            <img 
              src={coverUrl} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt={drink.name}
              onError={(e: any) => { if (!e.target.src.includes('.jpg')) e.target.src = coverUrl.replace('.JPG', '.jpg'); }} 
            />
          </div>
          
          <div className="flex flex-col h-full justify-center text-left">
            <p className="text-yellow-400 font-black italic tracking-[0.4em] text-xs mb-3 text-left">{drink.brand}</p>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-[0.9] mb-10 text-left">
              {drink.name}
            </h1>
            
            {/* Parametry odżywcze */}
            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 shadow-xl">
                <p className="text-[10px] text-zinc-500 font-black mb-1 tracking-widest text-left">ENERGIA / 100ML</p>
                <p className="text-3xl font-black text-white italic text-left">{drink.kcal || "—"} KCAL</p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 shadow-xl">
                <p className="text-[10px] text-zinc-500 font-black mb-1 tracking-widest text-left">CUKIER / 100ML</p>
                <p className="text-3xl font-black text-white italic text-left">{drink.sugar ?? "0"} G</p>
              </div>
            </div>

            <div className="border-l-4 border-yellow-400 pl-8 text-left">
              <p className="text-lg text-zinc-400 italic lowercase first-letter:uppercase leading-relaxed text-left">
                {drink.description || "Opis produktu jest w trakcie przygotowania."}
              </p>
            </div>
          </div>
        </div>

        {/* Dolna sekcja: Skład i Etykieta */}
        <div className="grid md:grid-cols-3 gap-8 border-t border-zinc-900 pt-16 mb-20 text-left">
          <div className="md:col-span-2 text-left">
            <h2 className="text-2xl font-black text-white italic mb-6 tracking-tighter text-left underline decoration-yellow-400 decoration-4">SKŁAD SUROWCOWY</h2>
            <div className="bg-zinc-900/20 p-8 rounded-3xl border border-zinc-800 shadow-inner text-left">
              <p className="text-sm text-zinc-400 leading-relaxed lowercase italic text-left">
                {/* Obsługa różnych nazw kolumn z bazy danych */}
                {drink.Ingredients || drink.ingredients || "Dane o składnikach nie zostały jeszcze wczytane z bazy danych."}
              </p>
            </div>
          </div>

          <div className="text-left">
            <h2 className="text-2xl font-black text-white italic mb-6 tracking-tighter text-left">DOKUMENTACJA</h2>
            <div 
              className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-zoom-in hover:border-yellow-400 transition-all shadow-xl aspect-[3/4]"
              onClick={() => setFullImage(ingredientsImgUrl)}
            >
              <img 
                src={ingredientsImgUrl} 
                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" 
                alt="Etykieta"
                onError={(e: any) => { if (!e.target.src.includes('.jpg')) e.target.src = ingredientsImgUrl.replace('.JPG', '.jpg'); }} 
              />
            </div>
            <p className="mt-4 text-[9px] text-zinc-600 font-bold tracking-widest text-center">KLIKNIJ ABY POWIĘKSZYĆ</p>
          </div>
        </div>
      </div>
    </main>
  );
}