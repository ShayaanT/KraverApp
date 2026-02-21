import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

interface UserStats {
  vouchersUsed: number;
  totalSaved: number;
  vouchersRemaining: number;
  monthlyVouchersUsed: number;
  favoriteCafes: Array<{ id: string; name: string; visits: number }>;
}

interface UserPreferences {
  notifications: boolean;
  locationServices: boolean;
}

interface Activity {
  id: string;
  cafeId: string;
  cafeName: string;
  voucherName: string;
  amount: number;
  timestamp: number;
}

interface UserContextType {
  stats: UserStats;
  preferences: UserPreferences;
  activities: Activity[];
  isLoading: boolean;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => Promise<void>;
  incrementVoucherUsage: () => void;
  decrementVoucherRemaining: () => void;
  refreshStats: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STATS_KEY = '@kraver_user_stats';
const USER_PREFERENCES_KEY = '@kraver_user_preferences';
const USER_ACTIVITIES_KEY = '@kraver_user_activities';

const defaultStats: UserStats = {
  vouchersUsed: 0,
  totalSaved: 0,
  vouchersRemaining: 20, // Default for premium tier
  monthlyVouchersUsed: 0,
  favoriteCafes: [],
};

const defaultPreferences: UserPreferences = {
  notifications: true,
  locationServices: true,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Reset to defaults when not authenticated
      setStats(defaultStats);
      setPreferences(defaultPreferences);
      setActivities([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const loadUserData = async () => {
    try {
      const [statsData, preferencesData, activitiesData] = await Promise.all([
        AsyncStorage.getItem(`${USER_STATS_KEY}_${user?.id}`),
        AsyncStorage.getItem(`${USER_PREFERENCES_KEY}_${user?.id}`),
        AsyncStorage.getItem(`${USER_ACTIVITIES_KEY}_${user?.id}`),
      ]);

      if (statsData) {
        setStats(JSON.parse(statsData));
      } else {
        // Set vouchers based on tier
        const tierVouchers = {
          basic: 5,
          premium: 20,
          vip: 999, // Unlimited represented as large number
        };
        const initialStats = {
          ...defaultStats,
          vouchersRemaining: tierVouchers[user?.tier || 'basic'],
        };
        setStats(initialStats);
        await AsyncStorage.setItem(`${USER_STATS_KEY}_${user?.id}`, JSON.stringify(initialStats));
      }

      if (preferencesData) {
        setPreferences(JSON.parse(preferencesData));
      }

      if (activitiesData) {
        setActivities(JSON.parse(activitiesData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);
      await AsyncStorage.setItem(`${USER_PREFERENCES_KEY}_${user?.id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const addActivity = async (activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    try {
      const newActivity: Activity = {
        ...activityData,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };

      const updatedActivities = [newActivity, ...activities].slice(0, 50); // Keep last 50
      setActivities(updatedActivities);
      await AsyncStorage.setItem(`${USER_ACTIVITIES_KEY}_${user?.id}`, JSON.stringify(updatedActivities));

      // Update stats
      const updatedStats = {
        ...stats,
        vouchersUsed: stats.vouchersUsed + 1,
        totalSaved: stats.totalSaved + activityData.amount,
        monthlyVouchersUsed: stats.monthlyVouchersUsed + 1,
        vouchersRemaining: Math.max(0, stats.vouchersRemaining - 1),
      };

      // Update favorite cafes
      const cafeIndex = updatedStats.favoriteCafes.findIndex(c => c.id === activityData.cafeId);
      if (cafeIndex >= 0) {
        updatedStats.favoriteCafes[cafeIndex].visits += 1;
      } else {
        updatedStats.favoriteCafes.push({
          id: activityData.cafeId,
          name: activityData.cafeName,
          visits: 1,
        });
      }

      // Sort by visits
      updatedStats.favoriteCafes.sort((a, b) => b.visits - a.visits);

      setStats(updatedStats);
      await AsyncStorage.setItem(`${USER_STATS_KEY}_${user?.id}`, JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  };

  const incrementVoucherUsage = () => {
    setStats(prev => ({
      ...prev,
      vouchersUsed: prev.vouchersUsed + 1,
      monthlyVouchersUsed: prev.monthlyVouchersUsed + 1,
    }));
  };

  const decrementVoucherRemaining = () => {
    setStats(prev => ({
      ...prev,
      vouchersRemaining: Math.max(0, prev.vouchersRemaining - 1),
    }));
  };

  const refreshStats = async () => {
    await loadUserData();
  };

  const value: UserContextType = {
    stats,
    preferences,
    activities,
    isLoading,
    updatePreferences,
    addActivity,
    incrementVoucherUsage,
    decrementVoucherRemaining,
    refreshStats,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
