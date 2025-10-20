import React from 'react';
import { ServiceDetails } from '../types';

interface ModelResponseProps {
  data: ServiceDetails;
}

export const ModelResponse: React.FC<ModelResponseProps> = ({ data }) => {
  return (
    <div className="w-full">
      <div className="mb-2 sm:mb-3">
        <h2 className="text-base sm:text-xl md:text-2xl font-bold gradient-text leading-tight">{data.namaLayanan}</h2>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {data.dasarHukum && data.dasarHukum.length > 0 && (
            <div className="glass-effect rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border-l-4 border-blue-500 shadow-sm">
              <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-blue-600 mb-1.5 sm:mb-2 flex items-center">
                <span className="text-sm sm:text-base md:text-lg mr-1 sm:mr-1.5">⚖️</span> 
                <span>Dasar Hukum</span>
              </h3>
              <ul className="space-y-0.5 sm:space-y-1 text-gray-700 text-[10px] sm:text-xs md:text-sm">
                {data.dasarHukum.map((item, index) => (
                  <li key={index} className="flex items-start leading-snug sm:leading-relaxed">
                    <span className="text-blue-500 mr-1 sm:mr-1.5 mt-0.5 flex-shrink-0 text-[10px] sm:text-xs">•</span>
                    <span className="flex-1 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        <div className="glass-effect rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border-l-4 border-purple-500 shadow-sm">
          <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-purple-600 mb-1.5 sm:mb-2 flex items-center">
            <span className="text-sm sm:text-base md:text-lg mr-1 sm:mr-1.5">📋</span> 
            <span>Persyaratan</span>
          </h3>
          <ul className="space-y-0.5 sm:space-y-1 text-gray-700 text-[10px] sm:text-xs md:text-sm">
            {data.persyaratan.map((item, index) => (
              <li key={index} className="flex items-start leading-snug sm:leading-relaxed">
                <span className="text-purple-500 mr-1 sm:mr-1.5 mt-0.5 flex-shrink-0 text-[10px] sm:text-xs">✓</span>
                <span className="flex-1 break-words">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-effect rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border-l-4 border-indigo-500 shadow-sm">
          <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-indigo-600 mb-1.5 sm:mb-2 flex items-center">
            <span className="text-sm sm:text-base md:text-lg mr-1 sm:mr-1.5">🔄</span> 
            <span>Sistem, Mekanisme, dan Prosedur</span>
          </h3>
          <ol className="space-y-1 sm:space-y-1.5 text-gray-700 text-[10px] sm:text-xs md:text-sm">
            {data.sistemMekanismeProsedur.map((item, index) => (
              <li key={index} className="flex items-start leading-snug sm:leading-relaxed">
                <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs font-bold mr-1 sm:mr-1.5 mt-0.5">
                  {index + 1}
                </span>
                <span className="flex-1 break-words">{item}</span>
              </li>
            ))}
          </ol>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
           <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md text-white">
              <div className="text-base sm:text-xl md:text-2xl mb-0.5 sm:mb-1">⏳</div>
              <h3 className="text-[9px] sm:text-[10px] md:text-xs font-semibold opacity-90 mb-0.5">Jangka Waktu</h3>
              <p className="text-[10px] sm:text-xs md:text-sm font-bold leading-tight">{data.jangkaWaktu}</p>
           </div>
           <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md text-white">
              <div className="text-base sm:text-xl md:text-2xl mb-0.5 sm:mb-1">📍</div>
              <h3 className="text-[9px] sm:text-[10px] md:text-xs font-semibold opacity-90 mb-0.5">Lokasi Gerai</h3>
              <p className="text-[10px] sm:text-xs md:text-sm font-bold leading-tight">{data.lokasiGerai}</p>
          </div>
        </div>

        {data.biaya && (
           <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md text-white text-center">
              <div className="text-base sm:text-xl md:text-2xl mb-0.5 sm:mb-1">💰</div>
              <h3 className="text-[9px] sm:text-[10px] md:text-xs font-semibold opacity-90 mb-0.5">Biaya</h3>
              <p className="text-xs sm:text-sm md:text-base font-bold">{data.biaya}</p>
           </div>
        )}

        {data.catatanTambahan && (
          <div className="glass-effect rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border-l-4 border-cyan-500 shadow-sm">
            <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-cyan-600 mb-1.5 sm:mb-2 flex items-center">
              <span className="text-sm sm:text-base md:text-lg mr-1 sm:mr-1.5">ℹ️</span> 
              <span>Catatan Tambahan</span>
            </h3>
            <p className="text-gray-700 text-[10px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed break-words">{data.catatanTambahan}</p>
          </div>
        )}
      </div>
    </div>
  );
};