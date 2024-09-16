import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { MOCKPFI } from '@/constants/mockPfi';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import FormField from './FormField';
import CustomButton from './CustomButton';

type CardItem = {
  item: Offering,
  onPress: () => void
}

const OfferingCard: React.FC<CardItem> = ({ item, onPress }) => {
  const pfiName = (item: Offering): string => {
    let pfiName = '';
    for (let i = 0; i < MOCKPFI.length; i++) {
      if (MOCKPFI[i].did === item.metadata.from) {
        pfiName = MOCKPFI[i].name
      }
    }
    return pfiName;
  }
  
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
      >
        <View className="p-4 m-4 bg-white rounded-lg shadow-md">
          <Text className='font-semibold text-black text-lg'>
            {pfiName(item)}
          </Text>
          <Text className="font-semibold mt-2">{item.data.description}</Text>
          <Text className="mt-1">Exchange Rate: {item.data.payoutUnitsPerPayinUnit}</Text>
          <Text className="mt-1">
            Payin: {item.data.payin.currencyCode} | Payout: {item.data.payout.currencyCode}
          </Text>
        </View>
      </TouchableOpacity>


    </>
)
}

export default OfferingCard