import React from 'react';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="glass-effect p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text mb-4">Analitik Pengguna</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Fitur analitik chat telah dinonaktifkan untuk meringankan beban aplikasi. Riwayat chat tidak lagi disimpan di database.
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          Jika Anda memerlukan analitik, pertimbangkan untuk mengaktifkan kembali penyimpanan data di pengaturan.
        </p>
      </div>
    </div>
  );
};