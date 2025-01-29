import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';
import ClientService from '../../Services/ClientService';
import { Link, useRouter, useLocalSearchParams } from "expo-router"; // Import useRouter

const WalkInClientsScreen = () => {
    const router = useRouter();
    const { userId } = useLocalSearchParams(); // Retrieve userId from the navigation params
    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientData = await ClientService.getAllClients();
                setClients(clientData);
                setFilteredClients(clientData);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        fetchClients();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = clients.filter(client =>
            `${client.firstName} ${client.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
            client.pets.some(pet => pet.name.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredClients(filtered);
    };

    const handlePetPress = (pet) => {
        setSelectedPet(pet);
        setModalVisible(true);
    };

    const handleStartMedicalSession = () => {
        if (selectedPet) {
            const { id: petId, ownerId: clientId } = selectedPet;
            setModalVisible(false);
            router.push({
                pathname: '/ManagerStack/MedicalSession',
                params: { petId, clientId, userId, returnTo: "WalkInClientsScreen" },
            });
        }
    };

    const renderClient = ({ item }) => (
        <View style={styles.clientItem}>
            <Text style={styles.clientText}>Client: {item.firstName} {item.lastName}</Text>
            <Text style={styles.sectionTitle}>Pets:</Text>
            <View style={styles.petListContainer}>
                {item.pets.map((pet) => (
                    <TouchableOpacity key={pet.id} style={styles.petItem} onPress={() => handlePetPress(pet)}>
                        <Text style={styles.petText}>{pet.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Link href={{ pathname: "/ClientStack/createPetProfile", params: { clientId: item.id } }} asChild>
                <TouchableOpacity style={styles.addPetButton}>
                    <Text style={styles.buttonText}>Add New Pet</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Walk-in Check-in</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by client or pet name..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <FlatList
                    data={filteredClients}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderClient}
                />
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}
                    >
                        <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                            {selectedPet && (
                                <>
                                    <Text style={styles.modalTitle}>Pet Details</Text>
                                    <Text style={styles.modalText}>Name: {selectedPet.name}</Text>
                                    <Text style={styles.modalText}>Type: {selectedPet.type}</Text>
                                    <Text style={styles.modalText}>Breed: {selectedPet.breed}</Text>
                                    <Text style={styles.modalText}>Birth Date: {selectedPet.birthDate}</Text>
                                    <Text style={styles.modalText}>Medical History: {selectedPet.medicalHistory}</Text>

                                    <TouchableOpacity style={styles.button} onPress={handleStartMedicalSession}>
                                        <Text style={styles.buttonText}>Start a Medical Session</Text>
                                    </TouchableOpacity>

                                    <Link href={{ pathname: "../ManagerStack/MedicalHistory", params: { petId: selectedPet.id }, }} asChild>

                                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                            <Text style={styles.buttonText}>Medical History</Text>
                                        </TouchableOpacity>
                                    </Link>

                                    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.buttonText}>Close</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        // backgroundColor:'#B7B5B5FF'
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
        width: '100%',
        backgroundColor: '#f8f8f8',
    },
    clientItem: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginVertical: 5,
    },
    clientText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    petListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    petItem: {
        backgroundColor: '#D3E4F0',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        margin: 5,
        elevation: 1,
    },
    petText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1A374D',
    },
    addPetButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        marginTop: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        marginTop: 10,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
});

export default WalkInClientsScreen;
