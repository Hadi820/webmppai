import React from 'react';
import { ServiceDetails } from '../types';

// Fungsi untuk memproses teks dengan bold
const processText = (text: string): string => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

interface PlainTextResponseProps {
  data: ServiceDetails;
}

export const PlainTextResponse: React.FC<PlainTextResponseProps> = ({ data }) => {
  const formatResponse = () => {
    if (!data || !data.namaLayanan) {
      return "Data layanan tidak tersedia.";
    }

    let response = `# ${data.namaLayanan}\n\n`;

    if (data.persyaratan && Array.isArray(data.persyaratan) && data.persyaratan.length > 0) {
      response += `**Persyaratan**\n`;
      data.persyaratan.forEach(item => response += `- ${item}\n`);
      response += '\n';
    }

    if (data.sistemMekanismeProsedur && Array.isArray(data.sistemMekanismeProsedur) && data.sistemMekanismeProsedur.length > 0) {
      response += `**Sistem, Mekanisme, dan Prosedur**\n`;
      data.sistemMekanismeProsedur.forEach((item, index) => response += `${index + 1}. ${item}\n`);
      response += '\n';
    }

    response += `**Jangka Waktu**\n${data.jangkaWaktu || 'Tidak ditentukan'}\n\n`;

    response += `**Lokasi Gerai**\n${data.lokasiGerai || 'Tidak ditentukan'}\n\n`;

    if (data.biaya) {
      response += `**Biaya**\n${data.biaya}\n\n`;
    }

    if (data.dasarHukum && Array.isArray(data.dasarHukum) && data.dasarHukum.length > 0) {
      response += `**Dasar Hukum**\n`;
      const hukumArray = Array.isArray(data.dasarHukum) ? data.dasarHukum : [data.dasarHukum];
      hukumArray.forEach(item => response += `- ${item}\n`);
      response += '\n';
    }

    if (data.catatanTambahan) {
      response += `**Catatan Tambahan**\n${data.catatanTambahan}\n`;
    }

    return response;
  };

  return (
    <div className="w-full text-gray-800">
      <div
        className="leading-snug sm:leading-relaxed text-xs sm:text-sm md:text-base break-words whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: processText(formatResponse()) }}
        style={{ lineHeight: '1.6' }}  // Tambahkan line-height untuk paragraf yang lebih rapi
      />
    </div>
  );
};
