import { useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import FunnelChart from '../components/charts/FunnelChart';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { computeFunnelData } from '../utils/funnelUtils';
import { getStageById } from '../constants/stages';

export default function FunnelAnalysis({ appData }) {
  const { inquiries, awarenessMetrics, thresholds } = appData;

  const funnelData = useMemo(
    () => computeFunnelData(inquiries, awarenessMetrics.totalReach),
    [inquiries, awarenessMetrics.totalReach]
  );

  const interestCount = funnelData.find((f) => f.stageId === 'interest')?.count ?? 0;
  const purchaseCount = funnelData.find((f) => f.stageId === 'purchase')?.count ?? 0;
  const overallRate = interestCount > 0 ? ((purchaseCount / interestCount) * 100).toFixed(1) : '0';

  return (
    <PageLayout title="Analisis Funnel" subtitle="Visualisasi lengkap marketing funnel">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Reach" value={awarenessMetrics.totalReach.toLocaleString('id-ID')} sub="Simulasi impresi digital" accent="#6366F1" icon="◎" />
        <StatCard label="Total Inquiry" value={interestCount} sub="Masuk ke funnel" accent="#3B82F6" icon="✉" />
        <StatCard label="Deal Closing" value={purchaseCount} sub="Berhasil ditandatangani" accent="#10B981" icon="✓" />
        <StatCard label="Konversi Overall" value={overallRate + '%'} sub="Inquiry → Deal" accent="#F59E0B" icon="◈" />
      </div>

      <div className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Marketing Funnel — Visualisasi Lengkap</h2>
        <FunnelChart funnelData={funnelData} thresholds={thresholds} />
      </div>

      <div className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Tabel Konversi Antar Tahap</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {['Tahap', 'Jumlah', 'Drop', 'Konversi dari Sebelumnya', 'Deskripsi'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {funnelData.map((item, idx) => {
                const stage = getStageById(item.stageId);
                if (!stage) return null;
                return (
                  <tr key={item.stageId} className="hover:bg-gray-50">
                    <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                      <Badge label={stage.label} color={stage.color} bgColor={stage.bgColor} size="sm" />
                    </td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap font-bold text-lg text-gray-900">{(item.count ?? 0).toLocaleString('id-ID')}</td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                      {item.dropoff > 0 ? (
                        <span className="inline-block bg-red-50 text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">−{item.dropoff}</span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                      {idx === 0 ? <span className="text-gray-400">—</span> : (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 rounded-full min-w-1 max-w-40 transition-all" style={{ width: `${item.conversionRate}%`, background: stage.color }} />
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
      </div>
    </PageLayout>
  );
}
