import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

interface Voucher {
  id: string;
  cafeId: string;
  name: string;
  description?: string;
  value: number; // Amount saved
}

interface VoucherRedemption {
  voucherId: string;
  cafeId: string;
  timestamp: number;
  date: string; // YYYY-MM-DD format
}

interface VoucherContextType {
  redemptions: VoucherRedemption[];
  isVoucherAvailable: (cafeId: string) => boolean;
  redeemVoucher: (voucherId: string, cafeId: string, merchantCode: string) => Promise<boolean>;
  globalVoucherCount: number;
  resetDailyRedemptions: () => Promise<void>;
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

const VOUCHER_REDEMPTIONS_KEY = '@kraver_voucher_redemptions';
const GLOBAL_VOUCHER_COUNT_KEY = '@kraver_global_voucher_count';

export function VoucherProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [redemptions, setRedemptions] = useState<VoucherRedemption[]>([]);
  const [globalVoucherCount, setGlobalVoucherCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadRedemptions();
      loadGlobalCount();
      checkAndResetDaily();
    } else {
      setRedemptions([]);
      setGlobalVoucherCount(0);
    }
  }, [isAuthenticated, user?.id]);

  const loadRedemptions = async () => {
    try {
      const data = await AsyncStorage.getItem(`${VOUCHER_REDEMPTIONS_KEY}_${user?.id}`);
      if (data) {
        const allRedemptions: VoucherRedemption[] = JSON.parse(data);
        // Filter to only today's redemptions
        const today = new Date().toISOString().split('T')[0];
        const todayRedemptions = allRedemptions.filter(r => r.date === today);
        setRedemptions(todayRedemptions);
      }
    } catch (error) {
      console.error('Error loading redemptions:', error);
    }
  };

  const loadGlobalCount = async () => {
    try {
      const data = await AsyncStorage.getItem(`${GLOBAL_VOUCHER_COUNT_KEY}_${user?.id}`);
      if (data) {
        setGlobalVoucherCount(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading global count:', error);
    }
  };

  const checkAndResetDaily = async () => {
    try {
      const lastResetDate = await AsyncStorage.getItem('@kraver_last_reset_date');
      const today = new Date().toISOString().split('T')[0];

      if (lastResetDate !== today) {
        // New day, reset redemptions
        await resetDailyRedemptions();
        await AsyncStorage.setItem('@kraver_last_reset_date', today);
      }
    } catch (error) {
      console.error('Error checking daily reset:', error);
    }
  };

  const isVoucherAvailable = (cafeId: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    // Check if user has already redeemed a voucher at this cafe today
    const hasRedeemedToday = redemptions.some(
      r => r.cafeId === cafeId && r.date === today
    );
    return !hasRedeemedToday;
  };

  const redeemVoucher = async (
    voucherId: string,
    cafeId: string,
    merchantCode: string
  ): Promise<boolean> => {
    try {
      // Validate merchant code (in production, this would be an API call)
      if (merchantCode.length !== 6) {
        throw new Error('Invalid merchant code');
      }

      // Check if voucher is available
      if (!isVoucherAvailable(cafeId)) {
        throw new Error('Voucher already used at this cafe today');
      }

      const today = new Date().toISOString().split('T')[0];
      const newRedemption: VoucherRedemption = {
        voucherId,
        cafeId,
        timestamp: Date.now(),
        date: today,
      };

      // Update redemptions
      const updatedRedemptions = [...redemptions, newRedemption];
      setRedemptions(updatedRedemptions);

      // Save to storage (keep all redemptions for history)
      const allRedemptionsData = await AsyncStorage.getItem(`${VOUCHER_REDEMPTIONS_KEY}_${user?.id}`);
      const allRedemptions: VoucherRedemption[] = allRedemptionsData 
        ? JSON.parse(allRedemptionsData) 
        : [];
      allRedemptions.push(newRedemption);
      await AsyncStorage.setItem(
        `${VOUCHER_REDEMPTIONS_KEY}_${user?.id}`,
        JSON.stringify(allRedemptions)
      );

      // Update global counter
      const newCount = globalVoucherCount + 1;
      setGlobalVoucherCount(newCount);
      await AsyncStorage.setItem(
        `${GLOBAL_VOUCHER_COUNT_KEY}_${user?.id}`,
        JSON.stringify(newCount)
      );

      return true;
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      throw error;
    }
  };

  const resetDailyRedemptions = async () => {
    try {
      setRedemptions([]);
      // Note: We don't delete the storage, just filter for today's redemptions
      // This preserves history while resetting daily availability
    } catch (error) {
      console.error('Error resetting daily redemptions:', error);
    }
  };

  const value: VoucherContextType = {
    redemptions,
    isVoucherAvailable,
    redeemVoucher,
    globalVoucherCount,
    resetDailyRedemptions,
  };

  return <VoucherContext.Provider value={value}>{children}</VoucherContext.Provider>;
}

export function useVoucher() {
  const context = useContext(VoucherContext);
  if (context === undefined) {
    throw new Error('useVoucher must be used within a VoucherProvider');
  }
  return context;
}
