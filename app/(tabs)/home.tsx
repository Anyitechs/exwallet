import { Image, StyleSheet, Platform, ScrollView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import CustomCard from '@/components/CustomCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { currencyIcons } from '@/constants/currencyIcons';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useRef, useMemo, useCallback } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function HomeScreen() {
  const { MOCKPFI } = useGlobalContext();

  const [isSheetOpen, setSheetOpen] = useState(false);

  const bottomSheetRefs = useRef(Array(MOCKPFI.length).fill(null));

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handlePresentModalPress = useCallback((index: number) => {
    if (bottomSheetRefs.current[index]) {
      bottomSheetRefs.current[index].expand();
    }
  }, []);

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={uuidv4()}
          name={i <= rating ? 'star' : 'star-o'}
          size={16}
          color="#f5a623"
          className="mr-1"
        />
      );
    }
    return stars;
  };


  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
      <View className='flex flex-col h-full'>
        <View className='flex flex-row justify-center'>
          <View className='w-[350px] h-[150px] bg-slate-50 shadow-2xl bg-white rounded-lg flex flex-col justify-center'>
            <Text className='text-center font-pbold text-3xl'>
              TBD$ 20,000
            </Text>
          </View>
        </View>
        <CustomButton
          title='Send Money'
          containerStyles='mx-5 mt-10'
          handlePress={() => router.push('/exchange')}
        />

        <View className='mt-10 ml-6 mr-6'>
          <Text className='text-2xl font-psemibold underline'>
            Top PFI's
          </Text>

          <View className='mt-4'>

          {MOCKPFI.map((item, index) => (

          <View key={uuidv4()} className="mb-4">
          <View className="bg-white rounded-lg p-4 shadow-md">
            <Text className="text-lg font-bold">{item.name}</Text>
            <View className="flex-row items-center" key={uuidv4()}>
              <View className='flex flex-row'>
                {renderRating(item.rating)}
              </View>
            </View>
            <TouchableOpacity onPress={() => handlePresentModalPress(index)}>
              <Text className="text-blue-500 mt-2">View Offerings</Text>
            </TouchableOpacity>
          </View>

    </View>
      ))}
          </View>

          {
            MOCKPFI && MOCKPFI.map((item, index) => (
              <BottomSheet
              ref={ref => (bottomSheetRefs.current[index] = ref)}
              index={-1}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
            >
              <View className="p-4">
                <View>
                  <Text className='text-center font-psemibold p-4 text-lg'>{item.name} Offerings</Text>
                </View>
            <View className="flex-col mx-8">
            {item.offerings.map((offer, index) => (
              <View key={uuidv4()} className="flex-row justify-center mr-3 mb-2 bg-gray-100 px-2 py-1 rounded-full">
                <MaterialCommunityIcons 
              name={currencyIcons[offer.from] || "currency-usd"} 
              size={20} 
            />
                <Text className='text-sm text-gray-700 font-pmedium'>
                  {offer.from} → <MaterialCommunityIcons 
              name={currencyIcons[offer.to] || "currency-usd"} 
              size={20} 
            /> {offer.to}
                </Text>
              </View>
            ))}
          </View>
                <View className='mt-4'>
                <CustomButton 
                  title='Request for Quote'
                  handlePress={() => {
                    bottomSheetRefs.current[index].close()
                    router.push('/exchange')
                  }
                    }
                />
                </View>
              </View>
            </BottomSheet>
            ))
          }
        </View>
      </View>
      </ScrollView>

      <StatusBar style='dark'/>
    </SafeAreaView>
  )
}

