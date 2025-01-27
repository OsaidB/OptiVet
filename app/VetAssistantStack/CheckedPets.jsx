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

const CheckedPets = () => {
    const router = useRouter();
    const [vetAssistantInfo, setVetAssistantInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [checkedPets, setCheckedPets] = useState([]);
    const [filteredCheckedPets, setFilteredCheckedPets] = useState([]);
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

    useEffect(() => {
        fetchCheckedPets();
    }, []);

    // const fetchCheckedPets = async () => {
    //     try {
    //         const petData = await PetService.getAllPets();
    //         // Filter pets that have completed daily checklists
    //         const completedChecklistPets = petData.filter((pet) => pet.dailyChecklist?.completed);
    //         setCheckedPets(completedChecklistPets);
    //         setFilteredCheckedPets(completedChecklistPets);
    //     } catch (error) {
    //         Alert.alert("Error", "Failed to fetch checked pets data.");
    //     }
    // };

    // Fetch checked pets for today
    const fetchCheckedPets = async () => {
        try {
            const today = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
            const petData = await DailyChecklistService.getCheckedPets(today);
            setCheckedPets(petData); // Update state with checked pets
            setFilteredCheckedPets(petData); // Initialize filtered list
        } catch (error) {
            Alert.alert("Error", "Failed to fetch checked pets.");
            console.error("Error fetching checked pets:", error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = checkedPets.filter(
            (pet) =>
                pet.name.toLowerCase().includes(query.toLowerCase()) ||
                pet.owner?.firstName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCheckedPets(filtered);
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

            {/* Pets Section */}
            <FlatList
                data={filteredCheckedPets}
                keyExtractor={(item) => item.id}
                renderItem={renderPet}
                numColumns={2}
                ListEmptyComponent={<Text style={styles.noDataText}>No checked pets found</Text>}
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
                            <Text style={styles.modalText}>
                                Checklist: {selectedPet.dailyChecklist?.notes || "No notes"}
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
                                        },
                                    });
                                }}
                            >
                                <Text style={styles.buttonText}>View Checklist Details</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // Reuse styles from VetAssistantStack/index.jsx
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
        height: 40,
        borderColor: "#CED6E0",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: "#FFF",
        color: "#000",
        fontSize: 16,
        marginBottom: 10,
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

export default CheckedPets;
