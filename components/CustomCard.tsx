import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomCard = ({ name }) => {
  return (
    <TouchableOpacity>
        <View className='w-full h-[100px] rounded-lg bg-white p-6  shadow-xl shadow-gray-200 mb-4'>
            <Text className='font-psemibold'>{ name }</Text>
        </View>
    </TouchableOpacity>
  )
}

export default CustomCard