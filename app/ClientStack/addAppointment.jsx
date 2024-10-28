import React, { useState, useEffect } from 'react';
import { View, Text, Picker, StyleSheet, TouchableOpacity } from 'react-native';
import AppointmentService from '../../Services/AppointmentService'; // Import AppointmentService
import PetService from '../../Services/PetService'; // Assuming you have this service
import UserService from '../../Services/UserService';
import axios from "axios"; // Assuming you have this service for vets

export default function AddAppointment() {
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedVet, setSelectedVet] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [vets, setVets] = useState([]);
    const [pets, setPets] = useState([]);

    // Fetch pets for client with ID = 1
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const petData = await PetService.getPetsByOwnerId(1); // Use PetService to fetch pets
                setPets(petData);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };
        fetchPets();
    }, []);

    // Fetch vets
// Fetch vets
    useEffect(() => {
        const fetchVets = async () => {
            try {
                const response = await axios.get('http://192.168.56.1:8080/api/users/roles/MANAGER');
                setVets(response.data);
            } catch (error) {
                console.error('Error fetching vets:', error);
            }
        };
        fetchVets();
    }, []);


    // Fetch available slots for the selected vet
    useEffect(() => {
        if (selectedVet) {
            const fetchAvailableSlots = async () => {
                try {
                    const slotData = await AppointmentService.getAvailableSlots(selectedVet); // Use AppointmentService
                    setAvailableSlots(slotData);
                } catch (error) {
                    console.error('Error fetching available slots:', error);
                    setAvailableSlots([]);
                }
            };
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [selectedVet]);

    const handleSubmit = async () => {
        if (!selectedPet || !selectedVet || !selectedSlot) {
            console.error('All fields must be selected');
            return;
        }

        const selectedSlotObj = availableSlots.find(slot => slot.id === Number(selectedSlot));

        if (!selectedSlotObj || !selectedSlotObj.appointmentDate) {
            console.error('Invalid slot selection');
            return;
        }

        try {
            await AppointmentService.createAppointment({
                status: 'SCHEDULED',
                vetId: selectedVet,
                clientId: 1,
                petId: selectedPet,
                appointmentDate: selectedSlotObj.appointmentDate
            });

            setSelectedPet('');
            setSelectedVet('');
            setSelectedSlot('');
            console.log('Appointment successfully scheduled');
        } catch (error) {
            console.error('Error scheduling appointment:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Appointment</Text>

            {/* Pet Selection */}
            <Text style={styles.label}>Select Pet:</Text>
            <Picker
                selectedValue={selectedPet}
                onValueChange={(itemValue) => setSelectedPet(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a pet" value="" />
                {pets.map((pet) => (
                    <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
                ))}
            </Picker>

            {/* Vet Selection */}
            <Text style={styles.label}>Select Vet:</Text>
            <Picker
                selectedValue={selectedVet}
                onValueChange={(itemValue) => {
                    setSelectedVet(itemValue);
                    setAvailableSlots([]); // Clear slots when changing the vet
                }}
                style={styles.picker}
            >
                <Picker.Item label="Select a vet" value="" />
                {vets.map((vet) => (
                    <Picker.Item key={vet.userId} label={`Dr. ${vet.firstName} ${vet.lastName}`} value={vet.userId} />
                ))}
            </Picker>

            {/* Available Slot Selection */}
            <Text style={styles.label}>Select Available Slot:</Text>
            <Picker
                selectedValue={selectedSlot}
                onValueChange={(itemValue) => setSelectedSlot(itemValue)}
                style={styles.picker}
                enabled={availableSlots.length > 0}
            >
                <Picker.Item label="Select an available slot" value="" />
                {availableSlots.map((slot) => (
                    <Picker.Item key={slot.id} label={`${slot.appointmentDate}`} value={slot.id} />
                ))}
            </Picker>

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Appointment</Text>
            </TouchableOpacity>
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
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 12,
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
});
