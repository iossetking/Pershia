'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import OutfitRenderer from '../outfits/OutfitRenderer';
import { useCollections, useCreateCollection } from '@/features/collections/hooks/useCollections';
import { useOutfits } from '@/features/outfits/hooks/useOutfits';
import { useGarments } from '@/features/garments/hooks/useGarments';
import { API_BASE_URL } from '@/features/garments/api/garments';
import type { Outfit } from '@/features/outfits/api/outfits';
import type { Garment } from '@/features/garments/api/garments';

// ── Create Collection Modal ───────────────────────────────────────────────────

type ModalTab = 'outfits' | 'garments';

function CreateCollectionModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState<ModalTab>('outfits');
  const [selectedOutfitIds, setSelectedOutfitIds] = useState<Set<number>>(new Set());
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<Set<number>>(new Set());

  const { data: outfits = [] } = useOutfits();
  const { data: garments = [] } = useGarments();
  const createCollection = useCreateCollection();

  const toggleOutfit = (id: number) => {
    setSelectedOutfitIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleGarment = (id: number) => {
    setSelectedGarmentIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createCollection.mutateAsync({
      title: title.trim(),
      outfit_ids: Array.from(selectedOutfitIds),
      garment_ids: Array.from(selectedGarmentIds),
    });
    onClose();
  };

  const totalSelected = selectedOutfitIds.size + selectedGarmentIds.size;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '92dvh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Nueva Colección</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Name input */}
        <div className="px-5 pt-4 pb-2">
          <input
            autoFocus
            type="text"
            placeholder="Nombre de la colección…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          />
        </div>

        {/* Tabs */}
        <div className="flex px-5 gap-2 pb-3">
          {(['outfits', 'garments'] as ModalTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab === 'outfits' ? 'Outfits' : 'Prendas'}
              {tab === 'outfits' && selectedOutfitIds.size > 0 && (
                <span className="ml-1.5 bg-white text-gray-800 rounded-full px-1.5 py-0.5 text-xs">
                  {selectedOutfitIds.size}
                </span>
              )}
              {tab === 'garments' && selectedGarmentIds.size > 0 && (
                <span className="ml-1.5 bg-white text-gray-800 rounded-full px-1.5 py-0.5 text-xs">
                  {selectedGarmentIds.size}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">
          {activeTab === 'outfits' && (
            outfits.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No hay outfits aún.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {outfits.map((outfit: Outfit) => {
                  const selected = selectedOutfitIds.has(outfit.outfit_id);
                  return (
                    <button
                      key={outfit.outfit_id}
                      onClick={() => toggleOutfit(outfit.outfit_id)}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${
                        selected ? 'border-gray-800 shadow-md' : 'border-transparent'
                      }`}
                    >
                      <div className="w-full h-full bg-gray-100">
                        <OutfitRenderer outfit={outfit} garments={garments} />
                      </div>
                      {selected && (
                        <div className="absolute top-1.5 right-1.5 bg-gray-800 rounded-full p-0.5">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-2 pb-1.5">
                        <p className="text-white text-[10px] font-semibold truncate">{outfit.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'garments' && (
            garments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No hay prendas aún.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {garments.map((garment: Garment) => {
                  const selected = selectedGarmentIds.has(garment.garment_id);
                  return (
                    <button
                      key={garment.garment_id}
                      onClick={() => toggleGarment(garment.garment_id)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all bg-gray-100 ${
                        selected ? 'border-gray-800 shadow-md' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={`${API_BASE_URL}/${garment.s3_url}`}
                        alt={garment.category}
                        className="w-full h-full object-contain p-1"
                      />
                      {selected && (
                        <div className="absolute top-1.5 right-1.5 bg-gray-800 rounded-full p-0.5">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={handleCreate}
            disabled={!title.trim() || createCollection.isPending}
            className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl py-3 text-sm transition-colors"
          >
            {createCollection.isPending
              ? 'Creando…'
              : `Crear colección${totalSelected > 0 ? ` · ${totalSelected} elementos` : ''}`}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Collections List ──────────────────────────────────────────────────────────

export default function CollectionsList() {
  const [showModal, setShowModal] = useState(false);
  const { data: collections = [], isLoading } = useCollections();
  const { data: outfits = [] } = useOutfits();
  const { data: garments = [] } = useGarments();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-3xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full pb-28">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

        <button
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center justify-center w-full aspect-[3/4] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-white transition-all group p-4"
        >
          <div className="bg-gray-200 group-hover:bg-gray-300 p-3 md:p-4 rounded-full transition-colors mb-3">
            <PlusIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-600 group-hover:text-white" />
          </div>
          <span className="text-gray-700 font-medium text-sm md:text-base text-center">
            Crear Nueva<br />Colección
          </span>
        </button>

        {collections.map(collection => {
          const previewOutfits = collection.outfit_ids
            .map(id => outfits.find(o => o.outfit_id === id))
            .filter(Boolean) as Outfit[];

          const previewGarments = collection.garment_ids
            .map(id => garments.find(g => g.garment_id === id))
            .filter(Boolean) as Garment[];

          const slots = [
            ...previewOutfits.map(o => ({ type: 'outfit' as const, data: o })),
            ...previewGarments.map(g => ({ type: 'garment' as const, data: g })),
            null, null, null, null,
          ].slice(0, 4);

          return (
            <Link
              key={collection.collection_id}
              href={`/wardrobe/collections/${collection.collection_id}`}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all p-3 aspect-[3/4]"
            >
              <div className="grid grid-cols-2 grid-rows-2 gap-1.5 w-full aspect-square mb-3 rounded-xl overflow-hidden bg-gray-100">
                {slots.map((slot, idx) => (
                  <div key={idx} className="bg-white relative w-full h-full flex items-center justify-center">
                    {slot ? (
                      slot.type === 'outfit' ? (
                        <OutfitRenderer outfit={slot.data} garments={garments} />
                      ) : (
                        <img
                          src={`${API_BASE_URL}/${slot.data.s3_url}`}
                          alt={slot.data.category}
                          className="w-full h-full object-contain p-1 drop-shadow-sm"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <PlusIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-1">{collection.title}</h3>
                <span className="text-xs text-gray-400 mt-1">
                  {collection.outfit_ids.length} Outfits · {collection.garment_ids.length} Prendas
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {showModal && <CreateCollectionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
