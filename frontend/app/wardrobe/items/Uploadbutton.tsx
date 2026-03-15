import React, { useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Aquí puedes procesar los archivos seleccionados
      console.log('Archivos seleccionados:', Array.from(files).map(file => file.name));
      for (let i = 0; i < files.length; i++) {
        console.log(`Archivo ${i + 1}: ${files[i].name} (${files[i].size} bytes)`);
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <button
        onClick={handleUpload}
        className="fixed bottom-15 right-6 bg-[#af925c] p-3 rounded-full text-white shadow-lg z-50 hover:bg-[#82745b] transition-colors"
        aria-label="Subir elemento"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </>
    );
} 
