import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function VoucherRedemptionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleRedeem = () => {
    // TODO: Implement actual redemption logic with backend
    if (code.length === 6) {
      Alert.alert(
        'Success!',
        'Your voucher has been redeemed.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit code from the merchant.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Redeem Voucher</ThemedText>
        
        <View style={styles.instructionsCard}>
          <ThemedText style={styles.instructionsTitle}>How to redeem:</ThemedText>
          <ThemedText style={styles.instruction}>1. Show this screen to the merchant</ThemedText>
          <ThemedText style={styles.instruction}>2. Merchant will provide a 6-digit code</ThemedText>
          <ThemedText style={styles.instruction}>3. Enter the code below to confirm redemption</ThemedText>
        </View>

        <View style={styles.codeSection}>
          <ThemedText style={styles.label}>Enter Merchant Code</ThemedText>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={[styles.redeemButton, code.length !== 6 && styles.redeemButtonDisabled]}
          onPress={handleRedeem}
          disabled={code.length !== 6}
        >
          <ThemedText style={styles.redeemButtonText}>Confirm Redemption</ThemedText>
        </TouchableOpacity>

        <View style={styles.warningCard}>
          <ThemedText style={styles.warningText}>
            ⚠️ Once redeemed, this voucher cannot be used again today at this cafe
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  instructionsCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f0f8ff',
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    lineHeight: 24,
    opacity: 0.8,
  },
  codeSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 8,
    backgroundColor: '#fff',
  },
  redeemButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  redeemButtonDisabled: {
    backgroundColor: '#ccc',
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  warningCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff3cd',
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
});
