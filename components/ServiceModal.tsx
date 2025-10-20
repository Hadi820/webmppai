import React, { useEffect, useState } from 'react';
import { ServiceDetails } from '../types';

interface ServiceModalProps {
  service: ServiceDetails;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // Trigger the transition on mount
    setIsShowing(true);
  }, []);

  const handleClose = () => {
    setIsShowing(false);
    // Wait for the animation to finish before calling the parent's onClose
    setTimeout(onClose, 300); // Duration matches transition-duration
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-all duration-300 ease-out ${isShowing ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 sm:p-10 relative transition-all duration-500 ease-out border-2 border-blue-100 ${isShowing ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-90'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white hover:bg-blue-500 rounded-full p-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:rotate-90 z-10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4 sm:mb-6 md:mb-8 animate-fade-in-up">
          <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3 md:mb-4">
            Detail Layanan
          </div>
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text leading-tight">{service.namaLayanan}</h2>
        </div>

        <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
          {service.dasarHukum && service.dasarHukum.length > 0 && (
            <div className="glass-effect rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md border border-blue-100 animate-slide-in-left">
              <h3 className="text-[11px] sm:text-xs md:text-sm lg:text-base font-bold text-blue-600 mb-1.5 sm:mb-2 md:mb-3 flex items-center">
                <span className="text-sm sm:text-lg md:text-xl lg:text-2xl mr-1 sm:mr-1.5 md:mr-2">⚖️</span> 
                <span>Dasar Hukum</span>
              </h3>
              <ul className="space-y-0.5 sm:space-y-1 md:space-y-1.5 text-gray-700 text-[10px] sm:text-xs md:text-sm lg:text-base">
                {service.dasarHukum.map((item, index) => (
                  <li key={index} className="flex items-start leading-snug sm:leading-relaxed">
                    <span className="text-blue-500 mr-1 sm:mr-1.5 md:mr-2 mt-0.5 flex-shrink-0 text-[10px] sm:text-xs">•</span>
                    <span className="flex-1 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="glass-effect rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md border border-blue-100 animate-slide-in-right">
            <h3 className="text-[11px] sm:text-xs md:text-sm lg:text-base font-bold text-blue-600 mb-1.5 sm:mb-2 md:mb-3 flex items-center">
              <span className="text-sm sm:text-lg md:text-xl lg:text-2xl mr-1 sm:mr-1.5 md:mr-2">📋</span> 
              <span>Persyaratan</span>
            </h3>
            <ul className="space-y-0.5 sm:space-y-1 md:space-y-1.5 text-gray-700 text-[10px] sm:text-xs md:text-sm lg:text-base">
              {service.persyaratan.map((item, index) => (
                <li key={index} className="flex items-start leading-snug sm:leading-relaxed">
                  <span className="text-blue-500 mr-1 sm:mr-1.5 md:mr-2 mt-0.5 flex-shrink-0 text-[10px] sm:text-xs">✓</span>
                  <span className="flex-1 break-words">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-effect rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md border border-blue-100 animate-slide-in-left">
            <h3 className="text-[11px] sm:text-xs md:text-sm lg:text-base font-bold text-blue-600 mb-1.5 sm:mb-2 md:mb-3 flex items-center">
              <span className="text-sm sm:text-lg md:text-xl lg:text-2xl mr-1 sm:mr-1.5 md:mr-2">🔄</span> 
              <span>Sistem, Mekanisme, dan Prosedur</span>
            </h3>
            <ol className="space-y-1 sm:space-y-1.5 md:space-y-2 text-gray-700 text-[10px] sm:text-xs md:text-sm lg:text-base">
              {service.sistemMekanismeProsedur.map((item, index) => (
                <li key={index} className="flex items-start leading-snug sm:leading-relaxed">
                  <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-bold mr-1 sm:mr-1.5 md:mr-2 lg:mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="flex-1 break-words">{item}</span>
                </li>
              ))}
            </ol>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 animate-scale-in">
             <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
                <div className="text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1 md:mb-2">⏳</div>
                <h3 className="text-[9px] sm:text-xs md:text-sm font-semibold opacity-90 mb-0.5 sm:mb-1">Jangka Waktu</h3>
                <p className="text-[10px] sm:text-sm md:text-base lg:text-lg font-bold leading-tight">{service.jangkaWaktu}</p>
             </div>
             <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2.5 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
                <div className="text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1 md:mb-2">📍</div>
                <h3 className="text-[9px] sm:text-xs md:text-sm font-semibold opacity-90 mb-0.5 sm:mb-1">Lokasi Gerai</h3>
                <p className="text-[10px] sm:text-sm md:text-base lg:text-lg font-bold leading-tight">{service.lokasiGerai}</p>
            </div>
          </div>

          {service.biaya && (
             <div className="bg-gradient-to-br from-green-500 to-green-600 p-2.5 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg text-white text-center transform hover:scale-105 transition-transform animate-scale-in">
                <div className="text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1 md:mb-2">💰</div>
                <h3 className="text-[9px] sm:text-xs md:text-sm font-semibold opacity-90 mb-0.5 sm:mb-1">Biaya</h3>
                <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold">{service.biaya}</p>
             </div>
          )}

          {service.catatanTambahan && (
            <div className="glass-effect rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md border-2 border-purple-200 animate-fade-in">
              <h3 className="text-[11px] sm:text-xs md:text-sm lg:text-base font-bold text-purple-600 mb-1.5 sm:mb-2 md:mb-3 flex items-center">
                <span className="text-sm sm:text-lg md:text-xl lg:text-2xl mr-1 sm:mr-1.5 md:mr-2">ℹ️</span> 
                <span>Catatan Tambahan</span>
              </h3>
              <p className="text-gray-700 text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug sm:leading-relaxed break-words">{service.catatanTambahan}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};