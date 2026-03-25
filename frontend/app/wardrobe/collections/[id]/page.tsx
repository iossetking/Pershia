'use client'; 
import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { OutfitsData } from '../../outfits/ConOutfits';
import OutfitRenderer from '../../outfits/OutfitRenderer';
import { Items } from '../../items/ConItem'; 
import { CollectionsData } from '../Collections'; 

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const collectionId = resolvedParams.id;

  if (!Array.isArray(CollectionsData)) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 text-center p-6">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error de conexión de datos</h2>
        <p className="text-gray-600">Asegúrate de que CollectionsData esté exportado como <b>export const CollectionsData = [...]</b> en tu archivo Collections.tsx</p>
      </div>
    );
  }

  const currentCollection = CollectionsData.find(col => col.id === collectionId);

  if (!currentCollection) {
    return (
      <div className="min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Colección no encontrada</h2>
        <Link href="/wardrobe/collections" className="bg-[#af925c] text-white px-6 py-2 rounded-full font-medium">
          Volver a mis colecciones
        </Link>
      </div>
    );
  }

  const safeOutfitIds = currentCollection.outfitIds || [];
  const safeItemIds = currentCollection.itemIds || [];

  const collectionOutfits = OutfitsData.filter(outfit => safeOutfitIds.includes(outfit.id));
  const collectionItems = Items.filter(item => safeItemIds.includes(item.id));

  const combinedElements = [
    ...collectionOutfits.map(outfit => ({ type: 'outfit', id: `outfit-${outfit.id}`, data: outfit })),
    ...collectionItems.map(item => ({ type: 'item', id: `item-${item.id}`, data: item }))
  ];

  return (
    <div className="min-h-screen bg-[#faf6e9]/50 p-4 md:p-6 w-full pb-28"> 
      
      <Link href="/wardrobe/collections" className="flex items-center gap-2 text-gray-600 hover:text-[#af925c] w-fit mb-6 transition-colors">
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="font-medium">Volver a Colecciones</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{currentCollection.name}</h1>
        <p className="text-sm text-gray-500 font-medium">
          {combinedElements.length} elementos guardados
        </p>
      </div>

      {combinedElements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">No hay nada en esta colección todavía.</p>
        </div>
      ) : (
        <div className="columns-[150px] md:columns-[250px] gap-4">
          {combinedElements.map((element) => {
            if (element.type === 'outfit') {
              return (
                <div key={element.id} className="break-inside-avoid mb-4 bg-white rounded-3xl p-3 md:p-4 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="relative w-full aspect-[3/4] bg-[#faf6e9]/30 rounded-2xl overflow-hidden border border-gray-50 group-hover:bg-[#faf6e9]/60 transition-colors flex items-center justify-center">
                    <OutfitRenderer outfit={element.data as any} />
                  </div>
                </div>
              );
            } 
            return (
              <div key={element.id} className="break-inside-avoid mb-4 rounded-2xl overflow-hidden cursor-pointer group border border-gray-100 shadow-sm">
                <img
                  src={(element.data as any).imageUrl}
                  alt={(element.data as any).category}
                  className="w-full object-cover rounded-xl transition-transform duration-300 md:group-hover:scale-110" 
                />
              </div>
            );

          })}
        </div>
      )}
    </div>
  );
}