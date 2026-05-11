'use client'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

export default function SearchBar({ value, onChange, isLoading }: SearchBarProps) {
  return (
    <div className="relative flex items-center mb-3">
      <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search wardrobe..."
        className="w-full bg-gray-100 rounded-2xl pl-9 pr-9 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
      />
      {isLoading && (
        <div className="absolute right-8 w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      )}
      {value && !isLoading && (
        <button onClick={() => onChange('')} className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors">
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
