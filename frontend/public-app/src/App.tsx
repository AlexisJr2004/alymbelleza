import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import HomePage from './pages/HomePage';
import ProductosPage from './pages/ProductosPage';
import CarritoPage from './pages/CarritoPage';
import PagosPage from './pages/PagosPage';
import CitasPage from './pages/CitasPage';
import GaleriaPage from './pages/GaleriaPage';
import PerfilPage from './pages/PerfilPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
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
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  );
}

export default App;
