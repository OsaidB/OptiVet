import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import PetService from "../../Services/PetService";

export default function PetProfiles() {
    const [pets, setPets] = useState([]);
    const ownerId = 1; // Replace this with the actual owner ID, e.g., from authentication

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const fetchedPets = await PetService.getPetsByOwnerId(ownerId);
                setPets(fetchedPets);
            } catch (error) {
                console.error("Error fetching pets:", error);
                Alert.alert('Error', 'Failed to load pet profiles.');
            }
        };

        fetchPets();
    }, []);

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
        return ageInMonths >= 12
            ? `${Math.floor(ageInMonths / 12)} years ${ageInMonths % 12} months`
            : `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Pets</Text>

            {/* List of Pet Profiles */}
            <FlatList
                data={pets}
                keyExtractor={(item) => item.id.toString()} // Ensure ID is a string for FlatList
                renderItem={({ item }) => (
                    <View style={styles.petCard}>
                        <Text style={styles.petName}>{item.name}</Text>
                        <Text>Type: {item.type}</Text>
                        <Text>Breed: {item.breed}</Text>
                        <Text>Age: {calculateAge(item.birthDate)}</Text>
                        <Text>Medical History: {item.medicalHistory}</Text>
                    </View>
                )}
            />

            {/* Button to navigate to Create Pet Profile */}
            <Link href="/ClientStack/createPetProfile" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Add New Pet</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    petCard: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
