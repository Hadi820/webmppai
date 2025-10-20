import React, { useState } from 'react';
import { Agency, ServiceDetails } from '../types';

interface ServiceGridProps {
  agencies: Agency[];
  onServiceClick: (service: ServiceDetails) => void;
}

const PLACEHOLDER_LOGO = "https://pandeglangkab.go.id/wp-content/uploads/2022/12/logo-pandeglang.png";
const MAX_VISIBLE_SERVICES = 3;

export const ServiceGrid: React.FC<ServiceGridProps> = ({ agencies, onServiceClick }) => {
  const [expandedAgencies, setExpandedAgencies] = useState<Set<string>>(new Set());

  const toggleAgencyExpansion = (agencyId: string) => {
    setExpandedAgencies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(agencyId)) {
        newSet.delete(agencyId);
      } else {
        newSet.add(agencyId);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
      <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-up">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text mb-2 sm:mb-3 md:mb-4">
          Daftar Layanan Instansi
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
          Jelajahi layanan yang tersedia di Mal Pelayanan Publik Pandeglang
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {agencies.map((agency, idx) => {
          const isExpanded = expandedAgencies.has(agency.id);
          const hasMoreServices = agency.services.length > MAX_VISIBLE_SERVICES;
          const visibleServices = isExpanded ? agency.services : agency.services.slice(0, MAX_VISIBLE_SERVICES);
          const hiddenCount = agency.services.length - MAX_VISIBLE_SERVICES;

          return (
            <div 
              key={agency.id} 
              className="group bg-gradient-to-br from-white to-blue-50/30 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-3 sm:p-4 md:p-6 flex flex-col border border-blue-100/50 card-hover animate-scale-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center mb-3 sm:mb-4 md:mb-6 pb-2 sm:pb-3 md:pb-4 border-b border-blue-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-lg sm:rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <img 
                    src={agency.logo || PLACEHOLDER_LOGO} 
                    alt={`${agency.name} logo`} 
                    className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_LOGO }}
                  />
                </div>
                <h3 className="ml-2 sm:ml-3 md:ml-4 text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                  {agency.name}
                </h3>
              </div>
              <div className="flex-grow space-y-1.5 sm:space-y-2">
                {visibleServices.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => onServiceClick(service)}
                    className="w-full text-left px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-white/60 hover:bg-blue-500 rounded-lg sm:rounded-xl transition-all duration-300 text-gray-700 hover:text-white shadow-sm hover:shadow-md transform hover:translate-x-1 border border-transparent hover:border-blue-400 group/btn"
                  >
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 sm:mr-2.5 md:mr-3 group-hover/btn:bg-white transition-colors flex-shrink-0"></span>
                      <span className="font-medium text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug">{service.namaLayanan}</span>
                    </span>
                  </button>
                ))}
                
                {hasMoreServices && (
                  <button
                    onClick={() => toggleAgencyExpansion(agency.id)}
                    className="w-full text-center px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg sm:rounded-xl transition-all duration-300 text-white shadow-md hover:shadow-lg transform hover:scale-105 font-semibold text-[10px] sm:text-xs md:text-sm mt-2"
                  >
                    {isExpanded ? (
                      <span className="flex items-center justify-center">
                        <span>Tampilkan Lebih Sedikit</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span>Lihat {hiddenCount} Layanan Lainnya</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};