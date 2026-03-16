"use client"
import { useState } from 'react'

import CosItems from "./ConItem"

export default function Items() {
  const [activecategory, setactivecategory] = useState('All');
  return (
  <div className="p-2">    
      
      <CosItems/>
      
    </div>
  )
}