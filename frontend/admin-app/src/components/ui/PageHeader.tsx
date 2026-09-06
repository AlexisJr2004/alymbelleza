interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">{eyebrow}</p>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </div>
      {action}
    </div>
  );
}
