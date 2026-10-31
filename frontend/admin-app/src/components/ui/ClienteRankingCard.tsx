import { Link } from 'react-router-dom';
import { formatoMoneda, numeroWhatsapp } from '../../lib/format';
import type { ClienteRanking } from '../../lib/ranking';

const FALLBACK_AVATAR = `${import.meta.env.BASE_URL}favicon.svg`;

interface ClienteRankingCardProps {
  clientes: ClienteRanking[];
  verTodosHref?: string;
}

// Mismo contenedor en ResumenPage.tsx (con enlace "Ver todos" hacia
// /ranking) y RankingPage.tsx (sin el enlace, ya está en esa página): un
// solo .admin-panel con el N.º 1 destacado (foto circular + datos de contacto) y,
// debajo, los N.º 2 y 3.
export default function ClienteRankingCard({ clientes, verTodosHref }: ClienteRankingCardProps) {
  return (
    <div className="admin-panel p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-coral font-semibold">Ranking</p>
          <h3 className="text-sm font-semibold text-ink mt-1">Clientes con más compras</h3>
        </div>
        {verTodosHref && (
          <Link to={verTodosHref} className="text-xs font-medium text-sky hover:text-sky/70 shrink-0">
            Ver todos
          </Link>
        )}
      </div>

      {clientes.length ? (
        <>
          <div className="flex flex-col items-center rounded-2xl border border-white/80 bg-slate-50 p-3 text-center">
            <div className="relative">
              <img
                src={clientes[0].profileImage || FALLBACK_AVATAR}
                alt={clientes[0].nombre}
                className="h-14 w-14 rounded-full object-cover ring-[3px] ring-white"
                onError={(e) => {
                  if (e.currentTarget.dataset.fallback) return;
                  e.currentTarget.dataset.fallback = 'true';
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
              />
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-bold text-white ring-2 ring-white">
                1
              </span>
            </div>
            <h4 className="mt-2 text-sm font-semibold text-ink">{clientes[0].nombre}</h4>
            <p className="mt-1 text-xs text-muted">{clientes[0].email}</p>
            {clientes[0].phone ? (
              <a
                href={`https://wa.me/${numeroWhatsapp(clientes[0].phone)}`}
                target="_blank"
                rel="noopener"
                className="text-xs text-sky hover:text-sky/70 hover:underline"
              >
                {clientes[0].phone}
              </a>
            ) : (
              <p className="text-xs text-muted">Sin teléfono</p>
            )}
            <div className="mt-2 flex flex-wrap justify-center items-center gap-2 text-xs">
              <span className="rounded-full border border-white/80 bg-white/60 px-3 py-1 font-medium text-[#3a3d45]">
                {clientes[0].total} pedidos
              </span>
              <span className="rounded-full bg-sky/15 px-3 py-1 font-semibold text-sky">
                {formatoMoneda(clientes[0].gastado)}
              </span>
            </div>
          </div>

          {clientes.length > 1 && (
            <div className="mt-4 divide-y divide-white/60 rounded-2xl border border-white/80 bg-white/25 px-4">
              {clientes.slice(1, 3).map((c, i) => (
                <div key={c.email} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/80 bg-white/60 text-xs font-semibold text-[#3a3d45]">
                    {i + 2}
                  </span>
                  <img
                    src={c.profileImage || FALLBACK_AVATAR}
                    alt={c.nombre}
                    className="h-9 w-9 rounded-full object-cover shrink-0"
                    onError={(e) => {
                      if (e.currentTarget.dataset.fallback) return;
                  e.currentTarget.dataset.fallback = 'true';
                      e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{c.nombre}</p>
                    <p className="text-xs text-muted truncate">{c.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-ink">{c.total} pedidos</p>
                    <p className="text-xs text-sky">{formatoMoneda(c.gastado)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-muted py-6 text-sm">Todavía no hay compras de clientes.</p>
      )}
    </div>
  );
}
