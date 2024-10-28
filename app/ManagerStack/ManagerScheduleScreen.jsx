import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import AppointmentService from '../../Services/AppointmentService';

const ManagerScheduleScreen = () => {
    const currentDay = new Date();
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);

    const formattedCurrentDay = format(currentDay, 'EEEE - d / MMMM ');

    // Fetch available slots from backend for vetId 1
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const slots = await AppointmentService.getAvailableSlots(1);
                setAvailableSlots(slots);
            } catch (error) {
                console.error('Error fetching available slots:', error);
            }
        };
        fetchAvailableSlots();
    }, []);

    // Handle time change for web and mobile
    const handleTimeChange = (event, time) => {
        if (Platform.OS === 'web') {
            const [hours, minutes] = event.target.value.split(':');
            const timeDate = new Date();
            timeDate.setHours(hours, minutes);
            setSelectedTime(timeDate);
        } else {
            setShowTimePicker(false);
            if (time) {
                setSelectedTime(time);
            }
        }
    };

    // Save appointment slot and call backend to save it
    const saveAppointmentSlot = async () => {
        const formattedDate = format(currentDay, 'yyyy-MM-dd');
        const formattedTime = format(selectedTime, 'HH:mm');
        const appointmentData = {
            appointmentDate: `${formattedDate}T${formattedTime}:00`,
            vetId: 1,
            status: 'AVAILABLE',
        };

        try {
            await AppointmentService.createAppointment(appointmentData);
            Alert.alert('Success', 'Appointment slot saved and published successfully!');
            setAvailableSlots([...availableSlots, appointmentData]);
        } catch (error) {
            console.error('Error saving appointment slot:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to save the appointment slot. Please try again.');
        }
    };

    const updateAppointmentSlot = async () => {
        if (!editingSlotId) return;

        const formattedDate = format(currentDay, 'yyyy-MM-dd');
        const formattedTime = format(selectedTime, 'HH:mm');
        const appointmentData = {
            appointmentDate: `${formattedDate}T${formattedTime}:00`,
        };

        try {
            const updatedSlot = await AppointmentService.updateAppointment(editingSlotId, appointmentData);
            setAvailableSlots(
                availableSlots.map(slot => slot.id === editingSlotId ? updatedSlot : slot)
            );
            Alert.alert('Updated', 'Appointment slot has been updated successfully!');
        } catch (error) {
            console.error(`Error updating appointment with ID: ${editingSlotId}`, error);
            Alert.alert('Error', 'Failed to update the appointment slot. Please try again.');
        } finally {
            setEditingSlotId(null);
            setShowTimePicker(false);
        }
    };

    const deleteAppointmentSlot = async (appointmentId) => {
        try {
            await AppointmentService.deleteAppointment(appointmentId);
            setAvailableSlots(availableSlots.filter(slot => slot.id !== appointmentId));
            Alert.alert('Deleted', 'Appointment slot has been deleted.');
        } catch (error) {
            console.error(`Error deleting appointment with ID: ${appointmentId}`, error);
            Alert.alert('Error', 'Failed to delete the appointment slot. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Your Schedule</Text>
            <Text style={styles.title}>It's {formattedCurrentDay}</Text>

            {Platform.OS === 'web' ? (
                <input
                    type="time"
                    value={format(selectedTime, 'HH:mm')}
                    onChange={handleTimeChange}
                    style={styles.webTimePicker}
                />
            ) : (
                <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.buttonText}>Select your available Time for today</Text>
                </TouchableOpacity>
            )}

            {showTimePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={saveAppointmentSlot}>
                <Text style={styles.saveButtonText}>Save Appointment Slot</Text>
            </TouchableOpacity>

            <View style={styles.appointmentsContainer}>
                <Text style={styles.subtitle}>Scheduled Appointment Slots (Today):</Text>
                {availableSlots.length === 0 ? (
                    <Text>No slots scheduled yet.</Text>
                ) : (
                    availableSlots.map((slot, index) => (
                        <View key={index} style={styles.appointmentCard}>
                            <Text>
                                {format(new Date(slot.appointmentDate), 'yyyy-MM-dd HH:mm')}
                            </Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteAppointmentSlot(slot.id)}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            <Link href="/" asChild>
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back to Dashboard</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    saveButton: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center'
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    appointmentsContainer: {
        marginTop: 30
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    appointmentCard: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 14
    },
    backButton: {
        backgroundColor: '#555',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center'
    },
    backButtonText: {
        color: 'white',
        fontSize: 16
    },
    webTimePicker: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '100%'
    },
});

export default ManagerScheduleScreen;
