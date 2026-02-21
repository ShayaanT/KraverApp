import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Preferences</ThemedText>
          
          <View style={styles.settingItem}>
            <ThemedText>Push Notifications</ThemedText>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>

          <View style={styles.settingItem}>
            <ThemedText>Location Services</ThemedText>
            <Switch value={locationServices} onValueChange={setLocationServices} />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Account</ThemedText>
          
          <TouchableOpacity style={styles.settingButton}>
            <ThemedText>Edit Profile</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <ThemedText>Change Password</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <ThemedText>Payment Methods</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Support</ThemedText>
          
          <TouchableOpacity style={styles.settingButton}>
            <ThemedText>Contact Kraver</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <ThemedText>FAQ</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <ThemedText>Terms of Service</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <ThemedText>Privacy Policy</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.version}>
          <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  settingButton: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  version: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    opacity: 0.4,
    fontSize: 12,
  },
});
