import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestimonialsQuery } from '../../hooks/useTestimonials';
import { isLoggedIn } from '../../lib/auth';
import TestimonialModal from './TestimonialModal';
import StoreIcon from './StoreIcon';

export default function StoreTestimonials() {
  const { data, isLoading, isError, refetch } = useTestimonialsQuery();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  function writeReview() { if (!isLoggedIn()) navigate('/login'); else setOpen(true); }
  return <section className="bb-container bb-testimonials" aria-labelledby="testimonials-title">
    <div className="bb-testimonials-intro"><h2 id="testimonials-title">Lo que dicen <br />nuestras clientas</h2><p>Historias de belleza y confianza</p><button type="button" className="bb-text-link" onClick={writeReview}>Comparte tu experiencia <StoreIcon name="arrow" /></button></div>
    <div className="bb-review-list" aria-live="polite">
      {isLoading ? <p className="bb-status">Cargando experiencias…</p> : isError ? <p className="bb-status">No se pudieron cargar las experiencias. <button type="button" onClick={() => refetch()}>Reintentar</button></p> : !data?.length ? <div className="bb-review-empty"><StoreIcon name="heart" /><div><h3>Tu experiencia nos inspira</h3><p>Sé la primera persona en compartir su historia con Bella Beauty.</p></div></div> : data.slice(0, 3).map(review => <figure className="bb-review" key={review._id}>
        <div className="bb-avatar"><span>{review.name.charAt(0).toUpperCase()}</span>{review.avatar && <img src={review.avatar} alt="" loading="lazy" onError={event => { event.currentTarget.hidden = true; }} />}</div>
        <div className="bb-review-body"><span className="bb-review-label"><StoreIcon name="heart" /> Experiencia Bella Beauty</span><blockquote>“{review.comment}”</blockquote><figcaption><strong>{review.name}</strong>{review.role && <span>{review.role}</span>}</figcaption></div>
      </figure>)}
    </div>
    <TestimonialModal open={open} onClose={() => setOpen(false)} />
  </section>;
}
