import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function AnalyticsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <ThemedText type="title" style={styles.summaryTitle}>This Month</ThemedText>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryValue}>$24</ThemedText>
              <ThemedText style={styles.summaryLabel}>Saved</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryValue}>6</ThemedText>
              <ThemedText style={styles.summaryLabel}>Vouchers</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Activity</ThemedText>
          
          {[
            { cafe: 'Blue Bottle Coffee', amount: '$4', date: '2 days ago' },
            { cafe: 'Stumptown', amount: '$5', date: '5 days ago' },
            { cafe: 'Intelligentsia', amount: '$4', date: '1 week ago' },
          ].map((item, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <ThemedText style={styles.cafeName}>{item.cafe}</ThemedText>
                <ThemedText style={styles.activityDate}>{item.date}</ThemedText>
              </View>
              <ThemedText style={styles.amount}>{item.amount}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Favorite Cafes</ThemedText>
          
          {[
            { name: 'Blue Bottle Coffee', visits: 8 },
            { name: 'Stumptown', visits: 5 },
            { name: 'La Colombe', visits: 3 },
          ].map((item, index) => (
            <View key={index} style={styles.favoriteItem}>
              <ThemedText style={styles.cafeName}>{item.name}</ThemedText>
              <ThemedText style={styles.visits}>{item.visits} visits</ThemedText>
            </View>
          ))}
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
  summaryCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    marginBottom: 24,
  },
  summaryTitle: {
    color: '#fff',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryLabel: {
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activityInfo: {
    flex: 1,
  },
  cafeName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34c759',
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  visits: {
    opacity: 0.6,
  },
});
