export const CHANNELS = [
  { id: 'website', label: 'Website', color: '#2563EB' },
];

export const getChannelById = (id) => CHANNELS.find((c) => c.id === id);
