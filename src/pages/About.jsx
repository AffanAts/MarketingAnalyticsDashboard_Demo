import PageLayout from '../components/layout/PageLayout';

const FEATURES = [
  { icon: '📊', title: 'Marketing Funnel Visualisasi', desc: 'Visualisasi interaktif funnel dari Awareness hingga Advocacy dengan deteksi dropout otomatis.' },
  { icon: '📋', title: 'Manajemen Inquiry', desc: 'CRUD lengkap untuk data prospek/klien dengan status tahap, follow-up tracker, dan filter canggih.' },
  { icon: '🌐', title: 'Analitik Kanal Website', desc: 'Performa kanal digital marketing berbasis website — satu-satunya kanal yang relevan untuk segmen B2B.' },
  { icon: '📡', title: 'Monitoring DA/PA Website', desc: 'Tracking Domain Authority dan Page Authority via Moz API setiap minggu beserta korelasi dengan volume inquiry.' },
  { icon: '⚙️', title: 'Konfigurasi Threshold Funnel', desc: 'Sesuaikan batas wajar dropout di setiap tahap funnel sesuai target bisnis.' },
  { icon: '👥', title: 'Manajemen Pengguna', desc: 'Sistem approval pengguna, manajemen role, dan audit log aktivitas lengkap.' },
];

const TECH_STACK = [
  { name: 'React 18', desc: 'Frontend framework utama' },
  { name: 'React Router v6', desc: 'Client-side routing' },
  { name: 'Recharts', desc: 'Library charting berbasis D3' },
  { name: 'Tailwind CSS v3', desc: 'Utility-first CSS framework' },
  { name: 'Moz Link Explorer API', desc: 'Otomatis fetch DA/PA mingguan' },
  { name: 'JSON (Local Data)', desc: 'Data simulasi untuk demo ini' },
];

export default function About() {
  return (
    <PageLayout title="Tentang Aplikasi" subtitle="CRM Digital Marketing Analytics Platform">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        {/* Dummy data disclaimer */}
        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <span className="text-lg mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-bold text-amber-800">Semua Data pada Aplikasi Ini adalah Data Dummy</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Ini adalah versi demo portofolio. Seluruh data — nama perusahaan, nama PIC, nilai proyek, metrik DA/PA, dan log aktivitas — adalah <strong>data fiktif yang dibuat untuk keperluan demonstrasi</strong>. Tidak ada hubungan dengan entitas bisnis nyata manapun. Semua operasi CRUD berjalan secara <em>in-memory</em> dan akan reset saat halaman di-refresh.
            </p>
          </div>
        </div>

        {/* About card */}
        <div className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-black ring-opacity-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">CRM Digital Marketing Analytics Platform</h2>
              <p className="text-sm text-gray-500 mt-0.5">Sistem analitik marketing funnel untuk bisnis B2B sektor jasa</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Platform ini dirancang untuk membantu tim marketing dan sales dalam memonitor, menganalisis, dan mengoptimalkan perjalanan prospek dari tahap <em>awareness</em> hingga menjadi klien loyal (<em>advocacy</em>). Sistem menggunakan pendekatan marketing funnel 6 tahap: Awareness, Interest, Consideration, Purchase, Retention, dan Advocacy.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Berdasarkan riset Gartner tentang perilaku B2B buyer, kanal utama yang digunakan adalah <strong>website perusahaan</strong> dan jaringan <strong>internal (referral langsung)</strong>. Platform ini fokus pada dua sumber tersebut dan melengkapinya dengan monitoring otomatis DA/PA via <strong>Moz Link Explorer API</strong> untuk mengukur kredibilitas SEO website.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-black ring-opacity-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Fitur Utama</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-black ring-opacity-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Tech Stack</h3>
          <div className="flex flex-col divide-y divide-gray-100">
            {TECH_STACK.map((t) => (
              <div key={t.name} className="flex items-center justify-between py-2.5">
                <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                <span className="text-xs text-gray-500">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel stages */}
        <div className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-black ring-opacity-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Marketing Funnel 6 Tahap</h3>
          <div className="flex flex-col gap-2">
            {[
              { stage: 'Awareness', color: '#6366F1', desc: 'Reach & impresi digital — traffic website, pencarian organik' },
              { stage: 'Interest', color: '#3B82F6', desc: 'Calon klien menghubungi via website atau referral internal' },
              { stage: 'Consideration', color: '#0EA5E9', desc: 'Proposal resmi dikirimkan dan sedang dievaluasi' },
              { stage: 'Purchase', color: '#10B981', desc: 'Deal / kontrak berhasil ditandatangani' },
              { stage: 'Retention', color: '#F59E0B', desc: 'Klien kembali menggunakan jasa (repeat order)' },
              { stage: 'Advocacy', color: '#8B5CF6', desc: 'Klien aktif merekomendasikan jasa ke jaringannya' },
            ].map((item) => (
              <div key={item.stage} className="flex items-center gap-3">
                <div className="w-24 py-1.5 rounded text-center text-xs font-bold text-white flex-shrink-0" style={{ background: item.color }}>
                  {item.stage}
                </div>
                <span className="text-xs text-gray-600">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* B2B context */}
        <div className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-black ring-opacity-5">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Mengapa Hanya Website & Internal?</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Mengacu pada riset <strong>Gartner</strong> mengenai perilaku pembeli B2B, sebagian besar proses evaluasi vendor dilakukan secara mandiri melalui penelusuran online (website). Kombinasi <em>organic search</em> dan <em>word-of-mouth</em> (internal/referral) mendominasi saluran masuknya prospek di segmen jasa konsultan profesional — berbeda dengan B2C yang mengandalkan media sosial.
          </p>
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-gray-400">CRM Analytics Platform v1.0 — Demo Version</p>
          <p className="text-xs text-gray-400 mt-1">Seluruh data pada demo ini adalah data simulasi dan tidak mewakili entitas nyata manapun</p>
        </div>
      </div>
    </PageLayout>
  );
}
