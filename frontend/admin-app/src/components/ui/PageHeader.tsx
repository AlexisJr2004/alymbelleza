interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="admin-page-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
      <div className="min-w-0 max-w-2xl">
        <p className="admin-eyebrow text-coral">{eyebrow}</p>
        <h1 className="font-display text-[23px] sm:text-[24px] font-normal leading-tight tracking-tight text-ink">{title}</h1>
        <p className="text-xs leading-relaxed text-muted mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}
