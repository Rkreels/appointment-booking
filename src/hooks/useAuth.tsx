
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rolePermissions: Record<UserRole, string[]> = {
  admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings', 'view_analytics'],
  manager: ['read', 'write', 'manage_bookings', 'view_analytics'],
  user: ['read', 'write', 'manage_own_bookings'],
  viewer: ['read'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock authentication - replace with real authentication
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      name: 'Alex Smith',
      email: 'alex@example.com',
      role: 'admin',
      permissions: rolePermissions.admin,
    };
    setUser(mockUser);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login logic
    console.log('Logging in:', email);
    const mockUser: User = {
      id: '1',
      name: 'Alex Smith',
      email,
      role: 'admin',
      permissions: rolePermissions.admin,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
