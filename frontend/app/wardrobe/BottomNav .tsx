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
    <div className="
      fixed bottom-0 left-0 w-full z-50
      flex justify-center
      pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 px-4

      backdrop-blur-xl bg-white/[0.55]
      border-t border-white/40
      shadow-[0_-4px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
    ">
      <div className="flex justify-center gap-2 w-full max-w-[400px]">
        {navigation.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isCurrent
                  ? 'bg-white/70 border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.10)] text-[#2F2020]'
                  : 'bg-white/20 border-white/30 text-[#2F2020]/60 hover:bg-white/40 hover:text-[#2F2020]',
                'flex-1 flex items-center justify-center',
                'rounded-2xl py-2 px-3',
                'text-sm sm:text-base font-medium',
                'border transition-all duration-200',
                'backdrop-blur-sm',
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