import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAppointmentsQuery, useCreateAppointment, useDeleteAppointment, useUpdateAppointmentStatus } from '../hooks/useAppointments';
import { isLoggedIn } from '../lib/auth';
import { confirmAction, notifyError, notifySuccess } from '../lib/sweetalert';
import { formatoFechaLarga, numeroWhatsapp } from '../lib/format';
import Calendario from '../components/citas/Calendario';
import TusCitasPanel from '../components/citas/TusCitasPanel';

const WHATSAPP_PHONE = numeroWhatsapp('593981229675');

function abrirWhatsapp(mensaje: string) {
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Página "Citas" — puerto de frontend/citas.html: calendario mensual + panel
// "Tus Citas" con las acciones de agendar / marcar realizada / cancelar /
// eliminar. Las mutaciones (useCreateAppointment/useUpdateAppointmentStatus/
// useDeleteAppointment) ya invalidan ['my-appointments'] en useAppointments.ts,
// así que este panel y la campana de notificaciones del header quedan
// sincronizados automáticamente sin nada extra acá.
export default function CitasPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: appointments, isLoading } = useAppointmentsQuery();
  const createAppointment = useCreateAppointment();
  const updateStatus = useUpdateAppointmentStatus();
  const deleteAppointment = useDeleteAppointment();

  async function handleDateClick(date: Date) {
    if (!isLoggedIn()) {
      // Fiel a citas.html: acá el sitio viejo solo mostraba esta alerta y no
      // hacía nada más (ni redirigía a login), así que no se agrega esa
      // navegación acá tampoco.
      Swal.fire('Debes iniciar sesión para agendar una cita');
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

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center mb-16 animate-fade-in">
        <br />
        <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight text-gray-900">
          Escoge un día, para agendar una cita conmigo ✨
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-4" />
      </div>

      <div className="container mx-auto px-5 pb-20">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <Calendario
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onPrevMonth={() => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            onNextMonth={() => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            onToday={() => setCurrentDate(new Date())}
          />

          <TusCitasPanel
            appointments={appointments}
            isLoading={isLoading}
            onMarkRealizada={handleMarkRealizada}
            onCancelar={handleCancelar}
            onEliminar={handleEliminar}
          />
        </div>
      </div>
    </>
  );
}
