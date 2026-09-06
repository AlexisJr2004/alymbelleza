import PageHeader from '../components/ui/PageHeader';

export default function ProductosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gestión de productos"
        title="Productos registrados"
        description="Administra el catálogo de Bella Beauty. Puedes buscar, filtrar por categoría, tipo o estado, y crear o editar productos."
      />
      <p className="text-sm text-gray-400">Pendiente de migrar (sub-fase 3 del plan).</p>
    </div>
  );
}
