import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Platform} from 'react-native';
import { Link } from 'expo-router';
import AppointmentService from '../../Services/AppointmentService';
import PetService from '../../Services/PetService';

export default function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const clientId = 1; // Assuming the client ID is 1

    const fetchAppointments = async () => {
        try {
            const appointmentData = await AppointmentService.getAppointmentsByClient(clientId);
            setAppointments(appointmentData);

            // Fetch pet details using PetService
            const petData = await PetService.getPetsByOwnerId(clientId);

            // Convert the array of pets into an object for easier access
            const petMap = {};
            petData.forEach(pet => {
                petMap[pet.id] = { name: pet.name, type: pet.type };
            });
            setPets(petMap);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true); // Start the refreshing indicator
        await fetchAppointments(); // Fetch new data
        setRefreshing(false); // Stop the refreshing indicator
    };

    const handleDeleteAppointment = async (appointmentId) => {
        if (!appointmentId) {
            console.error("Appointment ID is missing");
            return;
        }

        const currentAppointment = appointments.find(appointment => appointment.id === appointmentId);
        if (!currentAppointment) {
            console.error("Appointment not found");
            return;
        }

        const updatedData = {
            appointmentDate: currentAppointment.appointmentDate,
            clientId: null,
            petId: null,
            vetId: currentAppointment.vetId,
            status: 'AVAILABLE',
        };

        try {
            await AppointmentService.updateAppointment(appointmentId, updatedData);
            Alert.alert('Success', 'Appointment deleted successfully.');
            fetchAppointments(); // Refresh appointments list after deletion
        } catch (error) {
            console.error(`Error updating appointment with ID: ${appointmentId}`, error.response?.data || error);
            Alert.alert('Error', 'Failed to update the appointment. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(date);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Appointments</Text>

            {/* List of Appointments with Pull-to-Refresh */}
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.appointmentCard}>
                        <Text style={styles.appointmentText}>
                            Your {pets[item.petId]?.type}, {pets[item.petId] ? pets[item.petId].name : 'Unknown Pet'} - {formatDate(item.appointmentDate)}
                        </Text>

                        {/* Delete Button */}
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteAppointment(item.id)}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            />


            {/* Button to Add a New Appointment */}
            <Link href="/ClientStack/addAppointment" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Add New Appointment</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1D3D47',
        textAlign: 'center',
        marginBottom: 20,
    },
    appointmentCard: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginVertical: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appointmentText: {
        fontSize: 18,
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#FF5252',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        shadowColor: '#FF5252',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 2,
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'center',
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: Platform.OS === 'android' ? 40 : 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});