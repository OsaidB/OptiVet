import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DailyChecklistService from '../../Services/DailyChecklistService';
import PetService from '../../Services/PetService';

const MsgsScreen = () => {
    const [criticalMessages, setCriticalMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCriticalMessages = async () => {
            try {
                const checklists = await DailyChecklistService.getAllDailyChecklists();
                const filteredMessages = checklists.filter(
                    (checklist) => checklist.criticalIssueFlag === true
                );

                // Fetch pet details for each critical checklist entry
                const messagesWithPetInfo = await Promise.all(
                    filteredMessages.map(async (message) => {
                        const pet = await PetService.getPetById(message.petId);
                        return { ...message, pet, done: false }; // Add "done" state initially as false
                    })
                );

                setCriticalMessages(messagesWithPetInfo);
            } catch (error) {
                console.error("Error fetching critical messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCriticalMessages();
    }, []);

    const toggleDoneStatus = (id) => {
        // Toggle the "done" state for the selected message
        setCriticalMessages((prev) =>
            prev.map((message) =>
                message.id === id ? { ...message, done: !message.done } : message
            )
        );
    };

    const handleDeleteMessage = (id) => {
        // Delete the message
        setCriticalMessages((prev) => prev.filter((message) => message.id !== id));
    };

    const renderMessageItem = ({ item }) => (
        <View style={styles.messageContainer}>
            <View style={styles.messageHeader}>
                <Text style={styles.dateText}>Date: {item.date}</Text>
                <View style={styles.actionIcons}>
                    {/* Done Icon */}
                    <TouchableOpacity onPress={() => toggleDoneStatus(item.id)} style={styles.iconButton}>
                        <Ionicons
                            name={item.done ? "checkmark-circle" : "checkmark-circle-outline"}
                            size={24}
                            color={item.done ? "#4CAF50" : "#888"}
                        />
                    </TouchableOpacity>
                    {/* Delete Icon */}
                    <TouchableOpacity onPress={() => handleDeleteMessage(item.id)} style={styles.iconButton}>
                        <Ionicons name="trash-outline" size={24} color="#F44336" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.notesText}>Critical Notes: {item.criticalNotes}</Text>
            {item.pet && (
                <View style={styles.petInfoContainer}>
                    <Text style={styles.petInfoText}>Pet Name: {item.pet.name}</Text>
                    <Text style={styles.petInfoText}>Type: {item.pet.type}</Text>
                    <Text style={styles.petInfoText}>Breed: {item.pet.breed}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Assistant's Critical Messages</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#1D3D47" />
                ) : (
                    <FlatList
                        data={criticalMessages}
                        renderItem={renderMessageItem}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={<Text style={styles.emptyText}>No critical messages found.</Text>}
                    />
                )}
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
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1D3D47',
        textAlign: 'center',
    },
    messageContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    actionIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 10,
    },
    notesText: {
        fontSize: 16,
        color: '#555',
        marginVertical: 10,
    },
    petInfoContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    petInfoText: {
        fontSize: 14,
        color: '#555',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
    },
});

export default MsgsScreen;
