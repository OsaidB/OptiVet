import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from "expo-router";

const ManagerAppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            petId: 101, // Add petId here
            ownerId: 201, // Add ownerId here
            petName: 'Buddy',
            date: '2024-10-24',
            time: '10:00 AM',
            ownerName: 'John Doe',
            details: 'General checkup for Buddy. No major health issues expected.',
        },
        {
            id: 2,
            petId: 102,
            ownerId: 202,
            petName: 'Whiskers',
            date: '2024-10-25',
            time: '02:00 PM',
            ownerName: 'Jane Smith',
            details: 'Routine vaccination appointment for Whiskers.',
        },
    ]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    const handleAppointmentPress = (appointment) => {
        setSelectedAppointment(appointment);
        setModalVisible(true);
    };

    // Pass petId and ownerId as route parameters to MedicalSession screen
    const handleStartMedicalSession = () => {
        if (selectedAppointment) {
            const { petId, ownerId } = selectedAppointment;
            setModalVisible(false);
            router.push({
                pathname: '/ManagerStack/MedicalSession',
                params: { petId, ownerId },
            });
        }
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
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAppointment}
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
                        {selectedAppointment && (
                            <>
                                <Text style={styles.modalTitle}>Appointment Details</Text>
                                <Text style={styles.modalText}>Pet: {selectedAppointment.petName}</Text>
                                <Text style={styles.modalText}>Date: {selectedAppointment.date}</Text>
                                <Text style={styles.modalText}>Time: {selectedAppointment.time}</Text>
                                <Text style={styles.modalText}>Owner: {selectedAppointment.ownerName}</Text>
                                <Text style={styles.modalText}>Details: {selectedAppointment.details}</Text>

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

export default ManagerAppointmentsScreen;
