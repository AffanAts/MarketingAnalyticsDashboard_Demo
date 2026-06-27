import { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/formatters';

const TABS = ['Persetujuan User', 'Audit Log', 'Inquiry Terhapus'];
const ROLES = ['super_admin', 'admin', 'consultant', 'viewer'];

export default function AdminDashboard({ appData }) {
  const { users, auditLogs, deletedInquiries, approveUser, rejectUser, updateUserRole, deleteUser, restoreInquiry } = appData;
  const [activeTab, setActiveTab] = useState(0);

  const pendingUsers = users.filter((u) => u.status === 'pending_approval');
  const approvedUsers = users.filter((u) => u.status === 'approved');

  return (
    <PageLayout title="Admin Panel" subtitle="Manajemen pengguna, log aktivitas, dan data terhapus">
      {/* Tab nav */}
      <div className="flex gap-1 mb-5 bg-white rounded-lg p-1 shadow-sm ring-1 ring-black ring-opacity-5 w-fit">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === idx ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
            {idx === 0 && pendingUsers.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-4 rounded-full text-[0.6rem] font-bold bg-red-500 text-white px-1">
                {pendingUsers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 0: User Approval */}
      {activeTab === 0 && (
        <div className="flex flex-col gap-4">
          {pendingUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 bg-amber-50">
                <h2 className="text-sm font-bold text-amber-800">Menunggu Persetujuan ({pendingUsers.length})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {pendingUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-5 py-4 gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{u.username}</p>
                      <p className="text-xs text-gray-500">{u.email} · Daftar {formatDate(u.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => approveUser(u.id)}>Setujui</Button>
                      <Button variant="danger" size="sm" onClick={() => { if (window.confirm(`Tolak user ${u.username}?`)) rejectUser(u.id); }}>Tolak</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900">Daftar Pengguna ({approvedUsers.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Username', 'Email', 'Role', 'Status', 'Bergabung', 'Aksi'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 border-b border-gray-100 font-semibold text-gray-900">{u.username}</td>
                      <td className="px-3 py-3 border-b border-gray-100 text-gray-600 text-xs">{u.email}</td>
                      <td className="px-3 py-3 border-b border-gray-100">
                        <select
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                          value={u.role || ''}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          disabled={u.id === 1}
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Aktif</span>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
                      <td className="px-3 py-3 border-b border-gray-100">
                        {u.id !== 1 && (
                          <button
                            className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 border border-red-200 font-semibold hover:bg-red-100"
                            onClick={() => { if (window.confirm(`Hapus user ${u.username}?`)) deleteUser(u.id); }}
                          >
                            Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Audit Logs */}
      {activeTab === 1 && (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Log Aktivitas</h2>
            <span className="text-xs text-gray-500">{auditLogs.length} entri</span>
          </div>
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {['Waktu', 'User', 'Aksi', 'Entitas', 'Catatan'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 border-b border-gray-100 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-3 py-2.5 border-b border-gray-100 text-xs font-semibold text-gray-700 whitespace-nowrap">{log.username}</td>
                    <td className="px-3 py-2.5 border-b border-gray-100 whitespace-nowrap">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-3 py-2.5 border-b border-gray-100 text-xs text-gray-500 whitespace-nowrap">{log.entityType ?? '—'}</td>
                    <td className="px-3 py-2.5 border-b border-gray-100 text-xs text-gray-700">{log.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Deleted Inquiries */}
      {activeTab === 2 && (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-900">Inquiry Terhapus ({deletedInquiries.length})</h2>
            <p className="text-xs text-gray-500 mt-0.5">Data yang dihapus dari sistem — dapat dipulihkan</p>
          </div>
          {deletedInquiries.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-500">Tidak ada inquiry yang dihapus.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Perusahaan', 'PIC Klien', 'Jenis', 'Dihapus', 'Aksi'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2 border-b border-gray-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deletedInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 border-b border-gray-100 font-semibold text-gray-900">{inq.companyName}</td>
                      <td className="px-3 py-3 border-b border-gray-100 text-gray-700">{inq.picKlien}</td>
                      <td className="px-3 py-3 border-b border-gray-100 text-xs text-gray-600">{inq.jenisPenawaran}</td>
                      <td className="px-3 py-3 border-b border-gray-100 text-xs text-gray-500">{inq.deletedAt ? formatDate(inq.deletedAt) : '—'}</td>
                      <td className="px-3 py-3 border-b border-gray-100">
                        <button
                          className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold hover:bg-purple-100"
                          onClick={() => restoreInquiry(inq.id)}
                        >
                          Pulihkan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}

const ACTION_COLORS = {
  CREATE: { bg: '#ECFDF5', color: '#059669' },
  UPDATE: { bg: '#EFF6FF', color: '#2563EB' },
  DELETE: { bg: '#FEF2F2', color: '#DC2626' },
  LOGIN: { bg: '#F5F3FF', color: '#7C3AED' },
  ADVANCE_STAGE: { bg: '#ECFDF5', color: '#059669' },
  RESTORE: { bg: '#FFF7ED', color: '#D97706' },
  APPROVE_USER: { bg: '#EFF6FF', color: '#1D4ED8' },
};

function ActionBadge({ action }) {
  const style = ACTION_COLORS[action] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: style.bg, color: style.color }}>
      {action}
    </span>
  );
}
