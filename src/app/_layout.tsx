
import * as Notifications from 'expo-notifications';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Alert, Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const zoos = [
  { id: 123, name: 'Safari Zoo' },
  { id: 456, name: 'Wildlife Park' },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function createChannels() {
      if (Platform.OS !== 'android') return;

      for (const zoo of zoos) {
        await Notifications.setNotificationChannelAsync(
          `zoo_${zoo.id}`,
          {
            name: zoo.name,
            description: `Notifications for ${zoo.name}`,
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
            enableVibrate: true,
          }
        );
      }

      console.log('Zoo notification channels created');
    }

    createChannels().catch(console.error);

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data =
            response.notification.request.content.data;

          const zooId = data.zoo_id;
          const zooName = data.zoo_name;

          Alert.alert(
            'Notification Details',
            `Title: ${response.notification.request.content.title ?? ''}\n\n` +
              `Body: ${response.notification.request.content.body ?? ''}\n\n` +
              `Zoo Name: ${zooName ?? 'Not provided'}\n` +
              `Zoo ID: ${zooId ?? 'Not provided'}\n` +
              `Channel ID: ${
                response.notification.request.trigger &&
                'channelId' in response.notification.request.trigger
                  ? response.notification.request.trigger.channelId ?? 'Not available'
                  : 'Not available'
              }`
          );
        }
      );

    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
