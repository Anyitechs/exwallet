import { View, Image } from 'react-native'
import React from 'react'
import { IMAGES } from '@/constants/images'

const RoundedLogo = () => {
  return (
    <View className='bg-secondary h-[100px] w-[100px] mx-10 rounded-full'>
    <Image
        className='w-[100px] h-[100px]'
        source={IMAGES.logo}
        resizeMode='contain'
    />
</View>
  )
}

export default RoundedLogo