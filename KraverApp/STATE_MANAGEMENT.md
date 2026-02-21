# Global State Management - Kraver App

## Overview

The Kraver app uses React Context API for global state management. The state is organized into three main contexts:

1. **AuthContext** - Authentication and user sessions
2. **UserContext** - User profile, stats, and preferences
3. **VoucherContext** - Voucher redemptions and availability

All contexts are wrapped in an `AppProvider` component in the root layout.

## Contexts

### AuthContext

Manages user authentication state and session persistence.

**State:**
- `user` - Current logged-in user
- `isLoading` - Loading state during initialization
- `isAuthenticated` - Boolean indicating if user is logged in
- `hasCompletedOnboarding` - Onboarding completion status

**Methods:**
- `login(email, password)` - Authenticate user
- `register(name, email, password, tier)` - Register new user
- `logout()` - Sign out user
- `completeOnboarding()` - Mark onboarding as complete
- `updateUserTier(tier)` - Update user's subscription tier

**Usage:**
```typescript
import { useAuth } from '@/context';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication state
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <div>Hello {user?.name}</div>;
}
```

### UserContext

Manages user-specific data including statistics, preferences, and activity history.

**State:**
- `stats` - User statistics (vouchers used, total saved, etc.)
- `preferences` - User preferences (notifications, location services)
- `activities` - Recent voucher redemption history
- `isLoading` - Loading state

**Methods:**
- `updatePreferences(preferences)` - Update user preferences
- `addActivity(activity)` - Add new voucher redemption to history
- `incrementVoucherUsage()` - Increment voucher usage counter
- `decrementVoucherRemaining()` - Decrement remaining vouchers
- `refreshStats()` - Reload stats from storage

**Usage:**
```typescript
import { useUser } from '@/context';

function ProfileScreen() {
  const { stats, preferences, updatePreferences } = useUser();
  
  return (
    <View>
      <Text>Vouchers Used: {stats.vouchersUsed}</Text>
      <Text>Total Saved: ${stats.totalSaved}</Text>
      <Text>Remaining: {stats.vouchersRemaining}</Text>
    </View>
  );
}
```

### VoucherContext

Manages voucher redemptions and enforces the one-voucher-per-cafe-per-day rule.

**State:**
- `redemptions` - Today's voucher redemptions
- `globalVoucherCount` - Total voucher redemptions count

**Methods:**
- `isVoucherAvailable(cafeId)` - Check if user can redeem at this cafe today
- `redeemVoucher(voucherId, cafeId, merchantCode)` - Redeem a voucher
- `resetDailyRedemptions()` - Reset redemptions (called automatically at midnight)

**Usage:**
```typescript
import { useVoucher } from '@/context';

function CafeDetailScreen() {
  const { isVoucherAvailable, redeemVoucher } = useVoucher();
  const cafeId = '123';
  
  const canRedeem = isVoucherAvailable(cafeId);
  
  const handleRedeem = async (voucherId: string, code: string) => {
    try {
      await redeemVoucher(voucherId, cafeId, code);
      alert('Voucher redeemed!');
    } catch (error) {
      alert('Failed to redeem');
    }
  };
  
  return <Button disabled={!canRedeem} onPress={handleRedeem} />;
}
```

## Data Persistence

All contexts use `@react-native-async-storage/async-storage` for data persistence:

- **Auth state** persists across app restarts
- **User stats and preferences** are saved per user ID
- **Voucher redemptions** are stored with date tracking for the daily reset

## State Flow

```
App Launch
    ↓
AuthContext loads → Check if user is authenticated
    ↓
If authenticated → Load UserContext & VoucherContext data
    ↓
User interacts with app
    ↓
State updates → Automatically saved to AsyncStorage
```

## Integration

The `AppProvider` wraps all contexts in the correct order (dependencies matter):

```typescript
// app/_layout.tsx
import { AppProvider } from '@/context';

export default function RootLayout() {
  return (
    <AppProvider>
      {/* Your app components */}
    </AppProvider>
  );
}
```

## Key Features

### Automatic Daily Reset
The voucher redemptions automatically reset at midnight, allowing users to redeem new vouchers each day.

### Tier-Based Voucher Limits
User voucher counts are set based on their subscription tier:
- **Basic**: 5 vouchers/month
- **Premium**: 20 vouchers/month
- **VIP**: Unlimited vouchers

### Activity Tracking
Every voucher redemption is tracked in the activity history, including:
- Cafe name and ID
- Voucher details
- Amount saved
- Timestamp

### Favorite Cafes
The app automatically tracks which cafes users visit most frequently and ranks them.

## Future Enhancements

- [ ] Add API integration for backend sync
- [ ] Implement offline queue for failed requests
- [ ] Add optimistic updates for better UX
- [ ] Implement proper error boundaries
- [ ] Add analytics event tracking
