import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ManagerAppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simulate fetching appointments for the logged-in vet
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Replace this URL with your backend endpoint to get vet appointments
                const response = await axios.get('https://your-backend-api.com/vet/appointments');
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const renderAppointment = ({ item }) => (
        <View style={styles.appointmentItem}>
            <Text style={styles.appointmentText}>Pet: {item.petName}</Text>
            <Text style={styles.appointmentText}>Date: {item.date}</Text>
            <Text style={styles.appointmentText}>Time: {item.time}</Text>
            <Text style={styles.appointmentText}>Owner: {item.ownerName}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Appointments</Text>
            {loading ? (
                <Text>Loading appointments...</Text>
            ) : appointments.length > 0 ? (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAppointment}
                />
            ) : (
                <Text>No appointments found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    appointmentItem: {
        backgroundColor: '#E5E5E5',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        width: '100%',
    },
    appointmentText: {
        fontSize: 16,
    },
});

export default ManagerAppointmentsScreen;
