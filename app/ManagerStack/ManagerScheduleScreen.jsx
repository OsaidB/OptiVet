import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppointmentService from '../../Services/AppointmentService';

const ManagerScheduleScreen = () => {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCustomTimePicker, setShowCustomTimePicker] = useState(false);

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

    useEffect(() => {
        const slotsForSelectedDate = availableSlots.filter(slot =>
            format(parseISO(slot.appointmentDate), 'yyyy-MM-dd') === selectedDate
        );
        setFilteredSlots(slotsForSelectedDate);
    }, [availableSlots, selectedDate]);

    const handleDateSelect = (day) => {
        setSelectedDate(day.dateString);
        setShowDatePicker(false);
    };

    const handleTimeChange = (event, time) => {
        if (time) setSelectedTime(time);
    };

    const handleConfirmTime = () => {
        setShowCustomTimePicker(false);
    };

    const handleAddAppointment = async () => {
        const formattedTime = format(selectedTime, 'HH:mm');
        const appointmentDateTime = `${selectedDate}T${formattedTime}:00`;

        const isSlotExisting = filteredSlots.some(slot =>
            format(parseISO(slot.appointmentDate), 'yyyy-MM-dd HH:mm') === `${selectedDate} ${formattedTime}`
        );

        if (isSlotExisting) {
            Alert.alert('Error', 'An appointment slot for this date and time already exists.');
            return;
        }

        const appointmentData = {
            appointmentDate: appointmentDateTime,
            vetId: 1,
            status: 'AVAILABLE',
        };

        try {
            const newSlot = await AppointmentService.createAppointment(appointmentData);
            Alert.alert('Success', 'Appointment slot saved successfully!');
            setAvailableSlots([...availableSlots, newSlot]);
            setShowAddDialog(false);
        } catch (error) {
            console.error('Error saving appointment slot:', error);
            Alert.alert('Error', 'Failed to save the appointment slot. Please try again.');
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
            {/* Month Selector */}
            <View style={styles.monthSelector}>
                <Text style={styles.monthText}>{format(new Date(selectedDate), 'MMMM yyyy')}</Text>
                <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
                    <Ionicons name="chevron-down" size={24} color="#1D3D47" />
                </TouchableOpacity>
            </View>

            {/* Calendar Toggle */}
            {showCalendar && (
                <Calendar
                    current={selectedDate}
                    onDayPress={handleDateSelect}
                    markedDates={{
                        [selectedDate]: { selected: true, marked: true, selectedColor: '#1D3D47' },
                    }}
                    theme={{
                        selectedDayBackgroundColor: '#1D3D47',
                        todayTextColor: '#FF6347',
                        arrowColor: '#1D3D47',
                    }}
                />
            )}

            {/* Appointments Display */}
            <ScrollView style={styles.appointmentsContainer}>
                <Text style={styles.subtitle}>Appointments on {selectedDate}:</Text>
                {filteredSlots.length === 0 ? (
                    <Text>No appointments scheduled.</Text>
                ) : (
                    filteredSlots.map((slot, index) => (
                        <View key={index} style={styles.appointmentCard}>
                            <Text>{format(parseISO(slot.appointmentDate), 'HH:mm')}</Text>
                            {/* Delete Button */}
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteAppointmentSlot(slot.id)}
                            >
                                <Ionicons name="trash-outline" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddDialog(true)}>
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            {/* Add Appointment Dialog */}
            <Modal
                visible={showAddDialog}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddDialog(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Appointment</Text>

                        {/* Date Picker Button with Icon */}
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                            <Text style={styles.buttonText}>
                                {showDatePicker ? 'Select Date' : format(new Date(selectedDate), 'dd MMMM yyyy')}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#1D3D47" />
                        </TouchableOpacity>

                        {showDatePicker && (
                            <Calendar
                                current={selectedDate}
                                onDayPress={handleDateSelect}
                                markedDates={{
                                    [selectedDate]: { selected: true, marked: true, selectedColor: '#1D3D47' },
                                }}
                                theme={{
                                    selectedDayBackgroundColor: '#1D3D47',
                                    todayTextColor: '#FF6347',
                                    arrowColor: '#1D3D47',
                                }}
                            />
                        )}

                        {/* Time Picker Button with Icon */}
                        <TouchableOpacity onPress={() => setShowCustomTimePicker(true)} style={styles.dateButton}>
                            <Text style={styles.buttonText}>
                                {format(selectedTime, 'HH:mm')}
                            </Text>
                            <Ionicons name="time-outline" size={20} color="#1D3D47" />
                        </TouchableOpacity>

                        {showCustomTimePicker && (
                            <DateTimePicker
                                value={selectedTime}
                                mode="time"
                                display="spinner"
                                is24Hour={true}
                                onChange={handleTimeChange}
                                textColor="black"
                                style={{ height: 135 }}
                            />
                        )}

                        {/* Confirm Time Button */}
                        {showCustomTimePicker && (
                            <TouchableOpacity style={styles.confirmTimeButton} onPress={handleConfirmTime}>
                                <Text style={styles.confirmTimeButtonText}>Confirm Time</Text>
                            </TouchableOpacity>
                        )}

                        {/* Add Appointment Button */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddAppointment}>
                            <Text style={styles.saveButtonText}>Add Appointment</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddDialog(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    monthText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    appointmentsContainer: {
        flex: 1,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    appointmentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#add0d9',
        borderRadius: 8,
        marginVertical: 5,

    },
    deleteButton: {
        backgroundColor: '#1D3D47',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#1D3D47',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 40,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    dateButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        color: '#1D3D47',
    },
    confirmTimeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#1D3D47',
        borderRadius: 8,
    },
    confirmTimeButtonText: {
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
        width: '100%',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        alignItems: 'center',
        width: '100%',
    },
    cancelButtonText: {
        color: '#FF6347',
        fontSize: 16,
    },
});

export default ManagerScheduleScreen;
