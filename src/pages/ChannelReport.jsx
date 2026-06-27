import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/ui/StatCard';
import { getChannelById, CHANNELS } from '../constants/channels';
import { SUMBER_TYPES, getSumberById } from '../constants/sumber';
import { getStageIndex } from '../constants/stages';

export default function ChannelReport({ appData }) {
  const { inquiries } = appData;

  const channelData = useMemo(() => {
    const counts = {};
    inquiries.filter((inq) => inq.sumber === 'digital_marketing').forEach((inq) => {
      const ch = inq.channel || 'other';
      if (!counts[ch]) counts[ch] = { total: 0, deals: 0, proposals: 0 };
      counts[ch].total++;
      if (getStageIndex(inq.currentStage) >= getStageIndex('consideration') || (inq.isDropped && getStageIndex(inq.droppedAtStage) >= getStageIndex('consideration'))) counts[ch].proposals++;
      if (!inq.isDropped && getStageIndex(inq.currentStage) >= getStageIndex('purchase')) counts[ch].deals++;
    });
    return CHANNELS
      .map((ch) => ({
        name: ch.label,
        id: ch.id,
        color: ch.color,
        total: counts[ch.id]?.total || 0,
        proposals: counts[ch.id]?.proposals || 0,
        deals: counts[ch.id]?.deals || 0,
      }))
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [inquiries]);

  const sumberData = useMemo(() => {
    const counts = {};
    inquiries.forEach((inq) => {
      const key = inq.sumber || 'other';
      if (!counts[key]) counts[key] = { total: 0, deals: 0 };
      counts[key].total++;
      if (!inq.isDropped && getStageIndex(inq.currentStage) >= getStageIndex('purchase')) counts[key].deals++;
    });
    return SUMBER_TYPES.map((s) => ({
      name: s.label,
      id: s.id,
      color: s.color,
      total: counts[s.id]?.total || 0,
      deals: counts[s.id]?.deals || 0,
    })).filter((d) => d.total > 0);
  }, [inquiries]);

  const dmCount = inquiries.filter((i) => i.sumber === 'digital_marketing').length;
  const totalDeals = inquiries.filter((i) => !i.isDropped && getStageIndex(i.currentStage) >= getStageIndex('purchase')).length;
  const topChannel = channelData[0];

  return (
    <PageLayout title="Performa Kanal" subtitle="Analisis efektivitas kanal digital marketing">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Inquiry" value={inquiries.length} sub="Semua sumber" accent="#3B82F6" icon="✉" />
        <StatCard label="Digital Marketing" value={dmCount} sub={`${inquiries.length > 0 ? ((dmCount / inquiries.length) * 100).toFixed(0) : 0}% dari total`} accent="#6366F1" icon="📱" />
        <StatCard label="Total Deal" value={totalDeals} sub="Semua sumber" accent="#10B981" icon="✓" />
        <StatCard label="Top Kanal" value={topChannel?.name ?? '—'} sub={topChannel ? `${topChannel.total} inquiry` : 'Belum ada data'} accent="#F59E0B" icon="★" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Inquiry per Kanal Digital</h2>
          {channelData.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">Belum ada data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={channelData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="total" name="Total Inquiry" radius={[4, 4, 0, 0]}>
                  {channelData.map((entry) => <Cell key={entry.id} fill={entry.color} />)}
                </Bar>
                <Bar dataKey="deals" name="Deal Closing" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Inquiry per Sumber</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sumberData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="total" name="Total Inquiry" radius={[4, 4, 0, 0]}>
                {sumberData.map((entry) => <Cell key={entry.id} fill={entry.color} />)}
              </Bar>
              <Bar dataKey="deals" name="Deal Closing" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Tabel Detail Performa Kanal</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {['Kanal', 'Total Inquiry', 'Proposal', 'Deal', 'Konversi (%)'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channelData.map((row) => {
                const ch = getChannelById(row.id);
                const convRate = row.total > 0 ? ((row.deals / row.total) * 100).toFixed(1) : '0';
                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 border-b border-gray-100 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: ch?.color }} />
                        <span className="font-semibold text-gray-800">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle font-bold text-gray-900">{row.total}</td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle text-gray-700">{row.proposals}</td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle">
                      <span className="font-bold text-green-700">{row.deals}</span>
                    </td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${convRate}%`, background: ch?.color }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{convRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {channelData.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-500">Belum ada data kanal digital marketing.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Breakdown Sumber</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['Sumber', 'Total Inquiry', 'Deal', 'Konversi (%)'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sumberData.map((row) => {
                  const s = getSumberById(row.id);
                  const convRate = row.total > 0 ? ((row.deals / row.total) * 100).toFixed(1) : '0';
                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 border-b border-gray-100 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: s?.color }} />
                          <span className="font-semibold text-gray-800">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle font-bold text-gray-900">{row.total}</td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle font-bold text-green-700">{row.deals}</td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle text-xs font-semibold text-gray-600">{convRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
