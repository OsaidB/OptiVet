import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClientService from '../../Services/ClientService';

const ClientStack = () => {
    const [clientInfo, setClientInfo] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    console.error("No email found in AsyncStorage");
                    alert('Error: No email found. Please log in again.');
                }
            } catch (error) {
                console.error("Error fetching email from AsyncStorage:", error);
                alert('Error: Failed to retrieve email.');
            }
        };

        const fetchClientInfo = async () => {
            if (!email) return;
            try {
                const data = await ClientService.getClientByEmail(email);
                setClientInfo(data);
            } catch (error) {
                console.error("Error fetching client info:", error);
                alert('Error: Failed to load client information.');
            }
        };

        fetchEmail();
        fetchClientInfo();
    }, [email]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.greetingText}>Welcome Back,</Text>
                <Text style={styles.clientName}>{clientInfo?.firstName} {clientInfo?.lastName}</Text>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    style={styles.profileImage}
                />
            </View>

            {/* Statistics Section */}
            <View style={styles.statsSection}>
                <View style={styles.statsCard}>
                    <Text style={styles.statsValue}>{clientInfo?.pets?.length || 0}</Text>
                    <Text style={styles.statsLabel}>My Pets</Text>
                </View>
                <View style={styles.statsCard}>
                    <Text style={styles.statsValue}>{clientInfo?.appointments?.length || 0}</Text>
                    <Text style={styles.statsLabel}>Appointments</Text>
                </View>
                <View style={styles.statsCard}>
                    <Text style={styles.statsValue}>10+</Text>
                    <Text style={styles.statsLabel}>Products Ordered</Text>
                </View>
            </View>

            {/* Highlights Section */}
            <View style={styles.highlightsSection}>
                <Text style={styles.sectionTitle}>Pet Highlights</Text>
                {clientInfo?.pets?.slice(0, 3).map((pet) => (
                    <View key={pet.id} style={styles.petCard}>
                        <Image
                            source={{ uri: pet.imageUrl || 'https://via.placeholder.com/100' }}
                            style={styles.petImage}
                        />
                        <View style={styles.petDetails}>
                            <Text style={styles.petName}>{pet.name}</Text>
                            <Text style={styles.petType}>{pet.type}</Text>
                            <Text style={styles.petActivity}>Last checkup: {pet.lastCheckupDate || 'N/A'}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    greetingText: {
        fontSize: 24,
        color: '#1D3D47',
        fontWeight: '600',
    },
    clientName: {
        fontSize: 28,
        color: '#3498DB',
        fontWeight: 'bold',
        marginVertical: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#3498DB',
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statsCard: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        margin: 5,
        padding: 15,
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    statsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3498DB',
    },
    statsLabel: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    highlightsSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1D3D47',
        marginBottom: 15,
    },
    petCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    petDetails: {
        flex: 1,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    petType: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 5,
    },
    petActivity: {
        fontSize: 12,
        color: '#95A5A6',
    },
});

export default ClientStack;
