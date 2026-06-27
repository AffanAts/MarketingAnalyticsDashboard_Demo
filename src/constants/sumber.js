export const SUMBER_TYPES = [
  { id: 'digital_marketing', label: 'Website (Digital Marketing)', color: '#3B82F6' },
  { id: 'internal', label: 'Internal', color: '#A78BFA' },
];

export const getSumberById = (id) => SUMBER_TYPES.find((s) => s.id === id);

export const JENIS_PENAWARAN = [
  'AMDAL',
  'UKL-UPL',
  'SPPL',
  'KLHS',
  'Audit Lingkungan',
  'Persetujuan Lingkungan',
  'Lainnya',
];
