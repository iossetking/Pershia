// app/wardrobe/outfits/design/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Rnd } from 'react-rnd';
// Agregamos el XMarkIcon para el botón de eliminar
import { ArrowLeftIcon, PlusCircleIcon, SparklesIcon, BeakerIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Items } from '../../items/ConItem';

interface CanvasItem {
  instanceId: string;
  itemId: number;
  x: number;
  y: number;
  width: number;
  zIndex: number;
}

export default function DesignOutfitPage() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  
  // ESTADO PARA TUS CATEGORÍAS
  const [activeCategory, setActiveCategory] = useState('All');

  // Lógica de Categorías (Adaptada de tu código)
  const extraCategories = Array.from(new Set(Items.map(item => item.category)));
  const categories = ['All', ...extraCategories];
  const itemsFiltrados = activeCategory === 'All' ? Items : Items.filter(item => item.category === activeCategory);

  const addItemToCanvas = (itemId: number) => {
    const newItem: CanvasItem = {
      instanceId: `${itemId}_${Date.now()}`,
      itemId: itemId,
      x: 50,
      y: 50,
      width: 150,
      zIndex: maxZIndex + 1,
    };
    setCanvasItems([...canvasItems, newItem]);
    setMaxZIndex(maxZIndex + 1);
  };

  // NUEVA FUNCIÓN: Eliminar una prenda del lienzo
  const removeItemFromCanvas = (instanceIdToRemove: string) => {
    setCanvasItems(canvasItems.filter(item => item.instanceId !== instanceIdToRemove));
  };

  const handleSaveOutfit = () => {
    // Para calcular los porcentajes, tomamos el tamaño real del contenedor en el momento de guardar
    const canvasElement = document.getElementById('design-canvas');
    if (!canvasElement) return;

    const canvasWidth = canvasElement.offsetWidth;
    const canvasHeight = canvasElement.offsetHeight;

    const finalOutfitData = canvasItems.map(item => ({
      itemId: item.itemId,
      top: parseFloat(((item.y / canvasHeight) * 100).toFixed(2)),
      left: parseFloat(((item.x / canvasWidth) * 100).toFixed(2)),
      scale: parseFloat(((item.width / canvasWidth) * 100).toFixed(2)),
      zIndex: item.zIndex
    }));

    console.log("Datos para copiar en tu outfitsData.ts:", JSON.stringify(finalOutfitData, null, 2));
    alert("¡Diseño Guardado en Consola! Presiona F12 y ve a la pestaña 'Console'.");
  };

  return (
    // min-h-screen y h-screen aseguran que no haya scroll extra en la página completa
    // ✅ CÁMBIALA POR ESTA:
    <div className="h-[calc(100vh-160px)] bg-[#faf6e9]/50 p-4 md:p-6 flex flex-col overflow-hidden w-full">
      
      {/* CABECERA (Fija arriba) */}
      <div className="flex items-center justify-between  pb-2 shrink-0">
        <Link href="/wardrobe/outfits" className="flex items-center gap-2 text-gray-600 hover:text-[#af925c]">
          <ArrowLeftIcon className="h-5 w-5" />
          Volver a Outfits
        </Link>\ 
        <button 
          onClick={handleSaveOutfit}
          className="flex items-center gap-2 bg-[#af925c] text-white px-6 py-3 rounded-full shadow-md hover:bg-[#8d774a] transition-all duration-300"
        >
          <SparklesIcon className="h-5 w-5" />
          Guardar Conjunto
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL: Aquí aplicamos tu lógica de dividir la pantalla */}
      <div className="flex flex-1 gap-6 overflow-hidden w-full">
        
        {/* PANEL IZQUIERDO: ARMARIO (Ocupa exactamente el 40% del ancho) */}
        <div className="w-[60%] flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
          
          <div className="p-4 border-b border-gray-100 bg-white z-10 shrink-0">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Mi Armario</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((category) => {
                const isCurrent = category === activeCategory;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      isCurrent ? 'bg-[#af925c] text-white' : 'bg-[#e6e2cd]/50 text-gray-700 hover:bg-[#e6e2cd]'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* grid-cols-3 funciona excelente aquí porque tenemos el 40% de la pantalla */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {itemsFiltrados.map((item) => (
                <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-square cursor-pointer hover:border-[#af925c] bg-gray-50">
                  <img src={item.imageUrl} alt={item.category} className="w-full h-full object-contain p-2" />
                  <button 
                    onClick={() => addItemToCanvas(item.id)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <PlusCircleIcon className="h-12 w-12 text-white drop-shadow-md" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: EL LIENZO (Ocupa exactamente el 60% del ancho) */}
        <div className="w-[40%] flex justify-center items-center bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-hidden">
          
          {/* EL CANVAS: Toma toda la altura de su contenedor (h-full) y calcula su ancho automático gracias al aspect-[3/4] */}
          <div 
            id="design-canvas"
            className="relative h-full aspect-[3/4] max-w-full bg-[#faf6e9]/30 rounded-2xl border-2 border-dashed border-[#d4cbb3] overflow-hidden"
          >
            <p className="absolute top-4 left-0 w-full text-center text-[#af925c]/60 font-medium pointer-events-none z-0">
              Lienzo de Diseño
            </p>
            
            {canvasItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#af925c]/40 pointer-events-none z-0">
                <BeakerIcon className="h-24 w-24 mb-4 opacity-50" />
                <p className="text-sm font-medium">Toca el icono '+' para agregar prendas aquí</p>
              </div>
            )}

            {canvasItems.map((canvasItem) => {
              const originalItem = Items.find(item => item.id === canvasItem.itemId);
              if (!originalItem) return null;

              return (
                <Rnd
                  key={canvasItem.instanceId}
                  default={{ x: canvasItem.x, y: canvasItem.y, width: canvasItem.width, height: 'auto' }}
                  bounds="parent"
                  onDragStart={() => {
                    const newZ = maxZIndex + 1;
                    setMaxZIndex(newZ);
                    setCanvasItems(items => items.map(i => i.instanceId === canvasItem.instanceId ? { ...i, zIndex: newZ } : i));
                  }}
                  onDragStop={(e, d) => {
                    setCanvasItems(items => items.map(i => i.instanceId === canvasItem.instanceId ? { ...i, x: d.x, y: d.y } : i));
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    setCanvasItems(items => items.map(i => i.instanceId === canvasItem.instanceId ? { ...i, width: parseInt(ref.style.width), ...position } : i));
                  }}
                  lockAspectRatio={true}
                  style={{ zIndex: canvasItem.zIndex }}
                  className="group absolute" 
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={originalItem.imageUrl} 
                      alt={originalItem.category} 
                      className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none" 
                    />
                    
                    <button
                      onPointerDown={(e) => { e.stopPropagation(); removeItemFromCanvas(canvasItem.instanceId); }}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50"
                      title="Quitar prenda"
                    >
                      <XMarkIcon className="h-4 w-4 stroke-2" />
                    </button>

                    <div className="absolute -inset-1 border-2 border-[#af925c]/0 group-hover:border-[#af925c]/40 rounded-lg pointer-events-none transition-colors"></div>
                  </div>
                </Rnd>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}