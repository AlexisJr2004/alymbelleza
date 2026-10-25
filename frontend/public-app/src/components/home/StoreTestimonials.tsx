import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import { useDeleteTestimonial, useTestimonialsQuery, useUpdateTestimonial } from '../../hooks/useTestimonials';
import { useSessionUser } from '../../hooks/useSessionUser';
import { confirmAction, notifyError, notifySuccess } from '../../lib/sweetalert';
import { formatImageUrl } from '../../lib/format';
import type { Testimonial } from '../../types/models';
import TestimonialModal from './TestimonialModal';
import Sheet from '../ui/Sheet';
import StoreIcon from './StoreIcon';

export default function StoreTestimonials() {
  const { data = [], isLoading, isError, refetch } = useTestimonialsQuery();
  const user = useSessionUser();
  const update = useUpdateTestimonial();
  const remove = useDeleteTestimonial();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [comment, setComment] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const navigate = useNavigate();
  const canManage = (review: Testimonial) => !!user?._id && String(review.userId) === String(user._id);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (paused || hovered || focused || reducedMotion || editing || open || confirming || remove.isPending) swiper.autoplay.stop();
    else swiper.autoplay.start();
  }, [swiper, paused, hovered, focused, reducedMotion, editing, open, confirming, remove.isPending]);
  useEffect(() => { if (!user) { setOpen(false); setEditing(null); } }, [user?._id]);
  function writeReview() { if (!user) navigate('/login'); else setOpen(true); }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing || !canManage(editing) || !comment.trim() || update.isPending) return;
    try {
      await update.mutateAsync({ id: editing._id, comment: comment.trim(), name: editing.name, role: editing.role, avatar: editing.avatar });
      setEditing(null);
      notifySuccess('Testimonio actualizado', 'Gracias por compartir tu experiencia.');
    } catch (error) { notifyError('No se pudo guardar', error instanceof Error ? error.message : 'Inténtalo nuevamente.'); }
  }
  async function deleteReview(review: Testimonial) {
    if (!canManage(review) || remove.isPending) return;
    setConfirming(true);
    const confirmed = await confirmAction({ title: '¿Eliminar este testimonio?', text: 'Esta acción no se puede deshacer.', confirmText: 'Sí, eliminar' });
    try {
      if (confirmed) { await remove.mutateAsync(review._id); notifySuccess('Testimonio eliminado'); }
    } catch (error) { notifyError('No se pudo eliminar', error instanceof Error ? error.message : 'Inténtalo nuevamente.'); }
    finally { setConfirming(false); }
  }
  return <section className="bb-container bb-testimonials" aria-labelledby="testimonials-title">
    <div className="bb-testimonials-intro">
      <h2 id="testimonials-title">Lo que dicen <br />nuestras clientas</h2>
      <p>Historias de belleza y confianza</p>
      <button type="button" className="bb-text-link" onClick={writeReview}>Comparte tu experiencia <StoreIcon name="arrow" /></button>
      {data.length > 1 && <div className="bb-carousel-controls" aria-label="Controles de testimonios">
        <button type="button" aria-label="Testimonio anterior" onClick={() => swiper?.slidePrev()}><StoreIcon name="chevron" className="bb-rotate" /></button>
        <button type="button" disabled={reducedMotion} aria-label={paused || reducedMotion ? 'Reproducir testimonios' : 'Pausar testimonios'} aria-pressed={paused || reducedMotion} onClick={() => setPaused(value => !value)}><StoreIcon name={paused || reducedMotion ? 'play' : 'pause'} /></button>
        <button type="button" aria-label="Siguiente testimonio" onClick={() => swiper?.slideNext()}><StoreIcon name="chevron" /></button>
      </div>}
    </div>
    <div className="bb-review-carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      {isLoading ? <p className="bb-status" role="status">Cargando experiencias…</p> : isError ? <p className="bb-status" role="alert">No se pudieron cargar las experiencias. <button type="button" onClick={() => refetch()}>Reintentar</button></p> : !data.length ? <div className="bb-review-empty"><StoreIcon name="heart" /><div><h3>Tu experiencia nos inspira</h3><p>Sé la primera persona en compartir su historia con Bella Beauty.</p></div></div> :
        <Swiper key={data.map(review => review._id).join(',')} onSwiper={setSwiper} modules={[Autoplay, A11y]} loop={data.length > 3} rewind={data.length <= 3} speed={650} autoplay={{ delay: 3500, disableOnInteraction: false }} slidesPerView={1} spaceBetween={14} breakpoints={{ 640: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }} a11y={{ containerMessage: 'Experiencias de nuestros clientes', itemRoleDescriptionMessage: 'Testimonio', slideLabelMessage: '{{index}} de {{slidesLength}}' }}>
          {data.map(review => <SwiperSlide key={review._id}><figure className="bb-review">
            <div className="bb-avatar"><span>{review.name.charAt(0).toUpperCase()}</span>{review.avatar && <img src={formatImageUrl(review.avatar)} alt="" loading="lazy" onError={event => { event.currentTarget.hidden = true; }} />}</div>
            <div className="bb-review-body">
              <span className="bb-review-label"><StoreIcon name="heart" /> Experiencia Bella Beauty</span>
              <blockquote>“{review.comment}”</blockquote>
              <figcaption><strong>{review.name}</strong>{review.role && <span>{review.role}</span>}</figcaption>
              {canManage(review) && <div className="bb-review-actions"><button type="button" aria-label={'Editar testimonio de ' + review.name} onClick={() => { setComment(review.comment); setEditing(review); }}><StoreIcon name="edit" />Editar</button><button type="button" aria-label={'Eliminar testimonio de ' + review.name} disabled={remove.isPending} onClick={() => void deleteReview(review)}><StoreIcon name="trash" />Eliminar</button></div>}
            </div>
          </figure></SwiperSlide>)}
        </Swiper>}
    </div>
    <TestimonialModal open={open} onClose={() => setOpen(false)} />
    <Sheet open={!!editing} onClose={() => { if (!update.isPending) setEditing(null); }} labelledBy="edit-testimonial-title" desktopMaxWidthClassName="md:max-w-lg">
      <form className="bb-storefront bb-review-editor" onSubmit={save}>
        <div className="bb-editor-heading"><h2 id="edit-testimonial-title">Tu experiencia</h2><button type="button" aria-label="Cerrar edición" disabled={update.isPending} onClick={() => setEditing(null)}><StoreIcon name="close" /></button></div>
        <p>Actualiza tu testimonio y comparte lo que hace especial tu visita.</p>
        <label htmlFor="edit-testimonial-comment">Testimonio</label>
        <textarea id="edit-testimonial-comment" required rows={5} value={comment} disabled={update.isPending} onChange={event => setComment(event.target.value)} />
        <div className="bb-editor-buttons"><button type="button" className="bb-button bb-button-outline" disabled={update.isPending} onClick={() => setEditing(null)}>Cancelar</button><button type="submit" className="bb-button" disabled={update.isPending || !comment.trim()}>{update.isPending ? 'Guardando…' : 'Guardar cambios'}</button></div>
      </form>
    </Sheet>
  </section>;
}
