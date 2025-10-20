export interface ServiceDetails {
  namaLayanan: string;
  dasarHukum?: string[];
  persyaratan: string[];
  sistemMekanismeProsedur: string[];
  jangkaWaktu: string;
  lokasiGerai: string;
  biaya?: string;
  catatanTambahan?: string;
}

export interface Agency {
  id: string;
  name: string;
  logo: string;
  services: ServiceDetails[];
}

export type ChatRole = 'user' | 'model' | 'error';

export interface ChatMessage {
  role: ChatRole;
  content: string | ServiceDetails;
}

export interface MppProfile {
  name: string;
  address: string;
  description: string;
  operatingHours: {
    workdays: string;
    weekends: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
  };
}

export interface User {
  id: string; // Changed from number to string (UUID)
  username: string;
  password: string; // This will always be masked ('********')
}

export interface ChatLog {
  id: string;
  timestamp: Date;
  query: string;
  serviceInquired: string; // e.g., "KTP", "SIM", "Umum"
  responseTime: number; // in milliseconds
  wasSuccessful: boolean; // Did the bot give a structured answer?
}
