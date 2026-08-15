import { ShieldCheck, ShieldAlert, Fingerprint } from 'lucide-react';

const STATUS_CONFIG = {
  sealed: {
    label: 'SEALED',
    bg: 'bg-sealed',
    text: 'text-white',
    icon: Fingerprint,
    glow: 'glow-sealed',
  },
  verified: {
    label: 'VERIFIED',
    bg: 'bg-verified',
    text: 'text-white',
    icon: ShieldCheck,
    glow: 'glow-verified',
  },
  tampered: {
    label: 'TAMPERED',
    bg: 'bg-tampered',
    text: 'text-white',
    icon: ShieldAlert,
    glow: 'glow-tampered',
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.sealed;
  const Icon = config.icon;

  const sizeClasses = size === 'lg'
    ? 'px-4 py-2 text-sm gap-2'
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`
        inline-flex items-center font-mono font-bold uppercase
        brutal-border rounded-sm
        ${config.bg} ${config.text} ${config.glow}
        ${sizeClasses}
      `}
    >
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
}
