import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Platform,
    Image,
    ScrollView, SafeAreaView
} from 'react-native';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as SplashScreen from "expo-splash-screen";
import {useFonts} from "expo-font";
import PetService from "../../Services/PetService";
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PickerItem from "react-native-web/src/exports/Picker/PickerItem";
import {color} from "@rneui/base";
import AuthGuard from "../AuthGuard"; // Import useLocalSearchParams

export default function CreatePetProfile() {
    const router = useRouter();
    const {clientId} = useLocalSearchParams(); // Retrieve clientId using useLocalSearchParams

    const [petType, setPetType] = useState('');
    const [petName, setPetName] = useState('');
    const [petAgeMonths, setPetAgeMonths] = useState(0);
    const [petBreed, setPetBreed] = useState('');
    const [petGender, setGender] = useState(null); // State for gender
    const [petMedicalHistory, setPetMedicalHistory] = useState('');
    const [petPhoto, setPetPhoto] = useState(null); // State for the pet's photo

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

    // Log clientId whenever it changes
    useEffect(() => {
        console.log("Current client ID:", clientId);
    }, [clientId]);

    const petData = {
        Dog: [
            // { label: 'Select a breed', value: '' },
            {label: 'Golden Retriever', value: 'Golden Retriever'},
            {label: 'Bulldog', value: 'Bulldog'},
            {label: 'Beagle', value: 'Beagle'},
            {label: 'Poodle', value: 'Poodle'},
        ],
        Cat: [
            // { label: 'Select a breed', value: '' },
            {label: 'Persian', value: 'Persian'},
            {label: 'Siamese', value: 'Siamese'},
            {label: 'Maine Coon', value: 'Maine Coon'},
            {label: 'Bengal', value: 'Bengal'},
        ],
        Bird: [
            // { label: 'Select a breed', value: '' },
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

    // const pickImage = async () => {
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });
    //
    //     if (!result.canceled) {
    //         setPetPhoto(result.uri);
    //     }
    // };
    //----------------------------------------------------------------------------
    // const pickImage = async () => {
    //     // Request permission to access media library
    //     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //
    //     if (permissionResult.granted === false) {
    //         Alert.alert('Permission to access camera roll is required!');
    //         return;
    //     }
    //
    //     // Launch the image picker
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.All,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });
    //
    //     // Check if the user cancelled the picker
    //     if (result.cancelled) {
    //         return;
    //     }
    //
    //     // Set the image URI to state
    //     setPetPhoto(result.uri);
    // };
    //----------------------------------------------------------------------------
    const pickImage = async () => {
        // Request permission to access media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera roll is required!');
            return;
        }

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setPetPhoto(uri);
        }

        // // Check if the result contains a URI and set it
        // if (result.assets && result.assets.length > 0) {
        //     setPetPhoto(result.assets[0].uri); // Access the uri of the first selected asset
        // } else {
        //     Alert.alert('No image selected.'); // Handle case where no image is returned
        // }

        // // Check if the result contains a URI and set it
        // if (result.assets && result.assets.length > 0) {
        //     const uri = result.assets[0].uri; // Get the URI of the selected asset
        //     setPetPhoto(uri); // Set the photo URI
        // } else {
        //     Alert.alert('No image selected.'); // Handle case where no image is returned
        // }
    };

    const removePhoto = () => {
        setPetPhoto(null);
    };
    const handleSubmit = async () => {
        if (!petName || !petAgeMonths || !petType || !petBreed) {
            Alert.alert('Validation Error', 'Please fill in all fields.');
            return;
        }
        const birthDate = calculateBirthDate(petAgeMonths);
        let imageUrl = null;

        // Upload the photo if it exists
        if (petPhoto) {
            try {
                console.log("Uploading image...");
                imageUrl = await PetService.uploadImage(petPhoto);
                console.log("Image uploaded, URL:", imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
                Alert.alert('Error', 'Failed to upload image.');
                return;
            }
        }
        // Ensure imageUrl is available before continuing
        if (!imageUrl && petPhoto) {
            Alert.alert('Error', 'Image upload failed. Please try again.');
            return;
        }

        const petProfileData = {
            name: petName,
            // ownerId: "1",
            ownerId: clientId, // Use the passed clientId here

            type: petType,
            breed: petBreed,
            gender: petGender,

            // ageMonths: petAgeMonths,
            birthDate: birthDate,
            medicalHistory: petMedicalHistory,

            imageUrl: imageUrl,
        };

        console.log("(petProfileData):", petProfileData);
        try {
            console.log("Creating pet profile with data:", petProfileData);
            const response = await PetService.createPet(petProfileData);

            console.log("Pet profile created(response):", response);
            Alert.alert('Success', 'Pet profile created successfully!');
            resetForm();
            // // navigation.navigate('PetProfiles'); // Navigate back to PetProfiles
            // router.push('/ClientStack/PetProfiles'); // Navigate back to PetProfiles

            // Pass clientId while navigating back to PetProfiles
            router.push({
                pathname: '/ClientStack/PetProfiles',
                params: {clientId}, // Include clientId in params
            });

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
        setPetPhoto(null);
    };

    const ageInYears = Math.floor(petAgeMonths / 12);
    const remainingMonths = petAgeMonths % 12;

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
        // Request media library permission for image picking
        (async () => {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthGuard allowedRoles={['ROLE_CLIENT', 'VET','MANAGER']}> {/* Override AuthGuard here */}

        <ScrollView style={styles.container}>
            <Text style={styles.title}>Create Pet Profile</Text>

            <TextInput
                style={styles.input}
                placeholder="Pet Name"
                value={petName}
                onChangeText={setPetName}
            />

            {Platform.OS === 'ios' ? (
                <TouchableOpacity
                    style={[styles.pickerContainer, petType ? styles.pickerSelected : styles.pickerDefault]}
                    onPress={() => {
                        Alert.alert('Pet Type', 'Please select a pet type', [
                            {text: 'Dog', onPress: () => setPetType('Dog')},
                            {text: 'Cat', onPress: () => setPetType('Cat')},
                            {text: 'Bird', onPress: () => setPetType('Bird')},
                        ]);
                    }}>
                    <Text style={styles.pickerText}>{petType || "Select a pet type"}</Text>
                </TouchableOpacity>
            ) : (
                <Picker
                    selectedValue={petType}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        setPetType(itemValue);
                        setPetBreed('');
                    }}
                >
                    <Picker.Item label="Select a pet type" value="" />
                    <Picker.Item label="Dog" value="Dog" />
                    <Picker.Item label="Cat" value="Cat" />
                    <Picker.Item label="Bird" value="Bird" />
                </Picker>
            )}

            {Platform.OS === 'ios' ? (
                <TouchableOpacity
                    style={[styles.pickerContainer, petBreed ? styles.pickerSelected : styles.pickerDefault]}
                    onPress={() => {
                        if (!petType) {
                            Alert.alert('Error', 'Please select a pet type first!');
                            return;
                        }
                        const breeds = petData[petType] || [];
                        Alert.alert('Pet Breed', 'Please select a pet breed', breeds.map((breed) => ({
                            text: breed.label,
                            onPress: () => setPetBreed(breed.value),
                        })));
                    }}>
                    <Text style={styles.pickerText}>{petBreed || "Select a breed"}</Text>
                </TouchableOpacity>
            ) : (
                <Picker
                    selectedValue={petBreed}
                    style={styles.picker}
                    onValueChange={setPetBreed}
                    enabled={!!petType}
                >
                    <Picker.Item label="Select a breed" value="" />
                    {petData[petType]?.map((breed, index) => (
                        <Picker.Item key={index} label={breed.label} value={breed.value} />
                    ))}
                </Picker>
            )}

            {/* Gender Selection */}
            <Text style={styles.label}>Select Gender</Text>
            <View style={styles.genderToggleContainer}>
                <TouchableOpacity
                    style={[styles.genderButton, petGender === 'Male' && styles.genderButtonSelected]}
                    onPress={() => setGender('Male')}
                >
                    <Text style={[styles.genderButtonText, petGender === 'Male' && styles.genderButtonTextSelected]}>
                        Male
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.genderButton, petGender === 'Female' && styles.genderButtonSelected]}
                    onPress={() => setGender('Female')}
                >
                    <Text style={[styles.genderButtonText, petGender === 'Female' && styles.genderButtonTextSelected]}>
                        Female
                    </Text>
                </TouchableOpacity>
            </View>

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

            <TextInput
                style={styles.input}
                placeholder="Medical History"
                value={petMedicalHistory}
                onChangeText={setPetMedicalHistory}
            />

            <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
                <Text style={styles.photoButtonText}>{petPhoto ? 'Change Photo' : 'Select Photo'}</Text>
            </TouchableOpacity>

            {petPhoto && (
                <View style={styles.photoContainer}>
                    <Image source={{ uri: petPhoto }} style={styles.petImage} />
                    <TouchableOpacity onPress={removePhoto} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>X</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View>
                {/*<Button*/}
                {/*    title="Create Profile"*/}
                {/*    onPress={handleSubmit}*/}
                {/*    color={Platform.OS === 'ios' ? '#1D3D47' : undefined}*/}
                {/*/>*/}
                <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
                    <Text style={styles.resetButtonText}>Create Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                    <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
</AuthGuard>
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
        marginBottom: 12,
    },
    pickerContainer: {
        height: 50,
        justifyContent: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    photoButton: {
        backgroundColor: '#1D3D47',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    photoButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    petImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 20,
    },

    createButton: {
        marginTop: 10,
        backgroundColor: '#74b3c4',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },

    genderToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#1D3D47',
        alignItems: 'center',
    },
    genderButtonSelected: {
        backgroundColor: '#1D3D47',
        borderColor: '#1D3D47',
    },
    genderButtonText: {
        color: '#1D3D47',
        fontWeight: 'bold',
        fontSize: 16,
    },
    genderButtonTextSelected: {
        color: '#FFFFFF',
    },

    resetButton: {
        marginTop: 10,
        backgroundColor: '#f0ad4e',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    resetButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});