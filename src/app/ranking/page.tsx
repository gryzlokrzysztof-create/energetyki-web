"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

const SUPABASE_URL = 'https://bhpxwadyvudhfqnkklir.supabase.co';

export default function RankingPage() {
  const [drinks, setDrinks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showZeroSugar, setShowZeroSugar] = useState(false);
  
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const fetchDrinks = async () => {
      const { data, error } = await supabase.from('energy_drinks').select('*');
      if (data) setDrinks(data);
    };
    fetchDrinks();
  }, []);

  // KULOODPORNA FUNKCJA DO NAZW FOLDERÓW
  const createFolderName = (name: string) => {
    if (!name) return '';
    const polishChars: { [key: string]: string } = {
      'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
    };
    return name
      .toLowerCase()
      .replace(/[ąćęłńóśźż]/g, match => polishChars[match]) // 1. Usuwa polskie znaki
      .replace(/[^a-z0-9\s]/g, '') // 2. Usuwa WSZYSTKIE znaki specjalne (kropki, przecinki, apostrofy)
      .trim()
      .replace(/\s+/g, '_'); // 3. Zamienia spacje na podkreślniki
  };

  const determineIsZeroSugar = (drink: any): boolean => {
    if (drink.kcal !== undefined && drink.kcal !== null) {
      return drink.kcal < 6;
    }
    if (!drink.name) return false;
    const nameLower = drink.name.toLowerCase();
    const zeroKeywords = ['bezcukru', 'zero', 'bez cukru', 'no sugar', 'diet', 'ultra', 'sugarfree', 'sugar free'];
    return zeroKeywords.some(keyword => nameLower.includes(keyword));
  };

  let filteredDrinks = drinks.filter((drink) => 
    (drink.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (drink.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (showZeroSugar) {
    filteredDrinks = filteredDrinks.filter((drink) => determineIsZeroSugar(drink));
  }

  filteredDrinks.sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return " ↕";
    return sortConfig.direction === 'asc' ? " ↑" : " ↓";
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans flex flex-col items-center pt-28 md:pt-32">
      
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-zinc-900 px-4 md:px-8 py-5 flex justify-between items-center text-left">
        <Link href="/" className="hover:opacity-80 transition-all text-left">
          <div className="flex items-center gap-2">
            <span className="text-4xl text-yellow-400 font-extrabold italic">⚡</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 italic uppercase tracking-tighter text-left">
              ENERGETYKI.PL
            </h1>
          </div>
        </Link>
        <Link href="/" className="text-[9px] font-black text-zinc-400 hover:text-white border border-zinc-800 px-4 py-2 rounded-full transition-all tracking-widest bg-zinc-900/50 text-left">
          POWRÓT
        </Link>
      </header>

      <div className="w-full max-w-6xl space-y-5">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowZeroSugar(false)}
              className={`flex-1 md:flex-none px-5 py-2 text-sm font-semibold rounded-lg transition-all ${!showZeroSugar ? 'bg-yellow-400 text-black shadow-md' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'}`}
            >
              Wszystkie ({drinks.length})
            </button>
            <button 
              onClick={() => setShowZeroSugar(true)}
              className={`flex-1 md:flex-none px-5 py-2 text-sm font-semibold rounded-lg transition-all ${showZeroSugar ? 'bg-blue-500 text-white shadow-md' : 'bg-zinc-900 text-blue-400 border border-zinc-800 hover:bg-blue-900/20 hover:border-blue-500/50'}`}
            >
              Zero Sugar
            </button>
          </div>

          <div className="w-full md:w-72 relative">
            <input 
              type="text" 
              placeholder="Szukaj napoju..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/50 transition-all"
            />
          </div>
        </div>

        <div className="w-full bg-zinc-900/40 rounded-xl border border-zinc-800/80 overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none">
                <tr>
                  <th className="py-3 px-3 w-10 text-center rounded-tl-xl">#</th>
                  <th className="py-3 px-3 w-14 text-center"></th>
                  <th className="py-3 px-3 hover:text-zinc-200 transition-colors" onClick={() => handleSort('name')}>
                    Napój <span className="text-zinc-600">{getSortIcon('name')}</span>
                  </th>
                  <th className="py-3 px-3 hover:text-zinc-200 transition-colors" onClick={() => handleSort('avg_price')}>
                    Cena <span className="text-zinc-600">{getSortIcon('avg_price')}</span>
                  </th>
                  <th className="py-3 px-3 hover:text-zinc-200 transition-colors" onClick={() => handleSort('caffeine_mg_100ml')}>
                    Kofeina <span className="text-zinc-600">{getSortIcon('caffeine_mg_100ml')}</span>
                  </th>
                  <th className="py-3 px-3 text-center hover:text-zinc-200 transition-colors rounded-tr-xl" onClick={() => handleSort('volume')}>
                    Pojemność <span className="text-zinc-600">{getSortIcon('volume')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredDrinks.map((drink, index) => {
                  const folderName = createFolderName(drink.name);
                  const imagePath = `${SUPABASE_URL}/storage/v1/object/public/energy-drinkss/${folderName}/cover.JPG`; 
                  const isZeroSugar = determineIsZeroSugar(drink);

                  return (
                    <tr key={drink.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-2 px-3 text-center font-semibold text-zinc-500 group-hover:text-zinc-300 text-xs">{index + 1}</td>

                      <td className="py-2 px-3 text-center">
                        <div className="w-9 h-12 mx-auto bg-zinc-800/50 rounded flex items-center justify-center overflow-hidden shadow-sm relative">
                          <img 
                            src={imagePath} 
                            alt={drink.name} 
                            className="w-full h-full object-cover relative z-10"
                            onError={(e: any) => { 
                              // Jeśli .JPG zawiedzie, próbujemy małego .jpg
                              if (e.target.src.includes('.JPG')) {
                                e.target.src = imagePath.replace('.JPG', '.jpg');
                              } else {
                                // Jeśli i to zawiedzie, ukrywamy zepsutą ikonkę
                                e.target.style.opacity = '0';
                              }
                            }}
                          />
                        </div>
                      </td>
                      
                      <td className="py-2 px-3">
                        <div className="flex flex-col items-start gap-1">
                          <Link href={`/${drink.id}`} className="font-bold text-zinc-100 tracking-wide hover:text-yellow-400 transition-colors text-sm">
                            {drink.name}
                          </Link>
                          
                          {isZeroSugar && (
                            <span className="px-2 py-0.5 rounded text-blue-400 text-[9px] font-bold tracking-wide uppercase border border-blue-800/50 bg-blue-900/20 leading-none">
                              Zero Sugar
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-2 px-3 text-zinc-300 font-medium text-sm">
                        {drink.avg_price ? `${drink.avg_price} PLN` : '-'}
                      </td>
                      
                      <td className="py-2 px-3 text-zinc-300 font-medium text-sm">
                        ⚡ {drink.caffeine_mg_100ml} mg/100ml
                      </td>

                      <td className="py-2 px-3 text-zinc-400 font-medium text-xs text-center">
                        {drink.volume ? `${drink.volume} ml` : '-'}
                      </td>
                    </tr>
                  );
                })}

                {drinks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-zinc-500">
                      Ładowanie danych z bazy...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}