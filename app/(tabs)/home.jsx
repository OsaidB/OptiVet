import React, { useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const storedRole = await AsyncStorage.getItem('role');
                setRole(storedRole);
            } catch (error) {
                console.error('Error fetching user role from AsyncStorage:', error);
            }
        };

        fetchUserRole();
    }, []);

    const renderRoleButtons = () => {
        if (role === 'ROLE_CLIENT') {
            return (
                <Link href="/ClientStack" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Go to Client Dashboard</Text>
                    </TouchableOpacity>
                </Link>
            );
        }

        if (role === 'ROLE_USER') {
            return (
                <>
                    <Link href="/ManagerStack" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Go to Manager (Veterinarian) Dashboard</Text>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/VetAssistantStack" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Go to Vet Assistant Dashboard</Text>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/SecretaryStack" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Go to Secretary Dashboard</Text>
                        </TouchableOpacity>
                    </Link>
                </>
            );
        }

        return (
            <View>
                <Text style={styles.noAccessText}>No role assigned or authenticated.</Text>
            </View>
        );
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
                <HelloWave />
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Access Role-Based Dashboards</ThemedText>

                {renderRoleButtons()}
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
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5, // Add spacing between buttons
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noAccessText: {
        color: '#FF6347',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
