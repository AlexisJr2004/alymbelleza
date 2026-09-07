import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Swal from 'sweetalert2';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useTestimonialsQuery } from '../../hooks/useTestimonials';
import { isLoggedIn } from '../../lib/auth';
import TestimonialCard from './TestimonialCard';
import TestimonialModal from './TestimonialModal';

// Puerto de la sección de testimonios (initTestimonialSwiper/loadTestimonials
// en js/main.js), usando los componentes oficiales de swiper/react en vez del
// swiper-bundle imperativo por CDN que usaba el sitio viejo.
export default function TestimonialsSection() {
  const { data: testimonials, isLoading, isError } = useTestimonialsQuery();
  const [modalOpen, setModalOpen] = useState(false);
  const isEmpty = !isLoading && !isError && (testimonials?.length ?? 0) === 0;

  const handleOpenModal = () => {
    if (!isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para dejar un testimonio.',
        confirmButtonColor: '#7e22ce',
      });
      return;
    }
    setModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden py-16 bg-gray-50">
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
      <div className="container relative mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight text-gray-900">Lo que dicen nuestros clientes</h2>
          <p className="text-lg text-gray-600">Descubre lo que nuestros clientes tienen que decir sobre su experiencia con nosotros.</p>
        </div>

        <div className="testimonials-swiper swiper-container relative">
          {isError ? (
            <div className="testimonial-card text-center p-4 text-red-500">
              <p>Error al cargar testimonios.</p>
            </div>
          ) : isLoading ? (
            <div className="text-center p-8 text-gray-400">Cargando testimonios...</div>
          ) : isEmpty ? (
            <Swiper centeredSlides slidesPerView={1} pagination={{ el: '.swiper-pagination', clickable: true }} modules={[Pagination]}>
              <SwiperSlide className="flex items-center justify-center h-full w-full">
                <div className="w-full max-w-sm mx-auto text-center p-8">
                  <div className="mx-auto flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4 w-16 h-16">
                    <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">No hay testimonios aún</h3>
                  <p className="text-gray-600 mb-6 text-center">Parece que nadie ha compartido su experiencia todavía.</p>
                </div>
              </SwiperSlide>
              <div className="swiper-pagination !relative !mt-8 !bottom-0" slot="container-end" />
            </Swiper>
          ) : (
            <Swiper
              loop
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ el: '.swiper-pagination', clickable: true }}
              navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
              }}
              modules={[Navigation, Pagination, Autoplay]}
            >
              {(testimonials ?? []).map((testimonial) => (
                <SwiperSlide key={testimonial._id}>
                  <TestimonialCard testimonial={testimonial} />
                </SwiperSlide>
              ))}
              <div className="swiper-pagination !relative !mt-8 !bottom-0" slot="container-end" />
              <div className="swiper-button-next" slot="container-end">
                <i className="fas fa-chevron-right" />
              </div>
              <div className="swiper-button-prev" slot="container-end">
                <i className="fas fa-chevron-left" />
              </div>
            </Swiper>
          )}
        </div>

        <div className="text-center mt-16">
          <button
            type="button"
            id="openTestimonialModal"
            onClick={handleOpenModal}
            className="group bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              Agregar Testimonio
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <TestimonialModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
