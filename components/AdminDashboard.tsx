import React, { useState, useMemo, useEffect } from 'react';
import { Agency, ServiceDetails, MppProfile, User } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { SearchIcon } from './icons/SearchIcon';
import { IdentificationIcon } from './icons/IdentificationIcon';
import { ProfileSettings } from './ProfileSettings';
import { 
  createAgency, 
  updateAgency, 
  deleteAgency,
  createService,
  updateService,
  deleteService,
  fetchMppProfile,
  updateMppProfile
} from '../services/supabaseService';


interface AdminDashboardProps {
  agencies: Agency[];
  setAgencies: React.Dispatch<React.SetStateAction<Agency[]>>;
  onLogout: () => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User;
}

const initialProfileData: MppProfile = {
  name: "Mal Pelayanan Publik Kabupaten Pandeglang",
  description: "Pusat layanan terpadu untuk berbagai keperluan administrasi publik di Kabupaten Pandeglang. Kami berkomitmen untuk memberikan pelayanan yang cepat, mudah, dan transparan.",
  address: "Jl. Jenderal Sudirman No. 1, Pandeglang, Banten, 42211",
  operatingHours: {
    workdays: "Senin - Jumat, 08:00 - 15:00 WIB",
    weekends: "Sabtu, Minggu, dan Hari Libur Nasional Tutup",
  },
  contact: {
    phone: "(0253) 123-456",
    email: "mpp@pandeglangkab.go.id",
  },
  socialMedia: {
    instagram: "https://instagram.com/mpp_pandeglang",
    facebook: "https://facebook.com/mpp.pandeglang",
  },
};


const FormInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }> = ({ label, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="text" value={value} onChange={onChange} required={required} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

const FormTextarea: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
  </div>
);

type EditingAgencyState = {
  agency: Partial<Agency>;
  isNew: boolean;
} | null;

type AdminTab = 'instansi' | 'analitik' | 'profil' | 'api';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ agencies, setAgencies, onLogout, users, setUsers, currentUser }) => {
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(agencies[0]?.id || null);
  const [editingService, setEditingService] = useState<{ agencyId: string; serviceIndex: number; service: ServiceDetails } | null>(null);
  const [editingAgency, setEditingAgency] = useState<EditingAgencyState>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('instansi');
  const [searchQuery, setSearchQuery] = useState('');
  const [mppProfile, setMppProfile] = useState<MppProfile>(initialProfileData);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredAgencies = useMemo(() => {
    if (!searchQuery.trim()) {
      return agencies;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return agencies.filter(agency => {
      const agencyNameMatches = agency.name.toLowerCase().includes(lowercasedQuery);
      const serviceNameMatches = agency.services.some(service =>
        service.namaLayanan.toLowerCase().includes(lowercasedQuery)
      );
      return agencyNameMatches || serviceNameMatches;
    });
  }, [searchQuery, agencies]);

  useEffect(() => {
    // If the currently selected agency is filtered out, deselect it.
    if (selectedAgencyId && !filteredAgencies.some(a => a.id === selectedAgencyId)) {
      setSelectedAgencyId(null);
    }
  }, [filteredAgencies, selectedAgencyId]);

  useEffect(() => {
    // Fetch MPP profile when profile tab is active
    if (activeTab === 'profil' && !isLoadingProfile) {
      const loadProfile = async () => {
        setIsLoadingProfile(true);
        try {
          const profile = await fetchMppProfile();
          if (profile) {
            setMppProfile(profile);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      };
      loadProfile();
    }
  }, [activeTab]);


  const selectedAgency = agencies.find(a => a.id === selectedAgencyId);

  const handleSaveService = async () => {
    if (!editingService) return;
    const { agencyId, serviceIndex, service } = editingService;

    setIsLoadingAction(true);
    setActionError(null);

    try {
      if (serviceIndex > -1) {
        // Update existing service
        const agency = agencies.find(a => a.id === agencyId);
        if (agency) {
          const oldServiceName = agency.services[serviceIndex].namaLayanan;
          await updateService(agencyId, oldServiceName, service);
        }
      } else {
        // Create new service
        await createService(agencyId, service);
      }

      // Update local state
      setAgencies(prevAgencies => {
        return prevAgencies.map(agency => {
          if (agency.id === agencyId) {
            const newServices = [...agency.services];
            if (serviceIndex > -1) {
              newServices[serviceIndex] = service;
            } else {
              newServices.push(service);
            }
            return { ...agency, services: newServices };
          }
          return agency;
        });
      });
      setEditingService(null);
      setSuccessMessage('Layanan berhasil disimpan!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan layanan';
      setActionError(errorMessage);
      console.error('Error saving service:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleAddNewService = (agencyId: string) => {
    setEditingService({
      agencyId,
      serviceIndex: -1,
      service: {
        namaLayanan: '',
        dasarHukum: [],
        persyaratan: [],
        sistemMekanismeProsedur: [],
        jangkaWaktu: '',
        lokasiGerai: '',
        biaya: '',
        catatanTambahan: '',
      },
    });
  };

  const handleDeleteService = async (agencyId: string, serviceIndex: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      setIsLoadingAction(true);
      setActionError(null);

      try {
        const agency = agencies.find(a => a.id === agencyId);
        if (agency) {
          const serviceName = agency.services[serviceIndex].namaLayanan;
          await deleteService(agencyId, serviceName);

          // Update local state
          setAgencies(prevAgencies => prevAgencies.map(agency => {
            if (agency.id === agencyId) {
              const newServices = agency.services.filter((_, index) => index !== serviceIndex);
              return { ...agency, services: newServices };
            }
            return agency;
          }));
          setSuccessMessage('Layanan berhasil dihapus!');
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus layanan';
        setActionError(errorMessage);
        console.error('Error deleting service:', error);
      } finally {
        setIsLoadingAction(false);
      }
    }
  };

  const handleServiceFieldChange = (field: keyof ServiceDetails, value: string) => {
    if (!editingService) return;
    const isArrayField = ['dasarHukum', 'persyaratan', 'sistemMekanismeProsedur'].includes(field);
    setEditingService({
      ...editingService,
      service: {
        ...editingService.service,
        [field]: isArrayField ? value.split('\n').filter(line => line.trim() !== '') : value,
      },
    });
  };
  
  const handleOpenNewAgencyModal = () => {
    setEditingAgency({
      agency: { id: '', name: '', logo: '', services: [] },
      isNew: true,
    });
  };

  const handleOpenEditAgencyModal = (agency: Agency) => {
    setEditingAgency({ agency, isNew: false });
  };
  
  const handleSaveAgency = async () => {
    if (!editingAgency) return;
    const { agency, isNew } = editingAgency;

    if (!agency.name || agency.name.trim() === '') {
        setActionError("Nama instansi tidak boleh kosong.");
        return;
    }

    setIsLoadingAction(true);
    setActionError(null);

    try {
      if (isNew) {
        const newAgency = await createAgency(agency.name, agency.logo);
        setAgencies(prev => [...prev, newAgency]);
      } else {
        await updateAgency(agency.id!, agency.name, agency.logo);
        setAgencies(prev => prev.map(a => (a.id === agency.id ? { ...a, name: agency.name!, logo: agency.logo! } : a)));
      }
      setEditingAgency(null);
      setSuccessMessage('Instansi berhasil disimpan!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan instansi';
      setActionError(errorMessage);
      console.error('Error saving agency:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };
  
  const handleAgencyFieldChange = (field: 'name', value: string) => {
    if (!editingAgency) return;
    setEditingAgency({
        ...editingAgency,
        agency: {
            ...editingAgency.agency,
            [field]: value,
        },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingAgency) {
          setEditingAgency({
            ...editingAgency,
            agency: {
              ...editingAgency.agency,
              logo: reader.result as string,
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto py-3 sm:py-4 px-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-md">
              <img 
                src="/logo.png" 
                alt="Logo MPP"
                className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">Admin Dashboard</h1>
              <p className="text-[10px] sm:text-xs text-blue-100">MPP Pandeglang</p>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="text-xs sm:text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>
      
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm sticky top-[52px] sm:top-[60px] z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-4 md:space-x-6 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('instansi')}
              className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center transition-all ${
                activeTab === 'instansi'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Manajemen </span>Instansi
            </button>
            <button
              onClick={() => setActiveTab('analitik')}
              className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center transition-all ${
                activeTab === 'analitik'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Analitik
            </button>
            <button
              onClick={() => setActiveTab('profil')}
              className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center transition-all ${
                activeTab === 'profil'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IdentificationIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Profil MPP
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center transition-all ${
                activeTab === 'api'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Pengaturan API
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {actionError && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{actionError}</p>
              </div>
              <button onClick={() => setActionError(null)} className="text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'instansi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-4">
                <div className="glass-effect p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 sticky top-[120px] sm:top-[140px]">
                <div className="relative mb-3 sm:mb-4">
                    <input
                        type="text"
                        placeholder="Cari instansi atau layanan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm border-2 border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                </div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Daftar Instansi</h2>
                <ul className="space-y-1.5 sm:space-y-2 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-1">
                    {filteredAgencies.map(agency => (
                    <li key={agency.id} className="group flex items-center justify-between rounded-lg hover:bg-blue-50 transition-all">
                        <button
                            onClick={() => setSelectedAgencyId(agency.id)}
                            className={`text-left w-full p-2 sm:p-3 transition-all rounded-lg flex justify-between items-center ${selectedAgencyId === agency.id ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md' : 'text-gray-700'}`}
                        >
                            <span className="flex-grow pr-2 text-xs sm:text-sm md:text-base leading-tight">{agency.name}</span>
                            <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${selectedAgencyId === agency.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                                {agency.services.length}
                            </span>
                        </button>
                        <button 
                            onClick={() => handleOpenEditAgencyModal(agency)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all mr-1"
                            aria-label={`Edit ${agency.name}`}
                        >
                            <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </li>
                    ))}
                     {filteredAgencies.length === 0 && (
                        <li className="p-3 text-center text-gray-500 text-xs sm:text-sm">
                            Tidak ada hasil ditemukan.
                        </li>
                    )}
                </ul>
                <button 
                    onClick={handleOpenNewAgencyModal}
                    className="mt-3 sm:mt-4 w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                    + Tambah Instansi Baru
                </button>
                </div>
            </div>
            <div className="lg:col-span-8">
                {selectedAgency ? (
                <div className="glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-3 sm:pb-4 border-b border-blue-100">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text leading-tight">{selectedAgency.name}</h2>
                    <button onClick={() => handleAddNewService(selectedAgency.id)} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all text-xs sm:text-sm font-semibold transform hover:scale-105 whitespace-nowrap">
                        + Tambah Layanan
                    </button>
                    </div>
                    <div className="space-y-3">
                    {selectedAgency.services.map((service, index) => (
                        <div key={index} className="bg-white border-2 border-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 hover:shadow-md transition-all group">
                        <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base leading-tight">{service.namaLayanan}</h3>
                        <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                            <button onClick={() => setEditingService({ agencyId: selectedAgency.id, serviceIndex: index, service })} className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-100 transition-all" aria-label={`Edit ${service.namaLayanan}`}>
                            <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                            </button>
                            <button onClick={() => handleDeleteService(selectedAgency.id, index)} className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-100 transition-all" aria-label={`Hapus ${service.namaLayanan}`}>
                            <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                            </button>
                        </div>
                        </div>
                    ))}
                    {selectedAgency.services.length === 0 && (
                        <div className="text-center py-8 sm:py-12 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30">
                            <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-2 text-xs sm:text-sm font-semibold text-gray-900">Belum ada layanan</h3>
                            <p className="mt-1 text-[10px] sm:text-xs text-gray-600">Mulai tambahkan layanan untuk instansi ini.</p>
                        </div>
                    )}
                    </div>
                </div>
                ) : (
                    <div className="text-center py-12 sm:py-20 glass-effect rounded-xl sm:rounded-2xl shadow-lg border border-blue-100">
                        <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 px-4">
                           {searchQuery ? 'Tidak ada instansi yang cocok dengan pencarian Anda.' : 'Pilih instansi dari daftar untuk melihat dan mengelola layanannya.'}
                        </h3>
                    </div>
                )}
            </div>
            </div>
        )}
        
        {activeTab === 'analitik' && (
            <AnalyticsDashboard />
        )}

        {activeTab === 'profil' && (
            <ProfileSettings 
              profile={mppProfile} 
              setProfile={setMppProfile}
              currentUser={currentUser}
              users={users}
              setUsers={setUsers}
            />
        )}

        {activeTab === 'api' && (
            <div className="glass-effect p-6 rounded-xl shadow-lg border border-blue-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Pengaturan API Gemini</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const apiKey = (e.target as any).apiKey.value;
                if (apiKey.trim()) {
                  localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
                  alert('API Key Gemini berhasil diperbarui! Silakan refresh halaman untuk menerapkan perubahan.');
                  window.location.reload(); // Restart aplikasi untuk menerapkan API key baru
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key Gemini</label>
                  <input
                    type="password"
                    name="apiKey"
                    defaultValue={localStorage.getItem('GEMINI_API_KEY') || ''}
                    placeholder="Masukkan API Key Gemini baru"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">API Key akan disimpan di localStorage dan diterapkan setelah refresh halaman.</p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                >
                  Perbarui API Key
                </button>
              </form>
            </div>
        )}

        {editingService && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">{editingService.serviceIndex > -1 ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <FormInput label="Nama Layanan" value={editingService.service.namaLayanan} onChange={e => handleServiceFieldChange('namaLayanan', e.target.value)} required />
                <FormTextarea label="Dasar Hukum (satu per baris)" value={editingService.service.dasarHukum?.join('\n') || ''} onChange={e => handleServiceFieldChange('dasarHukum', e.target.value)} placeholder="PP No. 1 Tahun 2024..." />
                <FormTextarea label="Persyaratan (satu per baris)" value={editingService.service.persyaratan.join('\n')} onChange={e => handleServiceFieldChange('persyaratan', e.target.value)} placeholder="Fotokopi KTP..." />
                <FormTextarea label="Sistem, Mekanisme, dan Prosedur (satu per baris)" value={editingService.service.sistemMekanismeProsedur.join('\n')} onChange={e => handleServiceFieldChange('sistemMekanismeProsedur', e.target.value)} placeholder="1. Pemohon datang..." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    <FormInput label="Jangka Waktu" value={editingService.service.jangkaWaktu} onChange={e => handleServiceFieldChange('jangkaWaktu', e.target.value)} />
                    <FormInput label="Lokasi Gerai" value={editingService.service.lokasiGerai} onChange={e => handleServiceFieldChange('lokasiGerai', e.target.value)} />
                    <FormInput label="Biaya / Tarif" value={editingService.service.biaya || ''} onChange={e => handleServiceFieldChange('biaya', e.target.value)} />
                </div>
                
                <FormInput label="Catatan Tambahan" value={editingService.service.catatanTambahan || ''} onChange={e => handleServiceFieldChange('catatanTambahan', e.target.value)} />

              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                <button 
                  onClick={() => setEditingService(null)} 
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50"
                  disabled={isLoadingAction}
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveService} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={isLoadingAction}
                >
                  {isLoadingAction ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {editingAgency && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="p-6 space-y-5">
                <h2 className="text-xl font-bold">{editingAgency.isNew ? 'Tambah Instansi Baru' : 'Edit Instansi'}</h2>
                
                <FormInput 
                    label="Nama Instansi" 
                    value={editingAgency.agency.name || ''} 
                    onChange={e => handleAgencyFieldChange('name', e.target.value)} 
                    required 
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo Instansi</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <span className="inline-block h-16 w-16 rounded-md overflow-hidden bg-gray-100 border">
                      {editingAgency.agency.logo ? (
                        <img src={editingAgency.agency.logo} alt="Logo preview" className="h-full w-full object-contain" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <svg className="h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.993A1 1 0 001 19.503V7.497A1 1 0 000 6.503V3.007A1 1 0 001 2.007v-2.5A1 1 0 000-.503V-3.993L12 3l12-6.993v2.993A1 1 0 0023 1.007V3.5A1 1 0 0024 4.503v13.994A1 1 0 0023 19.503V22.003a1 1 0 001-1.01z" />
                            </svg>
                        </div>
                      )}
                    </span>
                    <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                    />
                    <label
                        htmlFor="logo-upload"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {editingAgency.agency.logo ? 'Ganti Logo' : 'Unggah Logo'}
                    </label>
                  </div>
                </div>

              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                <button 
                  onClick={() => setEditingAgency(null)} 
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50"
                  disabled={isLoadingAction}
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveAgency} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={isLoadingAction}
                >
                  {isLoadingAction ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Instansi'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};