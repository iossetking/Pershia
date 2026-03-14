"use client"
import { useState } from 'react'
import CategoriesMenu from './ItemNav'
import CosItems from "./ConItem"
export default function Items() {
  const [activecategory, setactivecategory] = useState('All');
  return (
    
<div className="p-2">    
      <CategoriesMenu 
        activecategory={activecategory}
        setactivecategory={setactivecategory}
      />
      <div className="p-2">
        <CosItems activecategory={activecategory} />
      </div>
    </div>
  )
}