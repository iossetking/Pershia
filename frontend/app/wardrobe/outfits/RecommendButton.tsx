'use client';
import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import RecommendModal from './RecommendModal';

export default function RecommendButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-36 right-6 bg-gray-800 p-3 rounded-full text-white shadow-lg z-50 hover:bg-gray-900 transition-all duration-300 group"
        aria-label="Get outfit recommendation"
      >
        <SparklesIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
          Outfit Recommendation
        </span>
      </button>

      {open && <RecommendModal onClose={() => setOpen(false)} />}
    </>
  );
}
