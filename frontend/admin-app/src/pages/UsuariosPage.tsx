import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
import Switch from '../components/ui/Switch';
import Pagination from '../components/ui/Pagination';
import PercentBarList from '../components/ui/PercentBarList';
import { UsuariosIcon, CheckIcon, ShieldCheckIcon, UsersInactiveIcon, SearchIcon } from '../components/icons';
import { useUsersQuery, useToggleUserActive, useSetUserRole } from '../hooks/useUsers';
import { useSwitchFilter } from '../hooks/useSwitchFilter';
import { filtrarPorRangoDeFechas } from '../lib/filters';
import { formatoFechaCorta, numeroWhatsapp } from '../lib/format';
import { getStoredUser } from '../lib/auth';
import { notifyError } from '../lib/sweetalert';
import type { User } from '../types/models';

const USUARIOS_POR_PAGINA = 8;
const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

export default function UsuariosPage() {
  const { data: usuarios = [], isLoading } = useUsersQuery();
  const toggleActive = useToggleUserActive();
  const setRole = useSetUserRole();
  const currentUser = getStoredUser();

  const [search, setSearch] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const rolFiltro = useSwitchFilter();
  const estadoFiltro = useSwitchFilter();
  const [pagina, setPagina] = useState(1);

  const total = usuarios.length;
  const activos = usuarios.filter((u) => u.isActive !== false).length;
  const inactivos = total - activos;
  const admins = usuarios.filter((u) => u.role === 'admin').length;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const filtrados = useMemo(() => {
    const texto = search.trim().toLowerCase();
    let lista = usuarios.filter(
      (u) => (u.name || '').toLowerCase().includes(texto) || (u.email || '').toLowerCase().includes(texto)
    );
    lista = filtrarPorRangoDeFechas(lista, (u) => u.createdAt, fechaDesde, fechaHasta);
    if (rolFiltro.selected.size) lista = lista.filter((u) => rolFiltro.selected.has(u.role));
    if (estadoFiltro.selected.size) {
      lista = lista.filter((u) => estadoFiltro.selected.has(u.isActive === false ? 'inactivo' : 'activo'));
    }
    return lista;
  }, [usuarios, search, fechaDesde, fechaHasta, rolFiltro.selected, estadoFiltro.selected]);

  const inicio = (pagina - 1) * USUARIOS_POR_PAGINA;
  const usuariosPagina = filtrados.slice(inicio, inicio + USUARIOS_POR_PAGINA);

  const limpiarFiltros = () => {
    setSearch('');
    setFechaDesde('');
    setFechaHasta('');
    rolFiltro.clear();
    estadoFiltro.clear();
    setPagina(1);
  };

  const handleToggleActive = async (u: User) => {
    try {
      await toggleActive.mutateAsync(u._id);
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo cambiar el estado del usuario.');
    }
  };

  const handleChangeRole = async (u: User) => {
    const nuevoRol = u.role === 'admin' ? 'cliente' : 'admin';
    try {
      await setRole.mutateAsync({ id: u._id, role: nuevoRol });
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo cambiar el rol del usuario.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión de usuarios"
        title="Clientes registrados"
        description="Administra los usuarios registrados en Bella Beauty. Puedes buscar, filtrar por rol o estado, habilitar/deshabilitar cuentas y cambiar el rol de administrador."
      />

      <KpiRow>
        <KpiCard
          label="Total clientes"
          value={total}
          note="Usuarios registrados"
          iconBg="bg-purple-100/70"
          iconColor="text-purple-600"
          icon={<UsuariosIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Activos"
          value={activos}
          note="Cuentas habilitadas"
          valueClassName="text-emerald-700"
          iconBg="bg-emerald-100/70"
          iconColor="text-emerald-600"
          icon={<CheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Administradores"
          value={admins}
          note="Con permisos totales"
          valueClassName="text-sky-700"
          iconBg="bg-sky-100/70"
          iconColor="text-sky-600"
          icon={<ShieldCheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Inactivos"
          value={inactivos}
          note="Cuentas deshabilitadas"
          valueClassName="text-gray-500"
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
          icon={<UsersInactiveIcon className="w-5 h-5" />}
        />
      </KpiRow>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Filtros</h3>
              <button type="button" onClick={limpiarFiltros} className="text-xs font-medium text-purple-600 hover:text-purple-800">
                Limpiar
              </button>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Registrado entre</h4>
              <div className="space-y-2">
                <input
                  type="date"
                  aria-label="Desde"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
                <input
                  type="date"
                  aria-label="Hasta"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rol</h4>
              <Switch checked={rolFiltro.isChecked('cliente')} onChange={(v) => { rolFiltro.toggle('cliente', v); setPagina(1); }} label="Clientes" />
              <Switch checked={rolFiltro.isChecked('admin')} onChange={(v) => { rolFiltro.toggle('admin', v); setPagina(1); }} label="Administradores" />
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Estado</h4>
              <Switch checked={estadoFiltro.isChecked('activo')} onChange={(v) => { estadoFiltro.toggle('activo', v); setPagina(1); }} label="Activos" />
              <Switch checked={estadoFiltro.isChecked('inactivo')} onChange={(v) => { estadoFiltro.toggle('inactivo', v); setPagina(1); }} label="Inactivos" />
            </div>
          </div>

          <PercentBarList
            title="Distribución de cuentas"
            rows={[
              { label: 'Activos', value: activos, pct: pct(activos), colorClass: 'text-emerald-700', borderClass: 'border-emerald-100' },
              { label: 'Inactivos', value: inactivos, pct: pct(inactivos), colorClass: 'text-gray-600', borderClass: 'border-gray-200' },
              { label: 'Administradores', value: admins, pct: pct(admins), colorClass: 'text-sky-700', borderClass: 'border-sky-100' },
            ]}
          />
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <UsuariosIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Usuarios registrados
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filtrados.length} usuario{filtrados.length === 1 ? '' : 's'} encontrado{filtrados.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagina(1);
                  }}
                  placeholder="Buscar por nombre o email..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-72"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-400">Cargando...</td>
                    </tr>
                  ) : usuariosPagina.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-400">No se encontraron usuarios.</td>
                    </tr>
                  ) : (
                    usuariosPagina.map((u) => {
                      const activo = u.isActive !== false;
                      const esYo = u.email === currentUser?.email;
                      const pendienteToggle = toggleActive.isPending && toggleActive.variables === u._id;
                      const pendienteRol = setRole.isPending && setRole.variables?.id === u._id;
                      return (
                        <tr key={u._id}>
                          <td className="p-3 pl-6">
                            <img
                              src={u.profileImage || FALLBACK_AVATAR}
                              alt={u.name || 'Usuario'}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = FALLBACK_AVATAR;
                              }}
                            />
                          </td>
                          <td className="p-3 font-semibold">{u.name || '—'}</td>
                          <td className="p-3">
                            {u.email ? (
                              <a href={`mailto:${u.email}`} className="text-purple-600 hover:text-purple-800 hover:underline">
                                {u.email}
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-3">
                            {u.phone ? (
                              <a
                                href={`https://wa.me/${numeroWhatsapp(u.phone)}`}
                                target="_blank"
                                rel="noopener"
                                className="text-emerald-600 hover:text-emerald-800 hover:underline inline-flex items-center gap-1.5"
                              >
                                {u.phone}
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-3">
                            {u.role === 'admin' ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">Administrador</span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Cliente</span>
                            )}
                          </td>
                          <td className="p-3">
                            {activo ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">Activo</span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Inactivo</span>
                            )}
                          </td>
                          <td className="p-3">{formatoFechaCorta(u.createdAt)}</td>
                          <td className="p-3">
                            {esYo ? (
                              <span className="text-xs text-gray-400">Tu cuenta</span>
                            ) : (
                              <div className="flex flex-col gap-1.5">
                                <button
                                  type="button"
                                  disabled={pendienteToggle}
                                  onClick={() => handleToggleActive(u)}
                                  className={`text-xs font-semibold px-2 py-1 rounded-lg transition disabled:opacity-60 ${
                                    activo ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  }`}
                                >
                                  {pendienteToggle ? '...' : activo ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                                <button
                                  type="button"
                                  disabled={pendienteRol}
                                  onClick={() => handleChangeRole(u)}
                                  className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition disabled:opacity-60"
                                >
                                  {pendienteRol ? '...' : 'Cambiar Rol'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination totalItems={filtrados.length} porPagina={USUARIOS_POR_PAGINA} paginaActiva={pagina} onChange={setPagina} />
          </div>
        </div>
      </div>
    </div>
  );
}
