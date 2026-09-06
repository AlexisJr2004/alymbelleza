import PageHeader from '../components/ui/PageHeader';

export default function ResumenPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Panel de control"
        title="Resumen general"
        description="Los pedidos, citas y usuarios de Bella Beauty se consolidan aquí para ver el estado del negocio de un vistazo."
      />
      <p className="text-sm text-gray-400">Pendiente de migrar (sub-fase 6 del plan).</p>
    </div>
  );
}
