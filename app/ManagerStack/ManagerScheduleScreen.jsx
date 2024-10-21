import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Link } from 'expo-router';

const ManagerScheduleScreen = () => {
    // Automatically set the date to the current day
    const currentDay = new Date();
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Format the current day and date
    // const formattedCurrentDay = format(currentDay, 'EEEE, MMMM do'); // Example: Monday, October 21, 2024
    const formattedCurrentDay = format(currentDay, 'EEEE - d / MMMM ');
    // Prepopulate with 3 dummy appointments for the current day
    const [appointments, setAppointments] = useState([
        { id: '1', date: format(currentDay, 'yyyy-MM-dd'), time: '10:00' },
        { id: '2', date: format(currentDay, 'yyyy-MM-dd'), time: '14:00' },
        { id: '3', date: format(currentDay, 'yyyy-MM-dd'), time: '16:30' }
    ]);

    // Handling time change for web and mobile
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

    const saveAppointmentSlot = () => {
        const formattedDate = format(currentDay, 'yyyy-MM-dd'); // Always set to today's date
        const formattedTime = format(selectedTime, 'HH:mm');

        const newAppointment = {
            id: Math.random().toString(),
            date: formattedDate,
            time: formattedTime,
        };

        setAppointments([...appointments, newAppointment]);
        Alert.alert('Success', 'Appointment slot saved successfully!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Your Schedule</Text>
            {/* Display current day and date */}
            <Text style={styles.title}> its {formattedCurrentDay}</Text>

            {/* Time Picker for Web or Mobile */}
            {Platform.OS === 'web' ? (
                <input
                    type="time"
                    value={format(selectedTime, 'HH:mm')}
                    onChange={handleTimeChange}
                    style={styles.webTimePicker}
                />
            ) : (
                <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
                    {/*<Text style={styles.buttonText}>Select Time: {format(selectedTime, 'HH:mm')}</Text>*/}
                    <Text style={styles.buttonText}>Select your available Time for today</Text>
                </TouchableOpacity>
            )}

            {/* Show DateTimePicker on Mobile */}
            {showTimePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            {/* Save Appointment Slot Button */}
            <TouchableOpacity style={styles.saveButton} onPress={saveAppointmentSlot}>
                <Text style={styles.saveButtonText}>Save Appointment Slot</Text>
            </TouchableOpacity>

            {/* List of Scheduled Appointment Slots */}
            <View style={styles.appointmentsContainer}>
                <Text style={styles.subtitle}>Scheduled Appointment Slots (Today):</Text>
                {appointments.length === 0 ? (
                    <Text>No slots scheduled yet.</Text>
                ) : (
                    appointments.map((appointment) => (
                        <View key={appointment.id} style={styles.appointmentCard}>
                            <Text>{appointment.date} - {appointment.time}</Text>
                        </View>
                    ))
                )}
            </View>

            {/* Navigation Link */}
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
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    appointmentsContainer: {
        marginTop: 30,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    appointmentCard: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 5,
    },
    backButton: {
        backgroundColor: '#555',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
    },
    webTimePicker: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '100%',
    },
});

export default ManagerScheduleScreen;
