export default function Badge({ label, color, bgColor, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${sizeClass}`}
      style={{ color, background: bgColor || color + '1A' }}
    >
      {label}
    </span>
  );
}
