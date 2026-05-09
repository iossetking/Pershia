"use client"
import { useState } from 'react'
import CategoriesMenu from './ItemNav'
import CosItems from "./ConItem"
import UploadButton from './Uploadbutton'
import { useGarments } from '@/features/garments/hooks/useGarments'

export default function Items() {
  const [activecategory, setactivecategory] = useState('All')
  const { data: garments = [], isLoading } = useGarments()

  const categories = ['All', ...Array.from(new Set(garments.map(g => g.category).filter(Boolean)))]

  return (
    <div className="p-2">
      <CategoriesMenu
        categories={categories}
        activecategory={activecategory}
        setactivecategory={setactivecategory}
      />
      <UploadButton />
      <div className="p-2">
        <CosItems garments={garments} isLoading={isLoading} activecategory={activecategory} />
      </div>
    </div>
  )
}
