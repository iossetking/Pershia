'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { type Garment, API_BASE_URL } from '@/features/garments/api/garments'

function garmentImageUrl(s3_url: string) {
  return `${API_BASE_URL}/${s3_url}`
}

function ItemDetailModal({ item, onClose }: { item: Garment; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        {/* Image */}
        <div className="md:w-5/12 bg-gray-100 flex-shrink-0">
          <img
            src={garmentImageUrl(item.s3_url)}
            alt={item.category}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="md:w-7/12 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              {item.category}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight capitalize">
              {item.style} {item.category}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Color</span>
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium capitalize">
              {item.color}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Fabric</span>
            <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-medium capitalize">
              {item.fabric}
            </span>
          </div>

          {item.description && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Description
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}

interface CosItemsProps {
  garments: Garment[]
  isLoading: boolean
  activecategory: string
}

export default function CosItems({ garments, isLoading, activecategory }: CosItemsProps) {
  const [selectedItem, setSelectedItem] = useState<Garment | null>(null)

  const filtered = activecategory === 'All'
    ? garments
    : garments.filter(g => g.category === activecategory)

  if (isLoading) {
    return (
      <div className="mt-6 columns-[150px] md:columns-[250px] gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4 rounded-2xl overflow-hidden bg-gray-100 animate-pulse"
            style={{ height: `${180 + (i % 3) * 60}px` }} />
        ))}
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-4xl">👕</span>
        <p className="text-sm">No items yet. Upload your first garment!</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="columns-[150px] md:columns-[250px] gap-4">
        {filtered.map((item) => (
          <div
            key={item.garment_id}
            onClick={() => setSelectedItem(item)}
            className="break-inside-avoid mb-4 rounded-2xl overflow-hidden cursor-pointer group relative z-10"
          >
            <img
              src={garmentImageUrl(item.s3_url)}
              alt={item.category}
              className="w-full object-cover rounded-xl transition-transform duration-300 md:group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}
