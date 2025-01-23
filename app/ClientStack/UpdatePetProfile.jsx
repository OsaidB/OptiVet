import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PetService from '../../Services/PetService';
import Slider from "@react-native-community/slider";
// import Slider from '@react-native-slider/slider';

const UpdatePetProfile = () => {
    const { petId, clientId, name, type, breed, birthDate, medicalHistory, imageUrl } = useLocalSearchParams();
    const router = useRouter();

    const calculateAgeInMonths = (birthDateString) => {
        if (!birthDateString) return 0;
        const birthDate = new Date(birthDateString);
        const today = new Date();
        return (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    };

    const calculateBirthDateFromMonths = (months) => {
        const today = new Date();
        today.setMonth(today.getMonth() - months);
        return today.toISOString().split('T')[0];
    };

    const initialAgeMonths = calculateAgeInMonths(birthDate);

    const [petDetails, setPetDetails] = useState({
        name: name || '',
        type: type || '',
        breed: breed || '',
        birthDate: birthDate || calculateBirthDateFromMonths(initialAgeMonths),
        medicalHistory: medicalHistory || '',
        imageUrl: imageUrl || '',
        ownerId: clientId,
    });

    const [petAgeMonths, setPetAgeMonths] = useState(initialAgeMonths);

    useEffect(() => {
        setPetDetails((prevDetails) => ({
            ...prevDetails,
            birthDate: calculateBirthDateFromMonths(petAgeMonths),
        }));
    }, [petAgeMonths]);

    const handleInputChange = (field, value) => {
        setPetDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setPetDetails((prevDetails) => ({
                    ...prevDetails,
                    imageUrl: result.assets[0].uri,
                }));
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            console.log("Updating pet:", petDetails);
            await PetService.updatePet(petId, petDetails);
            Alert.alert('Success', 'Pet profile updated successfully!');
            router.back();
        } catch (error) {
            console.error('Error updating pet:', error.response?.data || error);
            Alert.alert('Error', 'Failed to update pet profile. Please try again.');
        }
    };

    const ageInYears = Math.floor(petAgeMonths / 12);
    const remainingMonths = petAgeMonths % 12;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Pet Name</Text>
            <TextInput
                style={styles.input}
                value={petDetails.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter pet name"
            />

            <Text style={styles.label}>Type</Text>
            <TextInput
                style={styles.input}
                value={petDetails.type}
                onChangeText={(value) => handleInputChange('type', value)}
                placeholder="Enter pet type"
            />

            <Text style={styles.label}>Breed</Text>
            <TextInput
                style={styles.input}
                value={petDetails.breed}
                onChangeText={(value) => handleInputChange('breed', value)}
                placeholder="Enter pet breed"
            />

            <Text style={styles.label}>
                Age: {ageInYears} year{ageInYears !== 1 ? 's' : ''} {remainingMonths} month{remainingMonths !== 1 ? 's' : ''}
            </Text>
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

            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                <Text style={styles.imagePickerText}>Update Image</Text>
            </TouchableOpacity>

            {petDetails.imageUrl ? (
                <Image source={{ uri: petDetails.imageUrl }} style={styles.imagePreview} />
            ) : null}

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitText}>Update Profile</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    imagePickerButton: {
        backgroundColor: '#1D3D47',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    imagePickerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 16,
        alignSelf: 'center',
    },
    submitButton: {
        backgroundColor: '#1D3D47',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default UpdatePetProfile;
