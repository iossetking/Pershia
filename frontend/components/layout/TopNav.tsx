'use client'
import { Disclosure } from '@headlessui/react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

const navigation = [
  { name: 'Wardrobe', href: '/wardrobe/items' },
  { name: 'Feed', href: '/feed' },
]

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TopNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? user?.username ?? 'U')}&background=c8a97e&color=0f0f0f&bold=true`

  return (
    <nav className="relative z-50 overflow-visible bg-white/80 backdrop-blur-sm after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/20">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="relative flex h-16 items-center justify-between">

          <div className="flex flex-1 items-center justify-start">
            <p className="text-lg font-semibold md:text-2xl md:font-extralight md:tracking-[0.2em] md:uppercase md:bg-gradient-to-r md:from-gray-900 md:to-gray-500 md:bg-clip-text md:text-transparent">
              Pershia
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex space-x-1 sm:space-x-4">
              {navigation.map((item) => {
                const isCurrent = pathname.startsWith('/wardrobe') && item.name === 'Wardrobe'
                  ? true
                  : pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      isCurrent
                        ? 'bg-white/50 text-gray-800 border border-white/80'
                        : 'text-gray-700 hover:bg-white/30 border border-transparent hover:border-white/50',
                      'rounded-3xl px-3 sm:px-3 py-2 text-sm font-medium transition-all backdrop-blur-sm'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end pr-2 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                {user && (
                  <span className="hidden sm:block text-sm text-gray-600 font-medium">
                    {user.name ?? user.username}
                  </span>
                )}
                <img
                  alt={user?.name ?? 'User'}
                  src={avatarUrl}
                  className="size-9 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm text-white font-medium truncate">{user.name ?? user.username}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <MenuItem>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem>
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                    >
                      Sign in
                    </Link>
                  </MenuItem>
                )}
              </MenuItems>
            </Menu>
          </div>

        </div>
      </div>
    </nav>
  )
}
