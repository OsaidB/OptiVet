import React, { useState } from 'react';
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

const UpdatePetProfile = () => {
    const { petId, clientId, name, type, breed, birthDate, medicalHistory, imageUrl, residencyType } = useLocalSearchParams();
    const [petAgeMonths, setPetAgeMonths] = useState(0);
    const router = useRouter();
    const ageInYears = Math.floor(petAgeMonths / 12);
    const remainingMonths = petAgeMonths % 12;
    const { petId2 } = useLocalSearchParams();

    console.log(petId);

    const calculateBirthDate = (ageInMonths) => {
        const today = new Date();
        const birthDateEstimate = new Date(today.setMonth(today.getMonth() - ageInMonths));
        const year = birthDateEstimate.getFullYear();
        const month = String(birthDateEstimate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(birthDateEstimate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const [petDetails, setPetDetails] = useState({
        name: name || '',
        type: type || '',
        breed: breed || '',
        birthDate: calculateBirthDate(petAgeMonths) || '',
        medicalHistory: medicalHistory || '',
        imageUrl: imageUrl || '',
        // residencyType: residencyType || '',
    });

    const handleInputChange = (field, value) => {
        setPetDetails({ ...petDetails, [field]: value });
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            handleInputChange('imageUrl', result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        console.log("Updating pet with ID:", petId);
        console.log("Payload:", petDetails);
        try {
            await PetService.updatePet(petId, petDetails);
            Alert.alert('Success', 'Pet profile updated successfully.');
            router.back();
        } catch (error) {
            console.error('Error updating pet:', error.response?.data || error);
            const errorMessage = error.response?.data?.message || 'Failed to update pet profile. Please try again.';
            Alert.alert('Error', errorMessage);
        }
    };

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
                Select Pet Age: {petAgeMonths} month{petAgeMonths !== 1 ? 's' : ''} (
                {ageInYears} year{ageInYears !== 1 ? 's' : ''} {remainingMonths} month
                {remainingMonths !== 1 ? 's' : ''})
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

            {/*<Text style={styles.label}>Birth Date</Text>*/}
            {/*<TextInput*/}
            {/*    style={styles.input}*/}
            {/*    value={petDetails.birthDate}*/}
            {/*    onChangeText={(value) => handleInputChange('birthDate', value)}*/}
            {/*    placeholder="Enter birth date (YYYY-MM-DD)"*/}
            {/*    keyboardType="numeric"*/}
            {/*/>*/}

            {/*<Text style={styles.label}>Medical History</Text>*/}
            {/*<TextInput*/}
            {/*    style={styles.input}*/}
            {/*    value={petDetails.medicalHistory}*/}
            {/*    onChangeText={(value) => handleInputChange('medicalHistory', value)}*/}
            {/*    placeholder="Enter medical history"*/}
            {/*    multiline*/}
            {/*/>*/}

            {/*<Text style={styles.label}>Residency Type</Text>*/}
            {/*<TextInput*/}
            {/*    style={styles.input}*/}
            {/*    value={petDetails.residencyType}*/}
            {/*    onChangeText={(value) => handleInputChange('residencyType', value)}*/}
            {/*    placeholder="Enter residency type"*/}
            {/*/>*/}

            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                <Text style={styles.imagePickerText}>Update the Image</Text>
            </TouchableOpacity>

            {petDetails.imageUrl ? (
                <Image source={{ uri: petDetails.imageUrl }} style={styles.imagePreview} />
            ) : null}

            <TouchableOpacity onPress={handleSubmit} style={styles.imagePickerButton}>
                <Text style={styles.imagePickerText}>Update Profile</Text>
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
        backgroundColor: '#1d3d47',
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
});

export default UpdatePetProfile;
