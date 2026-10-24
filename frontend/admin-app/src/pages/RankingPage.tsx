import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
import StatCardMobile from '../components/ui/StatCardMobile';
import ClienteRankingCard from '../components/ui/ClienteRankingCard';
import Pagination from '../components/ui/Pagination';
import { TrophyIcon, UsuariosIcon, DollarIcon, BarsIcon, SearchIcon } from '../components/icons';
import { useOrdersQuery } from '../hooks/useOrders';
import { useUsersQuery } from '../hooks/useUsers';
import { calcularClientesActivos } from '../lib/ranking';
import { formatoMoneda, numeroWhatsapp } from '../lib/format';

const RANKING_POR_PAGINA = 10;
const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

export default function RankingPage() {
  const { data: orders = [] } = useOrdersQuery();
  const { data: users = [] } = useUsersQuery();

  const [search, setSearch] = useState('');
  const [pagina, setPagina] = useState(1);

  const clientesActivos = useMemo(() => calcularClientesActivos(orders, users), [orders, users]);

  const filtrados = useMemo(() => {
    const texto = search.trim().toLowerCase();
    if (!texto) return clientesActivos;
    return clientesActivos.filter(
      (c) => c.nombre.toLowerCase().includes(texto) || c.email.toLowerCase().includes(texto)
    );
  }, [clientesActivos, search]);

  const totalGastado = clientesActivos.reduce((sum, c) => sum + c.gastado, 0);
  const promedio = clientesActivos.length ? totalGastado / clientesActivos.length : 0;
  const lider = clientesActivos[0];

  // Porcentajes para los anillos de progreso de las tarjetas de estadística
  // en móvil: % de usuarios registrados que han comprado, y qué fracción de
  // los pedidos totales (entre clientes con compras) representa el líder.
  const totalPedidosClientes = clientesActivos.reduce((sum, c) => sum + c.total, 0);
  const pctClientesConCompra = users.length ? Math.round((clientesActivos.length / users.length) * 100) : 0;
  const pctLider = lider && totalPedidosClientes ? Math.round((lider.total / totalPedidosClientes) * 100) : 0;

  const inicio = (pagina - 1) * RANKING_POR_PAGINA;
  const paginaActual = filtrados.slice(inicio, inicio + RANKING_POR_PAGINA);

  return (
    <div>
      <PageHeader
        eyebrow="Clientes"
        title="Ranking de clientes"
        description="Todos los clientes con compras realizadas, ordenados por cantidad de pedidos."
      />

      <div className="grid grid-cols-2 gap-3 mb-6 lg:hidden">
        <StatCardMobile
          icon={<UsuariosIcon className="w-5 h-5" />}
          percent={pctClientesConCompra}
          label="Clientes con compras"
          value={clientesActivos.length}
        />
        <StatCardMobile
          icon={<TrophyIcon className="w-5 h-5" />}
          percent={pctLider}
          label="Líder actual"
          value={lider ? lider.nombre : '—'}
          highlighted
        />
        <StatCardMobile
          icon={<DollarIcon className="w-5 h-5" />}
          percent={100}
          label="Total en compras"
          value={formatoMoneda(totalGastado)}
        />
        <StatCardMobile
          icon={<BarsIcon className="w-5 h-5" />}
          percent={100}
          label="Promedio por cliente"
          value={formatoMoneda(promedio)}
        />
      </div>

      <KpiRow>
        <KpiCard
          label="Clientes con compras"
          value={clientesActivos.length}
          note="Al menos un pedido"
          iconBg="bg-ink/5"
          iconColor="text-ink"
          icon={<UsuariosIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Líder actual"
          value={lider ? lider.nombre : '—'}
          note={lider ? `${lider.total} pedidos` : 'Sin compras todavía'}
          valueClassName="text-coral"
          iconBg="bg-coral/15"
          iconColor="text-coral"
          icon={<TrophyIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Total en compras"
          value={formatoMoneda(totalGastado)}
          note="Entre todos los clientes"
          valueClassName="text-sky"
          iconBg="bg-sky/15"
          iconColor="text-sky"
          icon={<DollarIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Promedio por cliente"
          value={formatoMoneda(promedio)}
          note="Gasto promedio"
          iconBg="bg-[#eef0f4]"
          iconColor="text-muted"
          icon={<BarsIcon className="w-5 h-5" />}
        />
      </KpiRow>

      {/* Debajo de las KPI: el mismo contenedor de ranking que Resumen, a la
          izquierda, y a la derecha el listado completo con buscador y
          paginación. items-start porque ambos bloques tienen alturas muy
          distintas y no hace falta igualarlas acá. */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
        <div className="lg:col-span-2">
          <ClienteRankingCard clientes={clientesActivos} />
        </div>

        <div className="lg:col-span-3 glass p-6 md:p-8">
          <div className="glass-toolbar flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-ink flex items-center">
                <TrophyIcon className="w-5 h-5 mr-2 text-coral" />
                Ranking completo
              </h2>
              <p className="text-sm text-muted mt-1">
                {filtrados.length} cliente{filtrados.length === 1 ? '' : 's'} encontrado{filtrados.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="relative">
              <SearchIcon className="pointer-events-none z-10 w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar por nombre o email..."
                className="glass-input pl-10 pr-4 py-2.5 rounded-full text-sm w-full md:w-72"
              />
            </div>
          </div>

          <div className="glass-inset overflow-x-auto rounded-[22px]">
            <table className="glass-table min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Pedidos</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Total gastado</th>
                </tr>
              </thead>
              <tbody>
                {paginaActual.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted">
                      No se encontraron clientes.
                    </td>
                  </tr>
                ) : (
                  paginaActual.map((c, i) => (
                    <tr key={c.email}>
                      <td className="p-3 pl-6">
                        <span className="glass-inset grid h-7 w-7 place-items-center rounded-full text-xs font-semibold text-ink">
                          {inicio + i + 1}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.profileImage || FALLBACK_AVATAR}
                            alt={c.nombre}
                            className="w-9 h-9 rounded-full object-cover border border-white/80"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = FALLBACK_AVATAR;
                            }}
                          />
                          <span className="font-semibold text-ink">{c.nombre}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <a href={`mailto:${c.email}`} className="text-sky hover:text-sky/70 hover:underline">
                          {c.email}
                        </a>
                      </td>
                      <td className="p-3">
                        {c.phone ? (
                          <a
                            href={`https://wa.me/${numeroWhatsapp(c.phone)}`}
                            target="_blank"
                            rel="noopener"
                            className="text-emerald-600 hover:text-emerald-800 hover:underline"
                          >
                            {c.phone}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-3 text-right font-semibold text-ink">{c.total}</td>
                      <td className="p-3 text-right font-semibold text-sky">{formatoMoneda(c.gastado)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination totalItems={filtrados.length} porPagina={RANKING_POR_PAGINA} paginaActiva={pagina} onChange={setPagina} />
        </div>
      </div>
    </div>
  );
}
