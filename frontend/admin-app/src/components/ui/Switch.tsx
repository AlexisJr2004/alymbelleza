interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track" />
      {label}
    </label>
  );
}
