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
    <div className=" p-4 rounded-t-3xl w-full">
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
                'rounded-3xl px-3 py-2 text-sm font-medium transition-colors'
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