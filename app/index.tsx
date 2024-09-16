import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Image, StyleSheet, Platform, View, Text, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';

import { IMAGES } from '../constants/images';
import RoundedLogo from '@/components/RoundedLogo';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useGlobalContext } from '@/context/GlobalProvider';
import FormField from '@/components/FormField';
import { createDidAndVC } from '@/lib/tbDex';
import { saveItem } from '@/lib/localStorage';

const Welcome = () => {
    const { userId } = useGlobalContext();


    if (userId) return <Redirect href="/home" />


    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [userDetails, setUserDetails] = useState({
        customerName: '',
        countryCode: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const snapPoints = useMemo(() => ['25%', '80%', '90%'], []);

    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);

    const handleSubmit = async () => {
        if (!userDetails.customerName || !userDetails.countryCode) {
            return Alert.alert('Incomplete entry', 'Please fill in all the fields to proceed')
        }

        setIsSubmitting(true)
        
        try {
            const result = await createDidAndVC(userDetails.customerName, userDetails.countryCode);

            if (result.success) {
                await saveItem('userId', result.data.id);
                router.push('/home')
            } else {
                setUserDetails({
                    customerName: '',
                    countryCode: ''
                })
            }

        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }


  return (
    <SafeAreaView className='bg-primary h-full'>
        <ScrollView className='flex flex-col mt-[100px]'>
            <View className='flex'>
                <View className='flex flex-row justify-center'>
                    <RoundedLogo />
                </View>

                <View className='flex flex-row justify-center'>
                    <Text className='text-3xl
                text-bold mt-10 font-pblack'>
                    ExWallet
                    </Text>
                </View>

                <View className='mb-10'>
                    <Text className='text-center text-wrap text-base font-pmedium px-6'>
                        A secure way to exchange your assets on tbDex
                    </Text>
                </View>

                <View className='mt-10'>
                    <Text className='text-center px-6 text-base font-psemibold'>
                        Welcome to ExWallet! A secure way to exchange your assets on the tbDex protocol.
                    </Text>
                </View>


                <CustomButton
                    title='Create Wallet'
                    containerStyles='mx-4 mt-[250px]'
                    handlePress={() => {
                        if (userId) {
                            router.push('/home')
                        } else {
                            handlePresentModalPress()
                        }
                        // handlePresentModalPress();
                        
                    }
                    }
                />

            <BottomSheetModalProvider>
              <View className='p-24 flex justify-center'>
                
                <BottomSheetModal
                  ref={bottomSheetModalRef}
                  index={1}
                  snapPoints={snapPoints}
                  onChange={handleSheetChanges}
                  
                  backgroundStyle={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
                >
                  <BottomSheetView className='flex align-center'>
                    <Text className='text-center font-pmedium px-4 p-5'>
                        PFI's on the tbDex protocol requires a Verified Credential to complete transactions. Enter your name and country code below to create a VC.
                    </Text>
                    <FormField
                        title='Your Name'
                        placeholder='Enter your name'
                        value={userDetails.customerName}
                        handleChangeText={(e) => setUserDetails({ ...userDetails, customerName: e })}
                    />

                    <FormField
                        title='Location'
                        placeholder='Enter your country code. e.g NGN'
                        value={userDetails.countryCode}
                        handleChangeText={(e) => setUserDetails({ ...userDetails, countryCode: e })}
                    />

                    <View className='mx-4 mt-4'>
                        {
                            isSubmitting ? <ActivityIndicator size="large" color="#334b57" /> :
                            <CustomButton
                                title='Proceed'
                                handlePress={handleSubmit}
                                isLoading={isSubmitting}
                            />
                        }
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
              </View>
            </BottomSheetModalProvider>
            </View>
        </ScrollView>

        <StatusBar style='dark'/>
    </SafeAreaView>
  )
}

export default Welcome