import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
    SafeAreaView,
    RefreshControl,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import AppointmentService from '../../Services/AppointmentService';
import PetService from '../../Services/PetService';
import ClientService from '../../Services/ClientService';

const ManagerAppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // 🔹 Added refreshing state
    const router = useRouter();
    const { userId } = useLocalSearchParams(); // Retrieve userId from params

    // 🔹 Initial data fetch
    useEffect(() => {
        if (!userId) {
            console.error("Vet ID is missing");
            Alert.alert("Error", "Vet ID is required to view appointments.");
            return;
        }
        fetchScheduledAppointments();
    }, [userId]);

    // Function to fetch scheduled appointments
    const fetchScheduledAppointments = async () => {
        try {
            setRefreshing(true); // Start refreshing
            const scheduledAppointments = await AppointmentService.getScheduledAppointments(userId);

            // Fetch pet and client details for each appointment
            const detailedAppointments = await Promise.all(
                scheduledAppointments.map(async (appointment) => {
                    const petData = await PetService.getPetById(appointment.petId);
                    const clientData = await ClientService.getClientById(appointment.clientId);

                    return {
                        ...appointment,
                        petName: petData?.name || 'Unknown Pet',
                        petImage: PetService.serveImage(petData?.imageUrl || petData?.imageFileName),
                        firstName: clientData?.firstName || 'Unknown Owner',
                        lastName: clientData?.lastName || 'Unknown Owner',
                    };
                })
            );

            setAppointments(detailedAppointments);
        } catch (error) {
            console.error('Error fetching scheduled appointments:', error);
        } finally {
            setRefreshing(false); // Stop refreshing
        }
    };


    // 🔹 Refresh function
    const onRefresh = () => {
        fetchScheduledAppointments();
    };

    const handleAppointmentPress = (appointment) => {
        setSelectedAppointment(appointment);
        setModalVisible(true);
    };

    const handleStartMedicalSession = () => {
        if (selectedAppointment) {
            let appointmentId = selectedAppointment.id;
            const { petId, clientId } = selectedAppointment;
            setModalVisible(false);
            router.push({
                pathname: '/ManagerStack/MedicalSession',
                params: { petId, clientId, appointmentId, userId, returnTo: "ManagerAppointmentsScreen" },
            });
        }
    };

    const renderAppointment = ({ item }) => (
        <TouchableOpacity onPress={() => handleAppointmentPress(item)}>
            <View style={styles.appointmentItem}>
                <View style={styles.rowContainer}>
                    <View style={styles.imageContainer}>
                        {item.petImage ? (
                            <Image source={{ uri: item.petImage }} style={styles.petImage} resizeMode="cover" />
                        ) : (
                            <Text style={styles.noImageText}>No Image Available</Text>
                        )}
                    </View>

                    <View style={styles.detailsContainer}>
                        <Text style={styles.appointmentText}>Pet Owner: {item.firstName} {item.lastName}</Text>
                        <Text style={styles.appointmentText}>Pet: {item.petName}</Text>
                        <Text style={styles.appointmentText}>
                            Date: {`${new Date(item.appointmentDate).getDate()}/${new Date(item.appointmentDate).getMonth() + 1}/${new Date(item.appointmentDate).getFullYear()}`}
                        </Text>
                        <Text style={styles.appointmentText}>Time: {new Date(item.appointmentDate).toLocaleTimeString()}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Your Appointments</Text>
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAppointment}
                    refreshControl={ // 🔹 Added pull-to-refresh
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007BFF"]} />
                    }
                />

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                        <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                            {selectedAppointment && (
                                <>
                                    <Text style={styles.modalTitle}>Appointment Details</Text>
                                    <Text style={styles.modalText}>Pet: {selectedAppointment.petName}</Text>
                                    <Text style={styles.modalText}>
                                        Date: {`${new Date(selectedAppointment.appointmentDate).getDate()}/${new Date(selectedAppointment.appointmentDate).getMonth() + 1}/${new Date(selectedAppointment.appointmentDate).getFullYear()}`}
                                    </Text>
                                    <Text style={styles.modalText}>Time: {new Date(selectedAppointment.appointmentDate).toLocaleTimeString()}</Text>

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

                <TouchableOpacity style={styles.scheduleButton} onPress={() => router.push({ pathname: '/ManagerStack/ManagerScheduleScreen', params: { userId } })}>
                    <Text style={styles.scheduleButtonText}>Publish Available Slots</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    appointmentItem: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginVertical: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        width: '100%',
    },
    appointmentText: {
        fontSize: 16,
        color: '#444',
        marginBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 25,
        borderRadius: 15,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 15,
    },
    modalText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    imageContainer: {
        marginRight: 15,
    },
    petImage: {
        width: 90,
        height: 90,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
    },
    detailsContainer: {
        flex: 1, // Ensures the details container takes up remaining space
    },

    scheduleButton: {
        marginTop: 10,
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    scheduleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default ManagerAppointmentsScreen;
