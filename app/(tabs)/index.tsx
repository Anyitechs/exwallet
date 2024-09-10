import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className='bg-primary h-full'>
      <View className='flex'>
        <Text className='justify-center items-center text-2xl'>Hello</Text>
      </View>

      <StatusBar style='dark'/>
    </SafeAreaView>
  )
}

