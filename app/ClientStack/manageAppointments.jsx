import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function ManageAppointments() {
    const [appointments, setAppointments] = useState([
        { id: '1', date: '2024-10-10', time: '10:00 AM', pet: 'Buddy' },
        { id: '2', date: '2024-10-12', time: '2:00 PM', pet: 'Max' },
    ]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Appointments</Text>

            {/* List of Appointments */}
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.appointmentCard}>
                        <Text style={styles.appointmentText}>
                            {item.pet} - {item.date} at {item.time}
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
