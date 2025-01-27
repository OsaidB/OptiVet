import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import UserService from '../Services/UserService'; // Import UserService for role fetching if needed

const AuthGuard = ({ children, allowedRoles = [] }) => {
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    console.log("No token found");
                    router.replace(''); // Redirect to login if no token
                    return;
                }

                // Decode the token to get the user's base role
                const base64Payload = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(base64Payload));
                const role = decodedPayload.role;

                let finalRole = role; // Default to the role from the token

                // If the role is ROLE_USER, fetch the detailed employeeRole
                if (role === 'ROLE_USER') {
                    const storedEmployeeRole = await AsyncStorage.getItem('employeeRole');

                    if (!storedEmployeeRole) {
                        // Fetch employee info if not stored
                        try {
                            const storedEmail = await AsyncStorage.getItem('email');
                            if (!storedEmail) {
                                Alert.alert('Error', 'No email found. Please log in again.');
                                router.replace('');
                                return;
                            }

                            const employeeData = await UserService.getUserByEmail(storedEmail);
                            finalRole = employeeData.role; // Get the detailed role
                            await AsyncStorage.setItem('employeeRole', finalRole); // Cache it
                        } catch (error) {
                            console.error('Error fetching employee info:', error);
                            Alert.alert('Error', 'Failed to load employee information.');
                            router.replace('');
                            return;
                        }
                    } else {
                        finalRole = storedEmployeeRole; // Use the cached employee role
                    }
                }

                // Check if the role is allowed
                if (!allowedRoles.length || allowedRoles.includes(finalRole)) {
                    setUserRole(finalRole);
                    setLoading(false); // Allow access
                } else {
                    Alert.alert('Unauthorized', 'You do not have permission to access this page.');
                    console.log("Unauthorized: You do not have permission to access this page.");
                    router.replace(''); // Redirect if role is not allowed
                }
            } catch (error) {
                console.error('Authentication error:', error);
                router.replace(''); // Redirect to login on error
            }
        };

        authenticateUser();
    }, [allowedRoles, router]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return children; // Render the wrapped components
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AuthGuard;
