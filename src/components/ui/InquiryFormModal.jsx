import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { CHANNELS } from '../../constants/channels';
import { SUMBER_TYPES, JENIS_PENAWARAN } from '../../constants/sumber';
import { INQUIRY_STAGE_IDS } from '../../constants/stages';

const INTERNAL_PICS = ['Budi Santoso', 'Dewi Rahayu', 'Ahmad Fauzi', 'Siti Nurhaliza', 'Reza Pratama'];

const EMPTY_FOLLOWUPS = [
  { number: 1, scheduledDate: '', done: false, doneDate: null },
  { number: 2, scheduledDate: '', done: false, doneDate: null },
  { number: 3, scheduledDate: '', done: false, doneDate: null },
];

const INITIAL_FORM = {
  companyName: '',
  picKlien: '',
  phone: '',
  email: '',
  sumber: 'digital_marketing',
  channel: 'website',
  jenisPenawaran: 'AMDAL',
  currentStage: 'interest',
  projectValue: '',
  picInternal: '',
  noSurat: '',
  notes: '',
  tanggalMasuk: new Date().toISOString().slice(0, 10),
  followUps: EMPTY_FOLLOWUPS,
};

const inp =
  'w-full px-2.5 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
const inpErr = 'border-red-400 focus:border-red-400 focus:ring-red-400/20';

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="col-span-2 pt-2 pb-1 border-b border-gray-100">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{children}</h3>
    </div>
  );
}

