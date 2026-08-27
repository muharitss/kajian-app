import React from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { token } = useAuthStore();

  // If token is missing, render NotFoundPage (obfuscate admin presence)
  if (!token) {
    return <NotFoundPage />;
  }

  return <>{children}</>;
};
