import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput,
    Modal, ScrollView,
    Platform
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










export default function AddPetForAdoption() {
    const router = useRouter();
    const [petName, setPetName] = useState('');
    const [petAge, setPetAge] = useState(0);
    const [applyImage, setApplyImage] = useState(false);
    const [petImage, setPetImage] = useState(null);
    const [error, setError] = useState(null);
    const [typeOfPet, setTypeOfPet] = useState('');
    const [breedOfPet, setBreedOfPet] = useState('');
    const [petDescription, setPetDescription] = useState('');


    const ageYears = Math.floor(petAge / 12);
    const remainingMonths = petAge % 12;




    const calcBirthDate = (petage) => {
        const thisDay = new Date();
        const birthDate = new Date(thisDay.setMonth(thisDay.getMonth() - petage));
        const year = birthDate.getFullYear();
        const month = String(birthDate.getMonth() + 1).padStart(2, '0');
        const day = String(birthDate.getDate()).padStart(2, '0');
        console.log(`${year}-${month}-${day}`);
        return `${year}-${month}-${day}`;


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







    // useEffect(() => {
    //     const subscription = Dimensions.addEventListener(
    //         'change',
    //         ({ window, screen }) => {
    //             setDimensions({ window, screen });
    //         },
    //     );
    //     return () => subscription?.remove();
    // });


    const pickImage = async () => {
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {

            // If permission is denied, show an alert
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera 
                 roll permission to upload images.`
            );
        } else {

            // Launch the image library and get
            // the selected image
            const result =
                await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {

                setPetImage(result.assets[0].uri);
                setApplyImage(true);
                setError(null);




            }
        }
    };



    const deleteImage = () => {
        setPetImage(null);
        setApplyImage(false);


    };




    // const checkValueIsNumberOrNot = () => {

    //     if (isNaN(priceValue)) {

    //         return false;
    //     } else {


    //         setPriceValue(parseFloat(priceValue));
    //         return true;
    //     }
    // };


    // const addPetForAdoptionHandlee = async () => {


    //     console.log('heyy');
    // }



    const addPetForAdoptionHandle = async () => {


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

        // else if (!petDescription) {
        //     Alert.alert('entering the description of the pet in mandatory');
        //     console.log('entering the description of the pet in mandatory');
        // }

        else {

            try {


                if (!petImage) {


                    const getFile = {
                        uri: '../../assets/images/box.png',
                        name: 'box.png',
                        type: 'image/png',

                    };
                    setPetImage(getFile);


                }


                else {


                    const image = await PetForAdoptionService.uploadPetForAdoptionImages(petImage);

                    const dateOfBirth = calcBirthDate(petAge);

                    const petForAdoption = await PetForAdoptionService.createPetForAdoption({

                        name: petName,
                        birthDate: dateOfBirth,
                        type: typeOfPet,
                        breed: breedOfPet,
                        petForAdoptionImageUrl: image,
                        petForAdoptionDescription: petDescription
                    });

                }

                router.push({
                    pathname: '/SecretaryStack/PetsForAdoption',

                });
            } catch (error) {
                Alert.alert('error creating pet for adoption', error);
            }

        }


    };


    return (

        <ScrollView>

            <View style={{ justifyContent: 'space-evenly' }}>

                <View style={{}}>
                    <Text style={styles.title}>Add a new pet for adoption</Text>

                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Pet Name:</Text>
                    <TextInput
                        editable
                        placeholder="Pet Name"
                        placeholderTextColor='#787170'
                        numberOfLines={3}
                        value={petName}
                        onChangeText={setPetName}
                        maxLength={100}
                        // onBlur={}
                        style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 24, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
                    />
                </View>




                {/* <View style={{}}>
                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Price:</Text>
                    <TextInput
                        editable
                        placeholder="Product Price"
                        placeholderTextColor='#787170'
                        numberOfLines={3}
                        value={priceValue}
                        keyboardType="numeric"
                        onChangeText={setPriceValue}
                        // onBlur={}
                        style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
                    />
                </View> */}




                <View style={{}}>
                    <Text style={{ marginLeft: 10, fontSize: 25 }}>Pet Age: {petAge} month{petAge !== 1 ? 's' : ''} (
                        {ageYears} year{ageYears !== 1 ? 's' : ''} {remainingMonths} month{remainingMonths !== 1 ? 's' : ''} )</Text>

                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={240}
                        step={1}
                        value={petAge}
                        onValueChange={setPetAge}
                        minimumTrackTintColor={Platform.OS === 'android' ? '#FFD700' : '#1D3D47'}
                        maximumTrackTintColor="#ccc"
                        thumbTintColor={Platform.OS === 'android' ? '#FFD700' : '#1D3D47'}

                    />

                </View>






                <View style={{}}>
                    <Text style={{ marginLeft: 10, fontSize: 25 }}>Pet Type:</Text>

                    <Picker selectedValue={typeOfPet}
                        style={styles.picker}
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





                <View style={{}}>
                    <Text style={{ marginLeft: 10, fontSize: 25 }}>Pet Breed:</Text>

                    <Picker selectedValue={breedOfPet}
                        style={styles.picker}
                        onValueChange={(value) => {
                            setBreedOfPet(value);
                        }}
                        enabled={!!typeOfPet}
                        prompt="Select Pet Breed">

                        <Picker.Item label="Select pet breed" value="" />

                        {petsTypes[typeOfPet]?.map((breed, index) => (
                            <Picker.Item key={index} label={breed.label} value={breed.value || ''} />
                        ))}



                    </Picker>

                </View>






                <View style={{}}>
                    <Text style={{ marginLeft: 10, fontSize: 25, marginBottom: 12 }}>Pet Description:</Text>

                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        value={petDescription}
                        onChangeText={setPetDescription}
                        placeholder="Pet Description (Talk more abbout the pet, why does this pet need adoption, etc.) "
                        placeholderTextColor="#bfc1ca"
                        style={{ paddingLeft: 15, paddingTop: 15, borderWidth: 2, marginHorizontal: 10, marginBottom: 10, borderRadius: 12 }}
                    />

                </View>






                {/* <View style={{}}>

                    <Text style={{ marginLeft: 10, fontSize: 25 }}>Product Category:</Text>


                    <Picker
                        selectedValue={productCategory}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            setProductCategory(itemValue);
                            setSelectedCategoryId(itemValue);
                        }}
                        prompt="Select product category"

                    >

                        <Picker.Item label="Select product category" value="" />


                        {categories.map((item) => {


                            return (

                                <Picker.Item key={item.id} label={item.name} value={item.id} />

                            )
                        })}

                    </Picker>
                </View> */}


                <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Add a pet Image:</Text>
                <View style={{ backgroundColor: '#c7bcbc', justifyContent: 'center', alignItems: 'center', paddingBottom: 20, paddingTop: 20 }}>



                    {!(petImage) && (
                        <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }}>

                            <Image source={require('../../assets/images/upload (3).png')} style={{ width: 100, height: 100, marginTop: 10 }} resizeMode='contain'></Image>

                            <TouchableOpacity style={{ backgroundColor: "#133945", borderRadius: 8, padding: 10, margin: 10, justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
                                <Text style={styles.buttonText} adjustsFontSizeToFit>Upload Image</Text>
                            </TouchableOpacity>

                        </View>)}


                    {(applyImage && petImage) && (

                        <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }} deleteImage={deleteImage}>


                            <Image source={petImage} style={{ width: 100, height: 100, borderRadius: 8 }} resizeMode='contain'></Image>



                            <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteImage}>
                                <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

                            </TouchableOpacity>

                        </View>

                    )}

                </View>






                <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: '70%', width: '80%' }} onPress={addPetForAdoptionHandle}>
                        <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, padding: 17 }}>Add Pet for adoption</Text>
                    </TouchableOpacity>

                </View>



            </View>

        </ScrollView>



    );
}


const styles = StyleSheet.create({
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },



    picker: {
        height: 40,
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 20,
        borderColor: 'black',
        borderWidth: 2, // Thicker border
        borderRadius: 5, // Rounded corners
        padding: 10, // Padding for a more spacious feel
        color: '#1D3D47', // Text color for visibility
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
        alignSelf: 'center'
    },

    slider: {
        height: 40,
        marginHorizontal: 10,
        marginBottom: 12
    }
});


