import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FaqSection from '../components/home/FaqSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ServicesTabsSection from '../components/home/ServicesTabsSection';
import ContactSection from '../components/home/ContactSection';
import CookieConsent from '../components/home/CookieConsent';
import { ProductQuickViewProvider } from '../components/ui/ProductQuickViewProvider';

// Página de inicio — puerto de frontend/index.html (sin el chatbot, que es una
// sub-fase aparte). El orden de las secciones respeta el original.
// GoTopButton/AccessibilityWidget se movieron a PublicLayout: el sitio viejo
// los repetía en todas las páginas de contenido, no solo en index.html.
// CookieConsent sí es exclusivo de esta página (nunca existió en las demás).
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
    </>
  );
}
