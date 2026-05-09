'use client';
import React, { use, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { ArrowLeftIcon, XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import OutfitRenderer from '../../outfits/OutfitRenderer';
import { useCollection } from '@/features/collections/hooks/useCollections';
import { useOutfits } from '@/features/outfits/hooks/useOutfits';
import { useGarments } from '@/features/garments/hooks/useGarments';
import { type Outfit } from '@/features/outfits/api/outfits';
import { type Garment, API_BASE_URL } from '@/features/garments/api/garments';

// ── Garment Detail Modal ──────────────────────────────────────────────────────

function GarmentDetailModal({ garment, onClose }: { garment: Garment; onClose: () => void }) {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
        <div className="md:w-5/12 bg-gray-100 flex-shrink-0">
          <img src={`${API_BASE_URL}/${garment.s3_url}`} alt={garment.category} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="md:w-7/12 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{garment.category}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight capitalize">{garment.style} {garment.category}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Color</span>
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium capitalize">{garment.color}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Fabric</span>
            <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-medium capitalize">{garment.fabric}</span>
          </div>
          {garment.description && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Description</span>
              <p className="text-sm text-gray-600 leading-relaxed">{garment.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Outfit Detail Modal ───────────────────────────────────────────────────────

function OutfitDetailModal({ outfit, garments, onClose }: { outfit: Outfit; garments: Garment[]; onClose: () => void }) {
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const prendas = outfit.garments
    .map(el => garments.find(g => g.garment_id === el.garment_id))
    .filter(Boolean) as Garment[];

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()} style={{ maxHeight: '92vh' }}>
          <div className="md:w-5/12 bg-gray-50 flex-shrink-0 flex items-center justify-center p-4">
            <div className="relative w-full aspect-[3/4]">
              <OutfitRenderer outfit={outfit} garments={garments} />
            </div>
          </div>
          <div className="md:w-7/12 p-6 flex flex-col gap-5 overflow-y-auto">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Outfit</span>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{outfit.title}</h2>
              {outfit.description && <p className="text-sm text-gray-500 leading-relaxed mt-2">{outfit.description}</p>}
            </div>
            {prendas.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-3">Prendas del outfit</span>
                <div className="flex flex-col gap-2">
                  {prendas.map(garment => (
                    <button key={garment.garment_id} onClick={() => setSelectedGarment(garment)}
                      className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 rounded-2xl p-2 pr-4 transition-colors group text-left">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                        <img src={`${API_BASE_URL}/${garment.s3_url}`} alt={garment.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate capitalize">{garment.style} {garment.category}</p>
                        <p className="text-xs text-gray-400 capitalize">{garment.color}</p>
                      </div>
                      <ChevronLeftIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 rotate-180 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedGarment && <GarmentDetailModal garment={selectedGarment} onClose={() => setSelectedGarment(null)} />}
    </>,
    document.body
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const collectionId = parseInt(resolvedParams.id, 10);

  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);

  const { data: collection, isLoading } = useCollection(collectionId);
  const { data: allOutfits = [] } = useOutfits();
  const { data: allGarments = [] } = useGarments();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 w-full">
        <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse mb-6" />
        <div className="h-10 w-64 bg-gray-100 rounded-full animate-pulse mb-8" />
        <div className="columns-[150px] md:columns-[250px] gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="break-inside-avoid mb-4 rounded-2xl bg-gray-100 animate-pulse" style={{ height: `${180 + (i % 3) * 60}px` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Colección no encontrada</h2>
        <Link href="/wardrobe/collections" className="bg-gray-800 text-white px-6 py-2.5 rounded-full font-semibold text-sm">
          Volver a Colecciones
        </Link>
      </div>
    );
  }

  const collectionOutfits = collection.outfit_ids
    .map(id => allOutfits.find(o => o.outfit_id === id))
    .filter(Boolean) as Outfit[];

  const collectionGarments = collection.garment_ids
    .map(id => allGarments.find(g => g.garment_id === id))
    .filter(Boolean) as Garment[];

  const combinedElements = [
    ...collectionOutfits.map(o => ({ type: 'outfit' as const, id: `outfit-${o.outfit_id}`, data: o })),
    ...collectionGarments.map(g => ({ type: 'garment' as const, id: `garment-${g.garment_id}`, data: g })),
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 w-full pb-28">
      <Link href="/wardrobe/collections" className="flex items-center gap-2 text-gray-600 hover:text-gray-700 w-fit mb-6 transition-colors">
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="font-medium">Volver a Colecciones</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{collection.title}</h1>
        {collection.description && (
          <p className="text-sm text-gray-500 mb-2">{collection.description}</p>
        )}
        <p className="text-sm text-gray-400 font-medium">{combinedElements.length} elementos</p>
      </div>

      {combinedElements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">No hay nada en esta colección todavía.</p>
        </div>
      ) : (
        <div className="columns-[150px] md:columns-[250px] gap-4">
          {combinedElements.map(element => {
            if (element.type === 'outfit') {
              const outfit = element.data as Outfit;
              return (
                <div
                  key={element.id}
                  onClick={() => setSelectedOutfit(outfit)}
                  className="break-inside-avoid mb-4 bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="relative w-full aspect-[3/4] bg-gray-100/30 rounded-2xl overflow-hidden">
                    <OutfitRenderer outfit={outfit} garments={allGarments} />
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mt-2 px-1 truncate">{outfit.title}</p>
                </div>
              );
            }
            const garment = element.data as Garment;
            return (
              <div
                key={element.id}
                onClick={() => setSelectedGarment(garment)}
                className="break-inside-avoid mb-4 rounded-2xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm group"
              >
                <img
                  src={`${API_BASE_URL}/${garment.s3_url}`}
                  alt={garment.category}
                  className="w-full object-cover rounded-xl transition-transform duration-300 md:group-hover:scale-105"
                />
              </div>
            );
          })}
        </div>
      )}

      {selectedOutfit && (
        <OutfitDetailModal outfit={selectedOutfit} garments={allGarments} onClose={() => setSelectedOutfit(null)} />
      )}
      {selectedGarment && (
        <GarmentDetailModal garment={selectedGarment} onClose={() => setSelectedGarment(null)} />
      )}
    </div>
  );
}
