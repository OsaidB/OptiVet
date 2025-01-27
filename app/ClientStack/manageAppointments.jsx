import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    SafeAreaView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import AppointmentService from '../../Services/AppointmentService';
import PetService from '../../Services/PetService';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';

export default function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    // const [loading, setLoading] = useState(true);
    const { clientId } = useLocalSearchParams();

    useEffect(() => {
        if (!clientId) {
            console.error("Client ID is missing");
            Alert.alert("Error", "Client ID is required to view appointments.");
            return;
        }
        fetchAppointments();
    }, [clientId]);

    const fetchAppointments = async () => {
        try {
            //setLoading(true);

            // Fetch scheduled appointments
            const appointmentData = await AppointmentService.getScheduledAppointmentsByClient(clientId);
            setAppointments(appointmentData);

            // Fetch pet details by owner
            const petData = await PetService.getPetsByOwnerId(clientId);

            // Map pet data to include the pet's image URL
            const petMap = {};
            petData.forEach((pet) => {
                petMap[pet.id] = {
                    name: pet.name,
                    type: pet.type,
                    imageUrl: PetService.serveImage(pet.imageUrl || pet.imageFileName || ' '), // Generate correct image URL
                };
            });
            setPets(petMap);

            console.log("Appointments fetched:", appointmentData);
            console.log("Pets fetched:", petMap);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            //setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAppointments();
        setRefreshing(false);
    };

    const handleDeleteAppointment = async (appointmentId) => {
        if (!appointmentId) return;

        const currentAppointment = appointments.find((appointment) => appointment.id === appointmentId);
        if (!currentAppointment) return;

        const updatedData = {
            appointmentDate: currentAppointment.appointmentDate,
            duration: currentAppointment.duration,
            clientId: null,
            petId: null,
            vetId: currentAppointment.vetId,
            status: 'AVAILABLE',
        };

        try {
            await AppointmentService.updateAppointment(appointmentId, updatedData);
            Alert.alert('Success', 'Appointment deleted successfully.');
            fetchAppointments();
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

    // if (loading) {
    //     return (
    //         <SafeAreaView style={styles.safeArea}>
    //             <ActivityIndicator size="large" color="#1D3D47" style={{ marginTop: 20 }} />
    //         </SafeAreaView>
    //     );
    // }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Manage Appointments</Text>

                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.appointmentCard}>
                            {/* Pet Image */}
                            {pets[item.petId]?.imageUrl ? (
                                <Image
                                    source={{ uri: pets[item.petId].imageUrl }}
                                    style={styles.petImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text style={styles.noImageText}>No image available</Text>
                            )}

                            {/* Appointment Details */}
                            <View style={styles.cardDetails}>
                                <Text style={styles.petName}>
                                    {pets[item.petId]?.name || 'Unknown Pet'} ({pets[item.petId]?.type || 'Unknown Type'})
                                </Text>
                                <Text style={styles.appointmentDate}>{formatDate(item.appointmentDate)}</Text>
                                <Text style={styles.status}>
                                    Status: <Text style={styles.statusValue}>{item.status}</Text>
                                </Text>
                            </View>

                            {/* Delete Button */}
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteAppointment(item.id)}
                            >
                                <Ionicons name="trash-outline" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                />

                <Link
                    href={{
                        pathname: "/ClientStack/addAppointment",
                        params: { clientId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Add New Appointment</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginVertical: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderColor: '#E0E0E0',
        borderWidth: 1,
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cardDetails: {
        flex: 1,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    appointmentDate: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    status: {
        fontSize: 16,
        marginTop: 5,
        color: '#555',
    },
    statusValue: {
        fontWeight: 'bold',
        color: '#1D3D47',
    },
    deleteButton: {
        backgroundColor: '#FF5252',
        padding: 10,
        borderRadius: 8,
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
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
