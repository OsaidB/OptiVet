import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router'; // Updated for navigation
import Toast from 'react-native-toast-message';
import AuthService from '../Services/authService';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const router = useRouter(); // Expo Router's navigation hook

    const handleSignUp = async () => {
        if (!email || !password || !firstName || !lastName || !phoneNumber || !dateOfBirth) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill out all fields.',
            });
            return;
        }

        try {
            const userData = {
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                dateOfBirth: dateOfBirth.toISOString().split('T')[0], // Format for API
            };
            await AuthService.register(userData);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your account has been created!',
            });
            router.push('/(tabs)/home'); // Navigate to login screen
        } catch (error) {
            console.error('Error during sign up:', error);
            Toast.show({
                type: 'error',
                text1: 'Sign Up Failed',
                text2: error.response?.data?.message || 'Please try again later.',
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setIsPickerVisible(true)}
            >
                <Text style={styles.dateButtonText}>
                    {dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : 'Select Date of Birth'}
                </Text>
            </TouchableOpacity>

            {/* Modal for Date Picker */}
            {isPickerVisible && (
                <Modal transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTitle}>Select Date of Birth</Text>
                            <input
                                type="date"
                                value={dateOfBirth.toISOString().split('T')[0]}
                                onChange={(e) => setDateOfBirth(new Date(e.target.value))}
                                style={styles.dateInput}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsPickerVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.login} onPress={() => router.push('/')}>
                    Log In
                </Text>
            </Text>
            <Toast />
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#508C9B',
        width: '100%',
    },
    dateButton: {
        backgroundColor: '#1D3D47',
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
        width: '100%',
    },
    dateButtonText: {
        color: 'white',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#201E43',
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        color: 'white',
        textAlign: 'center',
    },
    login: {
        color: '#FFD700',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dateInput: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#1D3D47',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
