'use client';
import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface MobileAddButtonProps {
  onClick: () => void;
}

export default function MobileAddButton({ onClick }: MobileAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-[999] bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium transition-transform active:scale-95"
    >
      <PlusIcon className="h-5 w-5" />
    </button>
  );
}