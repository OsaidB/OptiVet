import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
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
                        return { ...message, pet };
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

    const renderMessageItem = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.dateText}>Date: {item.date}</Text>
            <Text style={styles.notesText}>Critical Notes: {item.criticalNotes}</Text>
            {item.pet && (
                <>
                    <Text style={styles.petInfoText}>Pet Name: {item.pet.name}</Text>
                    <Text style={styles.petInfoText}>Type: {item.pet.type}</Text>
                    <Text style={styles.petInfoText}>Breed: {item.pet.breed}</Text>
                </>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Critical Messages</Text>
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
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    notesText: {
        fontSize: 16,
        color: '#555',
    },
    petInfoText: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
    },
});

export default MsgsScreen;
