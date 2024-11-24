import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import AuthService from '../Services/authService'; // Adjust path if necessary

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // For loading state

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await AuthService.login(password, username); // Call login API
      setLoading(false);
      Alert.alert('Login Successful', `Welcome ${data.username || 'User'}!`);
      // You can store the token in local storage or state for further use
      // localStorage.setItem('token', data.token);
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
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
              placeholder="Email or Username"
              value={username}
              onChangeText={setUsername}
              autoCorrect={false}
              autoCapitalize="none"
          />
          <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCorrect={false}
              autoCapitalize="none"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
          <Link href="/(tabs)/home" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Home Screen (Skip login)</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          <Text>Don't have an account?  </Text>
          <Text style={styles.signup}>Sign Up</Text>
        </Text>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
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

    // width: '130%',
    flexDirection: 'row',
    justifyContent: 'space-between', // Better alignment
    width: '100%', // Align with input container width
    paddingHorizontal: 10, // Adds padding to ensure icons don’t overflow
    marginBottom: -11, // Adjust vertical positioning closer to the input
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
    // marginVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#508C9B',
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
    shadowColor: '#000', // Subtle shadow for a modern look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    // textTransform: 'uppercase', // Optional for a stronger call to action
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    // marginTop: 20, // Add spacing from the buttons

  },


  signup: {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Highlight sign-up link
  },
});

export default LoginScreen;