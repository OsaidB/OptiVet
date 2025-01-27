import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, Platform } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import CustomToast from '../Toast.config';
import React, { useState, useEffect } from 'react';
import AuthGuard from "../AuthGuard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../../Services/UserService';
import AuthService from '../../Services/authService';
import DefaultFemaleImage from "../../assets/images/default_female.jpg";

export default function VetAssistantStackLayout() {
    const colorScheme = useColorScheme();

    const [vetAssistantInfo, setVetAssistantInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    // Fetch vet assistant info and email
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

        const fetchVetAssistantInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email); // Fetch user by email
                setVetAssistantInfo(data);
            } catch (error) {
                console.error("Error fetching vet assistant info:", error);
                Alert.alert('Error', 'Failed to load vet assistant information.');
            }
        };

        fetchEmail();
        fetchVetAssistantInfo();
    }, [email]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Logout function
    const handleLogout = async () => {
        try {
            const success = await AuthService.logout();
            if (success) {
                Toast.show({
                    type: 'success',
                    text1: 'Logged Out',
                    text2: 'You have been successfully logged out.',
                });
                toggleModal(); // Close the modal
                router.replace('/LoginScreen'); // Redirect to the login screen
            } else {
                Alert.alert('Logout Failed', 'An error occurred during logout. Please try again.');
            }
        } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Logout Error', 'Something went wrong. Please try again.');
        }
    };

    if (!vetAssistantInfo) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading vet assistant data...</Text>
            </View>
        );
    }

    return (
        <AuthGuard allowedRoles={['VET_ASSISTANT']}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC' }]}>
                    <TouchableOpacity onPress={() => console.log('Menu pressed')} style={styles.iconButton}>
                        <Ionicons name="menu" size={24} color="#FFF" />
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
                                source={vetAssistantInfo?.profileImageUrl ? { uri: vetAssistantInfo.profileImageUrl } : DefaultFemaleImage}
                                style={styles.profileImage}
                            />
                            {vetAssistantInfo ? (
                                <>
                                    <Text style={styles.profileName}>
                                        {vetAssistantInfo.firstName} {vetAssistantInfo.lastName}
                                    </Text>
                                    <Text style={styles.profileEmail}>{vetAssistantInfo.email}</Text>
                                    <Text style={styles.profilePhone}>
                                        Phone: {vetAssistantInfo.phoneNumber || "N/A"}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.loadingText}>Loading profile...</Text>
                            )}
                            <View>
                                <TouchableOpacity onPress={toggleModal} style={styles.settingsButton}>
                                    <Text style={styles.settingsButtonText}>Settings</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleLogout} style={styles.logOutButton}>
                                    <Text style={styles.logOutButtonText}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Main Stack Navigation */}
                <Stack
                    screenOptions={{
                        headerShown: false,
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
                    <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Animals')}>
                        <Ionicons name="paw-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                        <Text style={styles.footerButtonText}>All Pets</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Checklist')}>
                        <Ionicons name="checkmark-done-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                        <Text style={styles.footerButtonText}>Checked Pets</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Settings')}>
                        <Ionicons name="settings-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                        <Text style={styles.footerButtonText}>Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Global Toast Notifications */}
                <Toast config={CustomToast} />
            </ThemeProvider>
        </AuthGuard>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#FFFFFF", // White background for the modal
        padding: 20,
        borderRadius: 12, // Rounded corners
        width: Platform.OS === 'web' ? '30%' : '80%', // Responsive width
        alignItems: "center", // Center content
        shadowColor: "#000", // Shadow for depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Shadow for Android
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#2C3E50", // Dark text color
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Circular image
        marginBottom: 15,
        backgroundColor: "#E0E0E0", // Placeholder background
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#2C3E50", // Dark gray for text
    },
    profileEmail: {
        fontSize: 16,
        color: "#7F8C8D", // Lighter gray
        marginBottom: 5,
    },
    profilePhone: {
        fontSize: 14,
        color: "#7F8C8D", // Neutral gray
        marginBottom: 15,
    },
    settingsButton: {
        marginTop: 15,
        backgroundColor: "#3498DB", // Primary blue
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    settingsButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    logOutButton: {
        marginTop: 10,
        backgroundColor: "#E74C3C", // Red for logout
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    logOutButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 20,
        color: "#7F8C8D", // Neutral gray
    },
});
