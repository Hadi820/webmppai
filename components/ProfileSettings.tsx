import React, { useState, useEffect } from 'react';
import { MppProfile, User } from '../types';
import { KeyIcon } from './icons/KeyIcon';
import { UsersIcon } from './icons/UsersIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { updateMppProfile, updateUser, createUser } from '../services/supabaseService';

interface ProfileSettingsProps {
  profile: MppProfile;
  setProfile: React.Dispatch<React.SetStateAction<MppProfile>>;
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, setProfile, currentUser, users, setUsers }) => {
  const [formData, setFormData] = useState<MppProfile>(profile);
  const [showSuccess, setShowSuccess] = useState(false);

  // State for password reset
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // State for adding a new user
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [addUserError, setAddUserError] = useState('');


  useEffect(() => {
    setFormData(profile);
  }, [profile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    if (keys.length > 1) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0] as keyof MppProfile] as object,
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMppProfile(formData);
      setProfile(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gagal menyimpan profil. Silakan coba lagi.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword || !confirmPassword) {
      setPasswordError('Semua kolom wajib diisi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Kata sandi baru tidak cocok.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Kata sandi minimal harus 6 karakter.');
      return;
    }

    try {
      await updateUser(currentUser.id, currentUser.username, newPassword);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === currentUser.id ? { ...user, password: newPassword } : user
        )
      );
      setPasswordSuccess('Kata sandi berhasil diperbarui!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Gagal memperbarui password. Silakan coba lagi.');
    }
  };
  
  const handleAddNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError('');

    if (!newUsername.trim() || !newUserPassword.trim()) {
      setAddUserError('Username dan password tidak boleh kosong.');
      return;
    }
    if (users.some(user => user.username === newUsername.trim())) {
      setAddUserError('Username sudah digunakan.');
      return;
    }

    try {
      const newUser = await createUser(newUsername.trim(), newUserPassword);
      setUsers(prev => [...prev, newUser]);
      setNewUsername('');
      setNewUserPassword('');
      setShowAddUserForm(false);
    } catch (error) {
      console.error('Error creating user:', error);
      setAddUserError('Gagal menambahkan pengguna. Silakan coba lagi.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informasi Umum */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informasi Umum</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Mal Pelayanan Publik</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Jadwal Operasional */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Jadwal Operasional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="operatingHours.workdays" className="block text-sm font-medium text-gray-700">Jam Buka (Senin-Jumat)</label>
              <input
                type="text"
                id="operatingHours.workdays"
                name="operatingHours.workdays"
                value={formData.operatingHours.workdays}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="operatingHours.weekends" className="block text-sm font-medium text-gray-700">Hari Libur</label>
              <input
                type="text"
                id="operatingHours.weekends"
                name="operatingHours.weekends"
                value={formData.operatingHours.weekends}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Kontak & Media Sosial */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Kontak & Media Sosial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input
                type="text"
                id="contact.phone"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">Alamat Email</label>
              <input
                type="email"
                id="contact.email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700">URL Instagram</label>
              <input
                type="url"
                id="socialMedia.instagram"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="socialMedia.facebook" className="block text-sm font-medium text-gray-700">URL Facebook</label>
              <input
                type="url"
                id="socialMedia.facebook"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center pt-4">
          {showSuccess && (
            <p className="text-green-600 mr-4 transition-opacity duration-300">
              Perubahan profil berhasil disimpan!
            </p>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Simpan Perubahan Profil
          </button>
        </div>
      </form>
      
      {/* User Management Section */}
      <div className="space-y-8">
         {/* Password Reset */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            <KeyIcon className="w-6 h-6 mr-3 text-gray-500" />
            Ubah Password Anda ({currentUser.username})
          </h3>
          <form onSubmit={handlePasswordReset} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                Simpan Password Baru
              </button>
            </div>
          </form>
        </div>

        {/* User List & Add User */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="flex items-center text-xl font-bold text-gray-800">
                <UsersIcon className="w-6 h-6 mr-3 text-gray-500" />
                Manajemen Pengguna
            </h3>
            {!showAddUserForm && (
              <button 
                onClick={() => setShowAddUserForm(true)}
                className="flex items-center px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-md hover:bg-blue-100 text-sm font-medium transition-colors"
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Tambah Pengguna Baru
              </button>
            )}
          </div>

          {showAddUserForm && (
             <form onSubmit={handleAddNewUser} className="p-4 mb-6 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
               <h4 className="font-semibold text-gray-700">Formulir Pengguna Baru</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Username Baru</label>
                    <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                 </div>
               </div>
               {addUserError && <p className="text-sm text-red-600">{addUserError}</p>}
               <div className="flex justify-end space-x-3">
                 <button type="button" onClick={() => setShowAddUserForm(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50">Batal</button>
                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan Pengguna</button>
               </div>
             </form>
          )}

          <div className="space-y-2">
            <h4 className="text-md font-semibold text-gray-600 px-3">Pengguna Terdaftar</h4>
            <ul className="divide-y divide-gray-200">
                {users.map(user => (
                    <li key={user.id} className="p-3 flex items-center justify-between">
                        <span className="text-gray-800">{user.username}</span>
                        {user.id === currentUser.id && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">ANDA</span>}
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};