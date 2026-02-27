![alt text](<Pershia logo.png>)

<h1 align="cleft">PerShia Fashion app</h1>

<p align="right">
<img src="https://img.shields.io/badge/STATUS-EN%20DESAROLLO-green">
</p>

## Describcion del proyecto
PerShia es una web app desarrollada con el fin de evitar un problema comun en la actualidad el **"Fast Fashion"**, muchas empresas al dia generan un sin fin de prendas al dia esto generando contaminacion ya que la industria de la moda genera aproximadamente el 20% de las aguas residuales a nivel mundial además, el sector consume cerca de 93,000 millones de metros cúbicos de agua al año.

La solucion a todo esto es PerShia, por medio de imagenes que el usuario suba a la web app de su ropero actual la IA le recomendara al usuario que prenda podria combinar ,  esto generando la no necesidad de comprar ropa , por otra parte se contara con otro apartado que se puede usar como inspiracion donde otros usuarios puedan subir sus estilos de ropa, se combinara el estilo de Pinterest y Tinder para generar una experiancia mas comoda e interactiva al usuario.

## Instalar

## Uso

## Tecnologías

El proyecto se basa en una arquitectura de microservicios y agentes de IA, diseñada para escalar de forma independiente el feed social y el motor de estilismo.

| Capa / Componente | Tecnología | Rol en el Proyecto | Detalle según Diseño |
| :--- | :--- | :--- | :--- |
| **Frontend** | **React.JS** (+ TailwindCSS) | Interfaz de Usuario | Gestiona el "Wardrobe Frontend" y el "Social Feed" (UI tipo Tinder). |
| **Backend APIs** | **FastAPI** (Python) | Orquestación y Lógica | Procesa peticiones del Guardarropa y el Feed Social mediante REST/HTTPS. |
| **IA Agent Layer** | **LangGraph** | Flujo Conversacional | Orquesta el "LangGraph Agent" para clasificar la intención del usuario. |
| **Modelos de ML** | **Llama 4** | Razonamiento LLM | Provee descripciones de prendas y lógica para el estilista conversacional. |
| **Computer Vision** | **Fashion-CLIP** | Embeddings de Moda | Genera vectores de 512 dimensiones para indexar imágenes y texto. |
| **Base de Datos** | **PostgreSQL** (+ pgvector) | Almacenamiento Vectorial | Persiste usuarios, prendas, outfits y los embeddings de búsqueda. |
| **Storage** | **AWS S3** | Object Storage | Almacenamiento global de las imágenes de prendas cargadas. |
| **Distribución** | **CloudFront** | CDN | Entrega global de contenido estático y fotos de outfits con baja latencia. |

## Areas

1.  **Wardrobe System:** Centrado en la gestión personal de prendas, donde **Fashion-CLIP** y **Llama 4** trabajan en conjunto para entender el estilo del usuario.
2.  **Social Feed:** Un sistema desacoplado que consume los "outfits aprobados" para mostrarlos a otros usuarios, permitiendo interacciones como *swipes* y *likes*.
3.  **Persistencia Híbrida:** Se utiliza PostgreSQL no solo para datos relacionales, sino como motor de búsqueda semántica gracias a la extensión `pgvector`.

## Desarrolladores

<p align="center">Iosset Ivan Sandoval Gonzalez

<p align="center">Yohance Garrett Lopez 

<p align="center">Oscar Josue Lopez Gonzalez

<p align="center">Miguel Omar Flores García

<p align="center">Rodrigo Alonso Castillo Ramirez 

<p align="center">Adin Jared Rosas Silva

<p align="center">Sebastian Sanchez Espinosa

## Licencia y Autor
