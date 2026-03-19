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
      try {
        const { data, error } = await supabase.from('energy_drinks').select('*');
        if (error) throw error;
        setDrinks(data || []);
      } catch (err) {
        console.error("Błąd pobierania:", err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="font-black text-yellow-400 uppercase italic animate-pulse text-2xl">Wczytywanie rankingu...</p>
    </div>
  );

  const filtered = drinks
    .filter(d => d.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Domyślne sortowanie po opłacalności (ratio) malejąco
      const ratioA = (a.caffeine_mg_100ml * (a.volume / 100)) / a.avg_price;
      const ratioB = (b.caffeine_mg_100ml * (b.volume / 100)) / b.avg_price;
      return ratioB - ratioA;
    });

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-400 p-4 md:p-8 font-sans uppercase">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-zinc-800 pb-6 text-left">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-yellow-400 italic tracking-tighter">⚡ ENERGETYKI.PL</h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-widest mt-1">Ranking opłacalności (MOC na 1 ZŁ)</p>
          </div>
          <input 
            type="text" 
            placeholder="WYSZUKAJ PRODUKT..." 
            className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-yellow-400 w-full md:w-64 transition-all shadow-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/20 shadow-2xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-zinc-800/50 text-zinc-400 font-black border-b border-zinc-800">
                <th className="p-4">PRODUKT</th>
                <th className="p-4 text-right">CENA (PLN)</th>
                <th className="p-4 text-right">KOFEINA (MG)</th>
                <th className="p-4 text-right text-yellow-500 font-black">MOC / 1 ZŁ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filtered.map((drink, index) => {
                const folder = drink.name?.toLowerCase().trim().replace(/\s+/g, '_');
                const imgUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folder}/cover.JPG`;
                
                // Obliczanie opłacalności: (kofeina na 100ml * ilość setek ml) / cena
                const totalCaffeine = drink.caffeine_mg_100ml * (drink.volume / 100);
                const ratio = (totalCaffeine / drink.avg_price).toFixed(2);

                return (
                  <tr key={drink.id} className={`${index < 3 ? 'bg-yellow-400/5' : ''} hover:bg-yellow-400/[0.08] transition-colors group`}>
                    <td className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0">
                        <img 
                          src={imgUrl} 
                          className="w-full h-full object-cover"
                          onError={(e: any) => { if(!e.target.src.includes('.jpg')) e.target.src = imgUrl.replace('.JPG', '.jpg'); }}
                          alt=""
                        />
                      </div>
                      <Link href={`/${drink.id}`} className="font-bold text-white italic group-hover:text-yellow-400 transition-colors">
                        {drink.name}
                      </Link>
                    </td>
                    <td className="p-4 text-right font-mono text-green-400">{drink.avg_price?.toFixed(2)}</td>
                    <td className="p-4 text-right text-zinc-300 font-bold">{totalCaffeine}</td>
                    <td className="p-4 text-right font-black text-yellow-400 italic text-sm">{ratio}</td>
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