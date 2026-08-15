export default function BrutalButton({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-navy text-white hover:bg-navy/90',
    amber: 'bg-amber text-navy hover:bg-amber/90',
    teal: 'bg-teal text-white hover:bg-teal/90',
    danger: 'bg-tampered text-white hover:bg-tampered/90',
    ghost: 'bg-white text-navy hover:bg-cream',
    outline: 'bg-cream text-navy hover:bg-white',
  };

  return (
    <button
      className={`
        brutal-btn px-4 py-2.5 text-sm font-bold
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
