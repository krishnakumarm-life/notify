
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';

const zoos = [
  { id: 123, name: 'Safari Zoo' },
  { id: 456, name: 'Wildlife Park' },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function MultiZooTest() {
  const [message, setMessage] = useState('Ready to test');
  const [lastZoo, setLastZoo] = useState('');

  useEffect(() => {
    async function setup() {
      if (Platform.OS !== 'android') return;

      for (const zoo of zoos) {
        await Notifications.setNotificationChannelAsync(
          `zoo_${zoo.id}`,
          {
            name: zoo.name,
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
          }
        );
      }
    }

    setup().catch((error) => {
      setMessage(String(error));
    });

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data =
            response.notification.request.content.data;

          setLastZoo(
            `Zoo: ${data.zoo_name}\nZoo ID: ${data.zoo_id}`
          );
          setMessage('Notification tapped successfully');
        }
      );

    return () => subscription.remove();
  }, []);

  async function sendTestNotification(
    zoo: (typeof zoos)[number]
  ) {
    try {
      const permission =
        await Notifications.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Allow notifications in your phone settings.'
        );
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(
          `zoo_${zoo.id}`,
          {
            name: zoo.name,
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
          }
        );
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `New Task - ${zoo.name}`,
          body: `Test notification for ${zoo.name}`,
          data: {
            zoo_id: zoo.id,
            zoo_name: zoo.name,
            screenName: 'TaskDetails',
            params: { task_id: 1001 },
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
          ...(Platform.OS === 'android'
            ? { channelId: `zoo_${zoo.id}` }
            : {}),
        },
      });

      setMessage(`Scheduled notification for ${zoo.name}`);
    } catch (error) {
      setMessage(String(error));
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Multi-Zoo Notification Test
      </Text>

      <Text>{message}</Text>

      {zoos.map((zoo) => (
        <View
          key={zoo.id}
          style={{
            padding: 16,
            borderWidth: 1,
            borderRadius: 8,
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>
            {zoo.name}
          </Text>

          <Text>Zoo ID: {zoo.id}</Text>
          <Text>Channel: zoo_{zoo.id}</Text>

          <Button
            title={`Send ${zoo.name} Notification`}
            onPress={() => sendTestNotification(zoo)}
          />
        </View>
      ))}

      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
        Notification tap result
      </Text>

      <Text selectable>
        {lastZoo || 'Tap a test notification to see its zoo details.'}
      </Text>
    </ScrollView>
  );
}
