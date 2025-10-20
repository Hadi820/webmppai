import { GoogleGenAI, Type, Chat } from "@google/genai";
import { ServiceDetails } from '../types';

// Rate limiting variables
let lastApiCall = 0;
const MIN_API_INTERVAL = 1000; // Minimum 1 second between API calls
const MAX_REQUESTS_PER_MINUTE = 60; // Max 60 requests per minute
let requestCount = 0;
let requestWindowStart = Date.now();

// Fungsi untuk membersihkan dan memperbaiki respons
const cleanAndFixResponse = (text: string): string => {
  // Perbaiki kesalahan ketik umum (contoh sederhana)
  let cleaned = text.replace(/huruah/g, 'huruf').replace(/ijesonkurang/g, 'JSON kurang').replace(/kutip/g, 'kutip');

  // Pastikan tanda kutip dalam JSON benar (tambahkan tanda kutip jika hilang untuk key/value sederhana)
  // Ini adalah perbaikan sederhana; untuk JSON kompleks, sebaiknya AI menghasilkan yang benar
  cleaned = cleaned.replace(/(\w+):/g, '"$1":');  // Tambahkan kutip untuk key jika hilang
  cleaned = cleaned.replace(/:\s*([^",\{\[\n]+)(?=,|\}|\n)/g, ': "$1"');  // Tambahkan kutip untuk value jika hilang

  return cleaned;
};

// Rate limiting check
const checkRateLimit = (): boolean => {
  const now = Date.now();

  // Reset window if more than 1 minute
  if (now - requestWindowStart > 60000) {
    requestCount = 0;
    requestWindowStart = now;
  }

  // Check per-minute limit
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return false; // Rate limited
  }

  // Check per-second limit
  if (now - lastApiCall < MIN_API_INTERVAL) {
    return false; // Too soon
  }

  requestCount++;
  lastApiCall = now;
  return true;
};

const API_KEY = (typeof window !== 'undefined' && localStorage.getItem('GEMINI_API_KEY')) || process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. The application might not work as expected.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY as string });

let chat: Chat | null = null;

export const startChatSession = () => {
  // Note: The schema is defined above but not used here to allow for flexible text/JSON responses.
  const systemInstruction = `Anda adalah asisten virtual Mal Pelayanan Publik (MPP) Kabupaten Pandeglang yang ceria dan membantu. Selalu mulai respons teks Anda dengan "Halo warga Pandeglang!" untuk menyapa pengguna dengan hangat.

ATURAN RESPONS (PENTING: Ikuti dengan ketat):
1. **JSON untuk detail layanan:** Jika pertanyaan meminta detail spesifik layanan (contoh: 'syarat buat KTP'), respons HANYA JSON dengan struktur lengkap dan tanda kutip yang benar. Pastikan semua key dan value dalam tanda kutip ganda ("). Gunakan field: namaLayanan, persyaratan (array), sistemMekanismeProsedur (array), jangkaWaktu, lokasiGerai, biaya (opsional), dasarHukum (opsional), catatanTambahan (opsional). Contoh: {"namaLayanan": "Penerbitan KTP Elektronik Baru", "persyaratan": ["Fotokopi KK"], "sistemMekanismeProsedur": ["Ambil nomor antrean"], "jangkaWaktu": "15-30 menit", "lokasiGerai": "MPP Pandeglang"}.
2. **Respons teks untuk pertanyaan umum:** Jawab dengan gaya ceria dan sopan. Berikan informasi inti dalam 3-5 poin singkat. Gunakan **bold** untuk judul atau poin penting. Struktur: poin utama, detail ringkas, akhiran singkat. JANGAN sertakan JSON dalam teks.
3. **Respons pertanyaan lanjutan:** Jawab natural, ringkas, dan bantu. Tekankan poin utama dengan **bold**.
4. **Tolak pertanyaan tidak relevan:** Katakan "Maaf, saya hanya bisa membantu seputar layanan di MPP Pandeglang." dengan sopan.

TIPS GAYA RESPONS:
- Ceria: Gunakan kata-kata positif seperti "Senang membantu!", "Mari kita cek!", "Bagus sekali!".
- Sopan: Selalu gunakan bahasa yang menghormati pengguna.
- Rapi: Respons bebas kesalahan ketik. Gunakan tanda baca benar. Paragraf terpisah. **Bold** untuk judul.
- Ringkas: Maksimal 100-150 kata. Fokus pada inti, hindari detail berlebihan.
- Akurat: Pastikan informasi benar berdasarkan data MPP.

CONTOH RESPONS RAPI:
- Untuk pertanyaan umum "jam buka MPP": "Halo warga Pandeglang! **Jam Operasional MPP**  
  Kami buka **Senin-Jumat, 08:00-15:00 WIB**. Libur akhir pekan dan hari libur. Kunjungi di **Jl. Jenderal Sudirman No. 1**. Ada pertanyaan lain?"
- Untuk detail spesifik "syarat buat KTP": Respons HANYA JSON, tanpa teks tambahan.
- Untuk "apa syarat KK baru": Respons teks ringkas: "Halo warga Pandeglang! **Syarat KK Baru**  
  - Fotokopi KTP suami/istri  
  - Buku Nikah atau Akta Perkawinan  
  - Surat Pengantar RT/RW  
  Proses di MPP Pandeglang. Senang membantu!"

Info Dasar MPP:
- Jam operasional: Senin-Jumat, 08:00-15:00 WIB.
- Libur: Sabtu, Minggu, dan hari libur nasional.
- Lokasi: Jl. Jenderal Sudirman No. 1, Pandeglang, Banten.
- Untuk layanan online, arahkan ke situs resmi instansi terkait.`;

  chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
      temperature: 0.1,  // Kurangi randomness untuk respons lebih cepat dan konsisten
      topP: 0.8,         // Batasi pilihan token untuk kecepatan
      maxOutputTokens: 1536,  // Tingkatkan untuk respons lebih informatif tapi tetap ringkas
    },
  });
};

