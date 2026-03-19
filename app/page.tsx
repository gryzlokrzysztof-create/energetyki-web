"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const URL = 'https://bhpxwadyvudhfqnkklir.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocHh3YWR5dnVkaGZxbmtrbGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTc0MTQsImV4cCI6MjA4NzM3MzQxNH0.0XT10Md4LodUak5FreZKyy4W8CXQFyZPAewVgUF6EZg';
const supabase = createClient(URL, KEY);

export default function Home() {
  const [drinks, setDrinks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from('energy_drinks').select('*');
      if (data) setDrinks(data);
      setLoading(false);
    }
    getData();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-black text-yellow-400 uppercase italic">Ładowanie bazy...</div>;

  const filtered = drinks.filter(d => d.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-400 p-8 font-sans uppercase">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-6 text-left">
          <h1 className="text-4xl font-black text-yellow-400 italic tracking-tighter text-left">⚡ ENERGETYKI.PL</h1>
          <input 
            type="text" 
            placeholder="SZUKAJ..." 
            className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs font-bold text-white outline-none w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/20">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-800/50 text-zinc-400 font-black">
                <th className="p-4">PRODUKT</th>
                <th className="p-4 text-right">CENA</th>
                <th className="p-4 text-right">MOC / 1 ZŁ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filtered.map((drink) => {
                const folder = drink.name?.toLowerCase().trim().replace(/\s+/g, '_');
                const imgUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folder}/cover.JPG`;
                const ratio = drink.avg_price && drink.volume ? ((drink.caffeine_mg_100ml * (drink.volume / 100)) / drink.avg_price).toFixed(2) : "0.00";

                return (
                  <tr key={drink.id} className="hover:bg-yellow-400/[0.03]">
                    <td className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 text-left">
                        <img src={imgUrl} className="w-full h-full object-cover text-left" onError={(e: any) => { if(!e.target.src.includes('.jpg')) e.target.src = imgUrl.replace('.JPG', '.jpg'); }} />
                      </div>
                      <Link href={`/${drink.id}`} className="font-bold text-white italic hover:text-yellow-400 text-left">
                        {drink.name}
                      </Link>
                    </td>
                    <td className="p-4 text-right font-mono text-green-400">{drink.avg_price} PLN</td>
                    <td className="p-4 text-right font-black text-yellow-400 italic">{ratio}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}