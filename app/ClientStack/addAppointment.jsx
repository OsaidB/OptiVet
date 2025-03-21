import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import AppointmentService from '../../Services/AppointmentService';
import PetService from '../../Services/PetService';
import UserService from '../../Services/UserService';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AddAppointment() {
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedVet, setSelectedVet] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [vets, setVets] = useState([]);
    const [managers, setManagers] = useState([]);
    const [managersAndVets, setManagersAndVets] = useState([]);
    const [pets, setPets] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [closestSlotHint, setClosestSlotHint] = useState(null);
    const {clientId} = useLocalSearchParams();

    // Fetch pets
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const petData = await PetService.getPetsByOwnerId(clientId);
                const filteredPets = petData
                    .filter(pet => !pet.deleted) // Exclude deleted pets
                    .map(pet => ({
                        ...pet,
                        imageUrl: PetService.serveImage(pet.imageUrl || pet.imageFileName), // Serve the correct image URL
                    }));
                setPets(filteredPets);
            } catch (error) {
                console.error('Error fetching pets:', error);
                Alert.alert('Error', 'Failed to load pets.');
            }
        };
        fetchPets();
    }, [clientId]);

    // Fetch vets
    useEffect(() => {
        const fetchVets = async () => {
            try {
                const managers = await UserService.getUsersByRole("MANAGER");
                const vets = await UserService.getUsersByRole("VET");

                // Combine results and remove duplicates by userId
                const combined = [...new Map([...managers, ...vets].map(user => [user.userId, user])).values()];
                setManagersAndVets(combined);
            } catch (error) {
                console.error('Error fetching vets:', error);
            }
        };
        fetchVets();
    }, [clientId]);

    // Fetch available slots based on selected vet and date
    useEffect(() => {
        if (selectedVet && selectedDate) {
            const fetchAvailableSlots = async () => {
                try {
                    const slotData = await AppointmentService.getAvailableSlots(selectedVet.userId);
                    const filteredSlots = slotData.filter(
                        slot => format(parseISO(slot.appointmentDate), 'yyyy-MM-dd') === selectedDate
                    );
                    setAvailableSlots(filteredSlots);

                    if (filteredSlots.length === 0) {
                        findClosestAvailableSlot(slotData);
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

    const findClosestAvailableSlot = (slotData) => {
        const futureSlots = slotData
            .filter(slot => parseISO(slot.appointmentDate) > new Date())
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

        if (futureSlots.length > 0) {
            const closestSlot = futureSlots[0];
            const hintMessage = `Closest available slot: ${format(parseISO(closestSlot.appointmentDate), 'yyyy-MM-dd')} at ${format(parseISO(closestSlot.appointmentDate), 'h:mm a')}`;
            showAlert(hintMessage);
        } else {
            showAlert('No upcoming slots are available.');
        }
    };

    const showAlert = (message) => {
        if (Platform.OS === 'web') {
            window.alert(message);
        } else {
            Alert.alert('Closest Slot', message, [{ text: 'OK' }]);
        }
    };

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
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
                clientId: clientId,
                petId: selectedPet.id,
                appointmentDate: selectedSlot.appointmentDate,
                duration: selectedSlot.duration,
            });
            if (Platform.OS === 'web') {
                window.alert('Success: Appointment successfully scheduled!');
            }
            Alert.alert('Success', 'Appointment successfully scheduled!');
            resetForm();
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            Alert.alert('Error', 'Failed to schedule appointment');
        }
    };

    const resetForm = () => {
        setSelectedPet(null);
        setSelectedVet(null);
        setSelectedSlot(null);
        setSelectedDate(null);
        setAvailableSlots([]);
    };

    const renderPetItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.petCard, selectedPet?.id === item.id && styles.selectedCard]}
            onPress={() => setSelectedPet(item)}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
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
        <SafeAreaView style={styles.safeArea}>
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
                    data={managersAndVets}
                    horizontal
                    renderItem={renderVetItem}
                    keyExtractor={(item) => item.userId.toString()}
                    showsHorizontalScrollIndicator={false}
                    style={styles.vetList}
                />

                {/* Date Selection */}
                <TouchableOpacity style={styles.button} onPress={() => setShowCalendar(true)}>
                    <Text style={styles.buttonText}>Select a Date</Text>
                </TouchableOpacity>

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
                {selectedDate && availableSlots.length > 0 && (
                    <>
                        <Text style={styles.label}>Available Slots on {selectedDate}</Text>
                            <FlatList
                                data={availableSlots}
                                horizontal
                                renderItem={renderSlotItem}
                                keyExtractor={(item) => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                                style={styles.slotList}
                            />
                    </>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Confirm Appointment</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    container: {
        padding: 12
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    label: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: 'bold',
    },

    petList: {
        marginBottom: 20
    },

    petListContainer: {
        borderWidth: 2, // Outer border width
        borderColor: '#1D3D47', // Border color
        borderRadius: 10, // Rounded corners
        padding: 10, // Space inside the border
        // marginVertical: 5, // Space above and below the list

    },

    vetList: {
        marginBottom: 20
    },

    petCard: {
        width: 150,
        height: 150,
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
        width: 100,
        height: 100,
        borderRadius: 30,
        marginBottom: 8
    },

    petName: {
        fontSize: 18,
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

    vetCard: {
        width: 280,
        padding: 15,
        paddingVertical: 20,
        marginBottom: 15,
        marginHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center'
    },

    vetName: {
        fontSize: 16,
        fontWeight: 'bold'
    },

    vetSpecialty: {
        fontSize: 14,
        color: '#666'
    },

//slotCard: {
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     alignItems: 'center'
//},

    slotText: {
        fontSize: 20,
        paddingHorizontal: 5,
        alignItems: 'center'
    },

//slotList: { paddingHorizontal: 10 },

    button: {
        padding: 15,
        backgroundColor: '#1D3D47',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },

    hintText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10
    }

});
