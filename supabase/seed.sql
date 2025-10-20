-- ============================================
-- MPP Pandeglang Service Finder Seed Data
-- ============================================

-- Clear existing data (optional, for fresh start)
TRUNCATE TABLE chat_logs, services, agencies, mpp_profile, users CASCADE;

-- ============================================
-- 1. SEED USERS (Admin)
-- ============================================
-- Password: 'password123' (in production, use proper hashing)
-- For demo purposes, using plain text (you should hash this in production)
INSERT INTO users (username, password_hash) VALUES
  ('admin', 'password123');

-- ============================================
-- 2. SEED MPP PROFILE
-- ============================================
INSERT INTO mpp_profile (
  name, 
  description, 
  address, 
  operating_hours_workdays, 
  operating_hours_weekends,
  contact_phone,
  contact_email,
  social_media_instagram,
  social_media_facebook
) VALUES (
  'Mal Pelayanan Publik Kabupaten Pandeglang',
  'Pusat layanan terpadu untuk berbagai keperluan administrasi publik di Kabupaten Pandeglang. Kami berkomitmen untuk memberikan pelayanan yang cepat, mudah, dan transparan.',
  'Jl. Jenderal Sudirman No. 1, Pandeglang, Banten, 42211',
  'Senin - Jumat, 08:00 - 15:00 WIB',
  'Sabtu, Minggu, dan Hari Libur Nasional Tutup',
  '(0253) 123-456',
  'mpp@pandeglangkab.go.id',
  'https://instagram.com/mpp_pandeglang',
  'https://facebook.com/mpp.pandeglang'
);

