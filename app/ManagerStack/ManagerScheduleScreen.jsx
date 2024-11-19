import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView, Modal, SafeAreaView} from 'react-native';
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
    const [showTimePickerModal, setShowTimePickerModal] = useState(false);

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
        setShowTimePickerModal(false);
    };

    const handleWebTimeChange = (event) => {
        const [hours, minutes] = event.target.value.split(':');
        const updatedTime = new Date(selectedTime);
        updatedTime.setHours(hours, minutes);
        setSelectedTime(updatedTime);
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

    const renderDialog = () => (
        <Modal
            visible={showAddDialog}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowAddDialog(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create Appointment</Text>

                    {/* Date Selection */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.buttonText}>{format(new Date(selectedDate), 'dd MMMM yyyy')}</Text>
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

                    {/* Time Selection */}
                    {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                        <TouchableOpacity onPress={() => setShowTimePickerModal(true)} style={styles.dateButton}>
                            <Text style={styles.buttonText}>{format(selectedTime, 'HH:mm')}</Text>
                            <Ionicons name="time-outline" size={20} color="#1D3D47" />
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.webTimePickerContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                            <input
                                type="time"
                                value={format(selectedTime, 'HH:mm')}
                                onChange={handleWebTimeChange}
                                className="time-picker"
                                required
                            />
                        </View>
                    )}

                    {showTimePickerModal && (
                        <DateTimePicker
                            value={selectedTime}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            is24Hour={true}
                            onChange={handleTimeChange}
                            textColor={'black'}
                        />
                    )}

                    <TouchableOpacity style={styles.saveButton} onPress={handleAddAppointment}>
                        <Text style={styles.saveButtonText}>Add Appointment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddDialog(false)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.monthSelector}>
                    <Text style={styles.monthText}>{format(new Date(selectedDate), 'MMMM yyyy')}</Text>
                    <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
                        <Ionicons name="chevron-down" size={24} color="#1D3D47" />
                    </TouchableOpacity>
                </View>

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

                {renderDialog()}

                <ScrollView style={styles.appointmentsContainer}>
                    <Text style={styles.subtitle}>Appointments on {selectedDate}:</Text>
                    {filteredSlots.length === 0 ? (
                        <Text>No appointments scheduled.</Text>
                    ) : (
                        filteredSlots.map((slot, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.appointmentCard,
                                    { backgroundColor: index % 2 === 0 ? '#add0d9' : '#1D3D47' },
                                ]}
                            >
                                <Text style={styles.appointmentTime}>
                                    {format(parseISO(slot.appointmentDate), 'HH:mm')}
                                </Text>
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

                <TouchableOpacity style={styles.addButton} onPress={() => setShowAddDialog(true)}>
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    monthText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    appointmentsContainer: {
        flex: 1,
        marginVertical: 10,
        marginBottom: 93
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    appointmentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginVertical: 5,
    },
    appointmentTime: {
        fontSize: 16,
        color: '#fff',
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1D3D47',
        marginBottom: Platform.OS === 'android' ? 40 : 0,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#1D3D47',
        borderRadius: 8,
        padding: 12,
        width: '100%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#FF6347',
        fontSize: 16,
    },
});

export default ManagerScheduleScreen;
