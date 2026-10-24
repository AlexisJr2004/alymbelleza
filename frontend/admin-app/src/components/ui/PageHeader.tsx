interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6 lg:mb-8">
      <div className="min-w-0 max-w-2xl">
        <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky shadow-[0_0_0_3px_rgba(126,156,227,0.12)]" />
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        <p className="text-sm leading-relaxed text-muted mt-2">{description}</p>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2 pt-1">{action}</div>}
    </div>
  );
}
