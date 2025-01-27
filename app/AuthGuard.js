import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import UserService from '../Services/UserService';

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
                    router.replace('');
                    return;
                }

                let decodedPayload;
                try {
                    const base64Payload = token.split('.')[1];
                    decodedPayload = JSON.parse(atob(base64Payload));
                } catch (error) {
                    console.error("Invalid token format:", error);
                    router.replace('');
                    return;
                }

                const role = decodedPayload.role || '';
                let finalRole = role;

                if (role === 'ROLE_USER') {
                    const storedEmployeeRole = await AsyncStorage.getItem('employeeRole');
                    if (!storedEmployeeRole) {
                        const storedEmail = await AsyncStorage.getItem('email');
                        if (!storedEmail) {
                            Alert.alert('Error', 'No email found. Please log in again.');
                            router.replace('');
                            return;
                        }

                        try {
                            const employeeData = await UserService.getUserByEmail(storedEmail);
                            finalRole = employeeData.role || '';
                            await AsyncStorage.setItem('employeeRole', finalRole);
                        } catch (error) {
                            console.error('Error fetching employee info:', error);
                            Alert.alert('Error', 'Failed to load employee information.');
                            router.replace('');
                            return;
                        }
                    } else {
                        finalRole = storedEmployeeRole;
                    }
                }

                if (!allowedRoles.length || allowedRoles.includes(finalRole)) {
                    setUserRole(finalRole);
                    setLoading(false);
                } else {
                    Alert.alert('Unauthorized', 'You do not have permission to access this page.');
                    router.replace('');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                router.replace('');
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

    return (
        <View style={{ flex: 1 }}>
            {React.Children.map(children, (child) => {
                if (typeof child === 'string') {
                    console.warn('Removed invalid child:', child); // Log invalid child
                    return null;
                }
                return child;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AuthGuard;
