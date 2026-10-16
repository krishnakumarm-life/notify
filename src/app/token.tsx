
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import {
    Button,
    Platform,
    ScrollView,
    Text,
} from 'react-native';

export default function TokenScreen() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function getToken() {
    setLoading(true);
    setError('');
    setToken('');

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const permission =
        await Notifications.requestPermissionsAsync();

      if (!permission.granted) {
        throw new Error('Notification permission denied.');
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        throw new Error(
          'EAS project ID missing. Run npx eas-cli@latest init.'
        );
      }

      const result =
        await Notifications.getExpoPushTokenAsync({
          projectId,
        });

      setToken(result.data);
      console.log('Expo Push Token:', result.data);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : String(e);

      setError(message);
      console.error('Push token error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Expo Push Token
      </Text>

      <Button
        title={loading ? 'Getting token...' : 'Get Expo Push Token'}
        onPress={getToken}
        disabled={loading}
      />

      {!!token && (
        <Text selectable style={{ marginTop: 20 }}>
          {token}
        </Text>
      )}

      {!!error && (
        <Text selectable style={{ marginTop: 20, color: 'red' }}>
          Error: {error}
        </Text>
      )}
    </ScrollView>
  );
}
