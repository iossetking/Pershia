'use client';
import React, { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { OutfitsData, OutfitType } from '../../outfits/ConOutfits';
import OutfitRenderer from '../../outfits/OutfitRenderer';
import { Items } from '../../items/ConItem';
import { CollectionsData } from '../Collections';
import { createPortal } from 'react-dom';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

// ── Tipos ────────────────────────────────────────────────────────────────────
type Item = typeof Items[0]

// ── Modal detalle de prenda (reutilizado) ────────────────────────────────────
function ItemDetailModal({ item, onClose }: { item: Item; onClose: () => void }) {
  React.useEffect(() => {
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

// ── Modal detalle de outfit (reutilizado) ────────────────────────────────────
function OutfitDetailModal({ outfit, onClose }: { outfit: OutfitType; onClose: () => void }) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
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
          <div className="md:w-5/12 bg-gray-50 flex-shrink-0 flex items-center justify-center p-4">
            <div className="relative w-full aspect-[3/4]">
              <OutfitRenderer outfit={outfit} />
            </div>
          </div>
          <div className="md:w-7/12 p-6 flex flex-col gap-5 overflow-y-auto">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Outfit</span>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{outfit.name}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">{outfit.description}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-3">Prendas del outfit</span>
              <div className="flex flex-col gap-2">
                {prendas.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 rounded-2xl p-2 pr-4 transition-colors group text-left"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.type}</p>
                    </div>
                    <ChevronLeftIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 rotate-180 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>,
    document.body
  )
}

// ── Página principal de colección ────────────────────────────────────────────
export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const collectionId = resolvedParams.id;

  const [selectedOutfit, setSelectedOutfit] = useState<OutfitType | null>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  if (!Array.isArray(CollectionsData)) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 text-center p-6">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error de conexión de datos</h2>
      </div>
    );
  }

  const currentCollection = CollectionsData.find(col => col.id === collectionId);

  if (!currentCollection) {
    return (
      <div className="min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Colección no encontrada</h2>
        <Link href="/wardrobe/collections" className="bg-gray-700 text-white px-6 py-2 rounded-full font-medium">
          Volver a mis colecciones
        </Link>
      </div>
    );
  }

  const safeOutfitIds = currentCollection.outfitIds || [];
  const safeItemIds = currentCollection.itemIds || [];

  const collectionOutfits = OutfitsData.filter(o => safeOutfitIds.includes(o.id));
  const collectionItems = Items.filter(i => safeItemIds.includes(i.id));

  const combinedElements = [
    ...collectionOutfits.map(outfit => ({ type: 'outfit' as const, id: `outfit-${outfit.id}`, data: outfit })),
    ...collectionItems.map(item => ({ type: 'item' as const, id: `item-${item.id}`, data: item }))
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 w-full pb-28">

      <Link href="/wardrobe/collections" className="flex items-center gap-2 text-gray-600 hover:text-gray-700 w-fit mb-6 transition-colors">
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="font-medium">Volver a Colecciones</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{currentCollection.name}</h1>
        <p className="text-sm text-gray-500 font-medium">{combinedElements.length} elementos guardados</p>
      </div>

      {combinedElements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500">No hay nada en esta colección todavía.</p>
        </div>
      ) : (
        <div className="columns-[150px] md:columns-[250px] gap-4">
          {combinedElements.map((element) => {
            if (element.type === 'outfit') {
              const outfit = element.data as OutfitType
              return (
                <div
                  key={element.id}
                  onClick={() => setSelectedOutfit(outfit)}
                  className="break-inside-avoid mb-4 bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="relative w-full aspect-[3/4] bg-gray-100/30 rounded-2xl overflow-hidden">
                    <OutfitRenderer outfit={outfit} />
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mt-2 px-1 truncate">{outfit.name}</p>
                </div>
              );
            }
            const item = element.data as Item
            return (
              <div
                key={element.id}
                onClick={() => setSelectedItem(item)}
                className="break-inside-avoid mb-4 rounded-2xl overflow-hidden cursor-pointer group border border-gray-100 shadow-sm"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full object-cover rounded-xl transition-transform duration-300 md:group-hover:scale-110"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Modales */}
      {selectedOutfit && (
        <OutfitDetailModal outfit={selectedOutfit} onClose={() => setSelectedOutfit(null)} />
      )}
      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}