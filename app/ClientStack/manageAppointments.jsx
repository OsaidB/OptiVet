import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import AppointmentService from '../../Services/AppointmentService';
import PetService from '../../Services/PetService';

export default function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState({});
    const clientId = 1; // Assuming the client ID is 1

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const appointmentData = await AppointmentService.getAppointmentsByClient(clientId);
                setAppointments(appointmentData);

                // Fetch pet details using PetService
                const petData = await PetService.getPetsByOwnerId(clientId);

                // Convert the array of pets into an object for easier access
                const petMap = {};
                petData.forEach(pet => {
                    petMap[pet.id] = pet.name; // Map pet ID to pet name
                });
                setPets(petMap);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchAppointments();
    }, []);

    const handleDeleteAppointment = async (appointmentId) => {
        if (!appointmentId) {
            console.error("Appointment ID is missing");
            return;
        }

        // Find the current appointment data
        const currentAppointment = appointments.find(appointment => appointment.id === appointmentId);
        if (!currentAppointment) {
            console.error("Appointment not found");
            return;
        }
console.log(currentAppointment);
        // Update only the status to 'AVAILABLE' while retaining clientId and petId
        const updatedData = {
            appointmentDate:currentAppointment.appointmentDate,
            // clientId: currentAppointment.clientId,
            clientId: null,
            // petId: currentAppointment.petId,
            petId: null,
            vetId: currentAppointment.vetId,
            status: 'AVAILABLE',
        };
        console.log(appointmentId);
        console.log("updatedData:",updatedData);

        console.log(`Updating appointment with ID: ${appointmentId}`, updatedData); // Log data before sending

        try {
            const result = await AppointmentService.updateAppointment(appointmentId, updatedData);
            Alert.alert('Success', 'Appointment updated to available successfully.');
            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment.id === appointmentId
                        ? { ...appointment, ...updatedData }
                        : appointment
                )
            );
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

            {/* List of Appointments */}
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.appointmentCard}>
                        <Text style={styles.appointmentText}>
                            {pets[item.petId] ? pets[item.petId] : 'Unknown Pet'} - {formatDate(item.appointmentDate)}
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    appointmentCard: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appointmentText: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
