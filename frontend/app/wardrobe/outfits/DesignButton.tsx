// app/wardrobe/outfits/DesignButton.tsx
import React from 'react';
import Link from 'next/link';
// Usaremos el icono de percha de Heroicons para diferenciarlo
import { BeakerIcon } from '@heroicons/react/24/outline'; 

export default function DesignButton() {
  return (
    <Link 
      href="/wardrobe/outfits/design" // Esta será la ruta de nuestra nueva página
      className="fixed bottom-32 right-6 bg-white border-2 border-[#af925c] p-3 rounded-full text-[#af925c] shadow-lg z-50 hover:bg-[#faf6e9] transition-all duration-300 group"
      aria-label="Diseñar nuevo outfit"
    >
      <BeakerIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
      {/* Opcional: un pequeño tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
        Diseñar Conjunto
      </span>
    </Link>
  );
}