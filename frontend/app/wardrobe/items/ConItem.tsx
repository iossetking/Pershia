const Prendas = [
  {    //imágenes de prueba de internet
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80', 
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80',
  },
   {
    id: 5,
    imageUrl: 'https://i.pinimg.com/1200x/c7/21/59/c72159872c86159bba194a771580ea89.jpg',
  },
   {
    id: 6,
    imageUrl: 'https://i.pinimg.com/1200x/3c/55/86/3c558695b739a5b0860aa656bd80f0f1.jpg',
  },
   {
    id: 7,
    imageUrl: 'https://i.pinimg.com/1200x/68/a8/4d/68a84d24707f1ec7445a321d949661e6.jpg',
  },
    {
    id: 8,
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',
  },
  {
    id: 9,
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',
  },
  {
    id: 10,
    imageUrl: 'https://i.pinimg.com/1200x/1c/d9/76/1cd976ba5009a9d5415cecba82362408.jpg',       
  }
]

export default function CosItems() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-4">{/* El contenedor principal (cuadrícula de 2 columnas)*/}
        {/*Map para duplicar la plantilla por cada prenda */}
        {Prendas.map((prenda) => (
          <div 
            key={prenda.id} 
            // aspect-square hace que el contenedor siempre sea un cuadrado perfecto
            // Le ponemos un fondo semitransparente (bg-white/20) para que resalte del fondo beige
            className="aspect-square bg-white/20 rounded-2xl flex items-center justify-center p-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <img
              src={prenda.imageUrl}
              // object-cover hace que la imagen llene el cuadrado sin deformarse
              className="w-full h-full object-cover rounded-xl" 
            />
          </div>
        ))}

      </div>
    </div>
  )
}