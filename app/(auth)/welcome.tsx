import CustomButton from '@/components/custom-button';
import { onboarding } from '@/constants';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;
  return (
    <SafeAreaView className='flex h-full items-center justify-between  bg-white'>
      <StatusBar barStyle={'dark-content'} />
      <TouchableOpacity
        onPress={() => {
          router.replace('/(auth)/sign-up');
        }}
        className='w-full flex items-end  justify-end p-5'
      >
        <Text className='text-black text-lg font-JakartaBold'>Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className='w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full' />
        }
        activeDot={
          <View className='w-[32px]  h-[4px] mx-1 bg-[#0286FF] rounded-full' />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className='flex items-center justify-normal p-5'>
            <Image
              source={item.image}
              className='w-full h-[300px] '
              resizeMode='contain'
            />
            <View className='flex flex-row items-center justify-center w-full mt-10'>
              <Text className='text-black text-3xl font-bold text-center mx-10'>
                {item.title}
              </Text>
            </View>

            <Text
              className='text-lg font-JakartaBold text-center
            mx-10 mt-3 text-[#858585]'
            >
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        onPress={() =>
          isLastSlide
            ? router.replace('/(auth)/sign-up')
            : swiperRef.current?.scrollBy(1)
        }
        title={isLastSlide ? 'Get started' : 'Next'}
        className='w-11/12 mt-12'
      />
    </SafeAreaView>
  );
};

export default Onboarding;
