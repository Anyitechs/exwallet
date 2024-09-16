import { MOCKPFI } from '@/constants/mockPfi';
import { useGlobalContext } from '@/context/GlobalProvider';
import { cancelExchangeOrder, createExchangeOrder, fetchExchanges } from '@/lib/tbDex';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';


const TransactionHistoryScreen: React.FC = () => {
    const { userId } = useGlobalContext();
    const [transactions, setTransactions] = useState<TransactionResponse>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fetchTransactions = async () => {
        const response: TransactionResponse = await fetchExchanges(userId as string);
        const reverseTransaction = response.reverse()
        setTransactions(reverseTransaction);
    };
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);


    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    
    const snapPoints = useMemo(() => ['50%', '100%'], []);

    useEffect(() => {
      fetchTransactions();
    }, []);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchTransactions();
        setIsRefreshing(false);
    }
  
    const filterTransactions = (transactions: TransactionResponse) => {
      return transactions.filter(
        (transaction) => transaction.metadata.kind === 'quote' || transaction.metadata.kind === 'order'
      );
    };
  
    const getOrderStatus = (exchangeId: string) => {
      const orderStatus = transactions.find(
        (transaction) =>
          transaction.metadata.exchangeId === exchangeId && transaction.metadata.kind === 'orderstatus'
      )?.data.orderStatus;
  
      return orderStatus || 'N/A';
    };

    const handlePresentModalPress = useCallback((transaction: Transaction) => {
        setSelectedTransaction(transaction);
        bottomSheetModalRef.current?.present();
    }, []);

    const getName = (item: Transaction): string => {
        let name;
        for (let i = 0; i < MOCKPFI.length; i++) {
            if (item.metadata.kind === "quote") {
                if (MOCKPFI[i].did === item.metadata.from)
                    name = MOCKPFI[i].name
            } else if (item.metadata.kind === "order") {
                if (MOCKPFI[i].did === item.metadata.to) {
                    name = MOCKPFI[i].name
                }
            }
        }
        return name as string;
    }

    const cancelOrder = async () => {
        try {
            setIsSubmitting(true)

            console.log('exhange details: ', selectedTransaction)
            const reason = "User canceled";

            const result = await cancelExchangeOrder(userId as string, selectedTransaction?.metadata.exchangeId!, selectedTransaction?.metadata.to!, reason);

            if (result.success) {
                console.log('result: ', result)
                bottomSheetModalRef.current?.close()
            } else {
                console.log('an error occured: ', result)
            }
        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const completeOrder = async () => {
        try {
            setIsSubmitting(true)

            console.log('exhange details: ', selectedTransaction)

            const result = await createExchangeOrder(userId as string, selectedTransaction?.metadata.exchangeId!, selectedTransaction?.metadata.to!);

            if (result.success) {
                console.log('result: ', result)
                bottomSheetModalRef.current?.close()
                // hideModal()
            } else {
                console.log('an error occured: ', result)
            }
        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }
      

    const renderTransaction = ({ item }: { item: Transaction }) => {
        const { kind, exchangeId, createdAt } = item.metadata;
        const payinAmount = item.data.payin ? item.data.payin.amount : '';
        const payoutAmount = item.data.payout ? item.data?.payout.amount : '';
        // const payinCurrency = item.data.payin ? item.data?.payin.kind.split('_')[0];
        const payoutCurrency = item.data.payout ? item.data.payout.currencyCode : '';
        const orderStatus = kind === 'order' ? getOrderStatus(exchangeId) : '';
      
        return (
          <TouchableOpacity 
            className="bg-white rounded-lg p-4 my-2 mx-3 shadow-md"
            onPress={() => handlePresentModalPress(item)}
          >
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                {kind.charAt(0).toUpperCase() + kind.slice(1)}
              </Text>
              <Text className="text-gray-600 mt-1">
                Date: {new Date(createdAt).toLocaleDateString()}
              </Text>
              <Text className="text-gray-600">
                Payin Amount: {payinAmount} 
              </Text>
              {payoutAmount && payoutCurrency && (
                <Text className="text-gray-600">
                  Payout: {payoutAmount} {payoutCurrency}
                </Text>
              )}
              {kind === 'order' && (
                <Text className="mt-2 font-medium text-green-600">
                  Order Status: {orderStatus}
                </Text>
              )}
              {/* {kind === 'quote' && (
                <TouchableOpacity 
                  className="bg-secondary py-2 px-4 rounded-md mt-3"
                  onPress={() => console.log('Complete order')}
                >
                  <Text className="text-white font-semibold text-center">
                    Complete Order
                  </Text>
                </TouchableOpacity>
              )} */}
            </View>
          </TouchableOpacity>
        );
    };
  
    return (
        <View>
            <FlatList
            className='bg-white'
                data={filterTransactions(transactions)}
                keyExtractor={(item) => item.metadata.id}
                renderItem={renderTransaction}
                ListEmptyComponent={() => (
                    <ActivityIndicator size="large" color="#334b57" />
                )}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
            />
            <BottomSheetModalProvider>
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
                            {selectedTransaction ? (
                            <>
                                <Text className='text-center text-lg font-psemibold'>
                                    {getName(selectedTransaction)}
                                </Text>
                                {/* <Text>
                                    Exchange from {selectedTransaction.data.payin?.kind}
                                </Text> */}
                                <Text className="text-lg font-semibold text-gray-800">
                                {selectedTransaction.metadata.kind.charAt(0).toUpperCase() + selectedTransaction.metadata.kind.slice(1)}
                                </Text>
                                <Text className="text-gray-600 mt-1">
                                Date: {new Date(selectedTransaction.metadata.createdAt).toLocaleDateString()}
                                </Text>
                                <Text className="text-gray-600">
                                Payin Amount: {selectedTransaction.data.payin?.amount}
                                </Text>
                                {selectedTransaction.data.payout?.amount && selectedTransaction.data.payout?.currencyCode && (
                                <Text className="text-gray-600">
                                    Payout: {selectedTransaction.data.payout.amount} {selectedTransaction.data.payout.currencyCode}
                                </Text>
                                )}

                                {selectedTransaction.metadata.kind === 'quote' && (
                                <>
                            <View className='mx-4 my-4'>
                            {
                                isSubmitting ? <ActivityIndicator size="large" color="#334b57" /> :
                                    <TouchableOpacity 
                                        className="bg-secondary py-2 px-4 rounded-md mt-3"
                                        onPress={() => completeOrder()}
                                        >
                                        <Text className="text-white font-semibold text-center">
                                            Complete Order
                                        </Text>
                                    </TouchableOpacity>
                            }
                        </View>

                        <View className='mx-4 my-4'>
                            {
                                isSubmitting ? <ActivityIndicator size="large" color="#334b57" /> :
                                <TouchableOpacity 
                                    className="bg-gray-300 py-2 px-4 rounded-md mt-3"
                                    onPress={() => cancelOrder()}
                                    >
                                    <Text className="text-center font-semibold text-gray-800">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>
                                </>
                                )}
                            </>
                            ) : (
                            <Text>No transaction selected</Text>
                            )}
                        </View>
                    </BottomSheetView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    </View>
    );
  };
  
  export default TransactionHistoryScreen;