
import React from 'react';
import { Image, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
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

                {/* Manager (Veterinarian) Role */}
                <Link href="/ManagerStack" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Go to Manager (Veterinarian) Dashboard</Text>
                    </TouchableOpacity>
                </Link>

                {/* Vet Assistant Role */}
                <Link href="/VetAssistantStack" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Go to Vet Assistant Dashboard</Text>
                    </TouchableOpacity>
                </Link>

                {/* Secretary Role */}
                <Link href="/SecretaryStack" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Go to Secretary Dashboard</Text>
                    </TouchableOpacity>
                </Link>

                {/* Client Role */}
                <Link href="/ClientStack" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Go to Client Dashboard</Text>
                    </TouchableOpacity>
                </Link>
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
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});