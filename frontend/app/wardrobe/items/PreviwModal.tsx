import React from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

// Definimos qué datos necesita recibir este componente desde afuera
interface PreviewModalProps {
  isOpen: boolean;
  previewUrl: string | null;
  file: File | null;
  onClose: () => void;
  onConfirm: (file: File) => void;
}

export default function PreviewModal({ isOpen, previewUrl, file, onClose, onConfirm }: PreviewModalProps) {
  // Si no está abierto o no hay imagen, no renderizamos nada
  if (!isOpen || !previewUrl || !file) return null;

  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">¿Subir esta prenda?</h3>
        
        {/* Previsualización de la imagen */}
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-6 bg-gray-100 shadow-inner">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex w-full gap-4">
          <button 
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(file)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-gray-700 text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            <CheckIcon className="w-5 h-5" />
            Subir
          </button>
        </div>
      </div>
    </div>
  );
}