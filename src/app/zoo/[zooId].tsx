
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ZooDetailsScreen() {
  const { zooId, zooName } = useLocalSearchParams<{
    zooId: string;
    zooName: string;
  }>();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {zooName}
      </Text>

      <Text style={{ marginTop: 12 }}>
        Zoo ID: {zooId}
      </Text>
    </View>
  );
}
