export const STAGES = [
  {
    id: 'awareness',
    label: 'Awareness',
    sublabel: 'Traffic Website',
    description: 'Reach & impresi kanal digital',
    color: '#6366F1',
    bgColor: '#EEF2FF',
    textColor: '#4338CA',
  },
  {
    id: 'interest',
    label: 'Interest',
    sublabel: 'WhatsApp Chat',
    description: 'Calon klien menghubungi via DM/WhatsApp',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    textColor: '#1D4ED8',
  },
  {
    id: 'consideration',
    label: 'Consideration',
    sublabel: 'Proposal Request',
    description: 'Proposal resmi dikirimkan',
    color: '#0EA5E9',
    bgColor: '#F0F9FF',
    textColor: '#0369A1',
  },
  {
    id: 'purchase',
    label: 'Purchase',
    sublabel: 'Deal',
    description: 'Deal / kontrak ditandatangani',
    color: '#10B981',
    bgColor: '#ECFDF5',
    textColor: '#059669',
  },
  {
    id: 'retention',
    label: 'Retention',
    sublabel: 'Repeat Order',
    description: 'Klien kembali menggunakan jasa',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    textColor: '#D97706',
  },
  {
    id: 'advocacy',
    label: 'Advocacy',
    sublabel: 'Recommendation',
    description: 'Klien aktif merekomendasikan jasa',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    textColor: '#7C3AED',
  },
];

export const INQUIRY_STAGES = STAGES.filter((s) => s.id !== 'awareness');
export const INQUIRY_STAGE_IDS = INQUIRY_STAGES.map((s) => s.id);

export const getStageById = (id) => STAGES.find((s) => s.id === id);
export const getStageIndex = (id) => INQUIRY_STAGE_IDS.indexOf(id);
