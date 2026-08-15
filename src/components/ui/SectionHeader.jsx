export default function SectionHeader({ number, label }) {
  return (
    <div className="mb-6">
      <span className="font-mono text-xs font-bold tracking-[0.2em] text-navy/70 uppercase">
        ▼ {String(number).padStart(2, '0')} · {label}
      </span>
    </div>
  );
}
