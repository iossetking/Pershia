import React from 'react';
import ConOutfit from './ConOutfits';
import DesignButton from './DesignButton';
import RecommendButton from './RecommendButton';

export default function OutfitsPage() {
  return (
    <div className="p-4">
      <ConOutfit />
      <RecommendButton />
      <DesignButton />
    </div>
  );
}