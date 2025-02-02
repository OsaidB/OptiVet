
import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput,
    Modal, ScrollView,
    Platform, SafeAreaView
} from "react-native";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// import { ImageBackground } from "react-native-web";
import { Ionicons } from '@expo/vector-icons';
import baseURL from '../../Services/config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/petsForAdoption`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;
import ProductService from '../../Services/ProductService';
import CategoryService from '../../Services/CategoryService';
import { WINDOWS } from "nativewind/dist/utils/selector";
import axios from "axios";
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import PetForAdoptionService from "../../Services/PetForAdoptionService";










export default function EditPetForAdoption() {
    const router = useRouter();
    const [petName, setPetName] = useState('');
    const [petAge, setPetAge] = useState(0);
    const [applyImage, setApplyImage] = useState(false);
    const [petImage, setPetImage] = useState(null);
    const [image, setImage] = useState(null);
    const [petImageUrl, setPetImageUrl] = useState(null);
    const [error, setError] = useState(null);
    const [typeOfPet, setTypeOfPet] = useState('');
    const [breedOfPet, setBreedOfPet] = useState('');
    const [petDescription, setPetDescription] = useState('');
    //const [imageOfPet, setImageOfPet] = useState(null);
    const [pet, setPet] = useState();
    const ageYears = Math.floor(petAge / 12);
    const remainingMonths = petAge % 12;

    const { petId } = useLocalSearchParams();



    useEffect(() => {
        const fetchPetForAdoption = async () => {
            try {
                const fetchPetForAdoption = await PetForAdoptionService.getPetForAdoptionById(petId);
                setPet(fetchPetForAdoption);

                setPetName(fetchPetForAdoption.name);

                setPetAge(calcAge(fetchPetForAdoption.birthDate));

                setTypeOfPet(fetchPetForAdoption.type);
                setBreedOfPet(fetchPetForAdoption.breed);
                setPetDescription(fetchPetForAdoption.petForAdoptionDescription);
                setPetImageUrl(fetchPetForAdoption.petForAdoptionImageUrl);
                //setImage(fetchPetForAdoption.petForAdoptionImageUrl);
                setApplyImage(true);
                //setSearchedProducts(fetchProducts);
            } catch (error) {
                console.error("Error fetching pet for adoption:", error);
                Alert.alert('Error', 'Failed to load pet for adoption.');
            }
        };

        fetchPetForAdoption();

    }, []);


    const calcBirthDate = (petage) => {
        const thisDay = new Date();
        const birthDate = new Date(thisDay.setMonth(thisDay.getMonth() - petage));
        const year = birthDate.getFullYear();
        const month = String(birthDate.getMonth() + 1).padStart(2, '0');
        const day = String(birthDate.getDate()).padStart(2, '0');
        //console.log(`${year}-${month}-${day}`);
        return `${year}-${month}-${day}`;


    }


    const calcAge = (petDate) => {

        if (!petDate){
             return 0;
        }
        const birthDate = new Date(petDate);
        const today = new Date();
        
        return (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    }

    const petsTypes = {
        Dog: [
            { label: 'Golden Retriever', value: 'Golden Retriever' },
            { label: 'Bulldog', value: 'Bulldog' },
            { label: 'Beagle', value: 'Beagle' },
            { label: 'Poodle', value: 'Poodle' }
        ],
        Cat: [
            { label: 'Persian', value: 'Persian' },
            { label: 'Siamese', value: 'Siamese' },
            { label: 'Maine Coon', value: 'Maine Coon' },
            { label: 'Bengal', value: 'Bengal' }],
        Bird: [
            { label: 'Parakeet', value: 'Parakeet' },
            { label: 'Canary', value: 'Canary' },
            { label: 'Cockatiel', value: 'Cockatiel' }]

    };


    const pickImage = async () => {
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {

            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera 
                 roll permission to upload images.`
            );
        } else {

            const result =
                await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {

                setPetImage(result.assets[0].uri);
                setApplyImage(true);
                setError(null);

            }
        }
    };



    const deletePetImage = () => {
        setPetImage(null);
        setApplyImage(false);


    };


    const deletePetImageUrl = () => {
        setPetImageUrl(null);
        setApplyImage(false);


    };



    const updatePetForAdoptionHandle = async () => {


        if (!petName) {
            Alert.alert('entering the name of the pet in mandatory');
            console.log('entering the name of the pet in mandatory');
        }
        else if (petAge == 0) {
            Alert.alert('entering the age of the pet in mandatory');
            console.log('entering the age of the pet in mandatory');
        }
        else if (!typeOfPet) {
            Alert.alert('entering the type of the pet in mandatory');
            console.log('entering the type of the pet in mandatory');
        }
        else if (!breedOfPet) {
            Alert.alert('entering the breed of the pet in mandatory');
            console.log('entering the breed of the pet in mandatory');
        }

        else {

            try {


                if (petImage) {
                    const imageOfPet = await PetForAdoptionService.uploadPetForAdoptionImages(petImage);
                    const dateOfBirth = calcBirthDate(petAge);
                    const petForAdoption = await PetForAdoptionService.updatePetForAdoptionById({

                        name: petName,
                        birthDate: dateOfBirth,
                        type: typeOfPet,
                        breed: breedOfPet,
                        petForAdoptionImageUrl: imageOfPet,
                        petForAdoptionDescription: petDescription
                    }, petId);

                }
                if (!petImage) {

                    const dateOfBirth = calcBirthDate(petAge);

                    const petForAdoption = await PetForAdoptionService.updatePetForAdoptionById({

                        name: petName,
                        birthDate: dateOfBirth,
                        type: typeOfPet,
                        breed: breedOfPet,
                        petForAdoptionImageUrl: pet.petForAdoptionImageUrl,
                        petForAdoptionDescription: petDescription
                    }, petId);

                }




                router.push({
                    pathname: '/SecretaryStack/PetsForAdoption',

                });
            } catch (error) {
                Alert.alert('error updating pet for adoption', error);
            }



        }


    };




    return (


        <SafeAreaView
            style={styles.container}>
            <ScrollView style={styles.scroll}>
                <Text style={styles.title}>Edit pet for adoption</Text>

                <View>
                    <Text style={styles.elementText}>
                        Pet Name:
                    </Text>
                    <TextInput
                        editable
                        placeholder="Pet Name"
                        placeholderTextColor="#787170"
                        numberOfLines={3}
                        value={petName}
                        onChangeText={setPetName}
                        maxLength={100}
                        // onBlur={}
                        style={styles.textInputStyle}
                    />
                </View>

                <View>
                    <Text style={styles.sliderText}>
                        Pet Age: {petAge} month{petAge !== 1 ? 's' : ''} ({ageYears} year
                        {ageYears !== 1 ? 's' : ''} {remainingMonths} month
                        {remainingMonths !== 1 ? 's' : ''} )
                    </Text>

                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={240}
                        step={1}
                        value={petAge}
                        onValueChange={setPetAge}
                        minimumTrackTintColor={
                            Platform.OS === 'android' ? '#FFD700' : '#1D3D47'
                        }
                        maximumTrackTintColor="#ccc"
                        thumbTintColor={Platform.OS === 'android' ? '#FFD700' : '#1D3D47'}
                    />
                </View>

                <View>
                    <Text style={styles.sliderText}>
                        Pet Type:
                    </Text>

                    <Picker
                        style={
                            Platform.OS == ('web' || 'android')
                                ? styles.picker
                                : styles.pickerIos
                        }
                        selectedValue={typeOfPet}
                        onValueChange={(value) => {
                            setTypeOfPet(value);
                            setBreedOfPet('');
                        }}
                        prompt="Select Pet Type">
                        <Picker.Item label="Select pet type" value="" />
                        <Picker.Item label="Dog" value="Dog" />
                        <Picker.Item label="Cat" value="Cat" />
                        <Picker.Item label="Bird" value="Bird" />
                    </Picker>
                </View>

                <View>
                    <Text style={styles.sliderText}>
                        Pet Breed:
                    </Text>

                    <Picker
                        selectedValue={breedOfPet}
                        style={
                            Platform.OS == ('web' || 'android')
                                ? styles.picker
                                : styles.pickerIos
                        }
                        onValueChange={(value) => {
                            setBreedOfPet(value);
                        }}
                        enabled={!!typeOfPet}
                        prompt="Select Pet Breed">
                        <Picker.Item label="Select pet breed" value="" />

                        {petsTypes[typeOfPet]?.map((breed, index) => (
                            <Picker.Item
                                key={index}
                                label={breed.label}
                                value={breed.value || ''}
                            />
                        ))}
                    </Picker>
                </View>

                <View>
                    <Text style={styles.elementText}>
                        Pet Description:
                    </Text>

                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        value={petDescription}
                        onChangeText={setPetDescription}
                        placeholder="Pet Description (Talk more abbout the pet, why does this pet need adoption, etc.) "
                        placeholderTextColor="#bfc1ca"
                        style={styles.textDescriptionInput}
                    />
                </View>



                <Text style={styles.elementText}>
                    Edit pet Image:
                </Text>

                <View style={styles.imagePart}>



                    {(!(petImage) && !(petImageUrl)) && (
                        <View style={styles.imageStyle}>

                            <Image source={require('../../assets/images/upload (3).png')} style={styles.uploadImageStyling} resizeMode='contain'></Image>

                            <TouchableOpacity style={styles.button} onPress={pickImage}>
                                <Text style={styles.buttonText} adjustsFontSizeToFit>Upload Image</Text>
                            </TouchableOpacity>

                        </View>)}



                    {(applyImage && petImageUrl) && (


                        <View style={styles.imageStyle} deletePetImageUrl={deletePetImageUrl}>


                            <Image source={{ uri: `${BASE_URL_IMAGES}${petImageUrl}` }} style={styles.petImageStyling} resizeMode='contain'></Image>

                            <TouchableOpacity style={styles.deleteImageButton} onPress={deletePetImageUrl}>
                                <Text style={styles.deleteImageButtonStyling}>X</Text>

                            </TouchableOpacity>

                        </View>

                    )}



                    {(applyImage && petImage) && (

                        <View style={styles.imageStyle} deletePetImage={deletePetImage}>


                            <Image source={petImage} style={styles.petImageStyling} resizeMode='contain'></Image>

                            <TouchableOpacity style={styles.deleteImageButton} onPress={deletePetImage}>
                                <Text style={styles.deleteImageButtonStyling}>X</Text>

                            </TouchableOpacity>

                        </View>

                    )}


                </View>



                {/* <View
                    style={styles.imagePart}>
                    {!petImage && (
                        <View
                            style={styles.imageStyle}>
                            <Image
                                source={require('../../assets/images/upload (3).png')}
                                style={styles.uploadImageStyling}
                                resizeMode="contain"></Image>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={pickImage}>
                                <Text style={styles.buttonText} adjustsFontSizeToFit>
                                    Upload Image
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {applyImage && petImage && (
                        <View
                            style={styles.imageStyle}
                            deleteImage={deleteImage}>
                            <Image
                                source={petImage}
                                style={{ width: 120, height: 120, borderRadius: 8 }}
                                resizeMode="contain"></Image>

                            <TouchableOpacity
                                style={styles.deleteImageButton}
                                onPress={deleteImage}>
                                <Text style={styles.deleteImageButtonStyling}>X</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View> */}




                <TouchableOpacity
                    style={styles.addButton}
                    onPress={updatePetForAdoptionHandle}>
                    <Text
                        style={styles.addButtonText}>
                        Update pet for adoption
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>






    );
}



const styles = StyleSheet.create({


    container: {

        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: Platform.OS == 'web' ? 0 : 30
    },

    scroll: {
        width: '100%',
        marginVertical: Platform.OS == 'web' ? 0 : 30

    },


    elementText: {
        marginLeft: 10,
        marginBottom: 12,
        fontSize: 25
    },

    textInputStyle: {

        borderWidth: 2,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
        height: 40,
        paddingLeft: 20,
        borderRadius: 4,
        backgroundColor: 'white',
    },


    textDescriptionInput: {
        padding: 12,
        borderWidth: 2,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 12,
        justifyContent: 'center',
    },

    sliderText: {
        marginLeft: 10,
        fontSize: 25
    },

    pickerIos: {
        borderWidth: 4,
        borderColor: '#f5f5f5',
        marginBottom: 20,

    },

    imagePart: {
        backgroundColor: '#c7bcbc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        marginBottom: 20,
    },

    imageStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'white',
    },

    uploadImageStyling: {
        width: 100,
        height: 100,
        marginTop: 10
    },

    button: {
        backgroundColor: '#133945',
        borderRadius: 8,
        padding: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteImageButton: {
        borderRadius: 100,
        backgroundColor: 'brown',
        width: 30,
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        left: -10,
        top: -10,
    },

    deleteImageButtonStyling: {
        alignSelf: 'center',
        fontSize: 20
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    picker: {
        height: 40,
        marginTop: 12,
        marginBottom: 20,
        marginHorizontal: 12,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        color: '#1D3D47',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
        alignSelf: 'center',
    },

    slider: {
        height: 40,
        marginHorizontal: 10,
        marginBottom: 12,
    },
    addButtonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    petImageStyling: {
        width: 120,
        height: 120,
        borderRadius: 8
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#133945',
        borderRadius: 18,
        padding: 12,
        marginVertical: 10,
    }
});



















