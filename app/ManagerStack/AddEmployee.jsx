import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import AuthService from '../../Services/authService';

const AddEmployee = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [role, setRole] = useState('VET_ASSISTANT'); // Default role
    const [loading, setLoading] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const router = useRouter();

    const handleAddEmployee = async () => {
        if (!firstName || !lastName || !email || !password || !phoneNumber || !dateOfBirth) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'All fields are required.',
            });
            return;
        }

        const newEmployee = {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            dateOfBirth: dateOfBirth.toISOString().split('T')[0], // Format for API
            role,
        };

        try {
            setLoading(true);
            await AuthService.registerEmployee(newEmployee);
            setLoading(false);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Employee account created successfully!',
            });

            // Navigate back to ManagerStack after success
            router.push('/ManagerStack');
        } catch (error) {
            setLoading(false);

            // Log and display error
            console.error('Error creating employee:', error);
            const errorMessage =
                error.response?.data?.message || 'Failed to create employee account. Please try again.';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Employee Account</Text>

            {/* Input Fields */}
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
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />

            {/* Date of Birth Picker */}
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setIsPickerVisible(true)}
            >
                <Text style={styles.dateButtonText}>
                    {dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : 'Select Date of Birth'}
                </Text>
            </TouchableOpacity>

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

            {/* Role Selection */}
            <Text style={styles.label}>Select Role</Text>
            <TouchableOpacity
                style={[
                    styles.roleButton,
                    role === 'VET' && styles.roleButtonSelected,
                ]}
                onPress={() => setRole('VET')}>
                <Text style={styles.roleButtonText}>Veterinarian</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.roleButton,
                    role === 'VET_ASSISTANT' && styles.roleButtonSelected,
                ]}
                onPress={() => setRole('VET_ASSISTANT')}>
                <Text style={styles.roleButtonText}>Vet Assistant</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.roleButton,
                    role === 'SECRETARY' && styles.roleButtonSelected,
                ]}
                onPress={() => setRole('SECRETARY')}>
                <Text style={styles.roleButtonText}>Secretary</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleAddEmployee}
                disabled={loading}>
                <Text style={styles.buttonText}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
            </TouchableOpacity>

            {/* Toast Notification */}
            <Toast />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    roleButton: {
        backgroundColor: '#ddd',
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    roleButtonSelected: {
        backgroundColor: '#1D3D47',
    },
    roleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 20,
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
});

export default AddEmployee;
