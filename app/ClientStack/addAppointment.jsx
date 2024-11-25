import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { format, parseISO, addDays } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import AppointmentService from '../../Services/AppointmentService';
import PetService from '../../Services/PetService';
import UserService from '../../Services/UserService';

export default function AddAppointment() {
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedVet, setSelectedVet] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [vets, setVets] = useState([]);
    const [pets, setPets] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [closestSlotHint, setClosestSlotHint] = useState(null);

    // Fetch pets
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const petData = await PetService.getPetsByOwnerId(1);
                setPets(petData);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };
        fetchPets();
    }, []);

    // Fetch vets
    useEffect(() => {
        const fetchVets = async () => {
            try {
                const vetsData = await UserService.fetchVets();
                setVets(vetsData);
            } catch (error) {
                console.error('Error fetching vets:', error);
            }
        };
        fetchVets();
    }, []);

    // Fetch available slots based on selected vet and date
    useEffect(() => {
        if (selectedVet && selectedDate) {
            const fetchAvailableSlots = async () => {
                try {
                    const slotData = await AppointmentService.getAvailableSlots(selectedVet.userId);
                    const filteredSlots = slotData.filter(slot =>
                        format(parseISO(slot.appointmentDate), 'yyyy-MM-dd') === selectedDate
                    );
                    setAvailableSlots(filteredSlots);

                    if (filteredSlots.length === 0) {
                        findClosestAvailableSlot(slotData);
                    } else {
                        setClosestSlotHint(null);
                    }
                } catch (error) {
                    console.error('Error fetching available slots:', error);
                    setAvailableSlots([]);
                }
            };
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [selectedVet, selectedDate]);

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
    };

    const findClosestAvailableSlot = (slotData) => {
        const futureSlots = slotData.filter(slot =>
            parseISO(slot.appointmentDate) > new Date()
        ).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

        if (futureSlots.length > 0) {
            const closestSlot = futureSlots[0];
            setClosestSlotHint(`Closest available slot: ${format(parseISO(closestSlot.appointmentDate), 'yyyy-MM-dd')} at ${format(parseISO(closestSlot.appointmentDate), 'h:mm a')}`);

        } else {
            setClosestSlotHint('No upcoming slots are available.');
        }
    };

    const handleSubmit = async () => {
        if (!selectedPet || !selectedVet || !selectedSlot) {
            Alert.alert('Error', 'Please select all fields');
            return;
        }

        try {
            await AppointmentService.updateAppointment(selectedSlot.id, {
                status: 'SCHEDULED',
                vetId: selectedVet.userId,
                clientId: 1,
                petId: selectedPet.id,
                appointmentDate: selectedSlot.appointmentDate
            });
            Alert.alert('Success', 'Appointment successfully scheduled!');
            resetForm();
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            Alert.alert('Error', 'Failed to schedule appointment');
        }
    };

    // Function to reset the form and refresh the state
    const resetForm = () => {
        setSelectedPet(null);
        setSelectedVet(null);
        setSelectedSlot(null);
        setSelectedDate(null);
        setAvailableSlots([]);
        setClosestSlotHint(null);
    };

    const renderPetItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.petCard, selectedPet?.id === item.id && styles.selectedCard]}
            onPress={() => setSelectedPet(item)}
        >
            <Image source={{ uri: item.petId }} style={styles.petImage} />
            <Text style={styles.petName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderVetItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.vetCard, selectedVet?.userId === item.userId && styles.selectedCard]}
            onPress={() => setSelectedVet(item)}
        >
            <Text style={styles.vetName}>Dr. {item.firstName} {item.lastName}</Text>
            <Text style={styles.vetSpecialty}>{item.specialty}</Text>
        </TouchableOpacity>
    );

    const renderSlotItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.slotCard, selectedSlot?.id === item.id && styles.selectedCard]}
            onPress={() => setSelectedSlot(item)}
        >
            <Text style={styles.slotText}>{format(parseISO(item.appointmentDate), 'h:mm a')}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add Appointment</Text>

            {/* Pet Selection */}
            <Text style={styles.label}>Select Your Pet</Text>
            <FlatList
                data={pets}
                horizontal
                renderItem={renderPetItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                style={styles.petList}
            />

            {/* Vet Selection */}
            <Text style={styles.label}>Select a Vet</Text>
            <FlatList
                data={vets}
                horizontal
                renderItem={renderVetItem}
                keyExtractor={(item) => item.userId.toString()}
                showsHorizontalScrollIndicator={false}
                style={styles.vetList}
            />

            {/* Date Selection Button */}
            <TouchableOpacity style={styles.button} onPress={() => setShowCalendar(true)}>
                <Text style={styles.buttonText}>Select a Date</Text>
            </TouchableOpacity>

            {/* Calendar for Date Selection */}
            {showCalendar && (
                <Calendar
                    onDayPress={(day) => handleDateSelection(day.dateString)}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: '#1D3D47' },
                    }}
                    theme={{
                        todayTextColor: '#00adf5',
                        selectedDayBackgroundColor: '#1D3D47',
                    }}
                />
            )}

            {/* Time Slot Selection */}
            {selectedDate && (
                <>
                    <Text style={styles.label}>Available Slots on {selectedDate}</Text>
                    {availableSlots.length > 0 ? (
                        <FlatList
                            data={availableSlots}
                            horizontal
                            renderItem={renderSlotItem}
                            keyExtractor={(item) => item.id.toString()}
                            showsHorizontalScrollIndicator={false}
                            style={styles.slotList}
                        />
                    ) : (
                        <Text style={styles.hintText}>{closestSlotHint || "No available slots found."}</Text>
                    )}
                </>
            )}

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Confirm Appointment</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    label: {
        fontSize: 18,
        marginVertical: 10
    },

    petList: {
        marginBottom: 20
    },

    vetList: {
        marginBottom: 20
    },

    petCard: {
        width: 120,
        padding: 10,
        marginRight: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1
    },

    selectedCard: {
        backgroundColor: '#D3F9D8'
    },

    petImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8
    },

    petName: {
        fontSize: 14,
        fontWeight: 'bold'
    },


    slotCard: {
        padding: 15,
        marginBottom: 10,
        marginRight: 10, // Add space between slot cards
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    slotList: {
        paddingHorizontal: 15,
    },

    vetCard: { width: 280, padding: 15, paddingVertical: 20, marginBottom: 15, marginHorizontal: 10, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
    vetName: { fontSize: 16, fontWeight: 'bold' },
    vetSpecialty: { fontSize: 14, color: '#666' },
    //slotCard: { padding: 15, marginBottom: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
    slotText: { fontSize: 20, paddingHorizontal: 5, alignItems: 'center' },
    //slotList: {paddingHorizontal:10},
    button: { padding: 15, backgroundColor: '#1D3D47', alignItems: 'center', borderRadius: 10, marginTop: 20 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    hintText: { fontSize: 14, color: '#888', textAlign: 'center', marginVertical: 10 },
});
