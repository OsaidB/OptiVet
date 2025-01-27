import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {router, Stack, useRouter} from 'expo-router';
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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DefaultUserImage from "../../assets/images/default_user.png";

export default function VetAssistantStackLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();

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
                router.replace(''); // Redirect to the login screen
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
                    <TouchableOpacity onPress={() => router.push('/VetAssistantStack')} style={styles.iconButton}>
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
                    animationType={Platform.OS === 'web' ? 'none' : 'slide'}
                    onRequestClose={toggleModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                                <FontAwesome name="close" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Profile Information</Text>
                            {/* Static Image */}
                            <Image
                                source={vetAssistantInfo?.profileImageUrl ? { uri: vetAssistantInfo.profileImageUrl } : DefaultUserImage}
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
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    onPress={() => {
                                        toggleModal();
                                        router.push('/VetAssistantStack/Settings');
                                    }}
                                    style={styles.settingsButton}
                                >
                                    <FontAwesome name="cogs" size={20} color="#FFFFFF" />
                                    <Text style={styles.settingsButtonText}>Settings</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleLogout} style={styles.logOutButton}>
                                    <FontAwesome name="sign-out" size={20} color="#FFFFFF" />
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
    // Modal Overlay
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark overlay
        justifyContent: "center",
        alignItems: "center",
    },
    // Modal Content
    modalContent: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 16,
        width: Platform.OS === "web" ? "30%" : "85%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
        color: "#2C3E50",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        backgroundColor: "#F0F0F0", // Light gray placeholder
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#34495E",
    },
    profileEmail: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 5,
    },
    profilePhone: {
        fontSize: 14,
        color: "#7F8C8D",
        marginBottom: 20,
    },
    settingsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        backgroundColor: "#2ECC71", // Green for settings
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    settingsButtonText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    logOutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#E74C3C", // Red for logout
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    logOutButtonText: {
        fontSize: 16,
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
    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#A1CEDC",
        borderBottomWidth: 1,
        borderBottomColor: "#CED6E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    iconButton: {
        padding: 8,
    },
    // Footer
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#CED6E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    footerButton: {
        alignItems: "center",
    },
    footerButtonText: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 4,
        color: "#2C3E50",
    },
    // Loading View
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
    },
    loadingText: {
        fontSize: 16,
        color: "#7F8C8D",
    },
});

