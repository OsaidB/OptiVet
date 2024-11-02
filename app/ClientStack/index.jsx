import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import ClientService from '../../Services/ClientService';

const ClientStack = () => {
    const [clientInfo, setClientInfo] = useState(null);
    const clientId = 3; // Temporary static client ID

    useEffect(() => {
        const fetchClientInfo = async () => {
            try {
                const data = await ClientService.getClientById(clientId);
                setClientInfo(data);
            } catch (error) {
                console.error("Error fetching client info:", error);
                Alert.alert('Error', 'Failed to load client information.');
            }
        };

        fetchClientInfo();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Client Dashboard</Text>
            {clientInfo ? (
                <>
                    <Text>Welcome, {clientInfo.firstName} {clientInfo.lastName}!</Text>
                    <Text>Email: {clientInfo.email}</Text>
                    <Text>Phone: {clientInfo.phoneNumber}</Text>
                </>
            ) : (
                <Text>Loading client information...</Text>
            )}

            {/* Button to navigate to Pet Profiles */}
            <Link href={{ pathname: "/ClientStack/PetProfiles", params: { clientId } }} asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Your Pet Profiles</Text>
                </TouchableOpacity>
            </Link>

            {/* Button to navigate to Manage Appointments */}
            <Link href="/ClientStack/manageAppointments" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Manage Appointments</Text>
                </TouchableOpacity>
            </Link>

            {/* Button to navigate to Client Settings */}
            <Link href="/ClientStack/settings" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Settings</Text>
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
        width: '80%', // Make buttons wider for better accessibility
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ClientStack;
