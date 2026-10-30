import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type AuthUser, type UserRole, type LoginResult } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Cross-tab sync for logout/login
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ambo_hrms_auth_session') {
        setUser(authService.getCurrentUser());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setLoading(true);
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
