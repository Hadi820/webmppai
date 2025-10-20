import { ChatLog } from '../types';

const sampleQueries = [
  "syarat buat KTP baru apa aja?", "cara perpanjang SIM C", "lokasi gerai SKCK di mana?",
  "biaya pembuatan paspor berapa?", "jam buka mpp pandeglang hari jumat", "daftar bpjs mandiri",
  "apa itu IMB dan bagaimana cara mengurusnya", "pajak motor tahunan", "ganti kaleng stnk",
  "kalau ktp hilang gimana", "mau urus surat nikah", "prosedur izin usaha mikro",
  "cara cek tagihan pbb online", "perbedaan kia dan ktp", "butuh berapa lama buat skck?",
  "apakah sabtu mpp buka?", "bisa bayar pdam di mpp?", "syarat legalisir ijazah"
];

const services = ["KTP", "SIM", "SKCK", "Paspor", "BPJS", "Perizinan", "Pajak", "Lainnya"];

// Function to generate a random integer
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateDummyChatLogs = (days: number): ChatLog[] => {
  const logs: ChatLog[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    const numLogsForDay = getRandomInt(20, 150); // Random number of logs per day

    for (let j = 0; j < numLogsForDay; j++) {
      const timestamp = new Date(date);
      timestamp.setHours(getRandomInt(8, 16), getRandomInt(0, 59), getRandomInt(0, 59));
      
      const query = sampleQueries[getRandomInt(0, sampleQueries.length - 1)];
      const wasSuccessful = Math.random() > 0.15; // 85% success rate
      
      let serviceInquired = "Lainnya";
      if (query.includes("KTP") || query.includes("ktp")) serviceInquired = "KTP";
      else if (query.includes("SIM") || query.includes("sim")) serviceInquired = "SIM";
      else if (query.includes("SKCK") || query.includes("skck")) serviceInquired = "SKCK";
      else if (query.includes("Paspor") || query.includes("paspor")) serviceInquired = "Paspor";
      else if (query.includes("BPJS") || query.includes("bpjs")) serviceInquired = "BPJS";
      else if (query.includes("usaha") || query.includes("izin")) serviceInquired = "Perizinan";
      else if (query.includes("pajak") || query.includes("stnk")) serviceInquired = "Pajak";


      logs.push({
        id: `log-${i}-${j}`,
        timestamp,
        query,
        serviceInquired,
        responseTime: getRandomInt(800, 5000), // response time between 0.8s and 5s
        wasSuccessful,
      });
    }
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
