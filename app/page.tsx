"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bhpxwadyvudhfqnkklir.supabase.co';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(URL, KEY);

export default function Home() {
  const [drinks, setDrinks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        // Zmienione na główną tabelę energy_drinks
        const { data } = await supabase.from('energy_drinks').select('*');
        if (data) setDrinks(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const filteredDrinks = drinks.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-black text-yellow-400">ŁADOWANIE DANYCH...</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-400 p-4 md:p-8 font-sans uppercase">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-zinc-800 pb-6">
          <div className="text-left">
            <h1 className="text-4xl font-black text-yellow-400 italic tracking-tighter">⚡ ENERGETYKI.PL</h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-widest mt-1">BAZA DANYCH OPŁACALNOŚCI</p>
          </div>
          <input 
            type="text" 
            placeholder="SZUKAJ..." 
            className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-yellow-400 w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/20">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-800/50 text-zinc-400 font-black">
                <th className="p-4">PRODUKT</th>
                <th className="p-4 text-right">CENA (PLN)</th>
                <th className="p-4 text-right">KOFEINA (MG)</th>
                <th className="p-4 text-right text-yellow-500">MOC / 1 ZŁ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredDrinks.map((drink) => (
                <tr key={drink.id} className="hover:bg-yellow-400/[0.03] transition-colors">
                  <td className="p-4">
                    <Link href={`/${drink.id}`} className="font-bold text-white italic hover:text-yellow-400">
                      {drink.name}
                    </Link>
                  </td>
                  <td className="p-4 text-right font-mono text-green-400">{drink.avg_price}</td>
                  <td className="p-4 text-right">{drink.caffeine_mg_100ml}</td>
                  <td className="p-4 text-right font-black text-yellow-400 italic text-sm">
                    {(drink.caffeine_mg_100ml * 2.5 / drink.avg_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}