import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function TiersScreen() {
  const router = useRouter();

  const tiers = [
    { name: 'Basic', price: 'Free', features: ['5 vouchers/month', 'Basic cafes'] },
    { name: 'Premium', price: '$9.99/mo', features: ['20 vouchers/month', 'All cafes', 'Priority support'] },
    { name: 'VIP', price: '$19.99/mo', features: ['Unlimited vouchers', 'All cafes', 'Exclusive deals', 'Priority support'] },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>Choose Your Plan</ThemedText>
        <ThemedText style={styles.subtitle}>
          Select a tier that works best for you
        </ThemedText>

        {tiers.map((tier, index) => (
          <View key={index} style={styles.tierCard}>
            <ThemedText type="subtitle">{tier.name}</ThemedText>
            <ThemedText style={styles.price}>{tier.price}</ThemedText>
            {tier.features.map((feature, fIndex) => (
              <ThemedText key={fIndex} style={styles.feature}>• {feature}</ThemedText>
            ))}
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.selectText}>Select {tier.name}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  tierCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  feature: {
    fontSize: 14,
    marginVertical: 4,
    opacity: 0.8,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  selectText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#007AFF',
  },
});
