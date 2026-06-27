export function formatNumber(n) {
  if (!n && n !== 0) return '-';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + ' jt';
  if (n >= 1000) return (n / 1000).toFixed(1) + ' rb';
  return String(n);
}

export function formatCurrency(n) {
  if (!n) return '-';
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPercent(n) {
  return n + '%';
}
