import PageHeader from '../components/ui/PageHeader';

export default function UsuariosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gestión de usuarios"
        title="Clientes registrados"
        description="Administra los usuarios registrados en Bella Beauty. Puedes buscar, filtrar por rol o estado, habilitar/deshabilitar cuentas y cambiar el rol de administrador."
      />
      <p className="text-sm text-gray-400">Pendiente de migrar (sub-fase 5 del plan).</p>
    </div>
  );
}
