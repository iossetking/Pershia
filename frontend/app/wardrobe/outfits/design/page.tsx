'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Wardrobe from './Wardrobe';
import Canvas, { CanvasItem } from './Canvas';
import MobileAddButton from './AddButton';
import { useCreateOutfit } from '@/features/outfits/hooks/useOutfits';

function SaveModal({ onConfirm, onCancel, isPending }: {
  onConfirm: (title: string, description: string) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Guardar outfit</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-700"><XMarkIcon className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Nombre *</label>
            <input
              autoFocus
              type="text"
              placeholder="Mi outfit favorito"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && title.trim() && onConfirm(title.trim(), description.trim())}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Descripción <span className="normal-case font-normal">(opcional)</span></label>
            <textarea
              placeholder="Un look relajado para el día a día..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors resize-none"
            />
          </div>
        </div>

        <button
          onClick={() => title.trim() && onConfirm(title.trim(), description.trim())}
          disabled={!title.trim() || isPending}
          className="w-full bg-gray-800 text-white py-3 rounded-2xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          <SparklesIcon className="w-4 h-4" />
          {isPending ? 'Guardando...' : 'Guardar outfit'}
        </button>
      </div>
    </div>
  );
}

export default function DesignOutfitPage() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const createOutfit = useCreateOutfit();
  const router = useRouter();

  const addItemToCanvas = useCallback((itemId: number) => {
    setCanvasItems(prev => [
      ...prev,
      { instanceId: `${itemId}_${Date.now()}`, itemId, x: 50, y: 50, width: 150, zIndex: maxZIndex + 1 },
    ]);
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  const removeItemFromCanvas = useCallback((instanceId: string) => {
    setCanvasItems(prev => prev.filter(item => item.instanceId !== instanceId));
  }, []);

  const handleSave = useCallback(async (title: string, description: string) => {
    const canvasEl = document.getElementById('design-canvas');
    if (!canvasEl || canvasItems.length === 0) return;

    const w = canvasEl.offsetWidth;
    const h = canvasEl.offsetHeight;

    // Deduplicate by garment_id — last occurrence wins
    const seen = new Map<number, typeof canvasItems[0]>();
    for (const item of canvasItems) seen.set(item.itemId, item);

    const garments = Array.from(seen.values()).map(item => ({
      garment_id: item.itemId,
      pos_top: parseFloat(((item.y / h) * 100).toFixed(2)),
      pos_left: parseFloat(((item.x / w) * 100).toFixed(2)),
      pos_scale: parseFloat(((item.width / w) * 100).toFixed(2)),
      pos_z_index: item.zIndex,
    }));

    await createOutfit.mutateAsync({ title, description: description || undefined, garments });
    setShowSaveModal(false);
    router.push('/wardrobe/outfits');
  }, [canvasItems, createOutfit, router]);

  return (
    <div className="h-[calc(100dvh-168px)] p-4 flex flex-col overflow-hidden w-full relative">
      <div className="flex items-center justify-between pb-2 shrink-0">
        <Link href="/wardrobe/outfits" className="flex items-center gap-2 text-gray-600 hover:text-gray-700">
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="hidden md:inline">Volver</span>
        </Link>
        <button
          onClick={() => canvasItems.length > 0 && setShowSaveModal(true)}
          disabled={canvasItems.length === 0}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-md hover:bg-gray-800 transition-all duration-300 text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed"
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
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsWardrobeOpen(false)} />
        )}
        <div className={`
          fixed inset-x-0 bottom-0 z-50 h-[85vh] transition-transform duration-300 ease-in-out rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
          lg:relative lg:inset-auto lg:h-full lg:w-[60%] lg:flex lg:translate-y-0 lg:shadow-none lg:rounded-none
          ${isWardrobeOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <Wardrobe onAddItem={addItemToCanvas} onCloseMobile={() => setIsWardrobeOpen(false)} />
        </div>
      </div>

      {showSaveModal && (
        <SaveModal
          onConfirm={handleSave}
          onCancel={() => setShowSaveModal(false)}
          isPending={createOutfit.isPending}
        />
      )}
    </div>
  );
}
