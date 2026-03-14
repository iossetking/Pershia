
export const Items = [
  {    //imágenes de prueba de internet
    id: 1,
    category: 'Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80', 
  },
  {
    id: 2,
    category: 'Pants',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3,
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 4,
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80',
  },
   {
    id: 5,
    category: 'Hats',
    imageUrl: 'https://i.pinimg.com/1200x/c7/21/59/c72159872c86159bba194a771580ea89.jpg',
  },
   {
    id: 6,
    category: 'Accessories',
    imageUrl: 'https://i.pinimg.com/1200x/3c/55/86/3c558695b739a5b0860aa656bd80f0f1.jpg',
  },
   {
    id: 7,
    category: 'Scarves',
    imageUrl: 'https://i.pinimg.com/1200x/68/a8/4d/68a84d24707f1ec7445a321d949661e6.jpg',
  },
    {
    id: 8,
    category: 'Shirts',
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',
  },
  {
    id: 9,
    category: 'Pants',
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',
  },
  {
    id: 10,
    category: 'Shoes',
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',       
  }
]
//Resive los datos
interface CosItemsProps {
  activecategory: string;
}

export default function CosItems({ activecategory }: CosItemsProps) {
  // Filtramos los items según la categoría
  const itemsFiltrados = activecategory === 'All' 
    ? Items 
    : Items.filter(item => item.category === activecategory);

  return (
    <div className="mt-6">
      
      {/*columns-[150px], en celular
        md:columns-[250px], en PC 
      */}
      <div className="columns-[150px] md:columns-[250px] gap-4">
        
        {itemsFiltrados.map((item) => (
          <div 
            key={item.id} 
            className="break-inside-avoid mb-4 rounded-2xl overflow-hidden cursor-pointer group"
          >
            <img
              src={item.imageUrl}
              // group-hover:scale-110 hace un zoom sutil
              // md:group-hover:brightness-90 la oscurece un poquito al pasar el mouse(no funciona en celular)
              className="w-full object-cover rounded-xl transition-transform duration-300 md:group-hover:scale-110" 
            />
          </div>
        ))}

      </div>
    </div>
  )
}