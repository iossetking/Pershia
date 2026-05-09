import React from 'react';
import { type Garment, API_BASE_URL } from '@/features/garments/api/garments';
import { OutfitType } from './ConOutfits';

interface OutfitRendererProps {
  outfit: OutfitType;
  garments: Garment[];
}

export default function OutfitRenderer({ outfit, garments }: OutfitRendererProps) {
  if (!outfit?.elements) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {outfit.elements.map((element, index) => {
        const garment = garments.find(g => g.garment_id === element.itemId);
        if (!garment) return null;
        return (
          <img
            key={index}
            src={`${API_BASE_URL}/${garment.s3_url}`}
            alt={garment.category}
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
