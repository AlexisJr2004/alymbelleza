import PageHeader from '../components/ui/PageHeader';

export default function TarjetasPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gestión de pagos"
        title="Centro de Tarjetas"
        description="Administra las cuentas bancarias que los clientes ven en la pasarela de pagos al finalizar su compra. Desde aquí puedes agregar, editar o desactivar una cuenta, y revisar cuántas hay activas por banco."
      />
      <p className="text-sm text-gray-400">Pendiente de migrar (sub-fase 4 del plan).</p>
    </div>
  );
}
