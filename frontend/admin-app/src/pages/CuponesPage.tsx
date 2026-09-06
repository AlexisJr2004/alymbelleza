import PageHeader from '../components/ui/PageHeader';

export default function CuponesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gestión de cupones"
        title="Cupones registrados"
        description="Crea y administra los códigos de descuento de Bella Beauty. Filtra por tipo, estado o vencimiento."
      />
      <p className="text-sm text-gray-400">Pendiente de migrar (sub-fase 4 del plan).</p>
    </div>
  );
}
