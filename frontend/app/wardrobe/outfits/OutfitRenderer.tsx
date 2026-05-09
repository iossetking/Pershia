import React from 'react';
import { type Garment, API_BASE_URL } from '@/features/garments/api/garments';
import { type Outfit } from '@/features/outfits/api/outfits';

interface OutfitRendererProps {
  outfit: Outfit;
  garments: Garment[];
}

export default function OutfitRenderer({ outfit, garments }: OutfitRendererProps) {
  if (!outfit?.garments?.length) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {outfit.garments.map((el, index) => {
        const garment = garments.find(g => g.garment_id === el.garment_id);
        if (!garment) return null;
        return (
          <img
            key={index}
            src={`${API_BASE_URL}/${garment.s3_url}`}
            alt={garment.category}
            className="absolute object-contain drop-shadow-sm"
            style={{
              top: `${el.pos_top}%`,
              left: `${el.pos_left}%`,
              width: `${el.pos_scale}%`,
              zIndex: el.pos_z_index,
            }}
          />
        );
      })}
    </div>
  );
}
