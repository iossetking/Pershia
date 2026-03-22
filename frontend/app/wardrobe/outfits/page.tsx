import React from 'react';
import ConOutfit from './ConOutfits';
import DesignButton from './DesignButton';

export default function OutfitsPage() {
  return (
    <div className="p-4">
      
      {/* ¡Mira qué limpio queda esto! */}
      <ConOutfit />
      <DesignButton />
    </div>
  );
}