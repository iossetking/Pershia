'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Item', href: '/wardrobe/items' },
  { name: 'Outfit', href: '/wardrobe/outfits' },
  { name: 'Collections', href: '/wardrobe/collections' },
] 

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center bg-[#E4D7B5] pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 ">
      <div className="flex justify-center gap-3 w-full max-w-[400px] px-4">
        {navigation.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isCurrent
                  ? 'bg-[#AAA38E] text-[#2F2020]' 
                  : 'bg-[#D4CAAF] text-[#2F2020] hover:bg-white/20',
                'rounded-3xl py-2 text-center font-medium transition-colors shadow-sm flex-1 flex items-center justify-center text-sm sm:text-base'
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}