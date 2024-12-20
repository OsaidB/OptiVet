import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Image,
    Alert,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PetService from '../../Services/PetService';
import UserService from '../../Services/UserService'; // Import the UserService
import { useRouter } from "expo-router";

const categories = [
    { id: '1', label: 'All', value: 'ALL' },
    { id: '2', label: 'Inpatient', value: 'INPATIENT_CARE' },
    { id: '3', label: 'Unclaimed', value: 'UNCLAIMED' },
    { id: '4', label: 'Abandoned', value: 'ABANDONED' },
];

const VetAssistantStack = () => {
    const router = useRouter();
    const [vetAssistantInfo, setVetAssistantInfo] = useState(null); // Store vet assistant details
    const [email, setEmail] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email'); // Fetch stored email
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    console.error("No email found in AsyncStorage");
                    Alert.alert('Error', 'No email found. Please log in again.');
                }
            } catch (error) {
                console.error("Error fetching email from AsyncStorage:", error);
                Alert.alert('Error', 'Failed to retrieve email.');
            }
        };

        const fetchVetAssistantInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email); // Fetch vet assistant by email
                setVetAssistantInfo(data);
            } catch (error) {
                console.error("Error fetching vet assistant info:", error);
                Alert.alert('Error', 'Failed to load vet assistant information.');
            }
        };

        fetchEmail();
        fetchVetAssistantInfo();
    }, [email]);

    useEffect(() => {
        fetchPets();
    }, []);

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

    const fetchPetsByResidency = async (category) => {
        if (category === 'ALL') {
            fetchPets();
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
                source={{ uri: PetService.serveImage(item.imageUrl) }}
                style={styles.petImage}
            />
            <Text style={styles.petName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vet Assistant Dashboard</Text>

            {vetAssistantInfo ? (
                <>
                    {/*<Text>Welcome, {vetAssistantInfo.firstName} {vetAssistantInfo.lastName}!</Text>*/}
                    {/*<Text>Email: {vetAssistantInfo.email}</Text>*/}
                    {/*<Text>Phone: {vetAssistantInfo.phoneNumber}</Text>*/}
                    {/*<Text>ID: {vetAssistantInfo.userId}</Text>*/}
                </>
            ) : (
                <Text>Loading vet assistant information...</Text>
            )}

            <TextInput
                style={styles.searchInput}
                placeholder="Search by pet or owner name..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor={'gray'}
            />

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

            <FlatList
                data={filteredPets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPet}
                ListEmptyComponent={<Text style={styles.noDataText}>No pets found</Text>}
                numColumns={2}
            />

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
        backgroundColor: '#F0F4F8', // Light grayish blue for a soothing background
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2C3E50', // Darker shade for better contrast
    },
    searchInput: {
        height: 45,
        borderColor: '#CED6E0', // Light border color
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    categoryListContainer: {
        marginBottom: Platform.OS === 'web' ? 10 : -160,
        flexDirection: 'row',
    },
    categoryItem: {
        backgroundColor: '#d1e1f6', // Soft blue for unselected categories
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100, // Fixed width for consistent size
        height: 40, // Fixed height for consistent size
    },
    selectedCategoryItem: {
        backgroundColor: '#3498DB', // Accent color for selected categories
    },
    categoryText: {
        fontSize: 14,
        color: '#34495E', // Neutral dark text
    },
    selectedCategoryText: {
        color: '#FFFFFF', // White text for selected categories
        fontWeight: '600',
    },
    petCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 10,
        margin: 8,
        alignItems: 'center',
        width: '45%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
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
        color: '#2C3E50',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2C3E50',
    },
    button: {
        backgroundColor: '#3498DB',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#7F8C8D', // Grayish text for no data
        fontSize: 16,
    },
});



export default VetAssistantStack;
