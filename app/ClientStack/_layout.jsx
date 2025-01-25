import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, Platform} from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClientService from '../../Services/ClientService';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

import CustomToast from '../Toast.config';
import DefaultFemaleImage from "../../assets/images/default_female.jpg";

export default function ClientStackLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    const [clientInfo, setClientInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    console.log('Client Info:', clientInfo);

    // Fetch client info and email
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

        const fetchClientInfo = async () => {
            if (!email) return;
            try {
                const data = await ClientService.getClientByEmail(email); // Fetch client by email
                setClientInfo(data);
            } catch (error) {
                console.error("Error fetching client info:", error);
                Alert.alert('Error', 'Failed to load client information.');
            }
        };

        fetchEmail();
        fetchClientInfo();
    }, [email]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    if (!clientInfo) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading client data...</Text>
            </View>
        );
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC' }]}>
                <TouchableOpacity onPress={() => router.push('/ClientStack')} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🐾OptiVet</Text>
                <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
                    <Ionicons name="person-circle" size={24} color="#FFF" />
                </TouchableOpacity>

            </View>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>x</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Profile Information</Text>
                        {/* Static Image */}
                        <Image
                            source={clientInfo?.profileImageUrl ? { uri: clientInfo.profileImageUrl } : DefaultFemaleImage}
                            style={styles.profileImage}
                        />
                        {clientInfo ? (
                            <>
                                {/*<Image*/}
                                {/*    source={{ uri: "https://via.placeholder.com/100" }}*/}
                                {/*    style={styles.profileImage}*/}
                                {/*/>*/}
                                <Text style={styles.profileName}>
                                    {clientInfo.firstName} {clientInfo.lastName}
                                </Text>
                                <Text style={styles.profileEmail}>{clientInfo.email}</Text>
                                <Text style={styles.profilePhone}>
                                    Phone: {clientInfo.phoneNumber || "N/A"}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.loadingText}>Loading profile...</Text>
                        )}
                        <View>
                            <TouchableOpacity onPress={() => {
                                toggleModal();
                                router.push('/ClientStack/settings');
                            }} style={styles.settingsButton}>
                                <Text style={styles.settingsButtonText}>Settings</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleModal} style={styles.logOutButton}>
                                <Text style={styles.logOutButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Main Stack Navigation */}
            <Stack
                screenOptions={{
                    headerShown: false, // Disable the default header
                    contentStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#121212' : '#F9F9F9',
                    },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
            </Stack>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#FFFFFF' }]}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => router.push('/ClientStack')}
                >
                    <Ionicons name="home-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() =>
                        router.push({
                            pathname: '/ClientStack/PetProfiles',
                            params: { clientId: clientInfo.id },
                        })
                    }
                >
                    <Ionicons name="paw-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>My Pets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() =>
                        router.push({
                            pathname: '/ClientStack/manageAppointments',
                            params: { clientId: clientInfo.id },
                        })
                    }
                >
                    <Ionicons name="calendar-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Appointments</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => router.push('/ClientStack/Products')}
                >
                    <Ionicons name="cart-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Store</Text>
                </TouchableOpacity>
            </View>

            {/* Global Toast Notifications */}
            <Toast config={CustomToast} />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#3498DB', // Primary blue
        borderBottomWidth: 1,
        borderBottomColor: '#CED6E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 24, // Updated for better visibility
        fontWeight: 'bold',
        color: '#FFFFFF', // White text
    },
    iconButton: {
        padding: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#FFFFFF', // Neutral white
        borderTopWidth: 1,
        borderTopColor: '#CED6E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 14, // Standard font size
        fontWeight: '600', // Medium weight for text
        marginTop: 5,
        color: '#2C3E50', // Dark gray for text
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9', // Light background
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 12,
        width: Platform.OS === 'web' ? '30%' : '80%',
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#2C3E50",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#2C3E50",
    },
    profileEmail: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 5,
    },
    profilePhone: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    logOutButton: {
        marginTop: 15,
        backgroundColor: "#E74C3C",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    logOutButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        marginLeft: 5
    },
    settingsButton: {
        marginTop: 15,
        backgroundColor: "#3498db",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    settingsButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 20,
        //fontWeight: 'bold',
        color: 'black',
    },
    loadingText: {
        fontSize: 16,
        color: '#7F8C8D', // Neutral gray
    },
});