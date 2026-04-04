"use client";
import Link from 'next/link';

export default function Kontakt() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 font-sans uppercase p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full border border-zinc-800 p-12 rounded-[40px] bg-zinc-900/20 backdrop-blur-sm shadow-2xl">
        <h1 className="text-5xl font-black text-yellow-400 italic tracking-tighter mb-10">KONTAKT</h1>
        <div className="space-y-10 text-left">
          <div>
            <p className="text-[10px] text-zinc-600 font-black tracking-[0.3em] mb-2 uppercase">ADRES E-MAIL</p>
            <p className="text-2xl font-black text-white italic border-b border-zinc-800 pb-2">kontakt@energetyki.pl</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600 font-black tracking-[0.3em] mb-2 uppercase">REKLAMA I DANE</p>
            <p className="text-sm font-bold leading-relaxed text-zinc-400 italic">
              ZNALAZŁEŚ BŁĄD W CENIE? CHCESZ DODAĆ SWÓJ PRODUKT? <br/>
              PISZ ŚMIAŁO. ODPOWIADAMY PO TRZECIEJ KAWIE.
            </p>
          </div>
        </div>
        <Link href="/" className="inline-block mt-16 text-[10px] font-black text-zinc-500 border-zinc-800 border-2 px-8 py-3 rounded-full hover:text-yellow-400 hover:border-yellow-400 transition-all uppercase italic">
          POWRÓT DO STARTU
        </Link>
      </div>
    </main>
  );
}