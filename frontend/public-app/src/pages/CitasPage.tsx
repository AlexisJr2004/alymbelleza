import { useState } from 'react';
import StorePageHeading from '../components/home/StorePageHeading';
import { useAppointmentsQuery, useCreateAppointment, useDeleteAppointment, useUpdateAppointmentStatus } from '../hooks/useAppointments';
import { isLoggedIn } from '../lib/auth';
import { confirmAction, notifyError, notifyInfo, notifySuccess } from '../lib/sweetalert';
import { formatoFechaLarga, numeroWhatsapp } from '../lib/format';
import Calendario from '../components/citas/Calendario';
import TusCitasPanel from '../components/citas/TusCitasPanel';

const WHATSAPP_PHONE = numeroWhatsapp('593981229675');

function abrirWhatsapp(mensaje: string) {
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Calendario, reservas y gestión de las citas del usuario.
export default function CitasPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: appointments, isLoading, isError, refetch } = useAppointmentsQuery();
  const createAppointment = useCreateAppointment();
  const updateStatus = useUpdateAppointmentStatus();
  const deleteAppointment = useDeleteAppointment();

  async function handleDateClick(date: Date) {
    if (!isLoggedIn()) {
      // Fiel a citas.html: acá el sitio viejo solo mostraba esta alerta y no
      // hacía nada más (ni redirigía a login), así que no se agrega esa
      // navegación acá tampoco.
      notifyInfo('Debes iniciar sesión para agendar una cita');
      return;
    }

    setSelectedDate(date);

    try {
      await createAppointment.mutateAsync(date.toISOString());
      notifySuccess('¡Cita agendada!', 'Tu cita ha sido registrada.');
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo agendar la cita');
    }

    // El aviso de WhatsApp se abre siempre, se haya podido registrar la cita
    // en el backend o no — así se comportaba handleDateClick() en citas.html
    // (la apertura de WhatsApp vive fuera del try/catch).
    abrirWhatsapp(
      `Hola Merly 👋, quiero agendar una cita para el ${formatoFechaLarga(date)}, me confirmas si estarás disponible, gracias amiga ❤️, espero tu respuesta.`
    );
  }

  function handleMarkRealizada(id: string) {
    updateStatus.mutate(
      { id, status: 'realizada' },
      { onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo actualizar la cita') }
    );
  }

  function handleCancelar(id: string) {
    // citas.html volvía a pedirle la lista completa de citas al backend solo
    // para sacar la fecha de ésta antes de armar el mensaje de WhatsApp; acá
    // ya la tenemos en caché (useAppointmentsQuery alimenta este mismo panel),
    // así que se reusa en vez de duplicar el fetch.
    const cita = appointments?.find((a) => a._id === id);
    if (cita) {
      abrirWhatsapp(
        `Hola Merly, lamentablemente debo cancelar mi cita para el ${formatoFechaLarga(new Date(cita.date))}. Disculpa las molestias.`
      );
    }
    updateStatus.mutate(
      { id, status: 'cancelada' },
      { onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo cancelar la cita') }
    );
  }

  async function handleEliminar(id: string) {
    const confirmed = await confirmAction({
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    deleteAppointment.mutate(id, {
      onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo eliminar la cita'),
    });
  }


  return <main className="bb-commerce" id="contenido">
    <div className="bb-container">
      <StorePageHeading page="Citas" eyebrow="UN MOMENTO PARA TI" title={<>Tu próxima <em>cita de belleza</em></>} description="Elige el día de tu visita y coordinemos los detalles. Un espacio para cuidarte, a tu ritmo." icon="calendar" />
      <div className="bb-appointments-grid">
        <Calendario currentDate={currentDate} selectedDate={selectedDate} busy={createAppointment.isPending} onDateClick={handleDateClick}
          onPrevMonth={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          onNextMonth={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          onToday={() => setCurrentDate(new Date())} />
        <TusCitasPanel appointments={appointments} isLoading={isLoading} isError={isError} loggedIn={isLoggedIn()}
          busy={updateStatus.isPending || deleteAppointment.isPending} onRetry={() => refetch()}
          onMarkRealizada={handleMarkRealizada} onCancelar={handleCancelar} onEliminar={handleEliminar} />
      </div>
    </div>
  </main>;
}
