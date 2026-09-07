import { Link } from 'react-router-dom';
import { useProductsQuery } from '../../hooks/useProducts';
import ProductCard from '../ui/ProductCard';

// Sección "Productos Destacados": misma llamada a GET /api/products que
// alimentará la futura página de Productos completa, pero acá solo se
// muestran los primeros 8 (data.slice(0, 8) en el script original de index.html).
export default function FeaturedProducts() {
  const { data: products, isLoading, isError } = useProductsQuery();
  const destacados = products?.slice(0, 8) ?? [];

  return (
    <section className="text-gray-600 body-font bg-[url('https://preline.co/assets/svg/component/rounded-lines.svg')] bg-no-repeat bg-center bg-cover">
      <div id="productos" className="container px-5 py-20 mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-12 animate-fade-in-right">
          <div className="mb-6 flex items-center space-x-4">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              Productos Destacados
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight text-gray-900">Nuestra Colección Premium</h2>
        </div>
        <div className="flex flex-wrap w-full mb-20">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Productos de calidad</h1>
            <div className="h-1 w-20 bg-purple-500 rounded" />
          </div>
          <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
            Explora nuestra exclusiva línea de productos de belleza y cuidado personal, formulados con ingredientes de alta
            calidad y tecnología innovadora. Cada artículo ha sido cuidadosamente seleccionado para ofrecerte resultados
            visibles y una experiencia de lujo en tu rutina diaria.
          </p>
        </div>

        {isError ? (
          <div className="w-full text-center text-red-500 py-8">No se pudieron cargar los productos.</div>
        ) : isLoading ? (
          <div className="w-full text-center text-gray-400 py-8">Cargando productos...</div>
        ) : (
          <div className="flex flex-wrap -m-4">
            {destacados.map((product) => (
              <div key={product._id} className="xl:w-1/4 md:w-1/2 w-full p-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="w-full flex justify-center mt-8">
          <Link
            to="/productos"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition"
          >
            Ver más productos
          </Link>
        </div>
      </div>
    </section>
  );
}
