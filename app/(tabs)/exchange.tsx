import { View, Text, ActivityIndicator, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { MOCKPFI } from '@/constants/mockPfi';
import RNPickerSelect from 'react-native-picker-select';
import OfferingCard from '@/components/OfferingCard';
import CustomButton from '@/components/CustomButton';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import FormField from '@/components/FormField';
import { router } from 'expo-router';
import { SELECTED_OFFER } from '@/context/reducer';

const Exchange = () => {
  const { offerings, loading, error } = useGlobalContext();
  const [fromCurrency, setFromCurrency] = useState<string | null>(null);
  const [toCurrency, setToCurrency] = useState<string | null>(null);
  const [filteredOfferings, setFilteredOfferings] = useState<Offering[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [userDetails, setUserDetails] = useState({
      customerName: '',
      countryCode: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendDetails, setSendDetails] = useState({
    amount: '',
    convertedAmount: ''
  });
  
  const snapPoints = useMemo(() => ['50%', '100%'], []);

  const { setUserOffer } = useGlobalContext();

  const [selectedOffer, setSelectedOffer] = useState<Offering | null>(null);

  const payinCurrencyOptions = Array.from(
    new Set([
      ...offerings.map((offering) => offering.data.payin.currencyCode),
      // ...offerings.map((offering) => offering.data.payout.currencyCode),
    ])
  ).map((currency) => ({ label: currency, value: currency }));

  const payoutCurrencyOptions = Array.from(
    new Set([
      // ...offerings.map((offering) => offering.data.payin.currencyCode),
      ...offerings.filter((offering) => offering.data.payin.currencyCode === fromCurrency),
    ])
  ).map((currency) => ({ label: currency.data.payout.currencyCode, value: currency.data.payout.currencyCode }));

  const payoutOptions = () => {
    let payoutCurrencies = new Set()

    for (let i = 0; i < offerings.length; i++) {
      const currentIndex = offerings[i]
      const payout = currentIndex.data.payout.currencyCode
      if (currentIndex.data.payin.currencyCode === fromCurrency) {
        payoutCurrencies.add(payout);
      }
    }

    return payinCurrencyOptions.map((currency) => ({ label: currency, value: currency }))

  }

  const handleSearch = () => {
    if (!fromCurrency || !toCurrency) {
      Alert.alert('Please select both From and To currencies.');
      return;
    }

    setIsSearching(true);

    const matchedOfferings = offerings.filter(
      (offering) =>
        offering.data.payin.currencyCode === fromCurrency &&
        offering.data.payout.currencyCode === toCurrency
    );

    setFilteredOfferings(matchedOfferings);
    setSendDetails({
      amount: '',
      convertedAmount: ''
    });
    setIsSearching(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#334b57" />
        <Text className="text-lg mt-2 font-psemibold">Loading Offerings...</Text>
      </View>
    );
  }

  const handleOpenOfferDetails = (offer) => {
    setUserOffer(offer)
    router.push("/exchangeDetails")
  };

  const renderOfferingCard = ({ item }) => (
    <View>
      <OfferingCard
        item={item}
        onPress={() => handleOpenOfferDetails(item)}
    />
    </View>
  )


  const convertAmount = (e) => {
    const parseAmount = parseInt(e);
    setSendDetails({
      amount: e,
      convertedAmount: (parseAmount * parseFloat(selectedOffer?.data.payoutUnitsPerPayinUnit as string)).toString()
    })
  }



  return (
    <SafeAreaView className='bg-primary h-full'>
      {/* <ScrollView> */}
      {loading && <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#334b57" />
        <Text className="text-lg mt-2">Loading offerings...</Text>
      </View>}

      {error && <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>}

      <View className="flex-1 p-4">
        <Text className="text-lg font-pbold mb-4">Exchange Currency</Text>

        <RNPickerSelect
          onValueChange={(value) => setFromCurrency(value)}
          items={payinCurrencyOptions}
          placeholder={{ label: 'Select From Currency', value: null }}
          style={{
            inputIOS: { color: 'black', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5 },
            inputAndroid: { color: 'black' },
          }}
          Icon={() => <TabBarIcon className='py-1.5 px-2' name='caret-down-circle-outline' />}
        />

        <RNPickerSelect
          onValueChange={(value) => setToCurrency(value)}
          items={payoutCurrencyOptions}
          placeholder={{ label: 'Select To Currency', value: null }}
          style={{
            inputIOS: { color: 'black', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginTop: 10 },
            inputAndroid: { color: 'black' },
          }}
          Icon={() => <TabBarIcon className='py-4 px-2' name='caret-down-circle-outline' />}

        />

        <CustomButton
          title='Search for Offerings'
          handlePress={handleSearch}
          containerStyles='mt-5 mb-4'
          isLoading={isSearching}
        />

        {isSearching ? (
          <View className="flex-1 justify-center items-center mt-4">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="text-lg mt-2">Searching offerings...</Text>
          </View>
        ) : (


          <BottomSheetModalProvider>
            {/* <View className='flex-col'> */}

            <FlatList
                data={filteredOfferings}
                keyExtractor={(item) => item.metadata.id}
                renderItem={renderOfferingCard}
                ListEmptyComponent={(fromCurrency && toCurrency) && !filteredOfferings ?
                  <View className="flex-1 justify-center items-center mt-4">
                    <Text className="text-gray-500">No offerings found for the selected currencies.</Text>
                  </View> : <View></View>
                }
            />
{/* 
            {filteredOfferings.map((item) => renderOfferingCard({ item }))}

            { fromCurrency && toCurrency ?
                  <View className="flex-1 justify-center items-center mt-4">
                    <Text className="text-gray-500">No offerings found for the selected currencies.</Text>
                  </View> : <View></View> } */}
            
            <BottomSheetModal
              ref={bottomSheetModalRef}
              snapPoints={snapPoints}
              backgroundStyle={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <BottomSheetView className='flex align-center'>
                <View className="p-4">
                  <Text className="text-lg font-bold text-center">{selectedOffer?.data.description}</Text>
                  <FormField
                    title={`You send (${selectedOffer?.data.payin.currencyCode})`}
                    placeholder='Enter amount'
                    value={sendDetails.amount}
                    handleChangeText={(e) => {
                      
                      convertAmount(e)
                    }}
                    numberInput={true}
                  />

                  <FormField
                    title={`You receive (${selectedOffer?.data.payout.currencyCode})`}
                    readOnly={true}
                    value={sendDetails.convertedAmount}
                    // placeholder=''

                  />

                  <View className='p-4'>
                    <Text className='font-pmedium'>Current rate: {selectedOffer?.data.payoutUnitsPerPayinUnit} {selectedOffer?.data.payout.currencyCode} → 1 {selectedOffer?.data.payin.currencyCode}
                    </Text>
                  </View>
                  
                  {selectedOffer?.data.payout.methods.map((method, index) => (
                    <>
                      <Text key={index} className="font-psemibold text-base px-4">
                      Payout Method - {method.kind.split('_').join(' ')} 
                      </Text>
                      <Text className='font-pmedium px-4 py-4'>
                        Estimated Settlement time ~ {method.estimatedSettlementTime / 3600} hours
                      </Text>
                      <View>
                          {
                            method.requiredPaymentDetails.required.map((details, index) => (
                              <FormField
                                key={index}
                                title={method.requiredPaymentDetails.properties[details].title}
                                placeholder={method.requiredPaymentDetails.properties[details].description}
                              />
                            ))
                          }
                      </View>
                    </>
                  ))}
                  <View className='mb-4'>
                    <CustomButton
                      title='Proceed'
                    />
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          {/* </View> */}
          </BottomSheetModalProvider>
        )}
      </View>

        
       
      {/* </ScrollView> */}
    </SafeAreaView>
  )
}

export default Exchange