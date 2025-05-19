import React, {useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  ToastAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './styles';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import {setUser} from '../../../redux/slices/userSlice';
import {EYESVG, SouqnaLogo} from '../../../assets/svg';
import PrimaryPasswordInput from '../../../components/atoms/InputFields/PrimaryPasswordInput';
import Bold from '../../../typography/BoldText';
import Header from '../../../components/Headers/Header';
import {loginUser} from '../../../api/authServices';
import {colors} from '../../../util/color';
import {Snackbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // const email = 'jmubashir272@gmail.com';
  // const password = 'admin123@'; // Static password for testing

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      setSnackbarMessage('Please enter a valid email.');
      setSnackbarVisible(true); // ✅ Show snackbar
      return;
    } else {
      setEmailError('');
    }

    if (!isPasswordValid(password)) {
      setSnackbarMessage('Password must be at least 8 characters.');
      setSnackbarVisible(true); // ✅ Show snackbar
      return;
    } else {
      setPasswordError('');
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);
      if (res.success) {
        const user = res.user;

        dispatch(
          setUser({
            token: user.token,
            refreshToken: user.refreshToken,
            tokenExpire: user.tokenExpire,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: password,
            sellerType: user.sellerType,
          }),
        );
        const message =
          user.role === 3
            ? 'Buyer logged in successfully'
            : user.role === 2
            ? 'Seller logged in successfully'
            : user.role === 4
            ? 'Logged in as Both'
            : 'Login successful';

        setSnackbarMessage(message);
        setSnackbarVisible(true); // ✅ Show snackbar
        console.log('Login successful:', user);

        setTimeout(() => {
          const destination = 'MainTabs';
          navigation.navigate(destination);
        }, 1000);
      } else {
        setSnackbarMessage(
          res.error || res.message || 'Invalid email or password',
        );
        setSnackbarVisible(true); // ✅ Show snackbar
      }
    } catch (error) {
      console.log('Login error:', error);
      showErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  const showErrorMessage = (customMessage = 'Invalid email or password') => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(customMessage, ToastAndroid.SHORT);
    } else {
      Alert.alert('Login Error', customMessage);
    }
  };

  const isEmailValid = email => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = password => {
    return password.length >= 8;
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const togglePasswordVisibility = () => {
    setSecurePassword(!securePassword);
  };

  const handleClearEmail = () => {
    setEmail('');
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const isFormValid = email && password; // Button activation condition

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={'Help'} />
      <View style={styles.HeaderContainer}>
        <SouqnaLogo width={50} height={50} />
        <Bold style={styles.title}>Souqna</Bold>
      </View>

      <PrimaryPasswordInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-Mail"
        error={emailError}
        clearText={handleClearEmail} // Pass clearText function to clear email input
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
      <View style={styles.buttonContainer}>
        <MyButton
          title={
            loading ? (
              <ActivityIndicator size="large" color={colors.green} />
            ) : (
              'Login'
            )
          }
          onPress={handleLogin}
          disabled={loading || !isFormValid}
        />
        <Regular style={styles.registerText}>
          Don’t have an account?{' '}
          <Regular style={styles.registerLink} onPress={navigateToRegister}>
            Register
          </Regular>
        </Regular>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        wrapperStyle={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          alignItems: 'center', // centers the snackbar horizontally
        }}
        style={{
          backgroundColor: colors.lightgreen,
          width: '90%',
          borderRadius: 8,
          left: 30,
        }}>
        <Regular style={{textAlign: 'center'}}>{snackbarMessage}</Regular>
      </Snackbar>
    </SafeAreaView>
  );
};

export default LoginScreen;