-- ============================================
-- 3. SEED AGENCIES
-- ============================================
INSERT INTO agencies (id, name, logo) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Dinas Kependudukan dan Pencatatan Sipil', 'https://upload.wikimedia.org/wikipedia/id/archive/2/21/20221129043534%21Logo_Ditjen_Dukcapil.png'),
  ('a2222222-2222-2222-2222-222222222222', 'SAMSAT (Sistem Administrasi Manunggal Satu Atap)', 'https://upload.wikimedia.org/wikipedia/id/thumb/0/07/LOGO_SAMSAT_TERBARU.png/579px-LOGO_SAMSAT_TERBARU.png'),
  ('a3333333-3333-3333-3333-333333333333', 'Kantor Imigrasi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Logo_of_the_Directorate_General_of_Immigration_of_the_Republic_of_Indonesia.svg/1024px-Logo_of_the_Directorate_General_of_Immigration_of_the_Republic_of_Indonesia.svg.png'),
  ('a4444444-4444-4444-4444-444444444444', 'Polres Pandeglang', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lambang_Polri.png/800px-Lambang_Polri.png'),
  ('a5555555-5555-5555-5555-555555555555', 'BPJS Kesehatan', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Logo_BPJS_Kesehatan_2013.svg/1200px-Logo_BPJS_Kesehatan_2013.svg.png');

-- ============================================
-- 4. SEED SERVICES
-- ============================================

-- Dukcapil Services
INSERT INTO services (
  agency_id, nama_layanan, dasar_hukum, persyaratan, 
  sistem_mekanisme_prosedur, jangka_waktu, lokasi_gerai, biaya, catatan_tambahan
) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Penerbitan KTP Elektronik Baru',
    NULL,
    ARRAY['Fotokopi Kartu Keluarga (KK)', 'Berusia 17 tahun atau sudah menikah', 'Surat pengantar dari RT/RW'],
    ARRAY['Pemohon datang ke loket Dukcapil', 'Mengambil nomor antrian', 'Verifikasi berkas oleh petugas', 'Proses foto dan sidik jari', 'Penerbitan KTP-el'],
    '1 Hari Kerja (jika blangko tersedia)',
    'Loket 1 & 2',
    'Gratis',
    NULL
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Cetak Ulang KTP Elektronik karena Rusak/Buram',
    NULL,
    ARRAY['KTP-el lama yang rusak atau buram (wajib dibawa)', 'Fotokopi Kartu Keluarga (KK)'],
    ARRAY['Pemohon datang ke loket Dukcapil dengan membawa persyaratan', 'Petugas memverifikasi data', 'Proses pencetakan ulang KTP-el', 'Penyerahan KTP-el baru kepada pemohon'],
    'Dapat ditunggu (sekitar 15-30 menit jika tidak ada kendala teknis)',
    'Loket 1 & 2',
    'Gratis',
    'Tidak perlu surat pengantar dari RT/RW atau desa untuk kasus KTP rusak atau buram.'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Penerbitan Kartu Keluarga (KK) Baru',
    ARRAY[
      'Peraturan Pemerintah Nomor 24 Tahun 2014',
      'Peraturan Menteri Dalam Negeri Nomor 19 Tahun 2018',
      'Peraturan Menteri Dalam Negeri Nomor 7 Tahun 2019',
      'Peraturan Menteri Dalam Negeri Nomor 108 Tahun 2019'
    ],
    ARRAY['Surat Nikah /Surat Cerai', 'KTP-EL semua anggota Keluarga', 'Akta Kelahiran Anggota Keluarga', 'Surat Keterangan pindah /Datang WNI', 'Formulir Permohonan Kartu Keluarga'],
    ARRAY['Pemohon Menyerahkan berkas pengajuan', 'Operator mengajukan berkas ke pejabat pemeriksa untuk diferifikasi', 'Pejabat memeriksa memberikan persetujuan kepada Operator', 'Operator Membuat Jenis Pelayanan yang diajukan Pemohon', 'Operator Menyerahkan jenis pelayanan Kepada Pemohon'],
    '1 s/d 24 Jam apabila tidak ada gangguan teknis',
    'Loket 3',
    'Gratis',
    NULL
  );

-- SAMSAT Services
INSERT INTO services (
  agency_id, nama_layanan, persyaratan, 
  sistem_mekanisme_prosedur, jangka_waktu, lokasi_gerai, biaya
) VALUES
  (
    'a2222222-2222-2222-2222-222222222222',
    'Perpanjangan STNK Tahunan',
    ARRAY['STNK asli', 'KTP asli pemilik kendaraan', 'BPKB asli (untuk beberapa kasus)', 'Tidak memiliki tunggakan pajak'],
    ARRAY['Cek fisik kendaraan (jika diperlukan)', 'Mengisi formulir perpanjangan', 'Pembayaran pajak di loket bank', 'Pengesahan STNK oleh petugas'],
    '1-2 Jam',
    'Loket 5, 6, 7',
    NULL
  );

-- Imigrasi Services
INSERT INTO services (
  agency_id, nama_layanan, persyaratan, 
  sistem_mekanisme_prosedur, jangka_waktu, lokasi_gerai, biaya
) VALUES
  (
    'a3333333-3333-3333-3333-333333333333',
    'Permohonan Paspor Biasa',
    ARRAY['KTP Elektronik', 'Kartu Keluarga (KK)', 'Akta Kelahiran/Ijazah/Buku Nikah', 'Surat pewarganegaraan (bagi WNA)'],
    ARRAY['Pendaftaran online melalui M-Paspor', 'Datang ke MPP sesuai jadwal', 'Verifikasi berkas', 'Wawancara dan pengambilan biometrik (foto & sidik jari)', 'Pembayaran biaya paspor', 'Pengambilan paspor'],
    '3-4 Hari Kerja setelah pembayaran',
    'Loket 10',
    NULL
  );

-- Polres Services
INSERT INTO services (
  agency_id, nama_layanan, persyaratan, 
  sistem_mekanisme_prosedur, jangka_waktu, lokasi_gerai, biaya, catatan_tambahan
) VALUES
  (
    'a4444444-4444-4444-4444-444444444444',
    'Penerbitan Surat Keterangan Catatan Kepolisian (SKCK) Baru',
    ARRAY[
      'Fotokopi KTP',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi Akta Kelahiran / Ijazah Terakhir',
      'Pas foto berwarna ukuran 4x6 (latar belakang merah) sebanyak 4 lembar',
      'Mengisi formulir pendaftaran',
      'Bukti pembayaran PNBP'
    ],
    ARRAY[
      'Pemohon datang ke loket pelayanan SKCK di MPP',
      'Mengisi formulir dan menyerahkan berkas persyaratan',
      'Petugas melakukan verifikasi dan penelitian catatan kriminal',
      'Proses pengambilan sidik jari (jika pemohon baru)',
      'Pembayaran biaya PNBP di loket yang tersedia',
      'Penerbitan SKCK'
    ],
    '30 - 60 Menit',
    'Loket 8',
    'Rp 30.000 (sesuai PP No. 76 Tahun 2020 tentang PNBP)',
    'SKCK berlaku selama 6 bulan sejak tanggal diterbitkan.'
  );

-- BPJS Services
INSERT INTO services (
  agency_id, nama_layanan, persyaratan, 
  sistem_mekanisme_prosedur, jangka_waktu, lokasi_gerai, biaya, catatan_tambahan
) VALUES
  (
    'a5555555-5555-5555-5555-555555555555',
    'Pendaftaran Peserta Baru (PBPU/Mandiri)',
    ARRAY[
      'Kartu Tanda Penduduk (KTP)',
      'Kartu Keluarga (KK)',
      'Buku tabungan (BCA, BNI, BRI, Mandiri, atau BTN)',
      'Pas foto ukuran 3x4 (1 lembar, jika diperlukan)',
      'Mengisi formulir pendaftaran'
    ],
    ARRAY[
      'Mengambil nomor antrian di loket BPJS Kesehatan',
      'Mengisi Formulir Daftar Isian Peserta (FDIP)',
      'Menyerahkan berkas kepada petugas',
      'Petugas melakukan verifikasi data',
      'Pemohon menerima virtual account untuk pembayaran iuran pertama',
      'Kartu BPJS akan aktif setelah pembayaran dilakukan'
    ],
    'Sekitar 30 - 45 Menit',
    'Loket 9',
    'Gratis (biaya pendaftaran), namun wajib membayar iuran pertama sesuai kelas yang dipilih.',
    'Pembayaran iuran pertama paling cepat 14 hari dan paling lambat 30 hari setelah virtual account diterbitkan.'
  );

-- ============================================
-- 5. SEED SAMPLE CHAT LOGS (for analytics)
-- ============================================
INSERT INTO chat_logs (query, service_inquired, response_time, was_successful, created_at) VALUES
  ('syarat buat KTP baru apa aja?', 'KTP', 1200, true, NOW() - INTERVAL '1 day'),
  ('cara perpanjang SIM C', 'SIM', 1500, true, NOW() - INTERVAL '1 day'),
  ('lokasi gerai SKCK di mana?', 'SKCK', 900, true, NOW() - INTERVAL '2 days'),
  ('biaya pembuatan paspor berapa?', 'Paspor', 1100, true, NOW() - INTERVAL '2 days'),
  ('jam buka mpp pandeglang hari jumat', 'Umum', 800, true, NOW() - INTERVAL '3 days'),
  ('daftar bpjs mandiri', 'BPJS', 1300, true, NOW() - INTERVAL '3 days'),
  ('pajak motor tahunan', 'Pajak', 1000, true, NOW() - INTERVAL '4 days'),
  ('kalau ktp hilang gimana', 'KTP', 1400, true, NOW() - INTERVAL '5 days'),
  ('butuh berapa lama buat skck?', 'SKCK', 950, true, NOW() - INTERVAL '6 days'),
  ('apakah sabtu mpp buka?', 'Umum', 700, true, NOW() - INTERVAL '7 days');