export default function InquiryFormModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const drawerRef = useRef(null);
  const isEdit = !!initialData?.id;

  useEffect(() => {
    if (open) {
      if (initialData?.id) {
        setForm({
          companyName: initialData.companyName ?? '',
          picKlien: initialData.picKlien ?? '',
          phone: initialData.phone ?? '',
          email: initialData.email ?? '',
          sumber: initialData.sumber ?? 'digital_marketing',
          channel: initialData.channel ?? 'website',
          jenisPenawaran: initialData.jenisPenawaran ?? 'AMDAL',
          currentStage: initialData.currentStage ?? 'interest',
          projectValue: initialData.projectValue ?? '',
          picInternal: initialData.picInternal ?? '',
          noSurat: initialData.noSurat ?? '',
          notes: initialData.notes ?? '',
          tanggalMasuk: (initialData.tanggalMasuk ?? '').slice(0, 10),
          followUps: initialData.followUps ?? EMPTY_FOLLOWUPS,
        });
      } else {
        setForm({ ...INITIAL_FORM, tanggalMasuk: new Date().toISOString().slice(0, 10) });
      }
      setErrors({});
      setSaving(false);
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  }

  function updateFollowUp(idx, patch) {
    setForm((p) => ({
      ...p,
      followUps: p.followUps.map((f, i) => (i === idx ? { ...f, ...patch } : f)),
    }));
  }

  function validate() {
    const errs = {};
    if (!form.companyName.trim()) errs.companyName = 'Wajib diisi';
    if (!form.picKlien.trim()) errs.picKlien = 'Wajib diisi';
    if (!form.phone.trim()) errs.phone = 'Wajib diisi';
    if (!form.tanggalMasuk) errs.tanggalMasuk = 'Wajib diisi';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        companyName: form.companyName.trim(),
        picKlien: form.picKlien.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        sumber: form.sumber,
        channel: form.sumber === 'digital_marketing' ? form.channel : null,
        jenisPenawaran: form.jenisPenawaran,
        currentStage: form.currentStage,
        projectValue: form.projectValue ? parseInt(form.projectValue, 10) : null,
        picInternal: form.picInternal.trim(),
        noSurat: form.noSurat.trim() || null,
        notes: form.notes.trim(),
        tanggalMasuk: form.tanggalMasuk,
        followUps: form.followUps.map((f) => ({
          number: f.number,
          scheduledDate: f.scheduledDate || null,
          done: !!f.done,
          doneDate: f.doneDate || null,
        })),
      };
      onSave(payload, isEdit ? initialData.id : null);
      onClose();
    } catch (err) {
      setErrors({ _root: err.message || 'Gagal menyimpan' });
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div ref={drawerRef} className="relative ml-auto h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Inquiry' : 'Tambah Inquiry Baru'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{isEdit ? form.companyName : 'Daftarkan calon klien baru'}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="inquiry-modal-form" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              <SectionTitle>Informasi Klien</SectionTitle>

              <div className="col-span-2">
                <Field label="Nama Perusahaan" required error={errors.companyName}>
                  <input className={`${inp} ${errors.companyName ? inpErr : ''}`} name="companyName" value={form.companyName} onChange={handleChange} placeholder="PT. Maju Bersama" autoFocus />
                </Field>
              </div>

              <Field label="PIC Klien" required error={errors.picKlien}>
                <input className={`${inp} ${errors.picKlien ? inpErr : ''}`} name="picKlien" value={form.picKlien} onChange={handleChange} placeholder="Nama PIC" />
              </Field>
              <Field label="No. Telp" required error={errors.phone}>
                <input className={`${inp} ${errors.phone ? inpErr : ''}`} name="phone" value={form.phone} onChange={handleChange} placeholder="08xx-xxxx-xxxx" />
              </Field>

              <div className="col-span-2">
                <Field label="Email">
                  <input className={inp} name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@perusahaan.com" />
                </Field>
              </div>

              <SectionTitle>Sumber &amp; Kanal</SectionTitle>

              <Field label="Sumber">
                <select className={inp} name="sumber" value={form.sumber} onChange={handleChange}>
                  {SUMBER_TYPES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>

              {form.sumber === 'digital_marketing' ? (
                <Field label="Kanal Digital">
                  <select className={inp} name="channel" value={form.channel} onChange={handleChange}>
                    {CHANNELS.map((ch) => (
                      <option key={ch.id} value={ch.id}>{ch.label}</option>
                    ))}
                  </select>
                </Field>
              ) : (
                <Field label="PIC Internal">
                  <select className={inp} name="picInternal" value={form.picInternal} onChange={handleChange}>
                    <option value="">-- Pilih PIC --</option>
                    {INTERNAL_PICS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              )}

              {form.sumber === 'digital_marketing' && (
                <Field label="PIC Internal">
                  <select className={inp} name="picInternal" value={form.picInternal} onChange={handleChange}>
                    <option value="">-- Pilih PIC --</option>
                    {INTERNAL_PICS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              )}

              <SectionTitle>Detail Penawaran</SectionTitle>

              <Field label="Tanggal Masuk" required error={errors.tanggalMasuk}>
                <input className={`${inp} ${errors.tanggalMasuk ? inpErr : ''}`} name="tanggalMasuk" type="date" value={form.tanggalMasuk} onChange={handleChange} />
              </Field>
              <Field label="No. Surat">
                <input className={inp} name="noSurat" value={form.noSurat} onChange={handleChange} placeholder="SP/2025/001" />
              </Field>

              <Field label="Jenis Penawaran">
                <select className={inp} name="jenisPenawaran" value={form.jenisPenawaran} onChange={handleChange}>
                  {JENIS_PENAWARAN.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </Field>
              <Field label="Tahap">
                <select className={inp} name="currentStage" value={form.currentStage} onChange={handleChange}>
                  {INQUIRY_STAGE_IDS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </Field>

              <div className="col-span-2">
                <Field label="Nilai Proyek (Rp)">
                  <input className={inp} name="projectValue" type="number" value={form.projectValue ?? ''} onChange={handleChange} placeholder="250000000" min="0" />
                </Field>
              </div>

              <SectionTitle>Follow Up</SectionTitle>

              <div className="col-span-2 flex flex-col gap-2">
                {form.followUps.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-gray-500 w-16 flex-shrink-0">FU {f.number}</span>
                    {f.done ? (
                      <input className={`${inp} bg-gray-50 text-gray-500 flex-1`} value={`✓ Done ${f.doneDate || ''}`} readOnly />
                    ) : (
                      <input className={`${inp} flex-1`} type="date" value={f.scheduledDate || ''} onChange={(e) => updateFollowUp(idx, { scheduledDate: e.target.value })} />
                    )}
                    {f.done ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => updateFollowUp(idx, { done: false, doneDate: null })}>Batal</Button>
                    ) : (
                      <Button type="button" variant="primary" size="sm" onClick={() => updateFollowUp(idx, { done: true, doneDate: new Date().toISOString().slice(0, 10) })}>Done</Button>
                    )}
                  </div>
                ))}
              </div>

              <SectionTitle>Catatan</SectionTitle>
              <div className="col-span-2">
                <textarea className={`${inp} resize-y min-h-[80px]`} name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Catatan tentang inquiry ini..." />
              </div>
            </div>

            {errors._root && (
              <div className="mt-4 px-3.5 py-2.5 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">{errors._root}</div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>Batal</Button>
          <Button type="submit" form="inquiry-modal-form" variant="primary" size="md" disabled={saving}>
            {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Inquiry'}
          </Button>
        </div>
      </div>
    </div>
  );
}
