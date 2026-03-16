'use client'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Wardrobe', href: '/wardrobe/items' },
  { name: 'Feed', href: '/feed'},
]

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TopNav() {
  const pathname = usePathname()
  return (
    <nav className="relative z-50 overflow-visible bg-white/10 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
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
                          ? 'bg-[#CBCBCB] text-[#1E1E1E]' 
                          : 'text-[#1E1E1E] hover:bg-black/5 hover:text-white',
                        'rounded-3xl px-3 sm:px-3 py-2 text-sm font-medium transition-colors'
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
                  src ="data:image/jpeg;base64,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"
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

