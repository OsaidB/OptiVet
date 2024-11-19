import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Platform} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import PetService from "../../Services/PetService";

export default function PetProfiles() {
    const { clientId } = useLocalSearchParams(); // Retrieve clientId dynamically
    const [pets, setPets] = useState([]);
    // const ownerId = 1; // Replace this with the actual owner ID, e.g., from authentication

    // // const BASE_URL = 'http://192.168.1.51:8080/api/pets'; //Osaid
    // const BASE_URL = 'http://192.168.56.1:8080/api/pets'; //murrar


    useEffect(() => {
        const fetchPets = async () => {
            try {
                const fetchedPets = await PetService.getPetsByOwnerId(clientId);

                // Map pets to ensure the image URL is constructed properly
                const petsWithImages = fetchedPets.map((pet) => ({
                    ...pet,
                    imageUrl: PetService.serveImage(pet.imageUrl || pet.imageFileName),
                }));

                setPets(petsWithImages);
            } catch (error) {
                console.error("Error fetching pets:", error);
                Alert.alert('Error', 'Failed to load pet profiles.');
            }
        };

        fetchPets();
    }, [clientId]);

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
                        {/* Display pet image if available */}
                        {item.imageUrl ? (
                            <Image
                                source={{ uri: item.imageUrl }} // Use the full image URL
                                style={styles.petImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text>No image available</Text>
                        )}
                        <Text style={styles.petName}>{item.name}</Text>
                        <Text>Type: {item.type}</Text>
                        <Text>Breed: {item.breed}</Text>
                        <Text>Age: {calculateAge(item.birthDate)}</Text>
                        <Text>Medical History: {item.medicalHistory}</Text>

                        <Link href="../ClientStack/MedicalHistory" asChild>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Medical History</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                )}
            />

            {/* Button to navigate to Create Pet Profile with clientId */}
            <Link href={{ pathname: "/ClientStack/createPetProfile", params: { clientId } }} asChild>
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
        alignItems: 'center', // Center content
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Make the image circular
        marginBottom: 10,
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
        marginBottom: Platform.OS === 'android' ? 40 : 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
