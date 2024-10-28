import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import AppointmentService from '../../Services/AppointmentService';
import PetService from '../../Services/PetService'; // Import PetService

export default function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState({});
    const clientId = 1; // Assuming the client ID is 1

    useEffect(() => {
        // Fetch appointments and pets when the component mounts
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
    },
    appointmentText: {
        fontSize: 16,
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
