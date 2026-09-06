import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import ResumenPage from './pages/ResumenPage';
import ProductosPage from './pages/ProductosPage';
import CuponesPage from './pages/CuponesPage';
import TarjetasPage from './pages/TarjetasPage';
import PedidosPage from './pages/PedidosPage';
import UsuariosPage from './pages/UsuariosPage';
import CitasPage from './pages/CitasPage';

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/resumen" replace />} />
        <Route path="resumen" element={<ResumenPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="cupones" element={<CuponesPage />} />
        <Route path="tarjetas" element={<TarjetasPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="citas" element={<CitasPage />} />
        <Route path="*" element={<Navigate to="/resumen" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
