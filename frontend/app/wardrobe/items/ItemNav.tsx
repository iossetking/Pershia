'use client'
import { useState, useEffect, useRef } from 'react'

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

interface CategoriesMenuProps {
  categories: string[]
  activecategory: string
  setactivecategory: (category: string) => void
}

export default function CategoriesMenu({ categories, activecategory, setactivecategory }: CategoriesMenuProps) {
  const [viewNav, setViewNav] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const container = document.getElementById('ZoneScroll')
    if (!container) return
    const onScroll = () => {
      const current = container.scrollTop
      if (current > lastScrollY.current && current > 200) setViewNav(false)
      else if (current < lastScrollY.current) setViewNav(true)
      lastScrollY.current = current
    }
    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={classNames(
        'sticky top-0 z-10 bg-white -mx-2 px-2 pt-2 pb-1 transition-transform duration-300 ease-in-out',
        viewNav ? 'translate-y-0' : '-translate-y-[120%]'
      )}
    >
      <div className="flex gap-3 overflow-x-auto pb-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setactivecategory(category)}
            className={classNames(
              'shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors backdrop-blur-lg border',
              category === activecategory
                ? 'bg-white/70 border-white/80 text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]'
                : 'bg-white/40 border-white/50 text-gray-700 hover:bg-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
