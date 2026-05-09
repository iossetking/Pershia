'use client'
import { usePathname } from 'next/navigation'
import { useRef, useEffect, ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.remove('anim-slide-up')
    void el.offsetWidth // force reflow to restart animation
    el.classList.add('anim-slide-up')
  }, [pathname])

  return (
    <div ref={ref} className="anim-slide-up h-full">
      {children}
    </div>
  )
}
