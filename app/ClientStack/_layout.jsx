import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClientService from '../../Services/ClientService';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import CustomToast from '../Toast.config';

export default function ClientStackLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    const [clientInfo, setClientInfo] = useState(null);
    const [email, setEmail] = useState(null);

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
                <TouchableOpacity onPress={() => console.log('Back pressed')} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🐾OptiVet</Text>
                <TouchableOpacity onPress={() => console.log('Profile pressed')} style={styles.iconButton}>
                    <Ionicons name="person-circle" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

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
    loadingText: {
        fontSize: 16,
        color: '#7F8C8D', // Neutral gray
    },
});
