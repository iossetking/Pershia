"use client"
import { useState } from 'react'
import CategoriesMenu from './ItemNav'
import CosItems from "./ConItem"
import UploadButton from './Uploadbutton'
import SearchBar from './SearchBar'
import { useGarments, useSearchGarments } from '@/features/garments/hooks/useGarments'
import { useDebounce } from '@/hooks/useDebounce'

export default function Items() {
  const [activecategory, setactivecategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 400)

  const { data: garments = [], isLoading } = useGarments()
  const { data: searchResults = [], isFetching: isSearching } = useSearchGarments(debouncedQuery)

  const isSearchActive = debouncedQuery.trim().length > 1
  const displayedGarments = isSearchActive ? searchResults : garments
  const displayLoading = isSearchActive ? isSearching : isLoading

  const categories = ['All', ...Array.from(new Set(garments.map(g => g.category).filter(Boolean)))]

  return (
    <div className="p-2">
      <SearchBar value={searchQuery} onChange={setSearchQuery} isLoading={isSearchActive && isSearching} />
      {!isSearchActive && (
        <CategoriesMenu
          categories={categories}
          activecategory={activecategory}
          setactivecategory={setactivecategory}
        />
      )}
      <UploadButton />
      <div className="p-2">
        <CosItems
          garments={displayedGarments}
          isLoading={displayLoading}
          activecategory={isSearchActive ? 'All' : activecategory}
          isSearchMode={isSearchActive}
        />
      </div>
    </div>
  )
}
