import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import * as SplashScreen from "expo-splash-screen";
import {useFonts} from "expo-font";
import PetService from "../../Services/PetService";

export default function CreatePetProfile() {
    const [petType, setPetType] = useState('');
    const [petName, setPetName] = useState('');
    const [petAgeMonths, setPetAgeMonths] = useState(0);
    const [petBreed, setPetBreed] = useState('');
    const [petMedicalHistory, setPetMedicalHistory] = useState('');

    const [owner, setOwner] = useState({
        email: "o.osaidb2015@gmail.com",
        password: "0000",
        firstName: "Osaid",
        lastName: "Baba",
        phoneNumber: "0598786818",
        dateOfBirth: "2000-12-12"
    });

    SplashScreen.preventAutoHideAsync();
    const [loaded] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const petData = {
        Dog: [
            {label: 'Select a breed', value: 'Select a breed'},
            {label: 'Golden Retriever', value: 'Golden Retriever'},
            {label: 'Bulldog', value: 'Bulldog'},
            {label: 'Beagle', value: 'Beagle'},
            {label: 'Poodle', value: 'Poodle'},
        ],
        Cat: [
            {label: 'Select a breed', value: 'Select a breed'},
            {label: 'Persian', value: 'Persian'},
            {label: 'Siamese', value: 'Siamese'},
            {label: 'Maine Coon', value: 'Maine Coon'},
            {label: 'Bengal', value: 'Bengal'},
        ],
        Bird: [
            {label: 'Select a breed', value: 'Select a breed'},
            {label: 'Parakeet', value: 'Parakeet'},
            {label: 'Canary', value: 'Canary'},
            {label: 'Cockatiel', value: 'Cockatiel'},
        ],
    };
    const calculateBirthDate = (ageInMonths) => {
        const today = new Date();
        const birthDateEstimate = new Date(today.setMonth(today.getMonth() - ageInMonths));
        const year = birthDateEstimate.getFullYear();
        const month = String(birthDateEstimate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(birthDateEstimate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async () => {
        if (!petName || !petAgeMonths || !petType || !petBreed) {
            Alert.alert('Validation Error', 'Please fill in all fields.');
            return;
        }
        const birthDate = calculateBirthDate(petAgeMonths);

        const petProfileData = {
            name: petName,
            ownerId: "1",

            type: petType,
            breed: petBreed,

            // ageMonths: petAgeMonths,
            birthDate: birthDate,
            medicalHistory: petMedicalHistory

        };

        try {
            const response = await PetService.createPet(petProfileData);

            console.log("Pet profile created:", response);
            Alert.alert('Success', 'Pet profile created successfully!');
            resetForm();
        } catch (error) {
            console.error("Error creating pet profile:", error);
            Alert.alert('Error', 'Failed to create pet profile.');
        }
    };

    const resetForm = () => {
        setPetType('');
        setPetName('');
        setPetAgeMonths(0);
        setPetBreed('');
        setPetMedicalHistory('');
    };

    const ageInYears = Math.floor(petAgeMonths / 12);
    const remainingMonths = petAgeMonths % 12;

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Pet Profile</Text>

            {/* Text input for Pet Name */}
            <TextInput
                style={styles.input}
                placeholder="Pet Name"
                value={petName}
                onChangeText={setPetName}
            />

            {/* Dropdown for selecting Pet Type */}
            <Text style={styles.label}>Select Pet Type:</Text>
            <Picker
                selectedValue={petType}
                style={styles.picker}
                onValueChange={(itemValue) => {
                    setPetType(itemValue);
                    setPetBreed(''); // Reset breed when pet type changes
                }}
            >
                <Picker.Item label="Select a pet type" value=""/>
                <Picker.Item label="Dog" value="Dog"/>
                <Picker.Item label="Cat" value="Cat"/>
                <Picker.Item label="Bird" value="Bird"/>
            </Picker>

            {/* Dropdown for selecting Pet Breed based on Pet Type */}
            <Text style={styles.label}>Select Pet Breed:</Text>
            <Picker
                selectedValue={petBreed}
                style={styles.picker}
                onValueChange={(itemValue) => setPetBreed(itemValue)}
                enabled={!!petType}
            >
                <Picker.Item label="Select a breed" value=""/>
                {petData[petType]?.map((breed, index) => (
                    <Picker.Item key={index} label={breed.label} value={breed.value || 'Select a breed'}/>
                ))}
            </Picker>

            {/* Slider for selecting Pet Age in Months */}
            <Text style={styles.label}>Select Pet
                Age: {petAgeMonths} month{petAgeMonths !== 1 ? 's' : ''} ({ageInYears} year{ageInYears !== 1 ? 's' : ''} {remainingMonths} month{remainingMonths !== 1 ? 's' : ''})</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={240}
                step={1}
                value={petAgeMonths}
                onValueChange={setPetAgeMonths}
                minimumTrackTintColor="#1D3D47"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1D3D47"
            />

            <TextInput
                style={styles.input}
                placeholder="Medical History"
                value={petMedicalHistory}
                onChangeText={setPetMedicalHistory}
            />

            <View style={styles.buttonContainer}>
                <Button title="Create Profile" onPress={handleSubmit}/>
                <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                    <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 12,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'flex-start',
    },
    resetButton: {
        marginTop: 10,
        backgroundColor: '#f0ad4e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    resetButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
