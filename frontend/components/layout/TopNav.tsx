'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/app/context/AuthContext'
import { googleAuth } from '@/features/users/api/users'

function AuthButtons() {
  const { setUser } = useAuth()
  const router = useRouter()

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const user = await googleAuth(tokenResponse.access_token)
        setUser(user)
        router.push('/wardrobe/items')
      } catch (err) {
        console.error('Auth failed:', err)
      }
    },
    onError: () => console.error('Google login failed'),
  })

  return (
    <>
      <button
        onClick={() => login()}
        className="text-sm text-white/50 hover:text-white/80 transition-colors px-3 py-1.5"
      >
        Log in
      </button>
      <button
        onClick={() => login()}
        className="text-sm font-medium text-[#0f0f0f] bg-white/90 hover:bg-white rounded-full px-5 py-1.5 transition-all"
      >
        Sign in
      </button>
    </>
  )
}

export default function TopNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  if (pathname !== '/') return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="absolute inset-x-0 top-0 z-50 flex items-center justify-between h-16 px-6 sm:px-10">
      <span className="text-sm tracking-[0.25em] uppercase text-white/50 font-light select-none">
        Pershia
      </span>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm text-white/50 hidden sm:block">
              {user.name ?? user.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-white/60 hover:text-white border border-white/15 hover:border-white/35 rounded-full px-4 py-1.5 transition-all"
            >
              Sign out
            </button>
          </>
        ) : (
          <AuthButtons />
        )}
      </div>
    </nav>
  )
}
