import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

// Mock data for cafes
const CAFES = [
  { id: '1', name: 'Blue Bottle Coffee', location: 'Downtown', vouchers: 3 },
  { id: '2', name: 'Stumptown', location: 'East Village', vouchers: 5 },
  { id: '3', name: 'Intelligentsia', location: 'West Side', vouchers: 2 },
  { id: '4', name: 'La Colombe', location: 'Midtown', vouchers: 4 },
];

export default function CafesScreen() {
  const router = useRouter();

  const renderCafeItem = ({ item }: { item: typeof CAFES[0] }) => (
    <TouchableOpacity 
      style={styles.cafeCard}
      onPress={() => router.push(`/cafe/${item.id}`)}
    >
      <View style={styles.cafeInfo}>
        <ThemedText type="subtitle">{item.name}</ThemedText>
        <ThemedText style={styles.location}>{item.location}</ThemedText>
      </View>
      <View style={styles.voucherBadge}>
        <ThemedText style={styles.voucherCount}>{item.vouchers}</ThemedText>
        <ThemedText style={styles.voucherLabel}>vouchers</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={CAFES}
        renderItem={renderCafeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  cafeCard: {
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
  cafeInfo: {
    flex: 1,
  },
  location: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  voucherBadge: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  voucherCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  voucherLabel: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.9,
  },
});

