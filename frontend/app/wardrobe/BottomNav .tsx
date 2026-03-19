'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Item', href: '/wardrobe/items' },
  { name: 'Outfit', href: '/wardrobe/outfits' },
  { name: 'Collections', href: '/wardrobe/collections' },
] // Direcciones de los botones del menú inferior

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function BottomNav () {
  // Esto detecta en qué URL estás a
  const pathname = usePathname()
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-[#E6E2CD] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] rounded-t-3xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around">
        {navigation.map((item) => {
          // Comprobamos si la ruta actual coincide con el href del botón
          const isCurrent = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isCurrent
                  ? 'bg-[#AAA38E] text-[#2F2020] ' // Color si está seleccionado
                  : 'bg-[#D4CAAF] text-[#2F2020] hover:bg-white/20', // Color normal
                'rounded-3xl px-3 py-2 text-center w-26 font-medium transition-colors'
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  )
}