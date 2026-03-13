function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CategoriesMenu() {
  const categories = ['All', 'Shirts', 'Pants', 'Shoes', 'Jackets', 'Hats', 'Accessories']
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categories.map((category, index) => {
        const isCurrent = index === 0; 
        return (
          <button
            key={category}
            className={classNames(
              'shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors',
              isCurrent
                ? 'bg-[#B0A288] text-black' // Color del botón activo 
                : 'bg-[#D2C5AD] text-gray-800 hover:bg-[#C2B59D]' // Color de los inactivos
               
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
