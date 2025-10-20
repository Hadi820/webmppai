import { User } from '../types';

const SESSION_KEY = 'mpp_admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

interface SessionData {
  user: User;
  timestamp: number;
  expiresAt: number;
}

export const sessionManager = {
  /**
   * Save user session to sessionStorage with expiration
   */
  saveSession: (user: User): void => {
    const now = Date.now();
    const sessionData: SessionData = {
      user,
      timestamp: now,
      expiresAt: now + SESSION_DURATION,
    };
    
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  /**
   * Get current session if valid, null if expired or not found
   */
  getSession: (): User | null => {
    try {
      const sessionStr = sessionStorage.getItem(SESSION_KEY);
      if (!sessionStr) return null;

      const sessionData: SessionData = JSON.parse(sessionStr);
      const now = Date.now();

      // Check if session has expired
      if (now > sessionData.expiresAt) {
        sessionManager.clearSession();
        return null;
      }

      return sessionData.user;
    } catch (error) {
      console.error('Failed to get session:', error);
      sessionManager.clearSession();
      return null;
    }
  },

  /**
   * Clear session from storage
   */
  clearSession: (): void => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  },

  /**
   * Check if session is still valid
   */
  isSessionValid: (): boolean => {
    return sessionManager.getSession() !== null;
  },

  /**
   * Get remaining session time in milliseconds
   */
  getRemainingTime: (): number => {
    try {
      const sessionStr = sessionStorage.getItem(SESSION_KEY);
      if (!sessionStr) return 0;

      const sessionData: SessionData = JSON.parse(sessionStr);
      const now = Date.now();
      const remaining = sessionData.expiresAt - now;

      return remaining > 0 ? remaining : 0;
    } catch (error) {
      return 0;
    }
  },

  /**
   * Extend session expiration (refresh session)
   */
  extendSession: (): boolean => {
    try {
      const user = sessionManager.getSession();
      if (!user) return false;

      sessionManager.saveSession(user);
      return true;
    } catch (error) {
      console.error('Failed to extend session:', error);
      return false;
    }
  },
};
