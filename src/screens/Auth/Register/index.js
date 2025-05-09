/* eslint-disable no-shadow */
/* eslint-disable no-alert */
//Register.js
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Linking,
  Animated,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
// import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './styles';
import {EYESVG, SouqnaLogo} from '../../../assets/svg';
import Bold from '../../../typography/BoldText';
import Header from '../../../components/Headers/Header';
import {colors} from '../../../util/color';
import RadioGroup from '../../../components/atoms/InputFields/RadioGroup';
import PrimaryPasswordInput from '../../../components/atoms/InputFields/PrimaryPasswordInput';
import CustomSwitch from '../../../components/atoms/InputFields/CustomSwitch';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import API from '../../../api/apiServices';
import {mvs} from '../../../util/metrices';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import {setRole} from '../../../redux/slices/userSlice';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [profilename, setProfilename] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const profileNameOpacity = useRef(new Animated.Value(0)).current;
  // const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleRegister = async () => {
    console.log('Register button pressed');
    if (!isEmailValid(email)) {
      setEmailError('Please enter a valid email.');
      return;
    } else {
      setEmailError('');
    }

    if (!isPasswordValid(password)) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    } else {
      setPasswordError('');
    }

    if (selectedOption === 'Seller' && !profilename) {
      alert('Please provide a profile name for your Seller account');
      return;
    }

    const storedFcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('Stored FCM Token: ', storedFcmToken);

    const payload = {
      name: selectedOption === 'Seller' ? profilename : 'Buyer',
      email,
      password,
      role: selectedOption === 'Seller' ? 2 : 3, // 2=Seller, 3=Buyer
      fcm: storedFcmToken,
    };

    console.log('Payload: ', payload); // Log the payload being sent to the API

    try {
      const response = await API.post('register', payload);
      console.log('API Response:', response.data);

      const data = response.data;
      if (data.success) {
        alert(data.message || 'Registration successful! Please login.');
        navigation.replace('Login');
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(
        'Registration Error:',
        error?.response?.data || error.message,
      );
      alert(
        error?.response?.data?.message ||
          'An error occurred during registration. Please try again.',
      );
    }
  };

  const isEmailValid = email => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const isValid = emailRegex.test(email);
    console.log('Email validation result: ', isValid, email); // Add a console log here
    return isValid;
  };

  const isPasswordValid = password => {
    const isValid = password.length >= 8;
    console.log('Password validation result: ', isValid, password); // Add a console log here
    return isValid;
  };

  const handleClearEmail = () => {
    setEmail('');
  };

  useEffect(() => {
    if (selectedOption === 'Seller') {
      Animated.timing(profileNameOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(profileNameOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [profileNameOpacity, selectedOption]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Header
        showBackButton
        onBackPress={() => navigation.goBack()}
        title={'Help'}
      />
      <View style={styles.HeaderContainer}>
        <Image
          source={require('../../../assets/img/logo1.png')}
          style={{width: mvs(50), height: mvs(50)}}
        />
        <Bold style={styles.title}>Souqna</Bold>
      </View>
      <Bold style={styles.howText}>How do you want to use Souqna?</Bold>

      <RadioGroup
        options={[
          {value: 'Seller', label: 'Seller'},
          {value: 'Buyer', label: 'Buyer'},
        ]}
        selectedOption={selectedOption}
        onSelect={setSelectedOption}
      />

      {selectedOption === 'Seller' && (
        <Animated.View style={{opacity: profileNameOpacity}}>
          <PrimaryPasswordInput
            value={profilename}
            onChangeText={setProfilename}
            placeholder="Profilename"
          />
        </Animated.View>
      )}

      <PrimaryPasswordInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-Mail"
        error={emailError}
        clearText={handleClearEmail}
      />

      <View style={styles.passwordContainer}>
        <PrimaryPasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          rightIcon={<EYESVG />}
          secureTextEntry={securePassword}
          error={passwordError}
        />
      </View>

      <View style={styles.switchContainer}>
        <CustomSwitch
          value={isSubscribed}
          onValueChange={setIsSubscribed}
          trackColor={{false: colors.grey, true: colors.green}}
          thumbColor={isSubscribed ? colors.white : '#f4f3f4'}
        />
        <Regular style={styles.switchText}>
          Yes, I look forward to receiving regular email updates from the group
          of companies - you can unsubscribe at any time.
        </Regular>
      </View>

      <View style={styles.buttonContainer}>
        <MyButton
          title="Register For Free"
          onPress={handleRegister}
          disabled={!email || !password} // Disable button if form is not valid
        />
        <Regular style={styles.termsText}>
          Our{' '}
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.example.com/terms')}>
            <Regular style={styles.termsLink}>Terms of Use</Regular>
          </TouchableOpacity>{' '}
          apply. You can find information about the processing of your data in
          our{' '}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.example.com/privacy-policy')
            }>
            <Regular style={styles.termsLink}>Privacy Policy</Regular>
          </TouchableOpacity>
          .
        </Regular>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
