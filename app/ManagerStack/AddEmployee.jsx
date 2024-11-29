import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AuthService from '../../Services/authService';

const AddEmployee = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('VET_ASSISTANT'); // Default role
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAddEmployee = async () => {
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        const newEmployee = {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            role,
        };

        try {
            setLoading(true);
            await AuthService.registerEmployee(newEmployee);
            setLoading(false);

            Alert.alert('Success', 'Employee account created successfully!', [
                { text: 'OK', onPress: () => router.push('/ManagerStack') },
            ]);
        } catch (error) {
            setLoading(false);
            console.error('Error creating employee:', error);
            Alert.alert('Error', 'Failed to create employee account. Please try again.');
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

            {/* Role Selection */}
            <Text style={styles.label}>Select Role</Text>
            <TouchableOpacity
                style={[
                    styles.roleButton,
                    role === 'ROLE_VET' && styles.roleButtonSelected,
                ]}
                onPress={() => setRole('VET')}>
                <Text style={styles.roleButtonText}>Veterinarian</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.roleButton,
                    role === 'ROLE_VET_ASSISTANT' && styles.roleButtonSelected,
                ]}
                onPress={() => setRole('VET_ASSISTANT')}>
                <Text style={styles.roleButtonText}>Vet Assistant</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.roleButton,
                    role === 'ROLE_SECRETARY' && styles.roleButtonSelected,
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
