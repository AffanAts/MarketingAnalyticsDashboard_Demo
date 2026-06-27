import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/ui/StatCard';
import FunnelChart from '../components/charts/FunnelChart';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { computeFunnelData, getActiveInquiries, getDroppedInquiries } from '../utils/funnelUtils';
import { getStageById, getStageIndex } from '../constants/stages';
import { getChannelById } from '../constants/channels';
import { getSumberById, SUMBER_TYPES } from '../constants/sumber';
import { formatDate, formatCurrency } from '../utils/formatters';
import { buildSeoInquiryCorrelation } from '../utils/timeSeries';
import { computeAvgTimeToPurchase, computeAgeDays, computeDaysInCurrentStage } from '../utils/stageAge';

export default function Dashboard({ appData }) {
  const { inquiries, awarenessMetrics, websiteMetrics, thresholds } = appData;
  const [detailInq, setDetailInq] = useState(null);

  const funnelData = useMemo(
    () => computeFunnelData(inquiries, awarenessMetrics.totalReach),
    [inquiries, awarenessMetrics.totalReach]
  );

  const activeInquiries = useMemo(() => getActiveInquiries(inquiries), [inquiries]);
  const droppedInquiries = useMemo(() => getDroppedInquiries(inquiries), [inquiries]);
  const cycleStats = useMemo(() => computeAvgTimeToPurchase(inquiries), [inquiries]);

  const interestCount = funnelData.find((f) => f.stageId === 'interest')?.count ?? 0;
  const purchaseCount = funnelData.find((f) => f.stageId === 'purchase')?.count ?? 0;
  const overallRate = interestCount > 0 ? ((purchaseCount / interestCount) * 100).toFixed(1) : '0';

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const correlationData = useMemo(
    () => buildSeoInquiryCorrelation(inquiries, websiteMetrics),
    [inquiries, websiteMetrics]
  );

  const dealBySumber = useMemo(() => {
    const purchaseIdx = getStageIndex('purchase');
    const deals = inquiries.filter((inq) => {
      if (inq.isDropped) return false;
      return getStageIndex(inq.currentStage) >= purchaseIdx;
    });
    const total = deals.length;
    const counts = {};
    deals.forEach((inq) => {
      const key = inq.sumber || 'other';
      counts[key] = (counts[key] || 0) + 1;
    });
    return { total, counts };
  }, [inquiries]);

  const dealPieData = useMemo(() => {
    const { counts, total } = dealBySumber;
    const known = SUMBER_TYPES.map((s) => ({
      name: s.label,
      value: counts[s.id] || 0,
      color: s.color,
      pct: total > 0 ? (((counts[s.id] || 0) / total) * 100).toFixed(1) : '0',
    }));
    return known.filter((d) => d.value > 0);
  }, [dealBySumber]);

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Ringkasan performa digital marketing"
      actions={
        <Link to="/inquiries" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors no-underline">
          + Tambah Inquiry
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-3.5 sm:grid-cols-3 xl:grid-cols-6 mb-4 sm:mb-5">
        <StatCard label="Total Reach" value={awarenessMetrics.totalReach.toLocaleString('id-ID')} sub="via API (otomatis) · simulasi" accent="#6366F1" icon="◎" />
        <StatCard label="Total Inquiry" value={interestCount} sub={`${activeInquiries.length} aktif · ${droppedInquiries.length} drop`} accent="#3B82F6" icon="✉" />
        <StatCard label="Project Deal" value={purchaseCount} sub="Berhasil closing" accent="#10B981" icon="✓" />
        <StatCard label="Konversi" value={overallRate + '%'} sub="Dari inquiry → deal" accent="#F59E0B" icon="◈" />
        <StatCard label="Dropped" value={droppedInquiries.length} sub="Tidak dilanjutkan" accent="#EF4444" icon="✗" />
        <StatCard
          label="Rata-rata Siklus"
          value={cycleStats.avg != null ? `${cycleStats.avg} hari` : '—'}
          sub={cycleStats.count > 0 ? `n=${cycleStats.count} · ${cycleStats.min}–${cycleStats.max} hari` : 'Belum ada data'}
          accent="#0EA5E9"
          icon="⏱"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <section className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Marketing Funnel</h2>
            <Link to="/funnel" className="text-sm font-medium text-blue-600 hover:underline">Lihat detail →</Link>
          </div>
          <FunnelChart funnelData={funnelData} thresholds={thresholds} />
        </section>

        <section className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Inquiry Terbaru</h2>
            <Link to="/inquiries" className="text-sm font-medium text-blue-600 hover:underline">Lihat semua →</Link>
          </div>
          <div className="flex flex-col">
            {recentInquiries.length === 0 && (
              <div className="py-7 text-center text-sm text-gray-500">Belum ada inquiry.</div>
            )}
            {recentInquiries.map((inq) => {
              const stage = getStageById(inq.isDropped ? inq.droppedAtStage : inq.currentStage);
              const channel = getChannelById(inq.channel);
              return (
                <div key={inq.id} className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-100 last:border-b-0">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 truncate">{inq.companyName}</span>
                    <span className="text-xs text-gray-500">
                      {channel?.label ?? inq.channel ?? '—'} · {inq.jenisPenawaran || '—'}
                    </span>
                    <span className="text-xs text-gray-400">{inq.picKlien}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge
                      label={inq.isDropped ? 'Drop' : stage?.label}
                      color={inq.isDropped ? '#EF4444' : stage?.color}
                      bgColor={inq.isDropped ? '#FEF2F2' : stage?.bgColor}
                      size="sm"
                    />
                    <span className="text-xs text-gray-500">{inq.tanggalMasuk ? formatDate(inq.tanggalMasuk) : '—'}</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                      onClick={() => setDetailInq(inq)}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5 mb-4">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900">Korelasi SEO & Volume Inquiry</h2>
          <p className="text-xs text-gray-500 mt-1">Domain Authority & Page Authority vs jumlah inquiry per bulan</p>
        </div>
        {correlationData.length === 0 ? (
          <div className="py-7 text-center text-sm text-gray-500">Belum ada data.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={correlationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748B' }} label={{ value: 'Inquiry', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748B' } }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748B' }} label={{ value: 'DA/PA', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#64748B' } }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="inquiries" name="Inquiry Masuk" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="da" name="Domain Authority" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              <Line yAxisId="right" type="monotone" dataKey="pa" name="Page Authority" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5 mb-4">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900">Asal Deal: Digital Marketing vs Internal</h2>
          <p className="text-xs text-gray-500 mt-1">Dari <strong>{dealBySumber.total}</strong> deal closing, distribusi per sumber</p>
        </div>
        {dealBySumber.total === 0 ? (
          <div className="py-7 text-center text-sm text-gray-500">Belum ada data deal.</div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dealPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {dealPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} deal`, name]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3 flex-1 w-full">
              {dealPieData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value} deal <span className="text-xs font-normal text-gray-500">({item.pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Ringkasan Tiap Tahap Funnel</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {['Tahap', 'Jumlah', 'Drop', 'Konversi', 'Deskripsi'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {funnelData.map((item, idx) => {
                const stage = getStageById(item.stageId);
                if (!stage) return null;
                return (
                  <tr key={item.stageId}>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                      <Badge label={stage.label} color={stage.color} bgColor={stage.bgColor} size="sm" />
                    </td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap font-bold text-base text-gray-900">{(item.count ?? 0).toLocaleString('id-ID')}</td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                      {item.dropoff > 0 ? (
                        <span className="inline-block bg-red-50 text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">−{item.dropoff}</span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                      {idx === 0 ? <span className="text-gray-400">—</span> : (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 rounded-full min-w-1 max-w-40" style={{ width: `${item.conversionRate}%`, background: stage.color }} />
                          <span className="text-xs font-semibold text-gray-600">{item.conversionRate}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle text-xs text-gray-500 hidden sm:table-cell">{stage.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {detailInq && <InquiryDetailModal inq={detailInq} onClose={() => setDetailInq(null)} />}
    </PageLayout>
  );
}

function InquiryDetailModal({ inq, onClose }) {
  const stage = getStageById(inq.isDropped ? inq.droppedAtStage : inq.currentStage);
  const channel = getChannelById(inq.channel);
  const sumber = getSumberById(inq.sumber);
  const totalDays = computeAgeDays(inq);
  const stageDays = computeDaysInCurrentStage(inq);
  const doneCount = (inq.followUps ?? []).filter((f) => f.done).length;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[300] p-4 bg-black/55 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-200">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">{inq.companyName}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={inq.isDropped ? `Drop (${stage?.label})` : stage?.label} color={inq.isDropped ? '#EF4444' : stage?.color} bgColor={inq.isDropped ? '#FEF2F2' : stage?.bgColor} size="sm" />
              {inq.noSurat && <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded">#{inq.noSurat}</span>}
            </div>
          </div>
          <button type="button" className="w-8 h-8 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors" onClick={onClose}>✕</button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto">
          <DetailField label="PIC Klien" value={inq.picKlien} />
          <DetailField label="Telepon" value={inq.phone} />
          <DetailField label="Email" value={inq.email} />
          <DetailField label="Sumber">
            {sumber ? <span className="inline-flex px-2 py-1 rounded text-xs font-semibold" style={{ background: sumber.color + '1A', color: sumber.color }}>{sumber.label}</span> : <span className="text-gray-500 italic">—</span>}
          </DetailField>
          <DetailField label="Kanal">
            {channel ? <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: channel.color }} />{channel.label}</span> : <span className="text-gray-500 italic">—</span>}
          </DetailField>
          <DetailField label="Jenis Penawaran" value={inq.jenisPenawaran} />
          <DetailField label="Nilai Proyek" value={formatCurrency(inq.projectValue)} />
          <DetailField label="Tanggal Masuk" value={formatDate(inq.tanggalMasuk)} />
          <DetailField label="PIC Internal" value={inq.picInternal} />
          <DetailField label="Umur Prospek" value={`${totalDays ?? '—'} hari · ${stageDays ?? '—'} hari di tahap ini`} />
          <DetailField label="Follow Up">
            <span>{doneCount}/3 selesai</span>
          </DetailField>
          {inq.notes && <DetailField label="Catatan" value={inq.notes} fullRow />}
        </div>

        <div className="flex justify-end gap-2.5 p-3.5 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" size="sm" onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, children, fullRow = false }) {
  return (
    <div className={fullRow ? 'col-span-2' : ''}>
      <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</span>
      <span className="block text-sm text-gray-900 break-words">
        {children != null ? children : (value || <span className="text-gray-500 italic">—</span>)}
      </span>
    </div>
  );
}
