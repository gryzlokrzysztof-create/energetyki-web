"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const URL = 'https://bhpxwadyvudhfqnkklir.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocHh3YWR5dnVkaGZxbmtrbGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTc0MTQsImV4cCI6MjA4NzM3MzQxNH0.0XT10Md4LodUak5FreZKyy4W8CXQFyZPAewVgUF6EZg';
const supabase = createClient(URL, KEY);

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export default function Home() {
  const [drinks, setDrinks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // Domyślne sortowanie po MOC / 1 ZŁ malejąco
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'ratio', direction: 'desc' });

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const { data } = await supabase.from('energy_drinks').select('*');
        if (data) setDrinks(data);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedDrinks = drinks
    .filter(d => d.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'ratio') {
        aValue = (a.caffeine_mg_100ml * 2.5) / a.avg_price;
        bValue = (b.caffeine_mg_100ml * 2.5) / b.avg_price;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return " ↕";
    return sortConfig.direction === 'asc' ? " ▲" : " ▼";
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-black text-yellow-400 uppercase tracking-tighter italic">Wczytywanie bazy energetyków...</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-400 p-8 font-sans uppercase">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-zinc-800 pb-6">
          <div className="text-left">
            <h1 className="text-4xl font-black text-yellow-400 italic tracking-tighter">⚡ ENERGETYKI.PL</h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-widest mt-1 text-left">Ranking opłacalności (MOC na 1 ZŁ)</p>
          </div>
          <input 
            type="text" 
            placeholder="WYSZUKAJ PRODUKT..." 
            className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-yellow-400 w-64 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/20 shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-800/50 text-zinc-400 font-black cursor-pointer select-none">
                <th className="p-4 hover:text-white transition-colors" onClick={() => requestSort('name')}>
                  PRODUKT {getSortIcon('name')}
                </th>
                <th className="p-4 text-right hover:text-white transition-colors" onClick={() => requestSort('avg_price')}>
                  CENA (PLN) {getSortIcon('avg_price')}
                </th>
                <th className="p-4 text-right hover:text-white transition-colors" onClick={() => requestSort('caffeine_mg_100ml')}>
                  KOFEINA / 100ML {getSortIcon('caffeine_mg_100ml')}
                </th>
                <th className="p-4 text-right text-yellow-500 hover:text-white transition-colors font-black" onClick={() => requestSort('ratio')}>
                  MOC / 1 ZŁ {getSortIcon('ratio')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {processedDrinks.map((drink, index) => {
                const folder = drink.name.toLowerCase().trim().replace(/\s+/g, '_');
                const imgUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folder}/cover.JPG`;
                const ratio = (drink.caffeine_mg_100ml * 2.5 / drink.avg_price).toFixed(2);

                // Logika podświetlania TOP 3 na złoto
                const isTop3 = index < 3;
                const isRatioSort = sortConfig.key === 'ratio' && sortConfig.direction === 'desc';
                const rowClass = isTop3 && isRatioSort 
                  ? "bg-yellow-400/10 hover:bg-yellow-400/20" 
                  : "hover:bg-yellow-400/[0.03]";

                return (
                  <tr key={drink.id} className={`${rowClass} transition-colors group`}>
                    <td className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                        <img 
                          src={imgUrl} 
                          className="w-full h-full object-cover"
                          onError={(e: any) => { if(!e.target.src.includes('.jpg')) e.target.src = imgUrl.replace('.JPG', '.jpg'); }}
                          alt={drink.name}
                        />
                      </div>
                      <Link href={`/${drink.id}`} className="font-bold