import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router'; // Updated for navigation
import Toast from 'react-native-toast-message';
import CustomToast from './Toast.config';
import AuthService from '../Services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import UserService from '../Services/UserService'; // Import UserService for fetching user data
import Checkbox from 'expo-checkbox'; // For Remember Me checkbox

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // New state for Remember Me
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Expo Router's navigation hook

  useEffect(() => {
    // Load stored credentials
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        const rememberMeStatus = await AsyncStorage.getItem('rememberMe');

        if (savedEmail && savedPassword && rememberMeStatus === 'true') {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved credentials:', error);
      }
    };

    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter both email and password.',
      });
      return;
    }

    setLoading(true);

    try {
      const newToken = await AuthService.login(password, email); // Call login API
      setLoading(false);

      if (newToken?.token) {
        console.log('Login successful, token:', newToken.token);


        // Decode JWT to extract email
        const base64Payload = newToken.token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        console.log('Decoded payload:', payload);

        // Save the token and role
        await AsyncStorage.setItem('authToken', newToken.token);
        if (payload?.role) await AsyncStorage.setItem('role', payload.role);
        if (payload?.sub) await AsyncStorage.setItem('email', payload.sub);

        // Handle "Remember Me" functionality
        if (rememberMe) {
          await AsyncStorage.setItem('savedEmail', email);
          await AsyncStorage.setItem('savedPassword', password);
          await AsyncStorage.setItem('rememberMe', 'true');
        } else {
          await AsyncStorage.removeItem('savedEmail');
          await AsyncStorage.removeItem('savedPassword');
          await AsyncStorage.setItem('rememberMe', 'false');
        }

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome to the app!',
        });

        // Navigate to the home screen
        router.push('/RoleBasedRedirector'); // Use Expo Router for navigation
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: newToken?.message || 'Invalid credentials.',
        });
      }
    } catch (error) {
      setLoading(false);

      // Handle API errors gracefully
      const responseData = error.response?.data;
      const errorMessage = responseData?.message || 'An error occurred during login.';
      console.error('Login Error:', errorMessage);

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
                source={require('../assets/images/Background.png')}
                style={styles.logo}
                resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Login</Text>

          {/* Dog and Cat Icons */}
          <View style={styles.iconsContainer}>
            <Image
                source={require('../assets/images/cat (1).png')}
                style={styles.icon}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/dog.png')}
                style={styles.icon}
                resizeMode="contain"
            />
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={'gray'}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={'gray'}
                returnKeyType="done"
            />
          </View>

          {/* Remember Me Checkbox */}
          <View style={styles.rememberMeContainer}>
            <Checkbox
                value={rememberMe}
                onValueChange={setRememberMe}
                color={rememberMe ? '#FFD700' : undefined}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>

          {/* Login Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
              <Text style={styles.signup}>Sign Up</Text>
            </TouchableOpacity>
          </Text>

          {/* Toast Notification */}
          {typeof window !== 'undefined' && <Toast config={CustomToast}/>}

          {/* Temporary Login Emails */}
          {/*<View style={styles.tempEmailsContainer}>*/}
          {/*  <Text style={styles.tempEmailsTitle}>Temporary Login Emails</Text>*/}
          {/*  <Text style={styles.tempEmail}>Vet Assistant: <Text style={styles.email}>vetAS@ex</Text></Text>*/}
          {/*  <Text style={styles.tempEmail}>Veterinarian: <Text style={styles.email}>vet@vet</Text></Text>*/}
          {/*  <Text style={styles.tempEmail}>Veterinarian: <Text style={styles.email}>vet2@mail.com with testtest</Text></Text>*/}
          {/*  <Text style={styles.tempEmail}>Secretary: <Text style={styles.email}>sec@ex</Text></Text>*/}
          {/*  <Text style={styles.tempEmail}>Client: <Text style={styles.email}>test@test</Text></Text>*/}
          {/*</View>*/}

        </ScrollView>
      </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#134B70',
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  logo: {
    height: 150,
    width: 150,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: -11,
  },
  icon: {
    height: 100,
    width: 100,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#508C9B',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rememberMeText: {
    color: 'white',
    marginLeft: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#201E43',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
  },
  signup: {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },


  tempEmailsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1E3559',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  tempEmailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  tempEmail: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  email: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
});

export default LoginScreen;
