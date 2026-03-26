'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { OutfitsData } from '../outfits/ConOutfits';
import OutfitRenderer from '../outfits/OutfitRenderer';
import { Items } from '../items/ConItem'; 

// 1. INTERFAZ CORRECTA
export interface CollectionType {
  id: string;
  name: string;
  outfitIds: string[];
  itemIds: number[]; 
}
export const CollectionsData: CollectionType[] = [
  { 
    id: '1', 
    name: 'Viaje a la Playa', 
    outfitIds: ['outfit-casual', 'outfit-accesorios'],
    itemIds: [3,5] 
  },
  { 
    id: '2', 
    name: 'Favoritos de Invierno', 
    outfitIds: [],
    itemIds: [1, 2] 
  },
];

export default function CollectionsList() {
  const [collections, setCollections] = useState<CollectionType[]>(CollectionsData);

  const handleCreateCollection = () => {
    const name = prompt("Nombre de la nueva colección:");
    if (!name?.trim()) return;
    
    setCollections(prev => [...prev, {
      id: crypto.randomUUID(), 
      name,
      outfitIds: [],
      itemIds: [], 
    }]);
  };

  return (
    <div className="w-full pb-28">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        
        <button 
          onClick={handleCreateCollection} 
          className="flex flex-col items-center justify-center w-full aspect-[3/4] bg-[#faf6e9]/30 rounded-3xl border-2 border-dashed border-[#d4cbb3] hover:border-[#af925c] hover:bg-white transition-all group p-4"
        >
          <div className="bg-[#e6e2cd] group-hover:bg-[#af925c] p-3 md:p-4 rounded-full transition-colors mb-3">
            <PlusIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-600 group-hover:text-white" />
          </div>
          <span className="text-[#af925c] font-medium text-sm md:text-base text-center">
            Crear Nueva<br/>Colección
          </span>
        </button>

        {collections.map((collection) => {
          const previewOutfits = collection.outfitIds
            .map(id => ({ type: 'outfit' as const, data: OutfitsData.find(o => o.id === id) }))
            .filter(o => o.data !== undefined);
            
          const previewItems = collection.itemIds
            .map(id => ({ type: 'item' as const, data: Items.find(i => i.id === id) }))
            .filter(i => i.data !== undefined);

          const mixedPreview = [...previewOutfits, ...previewItems].slice(0, 4);
          const displaySlots = [...mixedPreview, null, null, null, null].slice(0, 4);

          return (
            <Link 
              key={collection.id} 
              href={`/wardrobe/collections/${collection.id}`} 
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all p-3 aspect-[3/4]"
            >
              <div className="grid grid-cols-2 grid-rows-2 gap-1.5 w-full aspect-square mb-3 rounded-xl overflow-hidden bg-[#e6e2cd]/10">
                {displaySlots.map((slot, idx) => (
                  <div key={idx} className="bg-[#faf6e9]/40 relative w-full h-full flex items-center justify-center">
                    {slot ? (
                      slot.type === 'outfit' ? (
                        <OutfitRenderer outfit={slot.data as any} />
                      ) : (
                        <img src={(slot.data as any).imageUrl} alt="item" className="w-full h-full object-contain p-1 drop-shadow-sm" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <PlusIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-1">{collection.name}</h3>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {collection.outfitIds.length} Outfits • {collection.itemIds.length} Prendas
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}