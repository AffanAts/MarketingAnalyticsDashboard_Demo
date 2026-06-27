import { useState, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import InquiryFormModal from '../components/ui/InquiryFormModal';
import { getStageById, INQUIRY_STAGE_IDS } from '../constants/stages';
import { getChannelById } from '../constants/channels';
import { getSumberById } from '../constants/sumber';
import { formatDate, formatCurrency } from '../utils/formatters';

const PAGE_SIZE = 25;

export default function InquiryList({ appData }) {
  const { inquiries, addInquiry, updateInquiry, deleteInquiry, dropInquiry, undropInquiry, advanceStage } = appData;

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'monthly'
  const [filterStage, setFilterStage] = useState('');
  const [filterSumber, setFilterSumber] = useState('');
  const [filterDropped, setFilterDropped] = useState('active'); // 'active' | 'dropped' | 'all'
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmDrop, setConfirmDrop] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let list = [...inquiries];
    if (filterDropped === 'active') list = list.filter((inq) => !inq.isDropped);
    if (filterDropped === 'dropped') list = list.filter((inq) => inq.isDropped);
    if (filterStage) list = list.filter((inq) => (inq.isDropped ? inq.droppedAtStage : inq.currentStage) === filterStage);
    if (filterSumber) list = list.filter((inq) => inq.sumber === filterSumber);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((inq) =>
        (inq.companyName || '').toLowerCase().includes(q) ||
        (inq.picKlien || '').toLowerCase().includes(q) ||
        (inq.noSurat || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.tanggalMasuk) - new Date(a.tanggalMasuk));
  }, [inquiries, filterDropped, filterStage, filterSumber, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Monthly grouping
  const byMonth = useMemo(() => {
    const groups = {};
    filtered.forEach((inq) => {
      const key = (inq.tanggalMasuk || '').slice(0, 7);
      if (!groups[key]) groups[key] = [];
      groups[key].push(inq);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  function handleSave(payload, editId) {
    if (editId) {
      updateInquiry(editId, payload);
    } else {
      addInquiry(payload);
    }
  }

  function openEdit(inq) {
    setEditTarget(inq);
    setModalOpen(true);
  }

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function handleDrop(inq) {
    setConfirmDrop(inq);
  }

  function confirmDropAction() {
    if (confirmDrop) {
      dropInquiry(confirmDrop.id);
      setConfirmDrop(null);
    }
  }

  function handleDelete(inq) {
    setConfirmDelete(inq);
  }

  function confirmDeleteAction() {
    if (confirmDelete) {
      deleteInquiry(confirmDelete.id);
      setConfirmDelete(null);
    }
  }

  function handleExportCsv() {
    alert('Demo Mode — fitur export CSV hanya tersedia di versi production.');
  }

  function handleImportExcel() {
    alert('Fitur import Excel tidak tersedia di Demo Mode.');
  }

  function resetPage() { setPage(1); }

  const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  function formatMonthLabel(key) {
    if (!key) return '—';
    const [y, m] = key.split('-');
    return `${MONTHS_ID[parseInt(m, 10) - 1]} ${y}`;
  }

  return (
    <PageLayout
      title="Data Inquiry"
      subtitle={`${inquiries.filter((i) => !i.isDropped).length} inquiry aktif`}
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleImportExcel}>Import Excel</Button>
          <Button variant="ghost" size="sm" onClick={handleExportCsv}>Export CSV</Button>
          <Button variant="primary" size="sm" onClick={openAdd}>+ Tambah</Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm ring-1 ring-black ring-opacity-5 mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cari</label>
          <input
            className="px-2.5 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500"
            placeholder="Nama perusahaan, PIC, no. surat..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
          <select className="px-2.5 py-2 border border-gray-200 rounded-md text-sm" value={filterDropped} onChange={(e) => { setFilterDropped(e.target.value); resetPage(); }}>
            <option value="active">Aktif</option>
            <option value="dropped">Dropped</option>
            <option value="all">Semua</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tahap</label>
          <select className="px-2.5 py-2 border border-gray-200 rounded-md text-sm" value={filterStage} onChange={(e) => { setFilterStage(e.target.value); resetPage(); }}>
            <option value="">Semua</option>
            {INQUIRY_STAGE_IDS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sumber</label>
          <select className="px-2.5 py-2 border border-gray-200 rounded-md text-sm" value={filterSumber} onChange={(e) => { setFilterSumber(e.target.value); resetPage(); }}>
            <option value="">Semua</option>
            <option value="digital_marketing">Digital Marketing</option>
            <option value="internal">Internal</option>
            <option value="agen">Agen</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setViewMode('table')}
          >Tabel</button>
          <button
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${viewMode === 'monthly' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setViewMode('monthly')}
          >Per Bulan</button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-2 px-1">{filtered.length} inquiry ditemukan</div>

      {viewMode === 'table' && (
        <>
          <div className="bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden mb-3">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['No.', 'Perusahaan', 'PIC Klien', 'Jenis', 'Sumber/Kanal', 'Tahap', 'Nilai', 'Tgl Masuk', 'Aksi'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-3 border-b border-gray-200 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 && (
                    <tr><td colSpan={9} className="px-3 py-8 text-center text-sm text-gray-500">Tidak ada inquiry ditemukan.</td></tr>
                  )}
                  {paged.map((inq, idx) => {
                    const stage = getStageById(inq.isDropped ? inq.droppedAtStage : inq.currentStage);
                    const channel = getChannelById(inq.channel);
                    const sumber = getSumberById(inq.sumber);
                    return (
                      <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 border-b border-gray-100 text-xs text-gray-400 align-middle">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                        <td className="px-3 py-3 border-b border-gray-100 align-middle">
                          <div className="font-semibold text-gray-900 text-sm">{inq.companyName}</div>
                          {inq.noSurat && <div className="text-xs text-blue-600 font-mono">{inq.noSurat}</div>}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-100 align-middle text-sm text-gray-700 whitespace-nowrap">{inq.picKlien}</td>
                        <td className="px-3 py-3 border-b border-gray-100 align-middle text-xs text-gray-600 whitespace-nowrap">{inq.jenisPenawaran}</td>
                        <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                          <div className="text-xs font-medium" style={{ color: sumber?.color }}>{sumber?.label ?? inq.sumber}</div>
                          {inq.sumber === 'digital_marketing' && channel && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="w-2 h-2 rounded-full" style={{ background: channel.color }} />
                              <span className="text-xs text-gray-500">{channel.label}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                          <Badge
                            label={inq.isDropped ? `Drop` : stage?.label}
                            color={inq.isDropped ? '#EF4444' : stage?.color}
                            bgColor={inq.isDropped ? '#FEF2F2' : stage?.bgColor}
                            size="sm"
                          />
                        </td>
                        <td className="px-3 py-3 border-b border-gray-100 align-middle text-xs whitespace-nowrap">{formatCurrency(inq.projectValue)}</td>
                        <td className="px-3 py-3 border-b border-gray-100 align-middle text-xs text-gray-600 whitespace-nowrap">{formatDate(inq.tanggalMasuk)}</td>
                        <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 font-semibold" onClick={() => openEdit(inq)}>Edit</button>
                            {!inq.isDropped && (
                              <>
                                <button className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-semibold" onClick={() => advanceStage(inq.id)}>Lanjut</button>
                                <button className="text-xs px-2 py-1 rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 font-semibold" onClick={() => handleDrop(inq)}>Drop</button>
                              </>
                            )}
                            {inq.isDropped && (
                              <button className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-semibold" onClick={() => undropInquiry(inq.id)}>Restore</button>
                            )}
                            <button className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-semibold" onClick={() => handleDelete(inq)}>Hapus</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-600 px-1">
              <span>Halaman {page} dari {totalPages}</span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
                <button className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button>
              </div>
            </div>
          )}
        </>
      )}

      {viewMode === 'monthly' && (
        <div className="flex flex-col gap-4">
          {byMonth.length === 0 && (
            <div className="bg-white rounded-lg p-8 text-center text-sm text-gray-500 shadow-sm ring-1 ring-black ring-opacity-5">Tidak ada inquiry.</div>
          )}
          {byMonth.map(([monthKey, items]) => (
            <div key={monthKey} className="bg-white rounded-lg shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">{formatMonthLabel(monthKey)}</h3>
                <span className="text-xs text-gray-500 font-semibold">{items.length} inquiry</span>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((inq) => {
                  const stage = getStageById(inq.isDropped ? inq.droppedAtStage : inq.currentStage);
                  const sumber = getSumberById(inq.sumber);
                  return (
                    <div key={inq.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-semibold text-gray-900 truncate">{inq.companyName}</span>
                        <span className="text-xs text-gray-500">{inq.jenisPenawaran} · <span style={{ color: sumber?.color }}>{sumber?.label}</span></span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge label={inq.isDropped ? 'Drop' : stage?.label} color={inq.isDropped ? '#EF4444' : stage?.color} bgColor={inq.isDropped ? '#FEF2F2' : stage?.bgColor} size="sm" />
                        <span className="text-xs text-gray-400">{formatDate(inq.tanggalMasuk)}</span>
                        <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 font-semibold" onClick={() => openEdit(inq)}>Edit</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <InquiryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editTarget}
      />

      {/* Drop confirm */}
      {confirmDrop && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">Drop Inquiry?</h3>
            <p className="text-sm text-gray-600 mb-4">Tandai <strong>{confirmDrop.companyName}</strong> sebagai tidak dilanjutkan?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setConfirmDrop(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={confirmDropAction}>Ya, Drop</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">Hapus Inquiry?</h3>
            <p className="text-sm text-gray-600 mb-4">Hapus <strong>{confirmDelete.companyName}</strong>? Data akan dipindah ke tong sampah.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={confirmDeleteAction}>Ya, Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
