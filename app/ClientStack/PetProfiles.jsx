import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import PetService from "../../Services/PetService";
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function PetProfiles() {
    const { clientId } = useLocalSearchParams();
    const [pets, setPets] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetchPets();
    }, [clientId]);

    const fetchPets = async () => {
        try {
            const fetchedPets = await PetService.getPetsByOwnerId(clientId);
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

    const deletePet = async (petId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this pet?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await PetService.deletePet(petId);
                            Alert.alert("Success", "Pet deleted successfully.");
                            fetchPets(); // Refresh the pet list
                        } catch (error) {
                            console.error("Error deleting pet:", error);
                            Alert.alert("Error", "Failed to delete the pet.");
                        }
                    },
                },
            ]
        );
    };

    // const navigateToUpdatePet = (pet) => {
    //     router.push({
    //         pathname: "../ClientStack/UpdatePetProfile",
    //         params: { ...pet, clientId },
    //     });
    // };

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
            <FlatList
                data={pets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.petCard}>
                        {item.imageUrl ? (
                            <Image source={{ uri: item.imageUrl }} style={styles.petImage} resizeMode="cover" />
                        ) : (
                            <Text>No image available</Text>
                        )}
                        <Text style={styles.petName}>{item.name}</Text>
                        <Text>Type: {item.type}</Text>
                        <Text>Breed: {item.breed}</Text>
                        <Text>Age: {calculateAge(item.birthDate)}</Text>
                        <Text>Medical History: {item.medicalHistory}</Text>
                        <Link onPress={() => { (item.id) }} href={{ pathname: "../../ClientStack/MedicalHistory", params: { petId: item.id }, }} asChild>
                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.buttonText}>Medical History</Text>
                            </TouchableOpacity>
                        </Link>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.iconButton, styles.updateButton]}
                                onPress={() => router.push({
                                    pathname: "../ClientStack/UpdatePetProfile",
                                    params: { petId: item.id, clientId, name: item.name, type: item.type, breed: item.breed, birthDate: item.birthDate, medicalHistory: item.medicalHistory, imageUrl: item.imageUrl, residencyType: item.residencyType }
                                })}
                            >
                                <View>
                                    {/*<Icon name="edit" size={24} color="white" />*/}
                                    <FontAwesome name="edit" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.iconButton, styles.deleteButton]}
                                onPress={() => deletePet(item.id)}
                            >
                                <View>
                                    {/*<Icon name="delete" size={24} color="white" />*/}
                                    <FontAwesome name="trash" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/*<Link onPress={() => { (item.id) }} href={{ pathname: "../../ClientStack/MedicalHistory", params: { petId: item.id }, }} asChild>*/}
                        {/*    <TouchableOpacity style={styles.addButton}>*/}
                        {/*        <Text style={styles.buttonText}>Medical History</Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*</Link>*/}
                    </View>
                )}
            />
            <Link href={{ pathname: "/ClientStack/createPetProfile", params: { clientId } }} asChild>
                <TouchableOpacity style={styles.addButton}>
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
        alignItems: 'center',
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    addButton: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    updateButton: {
        backgroundColor: '#4CAF50', // Green for update
    },
    deleteButton: {
        backgroundColor: '#F44336', // Red for delete
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
