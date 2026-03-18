import React from 'react';
import { Items } from '../items/ConItem'; 

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
  elements: OutfitElement[];
}

export const OutfitsData: OutfitType[] = [ //
  {
    id: 'outfit-casual',
    name: 'Look Casual',
    elements: [
      { itemId: 1, top: 0, left: 10, scale: 80, zIndex: 1 },  
      { itemId: 2, top: 40, left: 10, scale: 80, zIndex: 2 }, 
      { itemId: 3, top: 75, left: 50, scale: 40, zIndex: 3 }, 
    ]
  },
  {
    id: 'outfit-accesorios',
    name: 'Con Accesorios',
    elements: [
      { itemId: 4, top: 5, left: 5, scale: 90, zIndex: 2 },   
      { itemId: 9, top: 50, left: 10, scale: 80, zIndex: 1 }, 
      { itemId: 6, top: -5, left: 60, scale: 30, zIndex: 3 }, 
    ]
  },
  {
    id: 'outfit-1',
    name: 'Con Accesorios',
    elements: [
      { itemId: 4, top: 5, left: 5, scale: 90, zIndex: 2 },   
      { itemId: 9, top: 50, left: 10, scale: 80, zIndex: 1 }, 
      { itemId: 6, top: -5, left: 60, scale: 30, zIndex: 3 }, 
    ]
  },
    {
    id: 'outfit-2',
    name: 'Con Accesorios',
    elements: [
      { itemId: 4, top: 5, left: 5, scale: 90, zIndex: 2 },   
      { itemId: 9, top: 50, left: 10, scale: 80, zIndex: 1 }, 
      { itemId: 6, top: -5, left: 60, scale: 30, zIndex: 3 }, 
    ]
  },
    {
    id: 'outfit-3',
    name: 'Con Accesorios',
    elements: [
      { itemId: 4, top: 5, left: 5, scale: 90, zIndex: 2 },   
      { itemId: 9, top: 50, left: 10, scale: 80, zIndex: 1 }, 
      { itemId: 6, top: -5, left: 60, scale: 30, zIndex: 3 }, 
    ]
  },
    {
    id: 'outfit-4',
    name: 'Con Accesorios',
    elements: [
      { itemId: 4, top: 5, left: 5, scale: 90, zIndex: 2 },   
      { itemId: 9, top: 50, left: 10, scale: 80, zIndex: 1 }, 
      { itemId: 6, top: -5, left: 60, scale: 30, zIndex: 3 }, 
    ]
  },
    {
    id: 'outfit-5',
    name: 'Con Accesorios',
    elements: [
      { itemId: 4, top: 5, left: 5, scale: 90, zIndex: 2 },   
      { itemId: 9, top: 50, left: 10, scale: 80, zIndex: 1 }, 
      { itemId: 6, top: -5, left: 60, scale: 30, zIndex: 3 }, 
    ]
  }

];

// 3. EL COMPONENTE PRINCIPAL
export default function ConOutfit() {
  return (
    <div className="mt-6">
      <div className="columns-[150px] md:columns-[250px] gap-4">
        
        {OutfitsData.map((outfit) => (
          <div 
            key={outfit.id} 
            className="break-inside-avoid mb-4 rounded-2xl overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative w-full aspect-[3/4] bg-[#e6e2cd]/30">
              
              {outfit.elements.map((element, index) => {
                const itemReal = Items.find(item => item.id === element.itemId);
                
                if (!itemReal) return null;

                return (
                  <img
                    key={index}
                    src={itemReal.imageUrl}
                    alt={`Item ${element.itemId}`}
                    className="absolute object-contain drop-shadow-sm transition-transform duration-300 md:group-hover:scale-110"
                    style={{
                      top: `${element.top}%`,
                      left: `${element.left}%`,
                      width: `${element.scale}%`,
                      zIndex: element.zIndex
                    }}
                  />
                );
              })}
            </div>
            
            <div className="p-3 text-center border-t border-[#e6e2cd]">
              <span className="text-sm font-medium text-gray-800">{outfit.name}</span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}