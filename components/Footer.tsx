import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white mt-8 sm:mt-12 md:mt-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-6xl mx-auto py-6 sm:py-8 md:py-10 px-3 sm:px-4">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4 sm:mb-5 md:mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            {/* Logo MPP */}
            <div className="bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
              <img 
                src="/logo.png" 
                alt="Logo MPP Pandeglang"
                className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white leading-tight">Mal Pelayanan Publik</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-blue-200">Kabupaten Pandeglang</p>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs md:text-sm text-blue-100 max-w-xs px-2 sm:px-0">
            Melayani dengan sepenuh hati untuk masyarakat Pandeglang
          </p>
        </div>

        {/* Cards Section - Side by Side on Mobile */}
        <div className="grid grid-cols-2 md:flex md:flex-row md:justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-[10px] sm:text-xs md:text-sm text-blue-100">
          <div className="animate-fade-in-up [animation-delay:100ms]">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 border border-white/20 h-full">
              <p className="flex items-start justify-start mb-1 sm:mb-1.5">
                <span className="text-sm sm:text-base md:text-lg mr-1 sm:mr-1.5 flex-shrink-0">📞</span>
                <span className="leading-tight text-left">
                  <strong className="text-white block mb-0.5">Kontak MPP:</strong>
                  <span className="block">(0253) 123-456</span>
                </span>
              </p>
              <p className="flex items-start justify-start">
                <span className="text-sm sm:text-base md:text-lg mr-1 sm:mr-1.5 flex-shrink-0">📍</span>
                <span className="leading-tight text-left">Jl. Jenderal Sudirman No. 1, Pandeglang</span>
              </p>
            </div>
          </div>
          
          <div className="animate-fade-in-up [animation-delay:200ms]">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 border border-white/20 h-full">
              <p className="font-semibold text-white mb-1 sm:mb-1.5 text-[11px] sm:text-xs md:text-sm">Jam Operasional</p>
              <p className="leading-snug">Senin - Jumat: 08:00 - 16:00</p>
              <p className="leading-snug">Sabtu: 08:00 - 12:00</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4 md:pt-6 border-t border-blue-500/30 text-center text-[10px] sm:text-xs md:text-sm text-blue-200">
          <p>&copy; {new Date().getFullYear()} Pemerintah Kabupaten Pandeglang. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};