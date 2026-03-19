{filteredDrinks.map((drink) => {
  // .trim() to Twój bezpiecznik na zbędne spacje w bazie
  const folder = drink.name.toLowerCase().trim().replace(/\s+/g, '_');
  const imgUrl = `${URL}/storage/v1/object/public/energy-drinkss/${folder}/cover.JPG`;
  
  return (
    <tr key={drink.id} className="hover:bg-yellow-400/[0.03]">
      <td className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
          <img 
            src={imgUrl} 
            className="w-full h-full object-cover"
            onError={(e: any) => {
              // Próba naprawy rozszerzenia, jeśli .JPG nie działa
              if (!e.target.src.includes('.jpg')) {
                e.target.src = imgUrl.replace('.JPG', '.jpg');
              }
            }}
          />
        </div>
        <Link href={`/${drink.id}`} className="font-bold text-white italic hover:text-yellow-400">
          {drink.name}
        </Link>
      </td>
      {/* Reszta Twoich komórek <td> (Cena, Moc itd.) pozostaje bez zmian */}
    </tr>
  );
})}