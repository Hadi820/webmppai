// Follow-up question suggestions based on context

export const FOLLOW_UP_SUGGESTIONS: Record<string, string[]> = {
  // KTP & KK related
  'ktp': [
    'Berapa lama proses pembuatan KTP?',
    'Apa saja syarat cetak ulang KTP rusak?',
    'Bagaimana cara update data di KTP?'
  ],
  'kartu keluarga': [
    'Bagaimana cara tambah anggota keluarga di KK?',
    'Apa syarat cetak ulang KK hilang?',
    'Berapa lama proses pembuatan KK baru?'
  ],
  'kk': [
    'Bagaimana cara tambah anggota keluarga di KK?',
    'Apa syarat cetak ulang KK hilang?',
    'Berapa lama proses pembuatan KK baru?'
  ],
  
  // SIM & STNK related
  'sim': [
    'Berapa biaya perpanjangan SIM?',
    'Apa saja syarat buat SIM baru?',
    'Bagaimana cara perpanjang SIM online?'
  ],
  'stnk': [
    'Berapa biaya perpanjangan STNK tahunan?',
    'Apa syarat balik nama STNK?',
    'Bagaimana cara cek pajak kendaraan?'
  ],
  
  // Paspor related
  'paspor': [
    'Berapa biaya pembuatan paspor?',
    'Bagaimana cara perpanjang paspor?',
    'Apa saja syarat paspor untuk anak?'
  ],
  
  // Perizinan Usaha related
  'izin usaha': [
    'Berapa biaya pengurusan izin usaha?',
    'Apa perbedaan SIUP dan NIB?',
    'Bagaimana cara daftar OSS online?'
  ],
  'umkm': [
    'Apa saja syarat izin usaha mikro?',
    'Bagaimana cara daftar UMKM online?',
    'Berapa biaya daftar izin UMKM?'
  ],
  
  // BPJS related
  'bpjs': [
    'Bagaimana cara bayar iuran BPJS?',
    'Apa perbedaan kelas 1, 2, dan 3 BPJS?',
    'Bagaimana cara pindah faskes BPJS?'
  ],
  
  // SKCK related
  'skck': [
    'Berapa lama masa berlaku SKCK?',
    'Bagaimana cara perpanjang SKCK?',
    'Apa perbedaan SKCK lokal dan nasional?'
  ],
  
  // Akta related
  'akta kelahiran': [
    'Berapa biaya pembuatan akta kelahiran?',
    'Apa syarat akta kelahiran terlambat?',
    'Bagaimana cara urus akta kelahiran online?'
  ],
  'akta': [
    'Apa saja jenis-jenis akta?',
    'Berapa lama proses pembuatan akta?',
    'Bagaimana cara cetak ulang akta hilang?'
  ],
  
  // Default suggestions
  'default': [
    'Jam operasional MPP Pandeglang?',
    'Lokasi dan kontak MPP Pandeglang?',
    'Layanan apa saja yang tersedia di MPP?'
  ]
};

export function getFollowUpSuggestions(lastUserMessage: string): string[] {
  const lowerMessage = lastUserMessage.toLowerCase();
  
  // Check each keyword
  for (const [keyword, suggestions] of Object.entries(FOLLOW_UP_SUGGESTIONS)) {
    if (keyword !== 'default' && lowerMessage.includes(keyword)) {
      return suggestions;
    }
  }
  
  // Return default suggestions if no match
  return FOLLOW_UP_SUGGESTIONS.default;
}
