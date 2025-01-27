import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserService from '../Services/UserService';
import ParallaxScrollView from '../components/ParallaxScrollView';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { HelloWave } from '../components/HelloWave';

export default function RoleRedirector() {
    const router = useRouter();
    const [role, setRole] = useState(null);
    const [employeeRole, setEmployeeRole] = useState(null);

    useEffect(() => {
        const initializeRole = async () => {
            try {
                const decodedRole = await UserService.getRoleFromToken();
                setRole(decodedRole);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        initializeRole();
    }, []);

    useEffect(() => {
        if (!role) return;

        if (role === 'ROLE_CLIENT') {
            router.replace('/ClientStack');
        } else if (role === 'ROLE_USER') {
            fetchEmployeeInfo();
        }
    }, [role]);

    const fetchEmployeeInfo = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('email');

            if (!storedEmail) {
                Alert.alert('Error', 'No email found. Please log in again.');
                return;
            }

            const employeeData = await UserService.getUserByEmail(storedEmail);
            // Save the employee role in local storage
            await AsyncStorage.setItem('employeeRole', employeeData.role);
            setEmployeeRole(employeeData.role);
        } catch (error) {
            console.error('Error fetching employee info:', error);
            Alert.alert('Error', 'Failed to load employee information.');
        }
    };

    useEffect(() => {
        if (!employeeRole) return;

        switch (employeeRole) {
            case 'VET_ASSISTANT':
                router.replace('/VetAssistantStack');
                break;
            case 'SECRETARY':
                router.replace('/SecretaryStack');
                break;
            case 'MANAGER':
            case 'VET':
                router.replace('/ManagerStack');
                break;
            default:
                Alert.alert('Error', 'No valid role assigned or authenticated.');
        }
    }, [employeeRole]);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
                <HelloWave />
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Loading Dashboard...</ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});