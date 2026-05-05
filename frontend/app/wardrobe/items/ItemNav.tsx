'use client'
import {Items}  from "./ConItem"
import { useState, useEffect,useRef } from 'react'
function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

interface CategoriesMenuProps {
  activecategory: string;
  setactivecategory: (categoria: string) => void;
}
export default function CategoriesMenu({ activecategory, setactivecategory }: CategoriesMenuProps) {
  // Estados para controlar si se muestra el menu
  const [ViewNav, setViewNav] = useState(true)
  const [ultimScrollY, setUltimScrollY] = useState(0)
  const ultimoScrollY = useRef(0)
  useEffect(() => {
    const contenedor = document.getElementById('ZoneScroll')
    if (!contenedor) return
    const manejarScroll = () => {
      const scrollActual = contenedor.scrollTop
      if (scrollActual > ultimScrollY && scrollActual > 200) {
        setViewNav(false) // Ocultamos el menú
      } 
      else if (scrollActual < ultimScrollY) {
        setViewNav(true) // Mostramos el menú
      }
      // Guardamos la nueva posición
      setUltimScrollY(scrollActual)
    }
    contenedor.addEventListener('scroll', manejarScroll)
    return () => contenedor.removeEventListener('scroll', manejarScroll)
  }, [ultimScrollY])

  const extracategories = Array.from(new Set(Items.map(item => item.category))); // Extrae las categorías únicas
  const categories = ['All', ...extracategories]; // Añade 'All'
  return (
    
      <div 
        className={classNames(
          "sticky top-0 z-10 bg-white -mx-2 px-2 pt-2 pb-1 transition-transform duration-300 ease-in-out",
          ViewNav ? "translate-y-0" : "-translate-y-[120%]"
        )}
      >
        <div className="flex gap-3 overflow-x-auto pb-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((category) => {
            const isCurrent = category === activecategory;
            return (
              <button
                key={category}
                onClick={() => setactivecategory(category)}
                className={classNames(
                  'shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors backdrop-blur-lg border ',
                  isCurrent
                    ? 'bg-white/70 border-white/80 text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]' 
                    : 'bg-white/40 border-white/50 text-gray-700 hover:bg-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  
                )}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
    
  )
}
