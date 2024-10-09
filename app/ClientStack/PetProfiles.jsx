import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function PetProfiles() {
    const [pets, setPets] = useState([
        { id: '1', name: 'Buddy', age: 3, breed: 'Golden Retriever' },
        { id: '2', name: 'Max', age: 2, breed: 'Bulldog' },
    ]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Pets</Text>

            {/* List of Pet Profiles */}
            <FlatList
                data={pets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.petCard}>
                        <Text style={styles.petName}>{item.name}</Text>
                        <Text>Age: {item.age}</Text>
                        <Text>Breed: {item.breed}</Text>
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
