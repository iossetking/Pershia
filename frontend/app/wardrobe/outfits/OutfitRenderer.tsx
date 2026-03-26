// app/wardrobe/outfits/OutfitRenderer.tsx
import React from 'react';
import { Items } from '../items/ConItem';
import { OutfitType } from './ConOutfits';

interface OutfitRendererProps {
  outfit: OutfitType;
}

export default function OutfitRenderer({ outfit }: OutfitRendererProps) {
  if (!outfit || !outfit.elements) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {outfit.elements.map((element, index) => {
        const itemData = Items.find(i => i.id === element.itemId);
        if (!itemData) return null;
        return (
          <img
            key={index}
            src={itemData.imageUrl}
            alt={itemData.category}
            className="absolute object-contain drop-shadow-sm"
            style={{
              top: `${element.top}%`,
              left: `${element.left}%`,
              width: `${element.scale}%`,
              zIndex: element.zIndex,
            }}
          />
        );
      })}
    </div>
  );
}