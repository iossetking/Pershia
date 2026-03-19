import BottomNav from "./BottomNav ";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#e8d8af] flex-1 flex flex-col rounded-t-3xl mt-2 overflow-hidden ">
      <div 
        id='ZoneScroll'
        /* ¡AQUÍ ESTÁ EL CAMBIO! Agregamos pb-24 casi al principio de las clases */
        className="flex-1 overflow-y-auto p-2 pt-0 pb-15 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] "
      >
        {children}
      </div>
      
      {/* Como hicimos el BottomNav 'fixed', este div ya no afectará el diseño, 
          pero lo dejamos para mantener tu estructura ordenada */}
      <div className="shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}