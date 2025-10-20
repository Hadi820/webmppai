import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const success = await onLogin(username, password);
    if (!success) {
      setError('Username atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6 border-2 border-blue-100 animate-scale-in">
            <div className="text-center">
                <div className="inline-block bg-white p-3 sm:p-4 md:p-5 rounded-2xl shadow-lg mb-3 sm:mb-4 animate-float">
                  <img 
                      src="/LOGO2.png" 
                      alt="Logo MPP Pandeglang"
                      className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 object-contain"
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">Admin Login</h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600">Mal Pelayanan Publik Pandeglang</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-2xl relative animate-fade-in shadow-md" role="alert">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">⚠️</span>
                          <span className="block sm:inline font-medium">{error}</span>
                        </div>
                    </div>
                )}
                <div>
                    <label 
                        htmlFor="username" 
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="block w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Masukkan username"
                    />
                </div>
                <div>
                    <label 
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Masukkan password"
                    />
                </div>
                <div>
                    <button 
                        type="submit"
                        className="w-full flex justify-center items-center py-4 px-4 border-none rounded-2xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 btn-ripple"
                    >
                        <span>🔐 Login</span>
                    </button>
                </div>
            </form>
             <div className="text-center pt-2">
                <button 
                  onClick={onBack} 
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                    ← Kembali ke halaman utama
                </button>
            </div>
        </div>
    </div>
  );
};