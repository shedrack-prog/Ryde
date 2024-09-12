import CustomButton from '@/components/custom-button';
import InputField from '@/components/input-field';
import OAuth from '@/components/OAuth';
import { icons, images } from '@/constants';
import { fetchAPI } from '@/lib/fetch';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [verification, setVerification] = useState({
    state: 'default',
    code: '',
    error: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp();
  const handleSignUp = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setVerification({
        ...verification,
        state: 'pending',
      });
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].longMessage);
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === 'complete') {
        // Todo
        // Create a database user

        await fetchAPI('/(api)/user', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });

        setVerification({
          ...verification,
          state: 'success',
        });
      } else {
        setVerification({
          ...verification,
          state: 'failed',
          error: 'Verification failed',
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: 'failed',
        error: err.errors[0].longMessage,
      });
    }
  };

  return (
    <ScrollView className=' bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image source={images.signUpCar} className='z-0 w-full h-[250px]' />
          <Text
            className='text-2xl text-black font-JakartaSemiBold
              absolute bottom-5 left-5'
          >
            Create Your Account
          </Text>
        </View>
        <View className='p-5'>
          <InputField
            label={'Name'}
            placeholder='Enter your name'
            icon={icons.person}
            value={form.name}
            onChangeText={(value: string) => setForm({ ...form, name: value })}
          />
          <InputField
            label={'Email'}
            placeholder='Enter your email'
            icon={icons.email}
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
          />
          <InputField
            label={'Password'}
            placeholder='Enter your password'
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value: string) =>
              setForm({ ...form, password: value })
            }
          />

          <CustomButton
            title='Sign Up'
            onPress={handleSignUp}
            className='mt-8 py-4'
          />
          {/* OAuth */}
          <OAuth />

          <Link
            href={'/sign-in'}
            className='text-lg text-center text-general-200 mt-10'
          >
            <Text>Already have an account? </Text>
            <Text className='text-primary-500'> Login</Text>
          </Link>
        </View>

        {/* Pending Modal */}
        <ReactNativeModal
          isVisible={verification.state === 'pending'}
          onModalHide={() => {
            if (verification.state === 'success') {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[340px]'>
            <Text className='text-2xl font-JakartaExtraBold mb-2'>
              Verification
            </Text>
            <Text className=' font-Jakarta  mb-5'>
              We have sent a verification code to {form.email}. Enter it below.
            </Text>

            <InputField
              label='Code'
              icon={icons.lock}
              placeholder='12345'
              keyboardType='numeric'
              value={verification.code}
              onChangeText={(code: string) =>
                setVerification({ ...verification, code })
              }
            />

            {verification.error && (
              <Text className='text-sm text-red-500 mt-1'>
                {verification.error}
              </Text>
            )}

            <CustomButton
              title='Verify Email'
              onPress={onPressVerify}
              className='mt-9 py-4 bg-success-500'
            />
          </View>
        </ReactNativeModal>

        {/* Verification modal */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
            <Image
              source={images.check}
              className='w-[110px] h-[110px] mx-auto my-5'
            />
            <Text className='text-3xl font-JakartaBold text-center'>
              Verified
            </Text>
            <Text className='text-base text-gray-400 font-Jakarta text-center mt-2'>
              You have successfully verified your account.
            </Text>

            <CustomButton
              title='Browse Home'
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/(root)/(tabs)/home');
              }}
              className='mt-8'
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
