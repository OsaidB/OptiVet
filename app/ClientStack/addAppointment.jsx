import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AddAppointment() {
    const [selectedPet, setSelectedPet] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [appointmentTime, setAppointmentTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);


    // Example pets list - this would typically come from your state or API
    const pets = [
        { id: '1', name: 'Buddy' },
        { id: '2', name: 'Max' },
        { id: '3', name: 'Bella' },
    ];

    const handleSubmit = () => {
        // Handle appointment submission logic here
        console.log({
            pet: selectedPet,
            date: appointmentDate.toDateString(),
            time: appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        // Clear the input fields
        setSelectedPet('');
        setAppointmentDate(new Date());
        setAppointmentTime(new Date());
    };

    const showDatePickerHandler = () => {
        setShowDatePicker(true);
    };

    const showTimePickerHandler = () => {
        setShowTimePicker(true);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || appointmentDate;
        setShowDatePicker(false);
        setAppointmentDate(currentDate);
    };

    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || appointmentTime;
        setShowTimePicker(false);
        setAppointmentTime(currentTime);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Appointment</Text>

            {/* Dropdown for selecting a pet */}
            <Text style={styles.label}>Select Pet:</Text>
            <Picker
                selectedValue={selectedPet}
                onValueChange={(itemValue) => setSelectedPet(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a pet" value="" />
                {pets.map((pet) => (
                    <Picker.Item key={pet.id} label={pet.name} value={pet.name} />
                ))}
            </Picker>

            {/* Date Picker */}
            <Text style={styles.label}>Appointment Date:</Text>
            {Platform.OS === 'web' ? (
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={appointmentDate.toISOString().split('T')[0]} // Format date for input
                    onChangeText={(text) => setAppointmentDate(new Date(text))}
                />
            ) : (
                <TouchableOpacity style={styles.input} onPress={showDatePickerHandler}>
                    <Text>{appointmentDate.toDateString()}</Text>
                </TouchableOpacity>
            )}
            {showDatePicker && (
                <DateTimePicker
                    value={appointmentDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            {/* Time Picker */}
            <Text style={styles.label}>Appointment Time:</Text>
            {Platform.OS === 'web' ? (
                <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    value={appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    onChangeText={(text) => {
                        const [hour, minute] = text.split(':').map(Number);
                        const newTime = new Date(appointmentTime);
                        newTime.setHours(hour);
                        newTime.setMinutes(minute);
                        setAppointmentTime(newTime);
                    }}
                />
            ) : (
                <TouchableOpacity style={styles.input} onPress={showTimePickerHandler}>
                    <Text>{appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={appointmentTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeTime}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Appointment</Text>
            </TouchableOpacity>

            {/* Link to go back to the Manage Appointments screen */}
            <Link href="/ClientStack/manageAppointments" asChild>
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back to Manage Appointments</Text>
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
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#1D3D47',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 12,
    },
});
