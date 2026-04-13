'use client'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Wardrobe', href: '/wardrobe/items' },
  { name: 'Feed', href: '/feed' },
]

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TopNav() {
  const pathname = usePathname()
  return (
    <nav className="relative z-50 overflow-visible bg-white/80 backdrop-blur-sm after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/20">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-start">
            <div className="flex flex-1 items-center justify-start">
              <p className="text-lg font-semibold md:text-2xl md:font-extralight md:tracking-[0.2em] md:uppercase md:bg-gradient-to-r md:from-gray-900 md:to-gray-500 md:bg-clip-text md:text-transparent">
                Pershia
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex space-x-1 sm:space-x-4">
              {navigation.map((item) => {
                const isCurrent = pathname.startsWith('/wardrobe') && item.name === 'Wardrobe'
                  ? true
                  : pathname === item.href;
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
                );
              })}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end pr-2 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKhbOJQRUSlIeaHAYsDKfnHspRVDNFxY4xjA&s"
                  className="size-13 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                  >
                    Your profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}

