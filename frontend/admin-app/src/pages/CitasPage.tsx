import PageHeader from '../components/ui/PageHeader';

export default function CitasPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gestión de citas"
        title="Citas registradas"
        description="Revisa las citas agendadas por los clientes, filtra por fecha o estado, y marca cada una como realizada o cancelada."
      />
      <p className="text-sm text-gray-400">Pendiente de migrar (sub-fase 5 del plan).</p>
    </div>
  );
}
