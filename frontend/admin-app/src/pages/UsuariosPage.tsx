import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
import StatCardMobile from '../components/ui/StatCardMobile';
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

      <div className="grid grid-cols-2 gap-3 mb-6 lg:hidden">
        <StatCardMobile
          icon={<UsuariosIcon className="w-5 h-5" />}
          iconBg="bg-ink/5"
          iconColor="text-ink"
          ringColor="#16181d"
          percent={100}
          label="Total clientes"
          value={total}
        />
        <StatCardMobile
          icon={<CheckIcon className="w-5 h-5" />}
          iconBg="bg-sky/15"
          iconColor="text-sky"
          ringColor="#7e9ce3"
          percent={pct(activos)}
          label="Activos"
          value={activos}
        />
        <StatCardMobile
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          iconBg="bg-coral/15"
          iconColor="text-coral"
          ringColor="#e2766f"
          percent={pct(admins)}
          label="Administradores"
          value={admins}
        />
        <StatCardMobile
          icon={<UsersInactiveIcon className="w-5 h-5" />}
          iconBg="bg-[#eef0f4]"
          iconColor="text-muted"
          ringColor="#8a8f9a"
          percent={pct(inactivos)}
          label="Inactivos"
          value={inactivos}
        />
      </div>

      <KpiRow>
        <KpiCard
          label="Total clientes"
          value={total}
          note="Usuarios registrados"
          iconBg="bg-ink/5"
          iconColor="text-ink"
          icon={<UsuariosIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Activos"
          value={activos}
          note="Cuentas habilitadas"
          valueClassName="text-sky"
          iconBg="bg-sky/15"
          iconColor="text-sky"
          icon={<CheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Administradores"
          value={admins}
          note="Con permisos totales"
          valueClassName="text-coral"
          iconBg="bg-coral/15"
          iconColor="text-coral"
          icon={<ShieldCheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Inactivos"
          value={inactivos}
          note="Cuentas deshabilitadas"
          valueClassName="text-muted"
          iconBg="bg-[#eef0f4]"
          iconColor="text-muted"
          icon={<UsersInactiveIcon className="w-5 h-5" />}
        />
      </KpiRow>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="glass p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wide">Filtros</h3>
              <button type="button" onClick={limpiarFiltros} className="text-xs font-medium text-coral hover:text-coral/80">
                Limpiar
              </button>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Registrado entre</h4>
              <div className="space-y-2">
                <input
                  type="date"
                  aria-label="Desde"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-1.5 border border-white/80 bg-white/60 rounded-full text-sm focus:ring-2 focus:ring-sky/50 focus:outline-none"
                />
                <input
                  type="date"
                  aria-label="Hasta"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-1.5 border border-white/80 bg-white/60 rounded-full text-sm focus:ring-2 focus:ring-sky/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-white/70 space-y-2">
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Rol</h4>
              <Switch checked={rolFiltro.isChecked('cliente')} onChange={(v) => { rolFiltro.toggle('cliente', v); setPagina(1); }} label="Clientes" />
              <Switch checked={rolFiltro.isChecked('admin')} onChange={(v) => { rolFiltro.toggle('admin', v); setPagina(1); }} label="Administradores" />
            </div>
            <div className="pt-4 border-t border-white/70 space-y-2">
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Estado</h4>
              <Switch checked={estadoFiltro.isChecked('activo')} onChange={(v) => { estadoFiltro.toggle('activo', v); setPagina(1); }} label="Activos" />
              <Switch checked={estadoFiltro.isChecked('inactivo')} onChange={(v) => { estadoFiltro.toggle('inactivo', v); setPagina(1); }} label="Inactivos" />
            </div>
          </div>

          <PercentBarList
            title="Distribución de cuentas"
            rows={[
              { label: 'Activos', value: activos, pct: pct(activos), colorClass: 'text-sky', borderClass: 'border-sky/25' },
              { label: 'Inactivos', value: inactivos, pct: pct(inactivos), colorClass: 'text-muted', borderClass: 'border-white/70' },
              { label: 'Administradores', value: admins, pct: pct(admins), colorClass: 'text-coral', borderClass: 'border-coral/25' },
            ]}
          />
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="glass p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-ink flex items-center">
                  <UsuariosIcon className="w-5 h-5 mr-2 text-coral" />
                  Usuarios registrados
                </h2>
                <p className="text-sm text-muted mt-1">
                  {filtrados.length} usuario{filtrados.length === 1 ? '' : 's'} encontrado{filtrados.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagina(1);
                  }}
                  placeholder="Buscar por nombre o email..."
                  className="pl-10 pr-4 py-2 border border-white/80 bg-white/60 rounded-full focus:ring-2 focus:ring-sky/50 focus:border-transparent focus:outline-none w-full md:w-72"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-[22px] border border-white/70">
              <table className="min-w-full divide-y divide-white/70">
                <thead className="bg-white/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Foto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Registrado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="bg-white/20 divide-y divide-white/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-muted">Cargando...</td>
                    </tr>
                  ) : usuariosPagina.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-muted">No se encontraron usuarios.</td>
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
                              className="w-9 h-9 rounded-full object-cover border border-white/80"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = FALLBACK_AVATAR;
                              }}
                            />
                          </td>
                          <td className="p-3 font-semibold text-ink">{u.name || '—'}</td>
                          <td className="p-3">
                            {u.email ? (
                              <a href={`mailto:${u.email}`} className="text-sky hover:text-sky/70 hover:underline">
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
                              <span className="status bg-coral">Administrador</span>
                            ) : (
                              <span className="status bg-muted">Cliente</span>
                            )}
                          </td>
                          <td className="p-3">
                            {activo ? (
                              <span className="status bg-sky">Activo</span>
                            ) : (
                              <span className="status bg-[#9aa0ac]">Inactivo</span>
                            )}
                          </td>
                          <td className="p-3 text-[#3a3d45]">{formatoFechaCorta(u.createdAt)}</td>
                          <td className="p-3">
                            {esYo ? (
                              <span className="text-xs text-muted">Tu cuenta</span>
                            ) : (
                              <div className="flex flex-col gap-1.5">
                                <button
                                  type="button"
                                  disabled={pendienteToggle}
                                  onClick={() => handleToggleActive(u)}
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-full transition disabled:opacity-60 ${
                                    activo ? 'bg-coral/10 text-coral hover:bg-coral/20' : 'bg-sky/10 text-sky hover:bg-sky/20'
                                  }`}
                                >
                                  {pendienteToggle ? '...' : activo ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                                <button
                                  type="button"
                                  disabled={pendienteRol}
                                  onClick={() => handleChangeRole(u)}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/60 text-[#3a3d45] hover:bg-white/90 transition disabled:opacity-60"
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
