'use client'
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Items } from '../items/ConItem';
import OutfitRenderer from './OutfitRenderer';

export interface OutfitElement {
  itemId: number;
  top: number;
  left: number;
  scale: number;
  zIndex: number;
}

export interface OutfitType {
  id: string;
  name: string;
  description: string;
  elements: OutfitElement[];
}

export const OutfitsData: OutfitType[] = [
  {
    id: 'outfit-casual',
    name: 'Casual Diario',
    description: 'Un look relajado y cómodo para el día a día. Combina una camisa básica con pantalón chino y tenis retro para un estilo urbano sin esfuerzo.',
    elements: [
      { itemId: 1, top: 0, left: 10, scale: 80, zIndex: 1 },
      { itemId: 2, top: 40, left: 10, scale: 80, zIndex: 2 },
      { itemId: 3, top: 75, left: 50, scale: 40, zIndex: 3 },
    ]
  },
  {
    id: 'outfit-accesorios',
    name: 'Layered & Bold',
    description: 'Outfit estructurado con chamarra bomber como pieza central. Los pantalones cargo aportan volumen y el cinturón de piel remata con detalle de calidad.',
    elements: [
      { itemId: 4, top: 5, left: 5, scale: 90, zIndex: 2 },
      { itemId: 9, top: 50, left: 10, scale: 80, zIndex: 1 },
      { itemId: 6, top: -5, left: 60, scale: 30, zIndex: 3 },
    ]
  },
  {
    id: 'outfit-elegante',
    name: 'Smart Casual',
    description: 'Combinación pulida con bufanda de lana como accesorio estrella. La camiseta gráfica rompe la formalidad y las botas Chelsea elevan el conjunto.',
    elements: [
      { itemId: 7, top: 0, left: 15, scale: 85, zIndex: 1 },
      { itemId: 8, top: 45, left: 15, scale: 85, zIndex: 2 },
      { itemId: 10, top: 80, left: 55, scale: 35, zIndex: 3 },
    ]
  },
  {
    id: 'outfit-elegante2',
    name: 'Winter Mood',
    description: 'Look de temporada fría con bufanda de lana como protagonista. El bucket hat añade un toque de personalidad streetwear sobre una base casual.',
    elements: [
      { itemId: 7, top: 0, left: 15, scale: 85, zIndex: 1 },
      { itemId: 8, top: 45, left: 15, scale: 85, zIndex: 2 },
      { itemId: 5, top: 80, left: 55, scale: 35, zIndex: 3 },
    ]
  },
  {
    id: 'outfit-elegante3',
    name: 'Editorial Vibes',
    description: 'Mezcla de texturas y proporciones: bufanda de lana sobre tenis retro crea un contraste interesante entre lo formal y lo deportivo.',
    elements: [
      { itemId: 7, top: 0, left: 15, scale: 85, zIndex: 1 },
      { itemId: 3, top: 45, left: 15, scale: 85, zIndex: 2 },
      { itemId: 10, top: 80, left: 55, scale: 35, zIndex: 3 },
    ]
  },
];

// ── Tipo para item individual ────────────────────────────────────────────────
type Item = typeof Items[0]

// ── Modal detalle de prenda individual ──────────────────────────────────────
function ItemDetailModal({ item, onClose }: { item: Item; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="md:w-5/12 bg-gray-100 flex-shrink-0">
          <img src={item.imageUrl} alt={item.name} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="md:w-7/12 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{item.category}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{item.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{item.brand}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tipo</span>
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium">{item.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Color</span>
            <span className="text-sm text-gray-700 font-medium">{item.color}</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">Materiales</span>
            <div className="flex flex-wrap gap-2">
              {item.materials.map((mat, i) => (
                <span key={i} className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-medium">{mat}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Descripción</span>
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Modal detalle de outfit ──────────────────────────────────────────────────
function OutfitDetailModal({ outfit, onClose }: { outfit: OutfitType; onClose: () => void }) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const prendas = outfit.elements
    .map(el => Items.find(i => i.id === el.itemId))
    .filter(Boolean) as Item[]

  if (!mounted) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          onClick={e => e.stopPropagation()}
          style={{ maxHeight: '92vh' }}
        >
          {/* Imagen del outfit - izquierda */}
          <div className="md:w-5/12 bg-gray-50 flex-shrink-0 flex items-center justify-center p-4">
            <div className="relative w-full aspect-[3/4]">
              <OutfitRenderer outfit={outfit} />
            </div>
          </div>

          {/* Info - derecha */}
          <div className="md:w-7/12 p-6 flex flex-col gap-5 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Outfit</span>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Nombre y descripción */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{outfit.name}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">{outfit.description}</p>
            </div>

            {/* Prendas del outfit */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-3">
                Prendas del outfit
              </span>
              <div className="flex flex-col gap-2">
                {prendas.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 rounded-2xl p-2 pr-4 transition-colors group text-left"
                  >
                    {/* Miniatura */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    {/* Info de la prenda */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.type}</p>
                    </div>
                    {/* Flecha */}
                    <ChevronLeftIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 rotate-180 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal de prenda individual encima del modal de outfit */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>,
    document.body
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function ConOutfit() {
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitType | null>(null)

  return (
    <div className="mt-6 pb-28">
      <div className="flex flex-wrap gap-4 justify-start">
        {OutfitsData.map((outfit) => (
          <div
            key={outfit.id}
            onClick={() => setSelectedOutfit(outfit)}
            className="w-[160px] md:w-[250px] lg:w-[280px] shrink-0 rounded-2xl overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-2"
          >
            <div className="relative w-full aspect-[3/4] bg-gray-100/40 rounded-xl overflow-hidden group-hover:bg-gray-100/70 transition-colors">
              <OutfitRenderer outfit={outfit} />
            </div>
            <p className="text-xs font-semibold text-gray-600 mt-2 px-1 truncate">{outfit.name}</p>
          </div>
        ))}
      </div>

      {selectedOutfit && (
        <OutfitDetailModal
          outfit={selectedOutfit}
          onClose={() => setSelectedOutfit(null)}
        />
      )}
    </div>
  )
}