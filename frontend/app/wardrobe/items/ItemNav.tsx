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
        'sticky top-0 z-10 bg-white -mx-2 px-2 pt-2 transition-transform duration-300 ease-in-out',
        viewNav ? 'translate-y-0' : '-translate-y-[120%]'
      )}
    >
      {/* Wrapper splits scroll from shadow clipping */}
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-2 px-1 py-2 w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setactivecategory(category)}
              className={classNames(
                'shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all focus:outline-none',
                category === activecategory
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
