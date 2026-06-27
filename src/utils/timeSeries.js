const MONTHS_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

function formatMonthShort(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${MONTHS_ID[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

function monthKey(iso) {
  return (iso || '').slice(0, 7);
}

export function buildSeoInquiryCorrelation(inquiries, websiteMetrics) {
  const inquiryByMonth = {};
  (inquiries || []).forEach((inq) => {
    const key = monthKey(inq.tanggalMasuk);
    if (!key) return;
    inquiryByMonth[key] = (inquiryByMonth[key] || 0) + 1;
  });

  const seoByMonth = {};
  (websiteMetrics || []).forEach((m) => {
    const key = monthKey(m.date);
    seoByMonth[key] = { da: m.domainAuthority, pa: m.pageAuthority };
  });

  const months = Array.from(
    new Set([...Object.keys(inquiryByMonth), ...Object.keys(seoByMonth)])
  ).sort();

  return months.map((key) => ({
    monthKey: key,
    month: formatMonthShort(key + '-01'),
    inquiries: inquiryByMonth[key] || 0,
    da: seoByMonth[key]?.da ?? null,
    pa: seoByMonth[key]?.pa ?? null,
  }));
}
