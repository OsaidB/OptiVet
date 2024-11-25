import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Alert, Platform } from 'react-native';
import PetService from '../../Services/PetService';
import { useRouter } from "expo-router";

const categories = [
    { id: '1', label: 'All', value: 'ALL' },
    { id: '2', label: 'Inpatient', value: 'INPATIENT_CARE' },
    { id: '3', label: 'Unclaimed', value: 'UNCLAIMED' },
    { id: '4', label: 'Abandoned', value: 'ABANDONED' },
];

const VetAssistantStack = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch all pets on initial mount
    useEffect(() => {
        fetchPets();
    }, []);

    // Fetch all pets
    const fetchPets = async () => {
        try {
            const petData = await PetService.getAllPets();
            setPets(petData);
            setFilteredPets(petData);
        } catch (error) {
            console.error("Error fetching pets:", error);
            Alert.alert("Error", "Failed to fetch pets data");
        }
    };

    // Fetch pets by residency type
    const fetchPetsByResidency = async (category) => {
        if (category === 'ALL') {
            fetchPets(); // Fetch all pets if "All" is selected
        } else {
            try {
                const petsByResidency = await PetService.getPetsByResidency(category);
                setFilteredPets(petsByResidency);
            } catch (error) {
                console.error("Error fetching pets by residency:", error);
                Alert.alert("Error", "Failed to fetch pets by residency type");
            }
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = pets.filter(pet =>
            pet.name.toLowerCase().includes(query.toLowerCase()) ||
            pet.owner?.firstName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPets(filtered);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        fetchPetsByResidency(category);
    };

    const handlePetPress = (pet) => {
        setSelectedPet(pet);
        setModalVisible(true);
    };

    const handleViewChecklist = () => {
        if (selectedPet) {
            const { id: petId, ownerId: clientId, name: petName } = selectedPet;
            setModalVisible(false);
            router.push({
                pathname: '/VetAssistantStack/DailyChecklist',
                params: { petId, clientId, petName },
            });
        }
    };

    const renderPet = ({ item }) => (
        <TouchableOpacity style={styles.petCard} onPress={() => handlePetPress(item)}>
            <Image
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                style={styles.petImage}
            />
            <Text style={styles.petName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vet Assistant Dashboard</Text>

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search by pet or owner name..."
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {/* Category List */}
            <FlatList
                data={categories}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.categoryItem,
                            selectedCategory === item.value && styles.selectedCategoryItem
                        ]}
                        onPress={() => handleCategorySelect(item.value)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === item.value && styles.selectedCategoryText
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryListContainer}
            />

            {/* Pets List */}
            <FlatList
                data={filteredPets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPet}
                ListEmptyComponent={<Text style={styles.noDataText}>No pets found</Text>}
                numColumns={2}
            />

            {/* Modal for Pet Details */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalContainer} onPressOut={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        {selectedPet && (
                            <>
                                <Text style={styles.modalTitle}>Pet Details</Text>
                                <Text>Name: {selectedPet.name}</Text>
                                <Text>Type: {selectedPet.type}</Text>
                                <Text>Breed: {selectedPet.breed}</Text>
                                <Text>Birth Date: {selectedPet.birthDate}</Text>
                                <TouchableOpacity style={styles.button} onPress={handleViewChecklist}>
                                    <Text style={styles.buttonText}>View Daily Checklist</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
    },
    categoryListContainer: {
        marginBottom: 20,
    },
    categoryItem: {
        backgroundColor: '#D3E4F0',
        padding: 10,
        borderRadius: 20,
        marginRight: 8,
    },
    selectedCategoryItem: {
        backgroundColor: '#007BFF',
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
    },
    selectedCategoryText: {
        color: '#fff',
    },
    petCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 8,
        alignItems: 'center',
        width: '45%',
        elevation: 2,
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    petName: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '80%',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 12,
        marginTop: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
});

export default VetAssistantStack;
