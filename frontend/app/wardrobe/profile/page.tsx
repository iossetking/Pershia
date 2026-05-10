'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/context/AuthContext'
import { updateUsername } from '@/features/users/api/users'

function getInitials(name: string | null, username: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return username.slice(0, 2).toUpperCase()
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-sm text-gray-800 bg-gray-50 rounded-2xl px-4 py-3">{value}</span>
    </div>
  )
}

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const router = useRouter()

  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameValue, setUsernameValue] = useState(user?.username ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    router.push('/')
    return null
  }

  const initials = getInitials(user.name ?? null, user.username)

  const handleSaveUsername = async () => {
    const trimmed = usernameValue.trim()
    if (!trimmed || trimmed === user.username) {
      setEditingUsername(false)
      setUsernameValue(user.username)
      return
    }
    setIsSaving(true)
    setError('')
    try {
      const updated = await updateUsername(user.user_id, trimmed)
      setUser(updated)
      setEditingUsername(false)
    } catch {
      setError("Couldn't save username.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelUsername = () => {
    setEditingUsername(false)
    setUsernameValue(user.username)
    setError('')
  }

  const joined = new Date(user.joined_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-full pb-28 px-4 pt-2">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-3">
          <span className="text-white text-2xl font-semibold tracking-wide">{initials}</span>
        </div>
        {user.name && (
          <p className="text-base font-semibold text-gray-800">{user.name}</p>
        )}
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4 max-w-md mx-auto">

        {/* Username — editable */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Username
            </span>
            {!editingUsername && (
              <button
                onClick={() => setEditingUsername(true)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <PencilIcon className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>

          {editingUsername ? (
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={usernameValue}
                onChange={e => setUsernameValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveUsername()
                  if (e.key === 'Escape') handleCancelUsername()
                }}
                className="flex-1 text-sm text-gray-800 bg-gray-50 border border-gray-300 focus:border-gray-500 rounded-2xl px-4 py-3 outline-none transition-colors"
              />
              <button
                onClick={handleSaveUsername}
                disabled={isSaving}
                className="flex items-center justify-center w-11 h-11 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-200 rounded-2xl transition-colors flex-shrink-0"
              >
                {isSaving
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <CheckIcon className="h-4 w-4 text-white" />
                }
              </button>
              <button
                onClick={handleCancelUsername}
                className="flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors flex-shrink-0 text-sm text-gray-500"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-800 bg-gray-50 rounded-2xl px-4 py-3">
              {user.username}
            </span>
          )}

          {error && <p className="text-xs text-red-500 px-1">{error}</p>}
        </div>

        {/* Read-only fields */}
        {user.name && <Field label="Full name" value={user.name} />}
        <Field label="Email" value={user.email} />
        <Field label="Member since" value={joined} />
      </div>
    </div>
  )
}
