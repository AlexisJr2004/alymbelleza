import { lazy, Suspense } from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FaqSection from '../components/home/FaqSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ServicesTabsSection from '../components/home/ServicesTabsSection';
import ContactSection from '../components/home/ContactSection';
import CookieConsent from '../components/home/CookieConsent';
import { ProductQuickViewProvider } from '../components/ui/ProductQuickViewProvider';

// ChatWidget en su propio chunk (React.lazy), igual que las páginas en
// App.tsx: así ni ChatWidget.tsx ni sus imports estáticos (findFaqAnswer,
// useChatEngine — que a su vez importa @mlc-ai/web-llm dinámicamente, ver ese
// archivo) forman parte del chunk de Home. El widget solo pesa lo mínimo del
// shell (bubble/panel/FAQ) hasta que React lo monta; @mlc-ai/web-llm en sí
// sigue sin descargarse hasta que además se abra el chat y se mande un
// mensaje que el FAQ no responda.
const ChatWidget = lazy(() => import('../components/chatbot/ChatWidget'));

// Página de inicio — puerto de frontend/index.html. El orden de las secciones
// respeta el original. GoTopButton/AccessibilityWidget se movieron a
// PublicLayout: el sitio viejo los repetía en todas las páginas de contenido,
// no solo en index.html. CookieConsent y ChatWidget sí son exclusivos de esta
// página (nunca existieron en las demás).
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductQuickViewProvider>
        <FeaturedProducts />
      </ProductQuickViewProvider>
      <FaqSection />
      <TestimonialsSection />
      <ServicesTabsSection />
      <ContactSection />

      <CookieConsent />
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </>
  );
}
