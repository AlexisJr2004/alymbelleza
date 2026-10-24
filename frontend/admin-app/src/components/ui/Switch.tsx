interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex min-h-10 items-center gap-2.5 text-sm text-muted cursor-pointer">
      <input
        type="checkbox"
        role="switch"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track" />
      {label}
    </label>
  );
}
