"use client";
import { useEffect, useState, use } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bhpxwadyvudhfqnkklir.supabase.co';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(URL, KEY);

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [drink, setDrink] = useState<any>(null);

  useEffect(() => {
    async function getDrink() {
      // Zmienione na główną tabelę energy_drinks
      const { data } = await supabase.from('energy_drinks').select('*').eq('id', id).single();
      if (data) setDrink(data);
    }
    if (id) getDrink();
  }, [id]);

  if (!drink) return <div className="min-h-screen bg-black flex items-center justify-center font-black text-yellow-400">WCZYTYWANIE PRODUKTU...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans uppercase p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-12 text-yellow-400 font-black italic hover:underline">
          ← POWRÓT DO RANKINGU
        </button>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-[40px] aspect-square flex items-center justify-center">
            <span className="text-zinc-700 font-black text-8xl italic">PHOTO</span>
          </div>
          
          <div>
            <p className="text-yellow-400 font-black italic text-xl mb-2">{drink.brand}</p>
            <h1 className="text-6xl font-black text-white italic tracking-tighter mb-10">{drink.name}</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-black mb-1">CENA</p>
                <p className="text-3xl font-black text-green-400 italic">{drink.avg_price} PLN</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-black mb-1">KOFEINA</p>
                <p className="text-3xl font-black text-white italic">{drink.caffeine_mg_100ml} MG</p>
              </div>
            </div>

            <p className="text-lg text-zinc-400 italic lowercase first-letter:uppercase leading-relaxed border-l-4 border-yellow-400 pl-6">
              {drink.description || "Brak opisu dla tego produktu."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}