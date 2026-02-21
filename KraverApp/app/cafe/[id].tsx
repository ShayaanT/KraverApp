import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

// Mock cafe data
const CAFE_DATA: Record<string, any> = {
  '1': { 
    name: 'Blue Bottle Coffee', 
    location: 'Downtown',
    description: 'Artisanal coffee roasted to perfection',
    vouchers: [
      { id: 'v1', name: 'Espresso', available: true },
      { id: 'v2', name: 'Cappuccino', available: true },
      { id: 'v3', name: 'Latte', available: false },
    ]
  },
  '2': { 
    name: 'Stumptown', 
    location: 'East Village',
    description: 'Direct trade coffee at its finest',
    vouchers: [
      { id: 'v4', name: 'Cold Brew', available: true },
      { id: 'v5', name: 'Americano', available: true },
    ]
  },
};

export default function CafeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const cafe = CAFE_DATA[id as string] || CAFE_DATA['1'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">{cafe.name}</ThemedText>
          <ThemedText style={styles.location}>{cafe.location}</ThemedText>
          <ThemedText style={styles.description}>{cafe.description}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Available Vouchers
          </ThemedText>
          
          {cafe.vouchers.map((voucher: any) => (
            <TouchableOpacity
              key={voucher.id}
              style={[
                styles.voucherCard,
                !voucher.available && styles.voucherCardDisabled
              ]}
              onPress={() => voucher.available && router.push(`/voucher/${voucher.id}`)}
              disabled={!voucher.available}
            >
              <View style={styles.voucherInfo}>
                <ThemedText style={styles.voucherName}>{voucher.name}</ThemedText>
                <ThemedText style={styles.voucherStatus}>
                  {voucher.available ? 'Available' : 'Used Today'}
                </ThemedText>
              </View>
              {voucher.available && (
                <View style={styles.redeemButton}>
                  <ThemedText style={styles.redeemText}>Redeem</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Fine Print
          </ThemedText>
          <ThemedText style={styles.finePrint}>
            • One voucher per cafe per day{'\n'}
            • Valid during off-peak hours (2pm - 5pm){'\n'}
            • Cannot be combined with other offers{'\n'}
            • Subject to availability
          </ThemedText>
        </View>
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
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  location: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 4,
  },
  description: {
    marginTop: 12,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  voucherCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  voucherCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  voucherInfo: {
    flex: 1,
  },
  voucherName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  voucherStatus: {
    fontSize: 12,
    opacity: 0.6,
  },
  redeemButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  redeemText: {
    color: '#fff',
    fontWeight: '600',
  },
  finePrint: {
    lineHeight: 20,
    opacity: 0.7,
  },
});
