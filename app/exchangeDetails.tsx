import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import RoundedLogo from '@/components/RoundedLogo'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createExchange, createExchangeOrder } from '@/lib/tbDex'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, FlatList, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ExchangeDetails = () => {
    const { selectedOffer, userId } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendDetails, setSendDetails] = useState({
        amount: '',
        convertedAmount: '',
    });

    const payin = () => {
        let payinMethods: any = {}
        selectedOffer?.data.payin.methods.map((details) => {
            if (details.requiredPaymentDetails.required) {
                details.requiredPaymentDetails.required.map((detail: string) => {
                    payinMethods[detail] = ""
                })
            } else {
                payinMethods = {}
            }
        })
        return payinMethods;
    }

    const [requiredFields, setRequiredFields] = useState<Record<string, string>>({});
    const [payinDetails, setPayinDetails] = useState<Record<string, string>>(payin());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [createExchangeDetails, setCreateExchangeDetails] = useState<Record<string, any>>({});


    const showModal = () => setIsModalVisible(true);
    const hideModal = () => { setIsModalVisible(false); router.push('/transactions'); };



    const convertAmount = (e) => {
        const parseAmount = parseInt(e);
        setSendDetails({
          amount: e,
          convertedAmount: (parseAmount * parseFloat(selectedOffer?.data.payoutUnitsPerPayinUnit! as string)).toString()
        })
    }

    const handleDynamicFieldChange= (fieldName: string, value: string) => {
        setRequiredFields(prevState => ({
            ...prevState,
            [fieldName]: value
        }))
    }

    const onSubmit = async () => {
        const { isValid, errors } = validateFields();

        if (!isValid) {
            Alert.alert("Incomplete fields", "Please fill in all the fields below")
        }
        else {
            setIsSubmitting(true)
            console.log(`Send details ${userId} ${sendDetails.amount}, ${JSON.stringify(requiredFields)}`)
            console.log(`payin details: ${JSON.stringify(payinDetails)}`);

            try {
                const result = await createExchange(userId as string, selectedOffer as Offering, sendDetails.amount, requiredFields, payinDetails);
                
                if (result.success) {
                    setCreateExchangeDetails(result.data);
                    showModal();
                } else {
                    console.log('an error occured: ', result);
                }
    
            } catch (error: any) {
                Alert.alert('Error', error.message)
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const completeOrder = async () => {
        try {
            setIsSubmitting(true)

            console.log('exhange details: ', createExchangeDetails)

            const result = await createExchangeOrder(userId as string, createExchangeDetails.metadata.exchangeId, createExchangeDetails.metadata.to);

            if (result.success) {
                console.log('result: ', result)
                hideModal()
            } else {
                console.log('an error occured: ', result)
            }
        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const validateFields = () => {
        let isValid = true;
        let errors: { [key: string]: string } = {};
        
        selectedOffer?.data.payout.methods.map((offer) => {
            offer.requiredPaymentDetails.required.forEach((details) => {
                const value = requiredFields[details];
                if (!value || value.trim() === '') {
                    isValid = false;
                    errors[details] = `${offer.requiredPaymentDetails.properties[details].title} is required`;
                }
            });
        })
    
        if (!sendDetails.amount || sendDetails.amount.trim() === '') {
            isValid = false;
            errors.amount = 'Amount is required';
        }
    
        if (!sendDetails.convertedAmount || sendDetails.convertedAmount.trim() === '') {
            isValid = false;
            errors.convertedAmount = 'Converted Amount is required';
        }
    
        return { isValid, errors };
    };

  return (
    <SafeAreaView className='bg-primary h-full flex flex-col'>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            className="flex-1"
        >
            <ScrollView>
                <View className='flex flex-col h-full'>
                    <View className='flex flex-row justify-center align-center'>
                        <RoundedLogo />
                    </View>
                    <Text className="text-lg font-bold text-center pt-4">{selectedOffer?.data.description}</Text>
                    <FormField
                        title={`You send (${selectedOffer?.data.payin.currencyCode})`}
                        placeholder={`Enter amount in (${selectedOffer?.data.payin.currencyCode})`}
                        value={sendDetails.amount}
                        handleChangeText={(e) => {
                        
                        convertAmount(e)
                        }}
                        numberInput={true}
                    />

                    <FormField
                        title={`You receive (${selectedOffer?.data.payout.currencyCode})`}
                        readOnly={true}
                        value={`${sendDetails.convertedAmount} ${selectedOffer?.data.payout.currencyCode}`}
                        // placeholder=''

                    />

                    <View className='p-4'>
                        <Text className='font-pmedium'>Current rate: {selectedOffer?.data.payoutUnitsPerPayinUnit} {selectedOffer?.data.payout.currencyCode} → 1 {selectedOffer?.data.payin.currencyCode}
                        </Text>
                    </View>
                    
                    {selectedOffer?.data.payout.methods.map((method, index) => (
                        <View key={index}>
                        <Text className="font-psemibold text-base px-4">
                        Payout Method - {method.kind.split('_').join(' ')} 
                        </Text>
                        <Text className='font-pmedium px-4 py-4'>
                            Estimated Settlement time ~ {method.estimatedSettlementTime / 3600} hours
                        </Text>
                        <View>
                            {
                                method.requiredPaymentDetails.required.map((details, index) => (
                                <FormField
                                    key={details}
                                    title={method.requiredPaymentDetails.properties[details].title}
                                    placeholder={method.requiredPaymentDetails.properties[details].description}
                                    value={requiredFields[details] || ''}
                                    handleChangeText={(e) => handleDynamicFieldChange(details, e)}
                            
                                />
                                ))
                            }
                        </View>
                        </View>
                    ))}
                    <View className='mx-4 my-4'>
                            {
                                isSubmitting ? <ActivityIndicator size="large" color="#334b57" /> :
                                <CustomButton
                                    title='Proceed'
                                    handlePress={onSubmit}
                                    isLoading={isSubmitting}
                                />
                            }
                        </View>
                    </View>
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={hideModal}
            >
                <View className="flex-1 justify-center items-center bg-gray-300 bg-opacity-50">

                    <View className="bg-white p-6 rounded-lg w-80">
                        <View className='flex flex-row justify-center'>
                            <Ionicons name="checkmark-circle" size={60} color="green" />
                        </View>
                        <Text className='font-pbold text-lg text-center'>
                        Quote created successfully!
                        </Text>
                        <Text className="text-base font-pmedium text-center mb-6">Do you want to complete this order now?</Text>

                        <View className="flex-row justify-between mx-2">
                            {
                                isSubmitting ? <View className='flex-row justify-center'>
                                    <ActivityIndicator size="large" color="#334b57" /> 
                                </View>:
                                <>
                                    <TouchableOpacity onPress={hideModal} className="bg-gray-300 py-4 px-4 rounded">
                                        <Text className="font-pmedium">Complete Later</Text>
                                    </TouchableOpacity>
                            
                                    <TouchableOpacity onPress={() => completeOrder()} className="bg-secondary py-4 px-4 rounded">
                                        <Text className="text-white font-pmedium">Proceed</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                        
                        {/* <View className="flex-row justify-between">
                            <TouchableOpacity onPress={hideModal} className="bg-gray-300 py-4 px-4 rounded">
                                <Text className="font-pmedium">Complete Later</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => completOrder()} className="bg-secondary py-4 px-4 rounded">
                                <Text className="text-white font-pmedium">Proceed</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ExchangeDetails