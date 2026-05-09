'use client';
import React, { useState, useMemo } from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useGarments } from '@/features/garments/hooks/useGarments';
import { API_BASE_URL } from '@/features/garments/api/garments';

interface WardrobeProps {
  onAddItem: (itemId: number) => void;
  onCloseMobile?: () => void;
}

export default function Wardrobe({ onAddItem, onCloseMobile }: WardrobeProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: garments = [], isLoading } = useGarments();

  const categories = useMemo(() => {
    const unique = Array.from(new Set(garments.map(g => g.category).filter(Boolean)));
    return ['All', ...unique];
  }, [garments]);

  const filtered = useMemo(() => {
    return activeCategory === 'All'
      ? garments
      : garments.filter(g => g.category === activeCategory);
  }, [garments, activeCategory]);

  return (
    <div className="w-full h-full flex flex-col bg-white lg:rounded-3xl shadow-sm lg:border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-white z-10 shrink-0">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 lg:hidden" />

        <div className="flex items-center justify-between mb-2 lg:hidden">
          <h3 className="font-semibold text-gray-700">Tu Armario</h3>
          <button onClick={onCloseMobile} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === activeCategory ? 'bg-gray-800 text-white' : 'bg-gray-200/50 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
            <span className="text-3xl">👕</span>
            <p className="text-sm">No hay prendas aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((garment) => (
              <div
                key={garment.garment_id}
                onClick={() => {
                  onAddItem(garment.garment_id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-square cursor-pointer hover:border-gray-400 bg-gray-50 transition-colors"
              >
                <img
                  src={`${API_BASE_URL}/${garment.s3_url}`}
                  alt={garment.category}
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlusCircleIcon className="h-12 w-12 text-white drop-shadow-md" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
