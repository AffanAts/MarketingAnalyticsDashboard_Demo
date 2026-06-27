import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/formatters';

export default function WebsiteMetrics({ appData }) {
  const { websiteMetrics, addWebsiteMetric, updateWebsiteMetric, deleteWebsiteMetric } = appData;

  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: '', domainAuthority: '', pageAuthority: '' });

  const sorted = useMemo(() => [...websiteMetrics].sort((a, b) => a.date.localeCompare(b.date)), [websiteMetrics]);

  // Sample every 4th for chart display to avoid overcrowding
  const chartData = useMemo(() => {
    return sorted.map((m) => ({
      date: m.date.slice(0, 7),
      da: m.domainAuthority,
      pa: m.pageAuthority,
      id: m.id,
    }));
  }, [sorted]);

  const latest = sorted[sorted.length - 1];

  function handleAdd() {
    if (!form.date || !form.domainAuthority || !form.pageAuthority) {
      alert('Semua field wajib diisi.');
      return;
    }
    addWebsiteMetric({
      date: form.date,
      domainAuthority: parseInt(form.domainAuthority, 10),
      pageAuthority: parseInt(form.pageAuthority, 10),
    });
    setForm({ date: '', domainAuthority: '', pageAuthority: '' });
    setShowAddForm(false);
  }

  function handleEdit(m) {
    setEditId(m.id);
    setForm({ date: m.date, domainAuthority: String(m.domainAuthority), pageAuthority: String(m.pageAuthority) });
  }

  function handleSaveEdit() {
    if (!form.date || !form.domainAuthority || !form.pageAuthority) {
      alert('Semua field wajib diisi.');
      return;
    }
    updateWebsiteMetric(editId, {
      date: form.date,
      domainAuthority: parseInt(form.domainAuthority, 10),
      pageAuthority: parseInt(form.pageAuthority, 10),
    });
    setEditId(null);
    setForm({ date: '', domainAuthority: '', pageAuthority: '' });
  }

  return (
    <PageLayout
      title="PA & DA Website"
      subtitle="Tren Domain Authority dan Page Authority"
      actions={
        <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Batal' : '+ Tambah Data'}
        </Button>
      }
    >
      {/* Info banner */}
      <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-start gap-3">
        <span className="mt-0.5">ℹ</span>
        <div>
          <p className="font-semibold">Data via Moz API (otomatis)</p>
          <p className="text-xs text-blue-700 mt-0.5">Nilai DA & PA diambil secara otomatis dari <strong>Moz Link Explorer API</strong> setiap minggu. <span className="text-amber-700 font-medium">⚠ Demo Mode — data pada tampilan ini adalah data simulasi.</span></p>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5 mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Tambah Data DA/PA</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal</label>
              <input type="date" className="px-2.5 py-2 border border-gray-200 rounded-md text-sm" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Domain Authority</label>
              <input type="number" min="0" max="100" className="px-2.5 py-2 border border-gray-200 rounded-md text-sm w-28" value={form.domainAuthority} onChange={(e) => setForm((p) => ({ ...p, domainAuthority: e.target.value }))} placeholder="0-100" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Page Authority</label>
              <input type="number" min="0" max="100" className="px-2.5 py-2 border border-gray-200 rounded-md text-sm w-28" value={form.pageAuthority} onChange={(e) => setForm((p) => ({ ...p, pageAuthority: e.target.value }))} placeholder="0-100" />
            </div>
            <Button variant="primary" size="md" onClick={handleAdd}>Simpan</Button>
          </div>
        </div>
      )}

      {/* Stats */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm ring-1 ring-black ring-opacity-5" style={{ borderTopColor: '#10B981', borderTopWidth: 3 }}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">DA Terkini</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{latest.domainAuthority}</p>
            <p className="text-xs text-gray-500">{formatDate(latest.date)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm ring-1 ring-black ring-opacity-5" style={{ borderTopColor: '#F59E0B', borderTopWidth: 3 }}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">PA Terkini</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{latest.pageAuthority}</p>
            <p className="text-xs text-gray-500">{formatDate(latest.date)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm ring-1 ring-black ring-opacity-5" style={{ borderTopColor: '#3B82F6', borderTopWidth: 3 }}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Data Poin</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{websiteMetrics.length}</p>
            <p className="text-xs text-gray-500">Rekaman mingguan</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm ring-1 ring-black ring-opacity-5" style={{ borderTopColor: '#8B5CF6', borderTopWidth: 3 }}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">DA Awal</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{sorted[0]?.domainAuthority ?? '—'}</p>
            <p className="text-xs text-gray-500">{formatDate(sorted[0]?.date)}</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Tren DA & PA dari Waktu ke Waktu</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} interval="preserveStartEnd" />
            <YAxis domain={[0, 50]} tick={{ fontSize: 11, fill: '#64748B' }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="da" name="Domain Authority" stroke="#10B981" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="pa" name="Page Authority" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* History table */}
      <div className="bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Riwayat Data DA/PA</h2>
          <span className="text-xs text-gray-500">{websiteMetrics.length} entri</span>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['Tanggal', 'Domain Authority', 'Page Authority', 'Aksi'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...sorted].reverse().map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 border-b border-gray-100 text-sm text-gray-700">
                    {editId === m.id ? (
                      <input type="date" className="px-2 py-1 border border-gray-200 rounded text-sm" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
                    ) : formatDate(m.date)}
                  </td>
                  <td className="px-3 py-2.5 border-b border-gray-100">
                    {editId === m.id ? (
                      <input type="number" min="0" max="100" className="px-2 py-1 border border-gray-200 rounded text-sm w-20" value={form.domainAuthority} onChange={(e) => setForm((p) => ({ ...p, domainAuthority: e.target.value }))} />
                    ) : <span className="font-bold text-green-700">{m.domainAuthority}</span>}
                  </td>
                  <td className="px-3 py-2.5 border-b border-gray-100">
                    {editId === m.id ? (
                      <input type="number" min="0" max="100" className="px-2 py-1 border border-gray-200 rounded text-sm w-20" value={form.pageAuthority} onChange={(e) => setForm((p) => ({ ...p, pageAuthority: e.target.value }))} />
                    ) : <span className="font-bold text-amber-600">{m.pageAuthority}</span>}
                  </td>
                  <td className="px-3 py-2.5 border-b border-gray-100 whitespace-nowrap">
                    {editId === m.id ? (
                      <div className="flex gap-1">
                        <button className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200 font-semibold hover:bg-green-100" onClick={handleSaveEdit}>Simpan</button>
                        <button className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600 border border-gray-200 font-semibold hover:bg-gray-100" onClick={() => setEditId(null)}>Batal</button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200 font-semibold hover:bg-blue-100" onClick={() => handleEdit(m)}>Edit</button>
                        <button className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 border border-red-200 font-semibold hover:bg-red-100" onClick={() => { if (window.confirm('Hapus data ini?')) deleteWebsiteMetric(m.id); }}>Hapus</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