// Input validation to prevent injection or XSS
const validateInput = (message: string): boolean => {
  if (!message || typeof message !== 'string') return false;

  // Check for potentially malicious patterns
  const dangerousPatterns = [
    /<script/i, /javascript:/i, /on\w+\s*=/i, /<iframe/i, /<object/i, /<embed/i,
    /eval\(/i, /setTimeout\(/i, /setInterval\(/i, /Function\(/i
  ];

  return !dangerousPatterns.some(pattern => pattern.test(message));
};

export const sendMessageToChat = async (
  message: string,
  onStream?: (chunk: string) => void
): Promise<ServiceDetails | string> => {
  if (!validateInput(message)) {
    return "Maaf, pesan Anda mengandung konten yang tidak diizinkan. Silakan ajukan pertanyaan yang sesuai.";
  }

  if (!checkRateLimit()) {
    return "Maaf, Anda telah mencapai batas permintaan. Silakan tunggu sebentar sebelum mencoba lagi.";
  }

  if (!chat) {
    startChatSession();
  }

  try {
    // Use streaming if callback is provided
    if (onStream) {
      const stream = await (chat as Chat).sendMessageStream({ message });
      let fullText = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        onStream(chunkText);
      }
      
      const trimmedText = fullText.trim();
      
      if (!trimmedText) {
        throw new Error("API returned an empty response.");
      }

      let cleanedText = cleanAndFixResponse(trimmedText);

      // Validasi: Jika respons teks mengandung blok JSON, ekstrak dan gunakan sebagai JSON
      if (cleanedText.includes('```json') || cleanedText.includes('```')) {
        const jsonMatch = cleanedText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          try {
            const jsonData = JSON.parse(jsonMatch[1].trim());
            
            // Map 'prosedur' to 'sistemMekanismeProsedur' if present
            if (jsonData.prosedur && Array.isArray(jsonData.prosedur)) {
              jsonData.sistemMekanismeProsedur = jsonData.prosedur;
              delete jsonData.prosedur;
            }
            
            // Map 'waktuPelayanan' to 'jangkaWaktu' if present
            if (jsonData.waktuPelayanan && !jsonData.jangkaWaktu) {
              jsonData.jangkaWaktu = jsonData.waktuPelayanan;
              delete jsonData.waktuPelayanan;
            }
            
            // Set default 'lokasiGerai' if missing
            if (!jsonData.lokasiGerai) {
              jsonData.lokasiGerai = "MPP Pandeglang, Jl. Jenderal Sudirman No. 1";
            }
            
            if (jsonData.namaLayanan && jsonData.persyaratan && Array.isArray(jsonData.persyaratan) && jsonData.sistemMekanismeProsedur && Array.isArray(jsonData.sistemMekanismeProsedur)) {
              return jsonData as ServiceDetails;
            }
          } catch (e) {
            console.warn("JSON dalam respons teks gagal di-parse. Menggunakan teks asli.");
          }
          // Hapus blok JSON dari teks untuk respons murni
          cleanedText = cleanedText.replace(/```json\s*[\s\S]*?\s*```/g, '').trim();
        }
      }

      cleanedText = cleanedText.replace(/```json\s*|\s*```/g, '').trim();
    }
    
    // Fallback to non-streaming response
    const response = await (chat as Chat).sendMessage({ message });
    const textResponse = response.text;
    
    if (typeof textResponse !== 'string') {
      console.error("API response did not contain a valid text property:", response);
      throw new Error("Invalid response from API. The response was not text.");
    }
    
    const trimmedText = textResponse.trim();

    if (!trimmedText) {
      throw new Error("API returned an empty response.");
    }

    const cleanedText = cleanAndFixResponse(trimmedText).replace(/```json\s*|\s*```/g, '').trim();

    if (cleanedText.startsWith('{') && cleanedText.endsWith('}')) {
        try {
          let data = JSON.parse(cleanedText);
          
          // Map 'prosedur' to 'sistemMekanismeProsedur' if present
          if (data.prosedur && Array.isArray(data.prosedur)) {
            data.sistemMekanismeProsedur = data.prosedur;
            delete data.prosedur;
          }
          
          // Map 'waktuPelayanan' to 'jangkaWaktu' if present
          if (data.waktuPelayanan && !data.jangkaWaktu) {
            data.jangkaWaktu = data.waktuPelayanan;
            delete data.waktuPelayanan;
          }
          
          // Set default 'lokasiGerai' if missing
          if (!data.lokasiGerai) {
            data.lokasiGerai = "MPP Pandeglang, Jl. Jenderal Sudirman No. 1";
          }
          
          if (data.namaLayanan && data.persyaratan && Array.isArray(data.persyaratan) && data.sistemMekanismeProsedur && Array.isArray(data.sistemMekanismeProsedur)) {
            return data as ServiceDetails;
          } else {
            console.warn("JSON response missing required fields or invalid arrays. Treating as text.", cleanedText);
          }
        } catch (e) {
          console.warn("Response looked like JSON but failed to parse. Treating as text.", cleanedText);
        }
      }
    
    return trimmedText;

  } catch (error) {
    console.error("Error processing chat message:", error);
    // Jangan expose detail error ke user untuk keamanan
    return "Maaf, terjadi sedikit kendala pada sistem. Bisakah Anda mencoba bertanya dengan cara lain?";
  }
};