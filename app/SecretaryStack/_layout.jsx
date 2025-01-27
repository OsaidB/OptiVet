import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, Platform } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import CustomToast from '../Toast.config';
import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AuthGuard from "../AuthGuard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../../Services/UserService';
import AuthService from '../../Services/authService';
import DefaultFemaleImage from "../../assets/images/default_female.jpg";

export default function SecretaryStackLayout() {
    const colorScheme = useColorScheme();

    const [secretaryInfo, setSecretaryInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    // Fetch secretary info and email
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

        const fetchSecretaryInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email); // Fetch user by email
                setSecretaryInfo(data);
            } catch (error) {
                console.error("Error fetching secretary info:", error);
                Alert.alert('Error', 'Failed to load secretary information.');
            }
        };

        fetchEmail();
        fetchSecretaryInfo();
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

    if (!secretaryInfo) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading secretary data...</Text>
            </View>
        );
    }

    return (
        <AuthGuard allowedRoles={['SECRETARY']}>
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
                            <Image
                                source={secretaryInfo?.profileImageUrl ? { uri: secretaryInfo.profileImageUrl } : DefaultFemaleImage}
                                style={styles.profileImage}
                            />
                            {secretaryInfo ? (
                                <>
                                    <Text style={styles.profileName}>
                                        {secretaryInfo.firstName} {secretaryInfo.lastName}
                                    </Text>
                                    <Text style={styles.profileEmail}>{secretaryInfo.email}</Text>
                                    <Text style={styles.profilePhone}>
                                        Phone: {secretaryInfo.phoneNumber || "N/A"}
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
                    <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Home')}>
                        <Ionicons name="location-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                        <Text style={styles.footerButtonText}>Home</Text>
                    </TouchableOpacity>
                    <Link href="/SecretaryStack/Products" asChild>
                        <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Products')}>
                            <Ionicons name="cart-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                            <Text style={styles.footerButtonText}>Products</Text>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/SecretaryStack/PetsForAdoption" asChild>
                        <TouchableOpacity style={styles.footerButton}>
                            <Image source={require('../../assets/images/cat (2).png')} style={{ width: '80%', height: 30 }} resizeMode='contain'></Image>
                            <Text style={styles.footerButtonText}>Pets For Adoption</Text>
                        </TouchableOpacity>
                    </Link>

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
    // Header styling
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    iconButton: {
        padding: 5,
    },

    // Footer styling
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 12,
        marginTop: 5,
    },

    // Modal overlay
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
        justifyContent: "center",
        alignItems: "center",
    },
    // Modal content
    modalContent: {
        backgroundColor: "#FFFFFF", // White modal background
        padding: 20,
        borderRadius: 12, // Rounded corners
        width: Platform.OS === 'web' ? '30%' : '80%', // Responsive modal width
        alignItems: "center",
        shadowColor: "#000", // Shadow effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Elevation for Android
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#2C3E50", // Dark text
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
        color: "#2C3E50", // Neutral dark gray
    },
    profileEmail: {
        fontSize: 16,
        color: "#7F8C8D", // Lighter gray
        marginBottom: 5,
    },
    profilePhone: {
        fontSize: 14,
        color: "#7F8C8D", // Neutral gray
    },

    // Settings button
    settingsButton: {
        marginTop: 15,
        backgroundColor: "#3498DB", // Primary blue color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8, // Rounded corners
    },
    settingsButtonText: {
        color: "#FFFFFF", // White text
        fontWeight: "bold",
        textAlign: "center",
    },

    // Logout button
    logOutButton: {
        marginTop: 10,
        backgroundColor: "#E74C3C", // Bright red for logout
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8, // Rounded corners
    },
    logOutButtonText: {
        color: "#FFFFFF", // White text
        fontWeight: "bold",
        textAlign: "center",
    },

    // Close button (top-right of the modal)
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 20,
        color: "#7F8C8D", // Neutral gray text
    },

    // Loading screen
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9', // Light background
    },
    loadingText: {
        fontSize: 16,
        color: '#7F8C8D', // Neutral gray text
    },
});
