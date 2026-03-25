import React from 'react';
import CollectionsList from './Collections';

export default function CollectionsPage() {
  return (
    <div className="bg-[#faf6e9]/50 p-4 md:p-6 w-full min-h-[calc(100dvh-80px)]">
      <CollectionsList />
    </div>
  );
}