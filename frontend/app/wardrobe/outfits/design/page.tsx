'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline'; 
import Wardrobe from './Wardrobe';
import Canvas, { CanvasItem } from './Canvas'; 
import MobileAddButton from './AddButton'; 

export default function DesignOutfitPage() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);

  const addItemToCanvas = useCallback((itemId: number) => {
    setCanvasItems((prev) => [
      ...prev,
      {
        instanceId: `${itemId}_${Date.now()}`,
        itemId: itemId,
        x: 50,
        y: 50,
        width: 150,
        zIndex: maxZIndex + 1,
      }
    ]);
    setMaxZIndex((prev) => prev + 1);
  }, [maxZIndex]);

  const removeItemFromCanvas = useCallback((instanceIdToRemove: string) => {
    setCanvasItems((prev) => prev.filter(item => item.instanceId !== instanceIdToRemove));
  }, []);

  const handleSaveOutfit = useCallback(() => {
    const canvasElement = document.getElementById('design-canvas');
    if (!canvasElement) return;

    const canvasWidth = canvasElement.offsetWidth;
    const canvasHeight = canvasElement.offsetHeight;

    const endOutfitData = canvasItems.map(item => ({
      itemId: item.itemId,
      top: parseFloat(((item.y / canvasHeight) * 100).toFixed(2)),
      left: parseFloat(((item.x / canvasWidth) * 100).toFixed(2)),
      scale: parseFloat(((item.width / canvasWidth) * 100).toFixed(2)),
      zIndex: item.zIndex
    }));

    console.log("Datos a subir", JSON.stringify(endOutfitData, null, 2)); 
    alert("Diseño Guardado.");
  }, [canvasItems]);

return (
    <div className="h-[calc(100dvh-120px)] p-4 md:p-4 flex flex-col overflow-hidden w-full relative ">
      <div className="flex items-center justify-between pb-2 shrink-0">
        <Link href="/wardrobe/outfits" className="flex items-center gap-2 text-gray-600 hover:text-gray-700">
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="hidden md:inline">Volver</span>
        </Link> 
        <button 
          onClick={handleSaveOutfit}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-md hover:bg-gray-800 transition-all duration-300 text-sm md:text-base"
        >
          <SparklesIcon className="h-5 w-5" />
          Guardar
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden w-full relative">
        <Canvas 
          canvasItems={canvasItems} 
          setCanvasItems={setCanvasItems}
          maxZIndex={maxZIndex}
          setMaxZIndex={setMaxZIndex}
          onRemoveItem={removeItemFromCanvas}
        />
        <MobileAddButton onClick={() => setIsWardrobeOpen(true)} />
        {isWardrobeOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity" 
            onClick={() => setIsWardrobeOpen(false)} 
          />
        )}
        <div className={`
          fixed inset-x-0 bottom-0 z-50 h-[85vh] transition-transform duration-300 ease-in-out rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
          lg:relative lg:inset-auto lg:h-full lg:w-[60%] lg:flex lg:translate-y-0 lg:shadow-none lg:rounded-none
          ${isWardrobeOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <Wardrobe 
            onAddItem={(id) => {
              addItemToCanvas(id);
            }} 
            onCloseMobile={() => setIsWardrobeOpen(false)}
          />
        </div>

      </div>
    </div>
  );
}
