import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../../Services/UserService'; // Import the updated UserService

const ManagerStack = () => {
    const [managerInfo, setManagerInfo] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email'); // Fetch stored email
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    console.error("No email found in AsyncStorage");
                    Alert.alert('Error', 'No email found. Please log in again.');
                }
            } catch (error) {
                console.error("Error fetching email from AsyncStorage:", error);
                Alert.alert('Error', 'Failed to retrieve email.');
            }
        };

        const fetchManagerInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email); // Fetch manager by email
                setManagerInfo(data);
            } catch (error) {
                console.error("Error fetching manager info:", error);
                Alert.alert('Error', 'Failed to load manager information.');
            }
        };

        fetchEmail();
        fetchManagerInfo();
    }, [email]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manager / Vet Dashboard</Text>
            {managerInfo ? (
                <>
                    <Text>Welcome, {managerInfo.firstName} {managerInfo.lastName}!</Text>
                    <Text>Email: {managerInfo.email}</Text>
                    <Text>Phone: {managerInfo.phoneNumber}</Text>
                    <Text>id: {managerInfo.userId}</Text>
                </>
            ) : (
                <Text>Loading manager information...</Text>
            )}

            {/* Navigation Buttons */}
            <Link href="ManagerStack/ManagerScheduleScreen" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Manage your meets!</Text>
                </TouchableOpacity>
            </Link>

            <Link href="ManagerStack/ManagerAppointmentsScreen" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Your Appointments</Text>
                </TouchableOpacity>
            </Link>

            <Link href="ManagerStack/WalkInClientsScreen" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Handle Walk-in Clients</Text>
                </TouchableOpacity>
            </Link>

            <Link href="ManagerStack/MsgsScreen" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Important Messages</Text>
                </TouchableOpacity>
            </Link>

            <Link href="ManagerStack/Products" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Products</Text>
                </TouchableOpacity>
            </Link>

            <Link href="ManagerStack/AddProduct" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Add Product</Text>
                </TouchableOpacity>
            </Link>

            <Link href="ManagerStack/AddEmployee" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Create Employee Account</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ManagerStack;
