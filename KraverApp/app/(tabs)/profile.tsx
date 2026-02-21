import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth, useUser } from '@/context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { stats } = useUser();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.name}>{user?.name || 'User'}</ThemedText>
          <ThemedText style={styles.email}>{user?.email || ''}</ThemedText>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <ThemedText type="subtitle">{stats.vouchersUsed}</ThemedText>
            <ThemedText style={styles.statLabel}>Vouchers Used</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="subtitle">${stats.totalSaved}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Saved</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="subtitle">{stats.vouchersRemaining}</ThemedText>
            <ThemedText style={styles.statLabel}>Remaining</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Membership</ThemedText>
          <View style={styles.membershipCard}>
            <ThemedText style={styles.tierName}>{user?.tier.charAt(0).toUpperCase()}{user?.tier.slice(1)} Tier</ThemedText>
            <ThemedText style={styles.tierDetails}>
              {user?.tier === 'vip' ? 'Unlimited vouchers' : user?.tier === 'premium' ? '20 vouchers/month' : '5 vouchers/month'}
            </ThemedText>
            <TouchableOpacity style={styles.upgradeButton}>
              <ThemedText style={styles.upgradeButtonText}>Upgrade to VIP</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            await logout();
            router.replace('/(auth)/login');
          }}
        >
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    marginBottom: 4,
  },
  email: {
    opacity: 0.6,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  membershipCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  tierName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  tierDetails: {
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  logoutButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  logoutText: {
    color: '#ff3b30',
    fontWeight: '600',
  },
});
