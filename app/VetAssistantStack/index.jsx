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
    Picker,
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
    const [newResidencyType, setNewResidencyType] = useState("");

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
        setNewResidencyType(pet.residencyType); // Set initial value
        setModalVisible(true);
    };

    const handleResidencyTypeChange = async () => {
        try {
            // Fetch the current pet data to avoid overwriting other fields
            const petData = await PetService.getPetById(selectedPet.id);

            // Update the residency type
            const updatedPetData = {
                ...petData,
                residencyType: newResidencyType, // Update only the residencyType
            };

            // Send the updated data to the backend
            await PetService.updatePet(selectedPet.id, updatedPetData);

            // Show success message and close modal
            Alert.alert("Success", `Residency Type updated to ${newResidencyType}`);
            setModalVisible(false);

            // Refresh the pets list
            fetchUncheckedPets();
        } catch (error) {
            console.error("Error updating residency type:", error);
            Alert.alert("Error", "Failed to update residency type.");
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
            <StatusBar translucent backgroundColor="transparent" />

            {/* Header Section */}
            {vetAssistantInfo ? (
                <Text style={styles.infoText}>
                    {/*Welcome, {vetAssistantInfo.firstName} {vetAssistantInfo.lastName}!*/}
                </Text>
            ) : (
                <Text style={styles.loadingText}>Loading vet assistant information...</Text>
            )}

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search pets or owners..."
                placeholderTextColor="#7F8C8D"
                value={searchQuery}
                onChangeText={handleSearch}
                multiline={false}
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
                    animationType={Platform.OS === "web" ? "none" : "slide"}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalCard}>
                            {/* Pet Details Section */}
                            <Text style={styles.modalTitle}>Pet Details</Text>
                            <View style={styles.petDetailsCard}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>🐾 Name:</Text>
                                    <Text style={styles.detailValue}>{selectedPet.name}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>📅 Birth Date:</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedPet.birthDate || "Unknown"}
                                    </Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>🦴 Type:</Text>
                                    <Text style={styles.detailValue}>{selectedPet.type}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>🐕 Breed:</Text>
                                    <Text style={styles.detailValue}>{selectedPet.breed}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>🏠 Residency:</Text>
                                    <Text style={styles.detailValue}>{selectedPet.residencyType}</Text>
                                </View>
                            </View>


                            {/* Residency Type Picker Section */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Update Residency Type</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={newResidencyType}
                                        onValueChange={(itemValue) => setNewResidencyType(itemValue)}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Select Residency Type..." value="nothing chosen" /> {/* Placeholder */}
                                        {categories
                                            .filter((category) => category.value !== "ALL")
                                            .map((category) => (
                                                <Picker.Item
                                                    key={category.value}
                                                    label={category.label}
                                                    value={category.value}
                                                />
                                            ))}
                                    </Picker>
                                </View>
                                <TouchableOpacity
                                    style={styles.updateButton}
                                    onPress={handleResidencyTypeChange}
                                >
                                    <Text style={styles.updateButtonText}>Update Residency Type</Text>
                                </TouchableOpacity>
                            </View>


                            {/* View Daily Checklist Button */}
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    router.push({
                                        pathname: "/VetAssistantStack/DailyChecklist",
                                        params: {
                                            petId: selectedPet.id,
                                            clientId: selectedPet.ownerId,
                                            petName: selectedPet.name,
                                            mode: "create", // Pass mode for checklist creation
                                        },
                                    });
                                }}
                            >
                                <Text style={styles.secondaryButtonText}>Fill Checklist of Today</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}




        </View>
    );
};

const styles = StyleSheet.create({

    petDetailsCard: {
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        width: "40%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#34495E",
    },
    detailValue: {
        fontSize: 16,
        color: "#2C3E50",
    },



    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for focus
    },
    modalCard: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 15,
        width: "85%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 15,
        // marginBottom: 10,

    },
    petDetailsContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    petDetail: {
        fontSize: 16,
        color: "#34495E",
        marginVertical: 5,
    },
    section: {
        marginBottom: 20,
        width: "100%",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2ECC71",
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#CED6E0",
        borderRadius: 10,
        backgroundColor: "#F8F9FA",
        marginBottom: 15,
    },
    picker: {
        height: 50,
        color: "#34495E",
    },
    updateButton: {
        backgroundColor: "#2ECC71",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
    },
    updateButtonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "bold",
    },
    secondaryButton: {
        backgroundColor: "#5DADE2",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
    },
    secondaryButtonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "bold",
    },

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
    modalContent: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
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
