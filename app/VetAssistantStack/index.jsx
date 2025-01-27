import React, { useState, useEffect } from "react";
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
    StatusBar, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PetService from "../../Services/PetService";
import UserService from "../../Services/UserService";
import { useRouter } from "expo-router";
import DailyChecklistService from "../../Services/DailyChecklistService"; // Import the service

const categories = [
    { id: "1", label: "All", value: "ALL" },
    { id: "2", label: "Inpatient", value: "INPATIENT_CARE" },
    { id: "3", label: "Unclaimed", value: "UNCLAIMED" },
    { id: "4", label: "Abandoned", value: "ABANDONED" },
];

const VetAssistantStack = () => {
    const router = useRouter();
    const [vetAssistantInfo, setVetAssistantInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    Alert.alert("Error", "No email found. Please log in again.");
                }
            } catch (error) {
                Alert.alert("Error", "Failed to retrieve email.");
            }
        };

        const fetchVetAssistantInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email);
                setVetAssistantInfo(data);
            } catch (error) {
                Alert.alert("Error", "Failed to load vet assistant information.");
            }
        };

        fetchEmail();
        fetchVetAssistantInfo();
    }, [email]);

    // Fetch unchecked pets on mount
    useEffect(() => {
        fetchUncheckedPets();
    }, []);

    // const fetchPets = async () => {
    //     try {
    //         const petData = await PetService.getAllPets();
    //         setPets(petData);
    //         setFilteredPets(petData);
    //     } catch (error) {
    //         Alert.alert("Error", "Failed to fetch pets data.");
    //     }
    // };

    const fetchUncheckedPets = async () => {
        try {
            const today = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
            const petData = await DailyChecklistService.getUncheckedPets(today);
            setPets(petData); // Update state with unchecked pets
            setFilteredPets(petData); // Initialize filtered list
        } catch (error) {
            Alert.alert("Error", "Failed to fetch unchecked pets.");
            console.error("Error fetching unchecked pets:", error);
        }
    };

    const filterPetsByCategory = (category) => {
        if (category === "ALL") {
            setFilteredPets(pets);
        } else {
            const filtered = pets.filter((pet) => pet.residencyType === category);
            setFilteredPets(filtered);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = pets.filter(
            (pet) =>
                pet.name.toLowerCase().includes(query.toLowerCase()) ||
                pet.owner?.firstName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPets(filtered);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        filterPetsByCategory(category);
    };

    const handlePetPress = (pet) => {
        setSelectedPet(pet);
        setModalVisible(true);
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
            <StatusBar translucent backgroundColor="transparent" />

            {/* Header Section */}
            {vetAssistantInfo ? (
                <Text style={styles.infoText}>
                    Welcome, {vetAssistantInfo.firstName} {vetAssistantInfo.lastName}!
                </Text>
            ) : (
                <Text style={styles.loadingText}>Loading vet assistant information...</Text>
            )}

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search pets or owners..."
                placeholderTextColor="#7F8C8D" // Gray for placeholder text
                value={searchQuery}
                onChangeText={handleSearch}
                multiline={false} // Prevent dynamic height adjustment
            />

            {/* Categories Section */}
            <View style={styles.categoryContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category.value && styles.selectedCategoryButton,
                        ]}
                        onPress={() => handleCategorySelect(category.value)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === category.value && styles.selectedCategoryText,
                            ]}
                        >
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Pets Section */}
            <FlatList
                data={filteredPets}
                keyExtractor={(item) => item.id}
                renderItem={renderPet}
                numColumns={2}
                ListEmptyComponent={<Text style={styles.noDataText}>No pets found</Text>}
                contentContainerStyle={styles.petListContainer}
            />

            {/* Modal for Pet Details */}
            {selectedPet && (
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType={Platform.OS === 'web' ? 'none' : 'slide'}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        onPressOut={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Pet Details</Text>
                            <Text style={styles.modalText}>Name: {selectedPet.name}</Text>
                            <Text style={styles.modalText}>Type: {selectedPet.type}</Text>
                            <Text style={styles.modalText}>Breed: {selectedPet.breed}</Text>
                            <Text style={styles.modalText}>
                                Birth Date: {selectedPet.birthDate}
                            </Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible(false);
                                    router.push({
                                        pathname: "/VetAssistantStack/DailyChecklist",
                                        params: {
                                            petId: selectedPet.id,
                                            clientId: selectedPet.ownerId,
                                            petName: selectedPet.name,
                                            mode: "create", // Pass update mode
                                        },
                                    });
                                }}
                            >
                                <Text style={styles.buttonText}>View Daily Checklist</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
        padding: 10,
    },
    infoText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
    },
    searchInput: {
        // height: 40, // Fixed height
        borderColor: "#CED6E0", // Light border color
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10, // Padding for horizontal space
        paddingVertical: 10, // Padding for horizontal space
        backgroundColor: "#FFF",
        color: "#000", // Explicit black text color
        // color: "#000", // Explicit black text color
        includeFontPadding: false, // Remove extra padding on Android

        fontSize: 16, // Fixed font size
        lineHeight: 30, // Explicit line height to prevent resizing
        textAlignVertical: "center", // Center text vertically
        // overflow: "hidden", // Prevent content overflow
        marginBottom: 10, // Space below the search bar
    },

    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    categoryButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#D1E1F6",
        marginBottom: 10,
        flexGrow: 1,
        alignItems: "center",
        marginHorizontal: 5,
    },
    selectedCategoryButton: {
        backgroundColor: "#2ECC71",
    },
    categoryText: {
        fontSize: 14,
        color: "#34495E",
    },
    selectedCategoryText: {
        color: "#FFF",
    },
    petListContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    petCard: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        margin: 5,
        alignItems: "center",
        width: "48%",
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    petName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    noDataText: {
        textAlign: "center",
        color: "#7F8C8D",
        fontSize: 16,
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        backgroundColor: "#2ECC71",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "bold",
    },
});

export default VetAssistantStack;
