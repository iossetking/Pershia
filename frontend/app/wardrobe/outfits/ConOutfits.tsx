import React from 'react';
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
  elements: OutfitElement[];
}

export const OutfitsData: OutfitType[] = [ 
  {
    id: 'outfit-casual',
    elements: [
      { itemId: 1, top: 0, left: 10, scale: 80, zIndex: 1 },  
      { itemId: 2, top: 40, left: 10, scale: 80, zIndex: 2 }, 
      { itemId: 3, top: 75, left: 50, scale: 40, zIndex: 3 }, 
    ]
  },
  {
    id: 'outfit-accesorios',
    elements: [
      { itemId: 4, top: 5, left: 5, scale: 90, zIndex: 2 },   
      { itemId: 9, top: 50, left: 10, scale: 80, zIndex: 1 }, 
      { itemId: 6, top: -5, left: 60, scale: 30, zIndex: 3 }, 
    ]
  },
  {
    id: 'outfit-elegante',
    elements: [
      { itemId: 7, top: 0, left: 15, scale: 85, zIndex: 1 },
      { itemId: 8, top: 45, left: 15, scale: 85, zIndex: 2 },
      { itemId: 10, top: 80, left: 55, scale: 35, zIndex: 3 },
    ]
  },
  {
    id: 'outfit-elegante2',
    elements: [
      { itemId: 7, top: 0, left: 15, scale: 85, zIndex: 1 },
      { itemId: 8, top: 45, left: 15, scale: 85, zIndex: 2 },
      { itemId: 5, top: 80, left: 55, scale: 35, zIndex: 3 },
    ]
  },
  {
    id: 'outfit-elegante3',
    elements: [
      { itemId: 7, top: 0, left: 15, scale: 85, zIndex: 1 },
      { itemId: 3, top: 45, left: 15, scale: 85, zIndex: 2 },
      { itemId: 10, top: 80, left: 55, scale: 35, zIndex: 3 },
    ]
  },
];
export default function ConOutfit() {
  return (
    <div className="mt-6 pb-28">
      <div className="flex flex-wrap gap-4 justify-start">
        
        {OutfitsData.map((outfit) => (
          <div 
            key={outfit.id} 
            className="w-[160px] md:w-[250px] lg:w-[280px] shrink-0 rounded-2xl overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-2"
          >
            <div className="relative w-full aspect-[3/4] bg-gray-100/40 rounded-xl overflow-hidden group-hover:bg-gray-100/70 transition-colors">
              <OutfitRenderer outfit={outfit} />
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}