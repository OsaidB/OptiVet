import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, RefreshControl } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import PetService from "../../Services/PetService";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function PetProfiles() {
    const { clientId } = useLocalSearchParams();
    const [pets, setPets] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchPets();
    }, [clientId]);

    const fetchPets = async () => {
        try {
            const fetchedPets = await PetService.getPetsByOwnerId(clientId);
            console.log(fetchedPets);
            const petsWithImages = fetchedPets
                .filter(pet => !pet.deleted) // Filter out deleted pets
                .map(pet => ({
                    ...pet,
                    imageUrl: PetService.serveImage(pet.imageUrl || pet.imageFileName),
                }));
            setPets(petsWithImages);
        } catch (error) {
            console.error("Error fetching pets:", error);
            Alert.alert('Error', 'Failed to load pet profiles.');
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true); // Start the refreshing indicator
        await fetchPets(); // Fetch updated pet data
        setRefreshing(false); // Stop the refreshing indicator
    };

    const handleUpdatePet = (pet) => {
        router.push({
            pathname: "../ClientStack/UpdatePetProfile",
            params: {
                petId: pet.id,
                clientId,
                name: pet.name,
                type: pet.type,
                breed: pet.breed,
                birthDate: pet.birthDate,
                medicalHistory: pet.medicalHistory,
                imageUrl: pet.imageUrl,
                residencyType: pet.residencyType,
            },
        });
        fetchPets();
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
                            await PetService.softDeletePet(petId);
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
                                onPress={() => handleUpdatePet(item)}
                            >
                                <FontAwesome name="edit" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.iconButton, styles.deleteButton]}
                                onPress={() => deletePet(item.id)}
                            >
                                <FontAwesome name="trash" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
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
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
