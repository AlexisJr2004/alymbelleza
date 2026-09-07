import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';

// Cada página se carga en su propio chunk: evita que dependencias pesadas de
// una sola ruta (swiper en Home, html2pdf/jsPDF/html2canvas en Pagos, y más
// adelante WebLLM en el chatbot) se descarguen en cada visita sin importar
// qué página se abra primero.
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductosPage = lazy(() => import('./pages/ProductosPage'));
const CarritoPage = lazy(() => import('./pages/CarritoPage'));
const PagosPage = lazy(() => import('./pages/PagosPage'));
const CitasPage = lazy(() => import('./pages/CitasPage'));
const GaleriaPage = lazy(() => import('./pages/GaleriaPage'));
const PerfilPage = lazy(() => import('./pages/PerfilPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="carrito" element={<CarritoPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="citas" element={<CitasPage />} />
          <Route path="galeria" element={<GaleriaPage />} />
          <Route path="perfil" element={<PerfilPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
