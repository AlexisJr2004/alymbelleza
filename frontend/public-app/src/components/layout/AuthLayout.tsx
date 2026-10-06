import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="floating-shapes">
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
      </div>
      <Outlet />
    </div>
  );
}
