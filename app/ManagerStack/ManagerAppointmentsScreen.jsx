import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from "expo-router";
import AppointmentService from '../../Services/AppointmentService';
import PetService from '../../Services/PetService';
import ClientService from '../../Services/ClientService';

const ManagerAppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchScheduledAppointments = async () => {
            try {
                const vetId = 1; // Update this ID as needed
                const scheduledAppointments = await AppointmentService.getScheduledAppointments(vetId);

                // Fetch pet and client details for each appointment
                const detailedAppointments = await Promise.all(
                    scheduledAppointments.map(async (appointment) => {
                        const petData = await PetService.getPetById(appointment.petId);
                        // const clientData = await ClientService.getClientById(appointment.clientId); // Fetch owner details

                        return {
                            ...appointment,
                            petName: petData?.name || 'Unknown Pet',
                            // ownerName: clientData?.firstName || 'Unknown Owner', // Use the owner's first name
                        };
                    })
                );

                setAppointments(detailedAppointments);
            } catch (error) {
                console.error('Error fetching scheduled appointments:', error);
            }
        };


        fetchScheduledAppointments();
    }, []);

    const handleAppointmentPress = (appointment) => {
        setSelectedAppointment(appointment);
        setModalVisible(true);
    };

    const handleStartMedicalSession = () => {
        if (selectedAppointment) {
            const { petId, clientId } = selectedAppointment;
            setModalVisible(false);
            router.push({
                pathname: '/ManagerStack/MedicalSession',
                params: { petId, clientId },
            });
        }
    };

    const renderAppointment = ({ item }) => (
        <TouchableOpacity onPress={() => handleAppointmentPress(item)}>
            <View style={styles.appointmentItem}>
                <Text style={styles.appointmentText}>Pet: {item.petName}</Text>
                <Text style={styles.appointmentText}>Date: {new Date(item.appointmentDate).toLocaleDateString()}</Text>
                <Text style={styles.appointmentText}>Time: {new Date(item.appointmentDate).toLocaleTimeString()}</Text>
                {/*<Text style={styles.appointmentText}>Owner: {item.ownerName}</Text>*/}
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
                                <Text style={styles.modalText}>Date: {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</Text>
                                <Text style={styles.modalText}>Time: {new Date(selectedAppointment.appointmentDate).toLocaleTimeString()}</Text>
                                {/*<Text style={styles.modalText}>Owner: {selectedAppointment.ownerName}</Text>*/}
                                {/*<Text style={styles.modalText}>Details: {selectedAppointment.details}</Text>*/}

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
