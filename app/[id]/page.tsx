"use client";
import { useEffect, useState, use } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const URL = 'https://bhpxwadyvudhfqnkklir.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocHh3YWR5dnVkaGZxbmtrbGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTc0MTQsImV4cCI6MjA4NzM3MzQxNH0.0XT10Md4LodUak5FreZKyy4W8CXQFyZPAewVgUF6EZg'; 
const supabase = createClient(URL, KEY);

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [drink, setDrink] = useState<any>(null);

  useEffect(() => {
    async function getDrink() {
      const { data } = await supabase.from('energy_drinks').select('*').eq('id', id).single();
      if (data) setDrink(data);
    }
    if (id) getDrink();
  }, [id]);

  if (!drink) return <div className="bg-black text-white p-20">Ładowanie...</div>;

  return (
    <main className="min-h-screen bg-black text-white p-10 uppercase">
      <button onClick={() => router.push('/')} className="text-yellow-400 mb-10">← WRÓĆ</button>
      <h1 className="text-6xl font-black italic">{drink.name}</h1>
      <p className="text-2xl mt-4 text-zinc-400">{drink.brand}</p>
      <div className="mt-10 p-6 bg-zinc-900 rounded-2xl border border-zinc-800 inline-block">
        <p className="text-sm text-zinc-500">CENA ŚREDNIA</p>
        <p className="text-4xl font-black text-green-400">{drink.avg_price} PLN</p>
      </div>
    </main>
  );
}