import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { Link, useRouter } from "expo-router";

const ManagerAppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            petName: 'Buddy',
            date: '2024-10-24',
            time: '10:00 AM',
            ownerName: 'John Doe',
            details: 'General checkup for Buddy. No major health issues expected.',
        },
        {
            id: 2,
            petName: 'Whiskers',
            date: '2024-10-25',
            time: '02:00 PM',
            ownerName: 'Jane Smith',
            details: 'Routine vaccination appointment for Whiskers.',
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null); // For selected appointment
    const [modalVisible, setModalVisible] = useState(false); // For controlling modal visibility
    const router = useRouter(); // Use the router to navigate programmatically

    // Handle appointment click to show modal
    const handleAppointmentPress = (appointment) => {
        setSelectedAppointment(appointment); // Set the clicked appointment
        setModalVisible(true); // Open the modal
    };

    // Close modal and navigate to MedicalSession screen
    const handleStartMedicalSession = () => {
        setModalVisible(false); // Close the modal
        router.push('/ManagerStack/MedicalSession'); // Navigate to MedicalSession
    };

    const renderAppointment = ({ item }) => (
        <TouchableOpacity onPress={() => handleAppointmentPress(item)}>
            <View style={styles.appointmentItem}>
                <Text style={styles.appointmentText}>Pet: {item.petName}</Text>
                <Text style={styles.appointmentText}>Date: {item.date}</Text>
                <Text style={styles.appointmentText}>Time: {item.time}</Text>
                <Text style={styles.appointmentText}>Owner: {item.ownerName}</Text>
            </View>
        </TouchableOpacity>
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

            {/* Modal for displaying detailed appointment info */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                {/* TouchableOpacity to close the modal when pressing outside */}
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1} // Prevents the background from being clickable
                    onPressOut={() => setModalVisible(false)} // Closes modal when pressing outside
                >
                    {/* Inner TouchableOpacity to prevent modal content from closing */}
                    <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                        {selectedAppointment && (
                            <>
                                <Text style={styles.modalTitle}>Appointment Details</Text>
                                <Text style={styles.modalText}>Pet: {selectedAppointment.petName}</Text>
                                <Text style={styles.modalText}>Date: {selectedAppointment.date}</Text>
                                <Text style={styles.modalText}>Time: {selectedAppointment.time}</Text>
                                <Text style={styles.modalText}>Owner: {selectedAppointment.ownerName}</Text>
                                <Text style={styles.modalText}>Details: {selectedAppointment.details}</Text>

                                {/* Link to Start a Medical Session */}
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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

export default ManagerAppointmentsScreen;
