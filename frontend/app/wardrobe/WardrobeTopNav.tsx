'use client'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

function getInitials(name: string | null, username: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return username.slice(0, 2).toUpperCase()
}

export default function WardrobeTopNav() {
  const { user } = useAuth()

  if (!user) return null

  const initials = getInitials(user.name ?? null, user.username)

  return (
    <div className="shrink-0 flex items-center justify-between px-4 pt-4 pb-3">
      <span className="text-xs tracking-[0.25em] uppercase text-gray-400 font-light select-none">
        Pershia
      </span>

      <Link
        href="/wardrobe/profile"
        className="flex items-center gap-2 group"
      >
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
  )
}
