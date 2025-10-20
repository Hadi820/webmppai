import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Agency, User } from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/login/LoginPage';
import { HomePage } from './components/HomePage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { fetchAgencies, fetchUsers, authenticateUser } from './services/supabaseService';
import { sessionManager } from './utils/sessionManager';

const App: React.FC = () => {
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for existing session on mount with expiration check
  useEffect(() => {
    const user = sessionManager.getSession();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  // Auto-logout when session expires
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionInterval = setInterval(() => {
      if (!sessionManager.isSessionValid()) {
        handleLogout();
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSessionInterval);
  }, [isAuthenticated]);



  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsFetchingData(true);
        const [agenciesData, usersData] = await Promise.all([
          fetchAgencies(),
          fetchUsers()
        ]);

        setAgencies(agenciesData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsFetchingData(false);
      }
    };

    initializeApp();
  }, []);



  const handleLogin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const authenticatedUser = await authenticateUser(user, pass);
      if (authenticatedUser) {
        setCurrentUser(authenticatedUser);
        setIsAuthenticated(true);
        sessionManager.saveSession(authenticatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionManager.clearSession();
  };



  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={
            isFetchingData ? (
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
                <LoadingSpinner message="Memuat data..." submessage="Menyiapkan layanan MPP Pandeglang" size="lg" />
              </div>
            ) : (
              <HomePage agencies={agencies} />
            )
          } />
          
          <Route path="/login" element={
            isAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <LoginPage onLogin={handleLogin} onBack={() => window.location.href = '/'} />
            )
          } />
          
          <Route path="/admin" element={
            isAuthenticated ? (
              <AdminDashboard
                agencies={agencies}
                setAgencies={setAgencies}
                onLogout={handleLogout}
                users={users}
                setUsers={setUsers}
                currentUser={currentUser!}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;