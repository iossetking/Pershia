'use client';
import React, { useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Items } from '../../items/ConItem'; 

export interface CanvasItem {
  instanceId: string;
  itemId: number;
  x: number;
  y: number;
  width: number;
  zIndex: number;
}

interface CanvasProps {
  canvasItems: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
  maxZIndex: number;
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>;
  onRemoveItem: (instanceId: string) => void;
}

export default function Canvas({ 
  canvasItems, 
  setCanvasItems,
  maxZIndex, 
  setMaxZIndex, 
  onRemoveItem 
}: CanvasProps) {
  
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const itemsMap = useMemo(() => {
    return Items.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<number, typeof Items[0]>);
  }, []);

  return (
    <div className="w-full lg:w-[40%] h-[60vh] lg:h-full flex justify-center items-center bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-hidden shrink-0">
      <div 
        id="design-canvas"
        className="relative h-full aspect-[3/4] max-w-full bg-white/30 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).id === 'design-canvas') {
            setActiveItemId(null);
          }
        }}
      >
        <p className="absolute top-4 left-0 w-full text-center text-gray-400/60 font-medium pointer-events-none z-0">
          Lienzo de Diseño
        </p>
        
        {canvasItems.map((canvasItem) => {
          const originalItem = itemsMap[canvasItem.itemId];
          if (!originalItem) return null;
          
          return (
            <Rnd
              key={canvasItem.instanceId}
              default={{ x: canvasItem.x, y: canvasItem.y, width: canvasItem.width, height: 'auto' }}
              bounds="parent"
              onDragStart={() => {
                setActiveItemId(canvasItem.instanceId);
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
              <div 
                className="relative w-full h-full"
                onPointerDown={() => setActiveItemId(canvasItem.instanceId)}
              >
                <img 
                  src={originalItem.imageUrl} 
                  alt={originalItem.category} 
                  className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none" 
                />
                
                <button
                  onPointerDown={(e) => { 
                    e.stopPropagation(); 
                    onRemoveItem(canvasItem.instanceId); 
                  }}
                  title="Quitar prenda"
                  className={`absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-opacity duration-200 z-50
                    ${activeItemId === canvasItem.instanceId 
                      ? 'opacity-100 pointer-events-auto' 
                      : 'opacity-0 pointer-events-none'
                    }
                    lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto
                  `}
                >
                  <XMarkIcon className="h-4 w-4 stroke-2" />
                </button>
                
                <div className={`absolute -inset-1 border-2 rounded-lg pointer-events-none transition-colors duration-200
                  ${activeItemId === canvasItem.instanceId 
                    ? 'border-gray-400/40' 
                    : 'border-transparent'
                  }
                  lg:border-transparent lg:group-hover:border-gray-400/40
                `}></div>
              </div>
            </Rnd>
          );
        })}
      </div>
    </div>
  );
}