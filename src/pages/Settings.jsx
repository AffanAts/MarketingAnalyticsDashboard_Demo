import { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';

const THRESHOLD_KEYS = [
  { key: 'awareness_to_interest', label: 'Awareness → Interest', description: 'Batas wajar dropout dari total reach ke inquiry masuk' },
  { key: 'interest_to_consideration', label: 'Interest → Consideration', description: 'Batas wajar dropout dari inquiry ke proposal' },
  { key: 'consideration_to_purchase', label: 'Consideration → Purchase', description: 'Batas wajar dropout dari proposal ke deal' },
  { key: 'purchase_to_retention', label: 'Purchase → Retention', description: 'Batas wajar dropout dari deal ke repeat order' },
  { key: 'retention_to_advocacy', label: 'Retention → Advocacy', description: 'Batas wajar dropout dari retention ke advocacy' },
];

export default function Settings({ appData }) {
  const { thresholds, updateThresholds } = appData;
  const [local, setLocal] = useState(thresholds);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocal(thresholds);
  }, [thresholds]);

  function handleChange(key, value) {
    setLocal((prev) => ({ ...prev, [key]: Number(value) }));
    setSaved(false);
  }

  function handleSave() {
    updateThresholds(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    const defaults = {
      awareness_to_interest: 95,
      interest_to_consideration: 50,
      consideration_to_purchase: 40,
      purchase_to_retention: 60,
      retention_to_advocacy: 50,
    };
    setLocal(defaults);
    updateThresholds(defaults);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <PageLayout
      title="Pengaturan"
      subtitle="Konfigurasi threshold funnel"
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>Reset Default</Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            {saved ? '✓ Tersimpan' : 'Simpan Perubahan'}
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5 text-sm text-blue-800">
          <strong>Apa itu threshold?</strong> Threshold adalah batas wajar persentase dropout antar tahap. Jika dropout melebihi batas ini, sistem akan memberi peringatan di funnel chart.
        </div>

        <div className="bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-900">Threshold Dropout Funnel</h2>
            <p className="text-xs text-gray-500 mt-0.5">Atur batas wajar persentase dropout untuk setiap transisi tahap</p>
          </div>

          <div className="divide-y divide-gray-100">
            {THRESHOLD_KEYS.map(({ key, label, description }) => (
              <div key={key} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-lg font-bold text-blue-600 w-12 text-right">{local[key]}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-6">0</span>
                  <input
                    type="range"
                    className="crm-slider flex-1"
                    min="0"
                    max="100"
                    step="5"
                    value={local[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${local[key]}%, #E2E8F0 ${local[key]}%, #E2E8F0 100%)`,
                    }}
                  />
                  <span className="text-xs text-gray-400 w-8">100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Perubahan berlaku segera setelah disimpan.</p>
              <Button variant="primary" size="md" onClick={handleSave}>
                {saved ? '✓ Tersimpan' : 'Simpan'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
