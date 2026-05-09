'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const initials = getInitials(user.name ?? null, user.username)

  const isFeed = pathname.startsWith('/wardrobe/feed')

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
                active
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>

      {/* User */}
      <div className="flex justify-end w-16">
        <Link href="/wardrobe/profile" className="flex items-center gap-2 group">
          <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors hidden sm:block">
            {user.username}
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
            <span className="text-white text-xs font-semibold tracking-wide">
              {initials}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
