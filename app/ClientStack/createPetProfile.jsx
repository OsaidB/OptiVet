import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as SplashScreen from "expo-splash-screen";
import {useFonts} from "expo-font";
import PetService from "../../Services/PetService";
// import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useRouter } from 'expo-router'; // Import useRouter

export default function CreatePetProfile() {
    // const navigation = useNavigation(); // Get the navigation object
    const router = useRouter(); // Get the router object

    const [petType, setPetType] = useState('');
    const [petName, setPetName] = useState('');
    const [petAgeMonths, setPetAgeMonths] = useState(0);
    const [petBreed, setPetBreed] = useState('');
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

        // Check if the user cancelled the picker
        if (result.canceled) {
            return; // No action needed if the user cancels
        }

        // // Check if the result contains a URI and set it
        // if (result.assets && result.assets.length > 0) {
        //     setPetPhoto(result.assets[0].uri); // Access the uri of the first selected asset
        // } else {
        //     Alert.alert('No image selected.'); // Handle case where no image is returned
        // }

        // Check if the result contains a URI and set it
        if (result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri; // Get the URI of the selected asset
            setPetPhoto(uri); // Set the photo URI
        } else {
            Alert.alert('No image selected.'); // Handle case where no image is returned
        }

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
            ownerId: "1",

            type: petType,
            breed: petBreed,

            // ageMonths: petAgeMonths,
            birthDate: birthDate,
            medicalHistory: petMedicalHistory,

            imageUrl:imageUrl,
        };

        console.log("(petProfileData):", petProfileData);
        try {
            console.log("Creating pet profile with data:", petProfileData);
            const response = await PetService.createPet(petProfileData);

            console.log("Pet profile created(response):", response);
            Alert.alert('Success', 'Pet profile created successfully!');
            resetForm();
            // navigation.navigate('PetProfiles'); // Navigate back to PetProfiles
            router.push('/ClientStack/PetProfiles'); // Navigate back to PetProfiles
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
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            }
        })();
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
            {/*<Text style={styles.label}>Select Pet Type:</Text>*/}
            <Picker
                selectedValue={petType}
                style={styles.picker}
                onValueChange={(itemValue) => {
                    setPetType(itemValue);
                    setPetBreed(''); // Reset breed when pet type changes
                }}
                prompt="Select a Pet Type" // Add a prompt for better user experience
                // accessibilityLabel="Select Pet Type" // Accessibility label
            >
                <Picker.Item label="Select a pet type" value=""/>
                <Picker.Item label="Dog" value="Dog"/>
                <Picker.Item label="Cat" value="Cat"/>
                <Picker.Item label="Bird" value="Bird"/>
            </Picker>

            {/* Dropdown for selecting Pet Breed based on Pet Type */}
            {/*<Text style={styles.label}>Select Pet Breed:</Text>*/}
            <Picker
                selectedValue={petBreed}
                style={styles.picker}
                onValueChange={(itemValue) => setPetBreed(itemValue)}
                enabled={!!petType}

                prompt="Select a breed" // Add a prompt for better user experience
                // accessibilityLabel="Select Pet Type" // Accessibility label
            >

                <Picker.Item label="Select a breed" value=""/>
                {petData[petType]?.map((breed, index) => (
                    <Picker.Item key={index} label={breed.label} value={breed.value || ''} />
                ))}
            </Picker>

            {/* Slider for selecting Pet Age in Months */}
            <Text style={styles.label}>Select Pet Age: {petAgeMonths} month{petAgeMonths !== 1 ? 's' : ''} ({ageInYears} year{ageInYears !== 1 ? 's' : ''} {remainingMonths} month{remainingMonths !== 1 ? 's' : ''})</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={240}
                step={1}
                value={petAgeMonths}
                onValueChange={setPetAgeMonths}
                minimumTrackTintColor={Platform.OS === 'android' ? '#FFD700' : '#1D3D47'} // Gold for Android
                maximumTrackTintColor="#ccc"
                thumbTintColor={Platform.OS === 'android' ? '#FFD700' : '#1D3D47'} // Gold for Android
            />

            <TextInput
                style={styles.input}
                placeholder="Medical History"
                value={petMedicalHistory}
                onChangeText={setPetMedicalHistory}
            />

            {/* Photo Picker Button */}
            <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
                <Text style={styles.photoButtonText}>{petPhoto ? "Change Photo" : "Select Photo"}</Text>
            </TouchableOpacity>

            {/* Display Selected Photo */}
            {/*{petPhoto && (*/}
            {/*    <Image source={{ uri: petPhoto }} style={styles.image} />*/}
            {/*)}*/}

            {/* Submission Buttons */}
            <View style={styles.buttonContainer}>
                <Button title="Create Profile" onPress={handleSubmit} color={Platform.OS === 'android' ? '#1D3D47' : undefined} />
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
        backgroundColor: Platform.OS === 'android' ? '#f0f8ff' : 'white', // Light color for Android
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 12,
        backgroundColor: '#f0f8ff', // Light background for visibility
        borderColor: '#1D3D47', // Dark border color
        borderWidth: 2, // Thicker border
        borderRadius: 5, // Rounded corners
        padding: 10, // Padding for a more spacious feel
        color: '#1D3D47', // Text color for visibility
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
    photoButton: {
        backgroundColor: '#1D3D47',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    photoButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center',
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
