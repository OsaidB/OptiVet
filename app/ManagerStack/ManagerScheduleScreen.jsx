import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    ScrollView,
    Modal,
    SafeAreaView
} from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import {addMinutes, format, parseISO} from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppointmentService from '../../Services/AppointmentService';
import {Picker} from "@react-native-picker/picker";
import { Picker as RNPicker } from '@react-native-picker/picker';
import {shadow} from "react-native-paper";
import { useLocalSearchParams } from 'expo-router';


const ManagerScheduleScreen = () => {
    const GAP_BETWEEN_APPOINTMENTS = 5;
    const [selectedDuration, setSelectedDuration] = useState(30);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePickerModal, setShowTimePickerModal] = useState(false);
    const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);
    const [tempSelectedTime, setTempSelectedTime] = useState(selectedTime);
    const [showPickerModal, setShowPickerModal] = useState(false);
    const { userId } = useLocalSearchParams(); // Retrieve userId from params

    //console.log('User ID:', userId);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const slots = await AppointmentService.getAppointmentsByVetId(userId);
                setAvailableSlots(slots);
            } catch (error) {
                console.error('Error fetching available slots:', error);
            }
        };
        fetchSlots();
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

    const handleTimeChangeAndroid = (event, time) => {
        if (time) setSelectedTime(time);
        setShowTimePickerModal(false);
    };

    const handleTimeChangeIOS = (event, time) => {
        if (time) setTempSelectedTime(time);
    };

    const handleDatePickerDone = () => {
        setSelectedDate(tempSelectedDate);
        setShowDatePicker(false);
    };

    const handleTimePickerDone = () => {
        setSelectedTime(tempSelectedTime);
        setShowTimePickerModal(false);
    };

    const handleWebTimeChange = (event) => {
        const [hours, minutes] = event.target.value.split(':');
        const updatedTime = new Date(selectedTime);
        updatedTime.setHours(hours, minutes);
        setSelectedTime(updatedTime);
    };

    // Check for overlapping appointments
    const isOverlapping = (startTime, endTime) => {
        return filteredSlots.some((slot) => {
            const existingStart = parseISO(slot.appointmentDate);
            const existingEnd = new Date(existingStart);
            existingEnd.setMinutes(existingEnd.getMinutes() + slot.duration + GAP_BETWEEN_APPOINTMENTS); // Dynamic duration

            return (
                (startTime >= existingStart && startTime < existingEnd) ||
                (endTime > existingStart && endTime <= existingEnd) ||
                (startTime <= existingStart && endTime >= existingEnd)
            );
        });
    };

    const handleAddAppointment = async () => {
        const formattedTime = format(selectedTime, 'HH:mm');
        const appointmentDateTime = `${selectedDate}T${formattedTime}:00`;

        const newStart = new Date(appointmentDateTime);
        const newEnd = new Date(newStart);
        newEnd.setMinutes(newEnd.getMinutes() + selectedDuration);

        if (isOverlapping(newStart, newEnd)) {
            Alert.alert('Error', 'This time slot overlaps with an existing appointment.');
            return;
        }

        const appointmentData = {
            appointmentDate: appointmentDateTime,
            vetId: userId,
            duration: selectedDuration,
            status: 'AVAILABLE',
        };

        try {
            const newSlot = await AppointmentService.createAppointment(appointmentData);
            Alert.alert('Success', 'Appointment slot saved successfully!');
            setAvailableSlots([...availableSlots, newSlot]);

            const nextTime = new Date(selectedTime);
            nextTime.setMinutes(nextTime.getMinutes() + selectedDuration + GAP_BETWEEN_APPOINTMENTS); // Dynamic gap
            setSelectedTime(nextTime);
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


    const renderPicker = () => {
        if (Platform.OS === 'ios') {
            return (
                <View>
                    {/*Duration Selection */}
                    <View style={styles.iosPickerContainer}>
                        <Text style={[styles.subtitle, { justifyContent:'flex-end' }]}>Select Duration</Text>
                        <Picker
                            selectedValue={selectedDuration}
                            onValueChange={(itemValue) => setSelectedDuration(itemValue)}
                            style={{ color: 'black', height: 50, width: '70%', justifyContent:'flex-start', alignItems: 'center' }}
                            itemStyle={{ color: 'black', height: 50, width: '200%' }}
                        >
                            <Picker.Item label="30 minutes" value={30} />
                            <Picker.Item label="1 hour" value={60} />
                            <Picker.Item label="1.5 hours" value={90} />
                            <Picker.Item label="2 hours" value={120} />
                            <Picker.Item label="2.5 hours" value={150} />
                            <Picker.Item label="3 hours" value={180} />
                        </Picker>
                    </View>
                </View>
            );
        }

        if (Platform.OS === 'android') {
            return (
                <View>
                    {/*Duration Selection */}
                    <View style={styles.iosPickerContainer}>
                        <Text style={styles.subtitle}>Select Duration</Text>
                        <Picker
                            selectedValue={selectedDuration}
                            onValueChange={(itemValue) => setSelectedDuration(itemValue)}
                            style={{ color: 'black', height: 70, width: '130%', justifyContent:'flex-start', backgroundColor:'#f0f0f0'}}
                            itemStyle={{ color: 'black', height: 50, width: '200%' }}
                        >
                            <Picker.Item label="30 minutes" value={30} />
                            <Picker.Item label="1 hour" value={60} />
                            <Picker.Item label="1.5 hours" value={90} />
                            <Picker.Item label="2 hours" value={120} />
                            <Picker.Item label="2.5 hours" value={150} />
                            <Picker.Item label="3 hours" value={180} />
                        </Picker>
                    </View>
                </View>
            );
        }

        // Web Platform
        return (
            <View style={styles.durationPickerContainer}>
                <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(Number(e.target.value))}
                    style={styles.durationWebPicker}
                >
                    <option value={30}>30 minutes Appointment</option>
                    <option value={60}>1 hour Appointment</option>
                    <option value={90}>1.5 hours Appointment</option>
                    <option value={120}>2 hours Appointment</option>
                    <option value={150}>2.5 hours Appointment</option>
                    <option value={180}>3 hours Appointment</option>
                </select>
            </View>
        );
    };

    const formattedDate = new Date(selectedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const renderDialog = () => {
        const renderDatePicker = () => {
            if (Platform.OS === 'ios') {
                return (
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={showDatePicker}
                        onRequestClose={() => setShowDatePicker(false)}
                    >
                        <View style={styles.pickerModalContainer}>
                            <View style={styles.pickerModalContent}>
                                <DateTimePicker
                                    value={new Date(tempSelectedDate)}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, date) => {
                                        if (date) setTempSelectedDate(format(date, 'yyyy-MM-dd'));
                                    }}
                                    textColor="black"
                                />
                                <TouchableOpacity style={styles.pickerCloseButton} onPress={handleDatePickerDone}>
                                    <Text style={styles.pickerCloseButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                );
            }

            if (Platform.OS === 'android') {
                return (
                    showDatePicker && (
                        <DateTimePicker
                            value={new Date(selectedDate)}
                            mode="date"
                            display="calendar"
                            onChange={(event, date) => {
                                if (date) setSelectedDate(format(date, 'yyyy-MM-dd'));
                                setShowDatePicker(false);
                            }}
                        />
                    )
                );
            }
        };

        const renderTimePicker = () => {
            if (Platform.OS === 'ios') {
                return (
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={showTimePickerModal}
                        onRequestClose={() => setShowTimePickerModal(false)}
                    >
                        <View style={styles.pickerModalContainer}>
                            <View style={styles.pickerModalContent}>
                                <DateTimePicker
                                    value={tempSelectedTime}
                                    mode="time"
                                    display="spinner"
                                    is24Hour={true}
                                    onChange={handleTimeChangeIOS}
                                    textColor="black"
                                />
                                <TouchableOpacity style={styles.pickerCloseButton} onPress={handleTimePickerDone}>
                                    <Text style={styles.pickerCloseButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                );
            }

            if (Platform.OS === 'android') {
                return (
                    showTimePickerModal && (
                        <DateTimePicker
                            value={selectedTime}
                            mode="time"
                            is24Hour={true}
                            onChange={handleTimeChangeAndroid}
                        />
                    )
                );
            }

            return (
                <View style={[styles.webPickerContainer, { flexDirection: 'column', alignItems: 'center', gap: 10 }]}>
                    {/* Web Date Picker */}
                    <div style={styles.pickerWebWrapper}>
                        <input
                            id="date-picker"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="date-picker"
                            style={styles.webInput}
                            required
                        />
                    </div>

                    {/*/!* Date Selection *!/*/}
                    {/*<TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>*/}
                    {/*    <Text style={styles.buttonText}>{format(new Date(selectedDate), 'dd MMMM yyyy')}</Text>*/}
                    {/*    <Ionicons name="calendar-outline" size={20} color="#1D3D47" />*/}
                    {/*</TouchableOpacity>*/}

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


                    {/*<View style={[styles.webPickerContainer, { flexDirection: 'column', alignItems: 'center', gap: 10 }]}>*/}
                    {/*    <input*/}
                    {/*        type="time"*/}
                    {/*        value={format(selectedTime, 'HH:mm')}*/}
                    {/*        onChange={handleWebTimeChange}*/}
                    {/*        className="time-picker"*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</View>*/}

                    {/*{showTimePickerModal && (*/}
                    {/*    <DateTimePicker*/}
                    {/*        value={selectedTime}*/}
                    {/*        mode="time"*/}
                    {/*        display={Platform.OS === 'ios' ? 'spinner' : 'default'}*/}
                    {/*        is24Hour={true}*/}
                    {/*        onChange={handleTimeChange}*/}
                    {/*        textColor={'black'}*/}
                    {/*    />*/}
                    {/*)}*/}

                    {/* Web Time Picker */}
                    <div style={styles.pickerWebWrapper}>
                        <input
                            id="time-picker"
                            type="time"
                            value={format(selectedTime, 'HH:mm')}
                            onChange={handleWebTimeChange}
                            className="time-picker"
                            style={styles.webInput}
                            required
                        />
                    </div>
                </View>
            );
        };

        return (
            <Modal
                visible={showAddDialog}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddDialog(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Appointment</Text>

                        {/* Date Selection (Only for Android and iOS) */}
                        {(Platform.OS === 'android' || Platform.OS === 'ios') && (
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                                <Text style={styles.buttonText}>
                                    {format(new Date(selectedDate), 'dd MMMM yyyy')}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color="#1D3D47" />
                            </TouchableOpacity>
                        )}
                        {renderDatePicker()}

                        {/* Time Selection (Only for Android and iOS) */}
                        {(Platform.OS === 'android' || Platform.OS === 'ios') && (
                            <TouchableOpacity onPress={() => setShowTimePickerModal(true)} style={styles.dateButton}>
                                <Text style={styles.buttonText}>{format(selectedTime, 'HH:mm')}</Text>
                                <Ionicons name="time-outline" size={20} color="#1D3D47" />
                            </TouchableOpacity>
                        )}
                        {renderTimePicker()}

                        {renderPicker()}

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
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.monthSelector}>
                    <Text style={styles.monthText}>{format(new Date(selectedDate), 'MMMM yyyy')}</Text>
                    <View style={{ width: 5 }} />
                    <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
                        <Ionicons name="chevron-down" size={24} color="#1D3D47" style={styles.iconStyle} />
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

                <ScrollView
                    style={styles.appointmentsContainer}
                    contentContainerStyle={{ paddingBottom: 80 }} // Add padding to avoid overlap
                >
                    <Text style={styles.subtitle}>{formattedDate} Appointments:</Text>
                    {filteredSlots.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <Ionicons name="calendar-outline" size={64} color="#1D3D47" />
                            <Text style={styles.emptyStateText}>No appointments yet!</Text>
                            <Text style={styles.emptyStateHint}>
                                Tap the "+" button to schedule a new appointment.
                            </Text>
                        </View>
                    ) : (
                        filteredSlots.map((slot, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.appointmentCard, //add0d9
                                    { backgroundColor: index % 2 === 0 ? '#74b3c4' : '#1D3D47' },
                                ]}
                            >
                                <View style={styles.appointmentInfo}>
                                    {/* Time Range */}
                                    <View style={styles.appointmentRow}>
                                        <Ionicons name="time-outline" size={18} color="white" style={styles.iconAStyle} />
                                        <Text style={styles.appointmentTime}>
                                            {` ${format(parseISO(slot.appointmentDate), 'HH:mm')} - ${format(
                                                addMinutes(parseISO(slot.appointmentDate), slot.duration || 30), // Default to 30 minutes if no duration
                                                'HH:mm'
                                            )}`}
                                        </Text>
                                    </View>

                                    {/* Duration */}
                                    <View style={styles.appointmentRow}>
                                        <Ionicons name="hourglass-outline" size={18} color="white" style={styles.iconAStyle} />
                                        <Text style={styles.appointmentTime}>
                                            {slot.duration < 60
                                                ? ` ${slot.duration} minutes`
                                                : ` ${slot.duration / 60 === 1 ? '1 hour' : `${(slot.duration / 60).toFixed(1)} hours`}`}
                                        </Text>
                                    </View>

                                    {/* Status */}
                                    <View style={styles.appointmentRow}>
                                        <Ionicons name="alert-circle-outline" size={18} color="white" style={styles.iconAStyle} />
                                        <Text
                                            style={[
                                                styles.statusText,
                                                {
                                                    backgroundColor:
                                                        slot.status === 'AVAILABLE' ? '#4CAF50' : // Green for available
                                                            slot.status === 'SCHEDULED' ? '#FFC107' : // Yellow for scheduled
                                                                '#F44336', // Red for done
                                                },
                                            ]}
                                        >
                                            {slot.status}
                                        </Text>
                                    </View>
                                </View>
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
        padding: 20,
    },

    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },

    monthText: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    iconStyle:{
        // to do....
    },

    appointmentsContainer: {
        flex: 1,
        marginVertical: 10,
    },

    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },

    emptyStateText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1D3D47',
        marginTop: 10,
    },

    emptyStateHint: {
        fontSize: 16,
        color: '#1D3D47',
        marginTop: 5,
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    appointmentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 5,
        borderRadius: 8,
        marginVertical: 5,
    },

    appointmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5, // Space between rows
    },
    iconAStyle: {
        marginRight: 8, // Space between icon and text
    },
    appointmentInfo: {
        flex: 1, // Ensure info aligns correctly
    },

    appointmentTime: {
        fontWeight:'bold',
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

    webPickerContainer: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        width:'100%',
    },

    pickerWebWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        width: '90%',
        marginBottom: 5,
    },

    webInput: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #ccc',
        fontSize: 14,
        color: '#000000',
        outline: 'none',
        backgroundColor: '#f0f0f0',
        transition: 'border-color 0.3s ease-in-out',
    },

    webInputFocus: {
        borderColor: '#007BFF',
    },

    buttonText: {
        fontSize: 16,
    },

    durationPickerContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },

    iosPickerButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    durationPickerText: {
        fontSize: 14,
        color: '#333',
    },
    // durationPickerModalContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // },
    // durationPickerModalContent: {
    //     backgroundColor: '#fff',
    //     borderRadius: 8,
    //     padding: 20,
    //     width: '80%',
    //     alignItems: 'center',
    // },
    durationCloseButton: {
        marginTop: 15,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 8,
    },
    durationCloseButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    // Android Specific Styles
    durationAndroidPicker: {
        height: 50,
        width: '100%',
        color: '#333',
        backgroundColor: '#f5f5f5',
    },
    // Web Specific Styles
    durationWebPicker: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #ccc',
        backgroundColor:'#f0f0f0',
        fontSize: 14,
        color: '#333',
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

    pickerModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    pickerModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
    },

    pickerCloseButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#1D3D47',
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },

    pickerCloseButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

    statusText: {
        marginTop: 5,
        fontSize: 14,
        color: '#ffffff', // White for contrast
        fontWeight: 'bold',
        backgroundColor: '#FFA500', // Orange for emphasis (you can adjust color based on status)
        padding: 5,
        borderRadius: 5,
        textAlign: 'left',
    },

    iosPickerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    }


});

export default ManagerScheduleScreen;