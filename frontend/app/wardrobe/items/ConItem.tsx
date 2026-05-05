'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'

export const Items = [
  {
    id: 1,
    category: 'Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
    name: 'White Oxford Shirt',
    type: 'Camisa casual',
    materials: ['100% Algodón egipcio'],
    description: 'Una camisa clásica de corte recto con cuello oxford. Perfecta para looks casuales o smart-casual. Su tejido transpirable la hace ideal para el día a día.',
    color: 'Blanco',
    brand: 'Uniqlo',
  },
  {
    id: 2,
    category: 'Pants',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80',
    name: 'Slim Chino Pants',
    type: 'Pantalón chino',
    materials: ['98% Algodón', '2% Elastano'],
    description: 'Pantalón de corte slim con ligera elasticidad para mayor comodidad. Versátil y elegante, combina perfectamente con camisas y tenis.',
    color: 'Beige',
    brand: 'Zara',
  },
  {
    id: 3,
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=500&q=80',
    name: 'Retro Sneakers',
    type: 'Tenis retro',
    materials: ['Cuero sintético', 'Suela de goma'],
    description: 'Tenis de estilo retro con diseño chunky. Suela gruesa con amortiguación EVA y forro interior acolchado para máxima comodidad.',
    color: 'Blanco / Gris',
    brand: 'New Balance',
  },
  {
    id: 4,
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80',
    name: 'Bomber Jacket',
    type: 'Chamarra bomber',
    materials: ['Shell: 100% Nylon', 'Relleno: Plumón sintético', 'Forro: Poliéster'],
    description: 'Chamarra bomber ligera con acabado brillante. Ribetes en contraste y bolsillos laterales con cierre. Ideal para temporadas de frío moderado.',
    color: 'Verde oliva',
    brand: 'Alpha Industries',
  },
  {
    id: 5,
    category: 'Hats',
    imageUrl: 'https://i.pinimg.com/1200x/c7/21/59/c72159872c86159bba194a771580ea89.jpg',
    name: 'Bucket Hat',
    type: 'Sombrero bucket',
    materials: ['100% Algodón canvas'],
    description: 'Sombrero estilo bucket con ala corta y uniforme. Ligero y plegable, perfecto para días soleados o looks streetwear.',
    color: 'Negro',
    brand: 'Carhartt WIP',
  },
  {
    id: 6,
    category: 'Accessories',
    imageUrl: 'https://i.pinimg.com/1200x/3c/55/86/3c558695b739a5b0860aa656bd80f0f1.jpg',
    name: 'Leather Belt',
    type: 'Cinturón de piel',
    materials: ['Cuero genuino', 'Hebilla de zinc'],
    description: 'Cinturón de piel genuina con costura decorativa. Hebilla plateada de zinc pulido. Ancho estándar de 35mm, compatible con la mayoría de presillas.',
    color: 'Café oscuro',
    brand: 'Fossil',
  },
  {
    id: 7,
    category: 'Scarves',
    imageUrl: 'https://i.pinimg.com/1200x/68/a8/4d/68a84d24707f1ec7445a321d949661e6.jpg',
    name: 'Wool Plaid Scarf',
    type: 'Bufanda de lana',
    materials: ['70% Lana merino', '30% Acrílico'],
    description: 'Bufanda de cuadros escoceses en lana merino suave. Extra larga para múltiples estilos de anudado. Cálida sin ser pesada.',
    color: 'Rojo / Negro',
    brand: 'Acne Studios',
  },
  {
    id: 8,
    category: 'Shirts',
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',
    name: 'Graphic Tee',
    type: 'Camiseta gráfica',
    materials: ['100% Algodón peinado'],
    description: 'Camiseta de cuello redondo con estampado gráfico en serigrafía. Corte oversize para un look relajado y moderno.',
    color: 'Negro',
    brand: 'Supreme',
  },
  {
    id: 9,
    category: 'Pants',
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',
    name: 'Cargo Pants',
    type: 'Pantalón cargo',
    materials: ['65% Poliéster', '35% Algodón'],
    description: 'Pantalón cargo con bolsillos laterales con solapa. Cintura ajustable con cordón. Ideal para looks utilitarios y streetwear.',
    color: 'Caqui',
    brand: 'Dickies',
  },
  {
    id: 10,
    category: 'Shoes',
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',
    name: 'Chelsea Boots',
    type: 'Botas Chelsea',
    materials: ['Cuero genuino', 'Elástico lateral', 'Suela de cuero'],
    description: 'Botas Chelsea clásicas de cuero liso con elástico lateral en tono contraste. Punta afilada y suela de cuero con costura Blake.',
    color: 'Negro',
    brand: 'Dr. Martens',
  },
]

type Item = typeof Items[0]

// ── Portal Modal: se monta directo en document.body para escapar cualquier overflow ──
function ItemDetailModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Bloquear scroll del body mientras el modal está abierto
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
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
        {/* Imagen - izquierda */}
        <div className="md:w-5/12 bg-gray-100 flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* Info - derecha */}
        <div className="md:w-7/12 p-6 flex flex-col gap-4 overflow-y-auto">

          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              {item.category}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{item.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{item.brand}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tipo</span>
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium">
              {item.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Color</span>
            <span className="text-sm text-gray-700 font-medium">{item.color}</span>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
              Materiales
            </span>
            <div className="flex flex-wrap gap-2">
              {item.materials.map((mat, i) => (
                <span key={i} className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {mat}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Descripción
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
          </div>

        </div>
      </div>
    </div>
  )

  // Usamos portal para montar el modal en document.body,
  // escapando cualquier contenedor con overflow o transform
  if (!mounted) return null
  return createPortal(modalContent, document.body)
}

interface CosItemsProps {
  activecategory: string;
}

export default function CosItems({ activecategory }: CosItemsProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const itemsFils = activecategory === 'All'
    ? Items
    : Items.filter(item => item.category === activecategory)

  return (
    <div className="mt-6">
      <div className="columns-[150px] md:columns-[250px] gap-4">
        {itemsFils.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="break-inside-avoid mb-4 rounded-2xl overflow-hidden cursor-pointer group relative z-10"
            style={{ pointerEvents: 'all' }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full object-cover rounded-xl transition-transform duration-300 md:group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}