import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { VoucherProvider } from './VoucherContext';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider combines all context providers in the correct order.
 * Order matters: AuthProvider > UserProvider > VoucherProvider
 * since UserProvider and VoucherProvider depend on AuthProvider.
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <VoucherProvider>
          {children}
        </VoucherProvider>
      </UserProvider>
    </AuthProvider>
  );
}
