'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Cog6ToothIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/context/AuthContext'

function getInitials(name: string | null, username: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return username.slice(0, 2).toUpperCase()
}

const tabs = [
  { name: 'Wardrobe', href: '/wardrobe/items' },
  { name: 'Feed', href: '/wardrobe/feed' },
]

export default function WardrobeTopNav() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  if (!user) return null

  const initials = getInitials(user.name ?? null, user.username)
  const isFeed = pathname.startsWith('/wardrobe/feed')

  const handleLogout = () => {
    setOpen(false)
    logout()
    router.push('/')
  }

  return (
    <div className="shrink-0 flex items-center justify-between px-4 pt-4 pb-3">
      <span className="text-xs tracking-[0.25em] uppercase text-gray-400 font-light select-none w-16">
        Pershia
      </span>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
        {tabs.map(tab => {
          const active = tab.name === 'Feed' ? isFeed : !isFeed
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                active ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>

      {/* User dropdown */}
      <div className="flex justify-end w-16 relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(prev => !prev)}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors hidden sm:block">
            {user.username}
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
            <span className="text-white text-xs font-semibold tracking-wide">
              {initials}
            </span>
          </div>
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.name ?? user.username}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>

            <Link
              href="/wardrobe/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4 text-gray-400" />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
