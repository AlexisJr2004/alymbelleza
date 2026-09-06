import PageHeader from '../components/ui/PageHeader';

export default function PedidosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gestión de pedidos"
        title="Pedidos registrados"
        description="Revisa los pedidos realizados por los clientes, filtra por fecha o cupón, y consulta ingresos y descuentos aplicados."
      />
      <p className="text-sm text-gray-400">Pendiente de migrar (sub-fase 2 del plan).</p>
    </div>
  );
}
