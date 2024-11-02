import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import ClientService from '../../Services/ClientService';
import { Link } from "expo-router";

const WalkInClientsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch all clients with pets from the backend on component mount
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

    // Filter clients based on search query
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
                params: { petId, clientId },
            });
        }
    };

    const renderClient = ({ item }) => (
        <View style={styles.clientItem}>
            <Text style={styles.clientText}>Client: {item.firstName} {item.lastName}</Text>
            <Text style={styles.clientText}>Pets:</Text>
            {item.pets.map((pet) => (
                <TouchableOpacity key={pet.id} style={styles.petItem} onPress={() => handlePetPress(pet)}>
                    <Text style={styles.petText}>• {pet.name}</Text>
                </TouchableOpacity>
            ))}

            {/* Link to Add New Pet */}
            <Link href={{ pathname: "/ClientStack/createPetProfile", params: { clientId: item.id } }} asChild>
                <TouchableOpacity style={styles.addPetButton}>
                    <Text style={styles.buttonText}>Add New Pet</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Walk-in Check-in</Text>

            {/* Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search by client or pet name..."
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {/* List of filtered clients with their pets */}
            <FlatList
                data={filteredClients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderClient}
            />

            {/* Modal for Pet Details */}
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

                                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '100%',
    },
    clientItem: {
        backgroundColor: '#E5E5E5',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        width: '100%',
    },
    petItem: {
        paddingLeft: 20,
        marginVertical: 5,
    },
    clientText: {
        fontSize: 16,
        color: 'black',
    },
    petText: {
        fontSize: 14,
        color: 'black',
    },
    addPetButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
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
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default WalkInClientsScreen;
