
// Application Constants
// Note: AGENCIES_DATA has been moved to Supabase database
// See supabase/seed.sql for the data

export const QUICK_CATEGORIES = [
  "Bagaimana cara buat KTP baru?",
  "Bagaimana cara urus paspor baru?",
  "Bagaimana cara buat izin usaha mikro?",
  "Berapa biaya daftar BPJS Mandiri?",
  "Apa saja syarat SKCK?",
];

// Legacy AGENCIES_DATA removed - now fetched from Supabase
// Use fetchAgencies() from services/supabaseService.ts instead

/* DEPRECATED - DO NOT USE
export const AGENCIES_DATA: Agency[] = [
  {
    id: "dukcapil",
    name: "Dinas Kependudukan dan Pencatatan Sipil",
    logo: "https://upload.wikimedia.org/wikipedia/id/archive/2/21/20221129043534%21Logo_Ditjen_Dukcapil.png",
    services: [
      {
        namaLayanan: "Penerbitan KTP Elektronik Baru",
        persyaratan: ["Fotokopi Kartu Keluarga (KK)", "Berusia 17 tahun atau sudah menikah", "Surat pengantar dari RT/RW"],
        sistemMekanismeProsedur: ["Pemohon datang ke loket Dukcapil", "Mengambil nomor antrian", "Verifikasi berkas oleh petugas", "Proses foto dan sidik jari", "Penerbitan KTP-el"],
        jangkaWaktu: "1 Hari Kerja (jika blangko tersedia)",
        lokasiGerai: "Loket 1 & 2",
        biaya: "Gratis"
      },
      {
        namaLayanan: "Cetak Ulang KTP Elektronik karena Rusak/Buram",
        persyaratan: ["KTP-el lama yang rusak atau buram (wajib dibawa)", "Fotokopi Kartu Keluarga (KK)"],
        sistemMekanismeProsedur: ["Pemohon datang ke loket Dukcapil dengan membawa persyaratan", "Petugas memverifikasi data", "Proses pencetakan ulang KTP-el", "Penyerahan KTP-el baru kepada pemohon"],
        jangkaWaktu: "Dapat ditunggu (sekitar 15-30 menit jika tidak ada kendala teknis)",
        lokasiGerai: "Loket 1 & 2",
        biaya: "Gratis",
        catatanTambahan: "Tidak perlu surat pengantar dari RT/RW atau desa untuk kasus KTP rusak atau buram."
      },
      {
        namaLayanan: "Penerbitan Kartu Keluarga (KK) Baru",
        dasarHukum: [
          "Peraturan Pemerintah Nomor 24 Tahun 2014",
          "Peraturan Menteri Dalam Negeri Nomor 19 Tahun 2018",
          "Peraturan Menteri Dalam Negeri Nomor 7 Tahun 2019",
          "Peraturan Menteri Dalam Negeri Nomor 108 Tahun 2019"
        ],
        persyaratan: ["Surat Nikah /Surat Cerai", "KTP-EL semua anggota Keluarga", "Akta Kelahiran Anggota Keluarga", "Surat Keterangan pindah /Datang WNI", "Formulir Permohonan Kartu Keluarga"],
        sistemMekanismeProsedur: ["Pemohon Menyerahkan berkas pengajuan", "Operator mengajukan berkas ke pejabat pemeriksa untuk diferifikasi", "Pejabat memeriksa memberikan persetujuan kepada Operator", "Operator Membuat Jenis Pelayanan yang diajukan Pemohon", "Operator Menyerahkan jenis pelayanan Kepada Pemohon"],
        jangkaWaktu: "1 s/d 24 Jam apabila tidak ada gangguan teknis",
        lokasiGerai: "Loket 3",
        biaya: "Gratis"
      }
    ]
  },
  {
    id: "samsat",
    name: "SAMSAT (Sistem Administrasi Manunggal Satu Atap)",
    logo: "https://upload.wikimedia.org/wikipedia/id/thumb/0/07/LOGO_SAMSAT_TERBARU.png/579px-LOGO_SAMSAT_TERBARU.png",
    services: [
      {
        namaLayanan: "Perpanjangan STNK Tahunan",
        persyaratan: ["STNK asli", "KTP asli pemilik kendaraan", "BPKB asli (untuk beberapa kasus)", "Tidak memiliki tunggakan pajak"],
        sistemMekanismeProsedur: ["Cek fisik kendaraan (jika diperlukan)", "Mengisi formulir perpanjangan", "Pembayaran pajak di loket bank", "Pengesahan STNK oleh petugas"],
        jangkaWaktu: "1-2 Jam",
        lokasiGerai: "Loket 5, 6, 7",
      }
    ]
  },
  {
    id: "imigrasi",
    name: "Kantor Imigrasi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Logo_of_the_Directorate_General_of_Immigration_of_the_Republic_of_Indonesia.svg/1024px-Logo_of_the_Directorate_General_of_Immigration_of_the_Republic_of_Indonesia.svg.png",
    services: [
      {
        namaLayanan: "Permohonan Paspor Biasa",
        persyaratan: ["KTP Elektronik", "Kartu Keluarga (KK)", "Akta Kelahiran/Ijazah/Buku Nikah", "Surat pewarganegaraan (bagi WNA)"],
        sistemMekanismeProsedur: ["Pendaftaran online melalui M-Paspor", "Datang ke MPP sesuai jadwal", "Verifikasi berkas", "Wawancara dan pengambilan biometrik (foto & sidik jari)", "Pembayaran biaya paspor", "Pengambilan paspor"],
        jangkaWaktu: "3-4 Hari Kerja setelah pembayaran",
        lokasiGerai: "Loket 10",
      }
    ]
  },
  {
    id: "polres",
    name: "Polres Pandeglang",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lambang_Polri.png/800px-Lambang_Polri.png",
    services: [
      {
        namaLayanan: "Penerbitan Surat Keterangan Catatan Kepolisian (SKCK) Baru",
        persyaratan: [
          "Fotokopi KTP",
          "Fotokopi Kartu Keluarga (KK)",
          "Fotokopi Akta Kelahiran / Ijazah Terakhir",
          "Pas foto berwarna ukuran 4x6 (latar belakang merah) sebanyak 4 lembar",
          "Mengisi formulir pendaftaran",
          "Bukti pembayaran PNBP"
        ],
        sistemMekanismeProsedur: [
          "Pemohon datang ke loket pelayanan SKCK di MPP",
          "Mengisi formulir dan menyerahkan berkas persyaratan",
          "Petugas melakukan verifikasi dan penelitian catatan kriminal",
          "Proses pengambilan sidik jari (jika pemohon baru)",
          "Pembayaran biaya PNBP di loket yang tersedia",
          "Penerbitan SKCK"
        ],
        jangkaWaktu: "30 - 60 Menit",
        biaya: "Rp 30.000 (sesuai PP No. 76 Tahun 2020 tentang PNBP)",
        lokasiGerai: "Loket 8",
        catatanTambahan: "SKCK berlaku selama 6 bulan sejak tanggal diterbitkan."
      }
    ]
  },
  {
    id: "bpjs",
    name: "BPJS Kesehatan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Logo_BPJS_Kesehatan_2013.svg/1200px-Logo_BPJS_Kesehatan_2013.svg.png",
    services: [
      {
        namaLayanan: "Pendaftaran Peserta Baru (PBPU/Mandiri)",
        persyaratan: [
          "Kartu Tanda Penduduk (KTP)",
          "Kartu Keluarga (KK)",
          "Buku tabungan (BCA, BNI, BRI, Mandiri, atau BTN)",
          "Pas foto ukuran 3x4 (1 lembar, jika diperlukan)",
          "Mengisi formulir pendaftaran"
        ],
        sistemMekanismeProsedur: [
          "Mengambil nomor antrian di loket BPJS Kesehatan",
          "Mengisi Formulir Daftar Isian Peserta (FDIP)",
          "Menyerahkan berkas kepada petugas",
          "Petugas melakukan verifikasi data",
          "Pemohon menerima virtual account untuk pembayaran iuran pertama",
          "Kartu BPJS akan aktif setelah pembayaran dilakukan"
        ],
        jangkaWaktu: "Sekitar 30 - 45 Menit",
        biaya: "Gratis (biaya pendaftaran), namun wajib membayar iuran pertama sesuai kelas yang dipilih.",
        lokasiGerai: "Loket 9",
        catatanTambahan: "Pembayaran iuran pertama paling cepat 14 hari dan paling lambat 30 hari setelah virtual account diterbitkan."
      }
    ]
  }
];
*/
