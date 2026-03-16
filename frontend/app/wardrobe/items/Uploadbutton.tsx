import React, { useRef, useState, useEffect } from 'react';
import { PlusIcon, CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';
import PreviewModal from './PreviwModal';

export default function UploadButton() {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Estados de memoria temporal
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para saber si Python esta procesando la imagen
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const mobileCheck = /iPhone|iPad|Android/i.test(navigator.userAgent);
      setIsMobile(mobileCheck);
    }
  }, []);

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
    setIsOpen(false);
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
    setIsOpen(false);
  };

  // Conexión a python y manejo de archivos
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const originalFile = files[0];
      
      // pantalla de procesando
      setIsProcessing(true);

      try {
        {/*
          
          
          AQUÍ VA El CODIGO PARA ENVIAR A PYTHON Y RECIBIR LA IMAGEN PROCESADA
          
          
          */}

        // Simulacion(Borrar cundo este lo de python)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Usaremos la imagen original como prueba.
        // Cuando este lo de python, aquí ira la imagen sin fondo.
        const imageUrlForPreview = URL.createObjectURL(originalFile);
        
        // 3. Guardamos la imagen ( y abrimos el Modal
        setSelectedFile(originalFile); // En el futuro será el 'processedFile'
        setPreviewUrl(imageUrlForPreview);
        setIsModalOpen(true);

      } catch (error) {
        console.error("Error al quitar el fondo:", error);
        alert("Hubo un error al procesar la imagen.");
      } finally {
        // Apagamos la pantalla de carga, ya sea que haya funcionado o fallado
        setIsProcessing(false);
      }
    }
    
    event.target.value = ''; // Limpiamos el input
  };

  const handleCloseModal = () => {// Limpiamos todo el estado relacionado con la imagen y cerramos el modal
    setIsModalOpen(false);
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleConfirmUpload = (file: File) => {// Aquí es donde se guarda la imagen (actualmente solo mostramos un mensaje y cerramos el modal)
    console.log("Archivo SIN FONDO listo para guardarse definitivamente:", file);
    alert(`Imagen confirmada y lista para guardar.`);
    handleCloseModal();
  };

  return (
    <>
      {/* Pantalla de carga */}
      {isProcessing && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white/30 border-t-[#af925c] rounded-full animate-spin mb-4"></div>
          <p className="text-white font-medium text-lg">Quitando el fondo...</p>
        </div>
      )}

      {/* Modal de previsualización */}
      <PreviewModal 
        isOpen={isModalOpen}
        previewUrl={previewUrl}
        file={selectedFile}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUpload}
      />

      {/* Botón flotante */}
      <div className="fixed bottom-15 right-6 z-50 flex flex-col items-end">
        {isOpen && (
          <div className="mb-4 flex flex-col gap-3">
            {isMobile && (
              <button
                onClick={handleCameraClick}
                className="flex items-center justify-end gap-3 bg-white px-4 py-2 rounded-full shadow-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Tomar foto</span>
                <div className="bg-[#af925c] p-2 rounded-full text-white">
                  <CameraIcon className="h-5 w-5" />
                </div>
              </button>
            )}

            <button
              onClick={handleGalleryClick}
              className="flex items-center justify-end gap-3 bg-white px-4 py-2 rounded-full shadow-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium">Elegir de galería</span>
              <div className="bg-[#af925c] p-2 rounded-full text-white">
                <PhotoIcon className="h-5 w-5" />
              </div>
            </button>
          </div>
        )}

        <input type="file" ref={galleryInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" style={{ display: 'none' }} />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#af925c] p-3 rounded-full text-white shadow-lg hover:bg-[#82745b] transition-all duration-300 ease-in-out"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}