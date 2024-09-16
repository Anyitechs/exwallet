import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'


type InputProps = {
    title: string,
    value?: string,
    placeholder: string,
    handleChangeText: any,
    otherStyles?: string,
    readOnly?: boolean,
    numberInput?: boolean,
}

const FormField: React.FC<InputProps> = ({ title, value, placeholder,
handleChangeText, otherStyles, readOnly, numberInput }) => {

  return (
    <View className={`space-y-2 ${otherStyles} mx-4 mt-2`}>
      <Text className='text-base font-pmedium'>
        {title}
        </Text>

        <View className='border-2  w-full h-16 px-4 
        rounded-2xl focus:border-secondary items-center flex-row'>
            <TextInput 
                className='flex-1 font-psemibold
                text-base'
                value={value}
                placeholder={placeholder}
                placeholderTextColor='#7b7b8b'
                onChangeText={handleChangeText}
                readOnly={readOnly}
                keyboardType={numberInput ? 'number-pad' : 'default'}
            />
        </View>
    </View>
  )
}

export default FormField