import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ServicesTabsSection from '../components/home/ServicesTabsSection';
import FaqSection from '../components/home/FaqSection';

export default function NosotrosPage() {
  const { hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); }, [hash]);
  return <main>
    <div className="max-w-3xl mx-auto px-6 pt-14 text-center">
      <h1 className="font-display text-4xl mb-4">Tu belleza, nuestra pasión</h1>
      <p className="text-gray-600">En Bella Beauty encontrarás productos de cuidado personal y servicios para dedicarte un momento a ti. Conoce nuestros tratamientos y agenda tu próxima visita.</p>
    </div>
    <section id="servicios" className="scroll-mt-40"><ServicesTabsSection /></section>
    <FaqSection />
  </main>;
}
