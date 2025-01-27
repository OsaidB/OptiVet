import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, Button, button, Input, Alert } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import MedicalHistoryService from "../../Services/MedicalHistoryService";
import PetService from '../../Services/PetService';
import baseURL from '../../Services/config'; // Adjust the path as necessary
import * as ImagePicker from "expo-image-picker";
import { Picker } from '@react-native-picker/picker';
const BASE_URL = `${baseURL.USED_BASE_URL}/api/medicalHistories`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;
//import { useRouter } from 'expo-router';
//import { useRoute } from '@react-navigation/native';
import MedicalSessionService from '../../Services/MedicalSessionService';
import { id } from 'date-fns/locale';
import { WINDOWS } from 'nativewind/dist/utils/selector';
//import { newDate } from 'react-datepicker/dist/date_utils';







const MedicalHistory = () => {
    const [conditionText, setConditionText] = useState('');
    const [allergyText, setAllergyText] = useState('');
    const [vaccinationText, setVaccinationText] = useState('');
    const [surgeoryText, setSurgeoryText] = useState('');
    const [conditions, setConditions] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [surgeories, setSurgeories] = useState([]);
    //const [imageUrls, setImageUrls] = useState([{ id: 1, name: '1735573696079-petImage.jpg' }, { id: 2, name: '1735573696079-petImage.jpg' }, { id: 3, name: '1735573696079-petImage.jpg' }, { id: 4, name: '1735573696079-petImage.jpg' }, { id: 5, name: '1735573696079-petImage.jpg' }, { id: 6, name: '1735573696079-petImage.jpg' }, { id: 7, name: '1735573696079-petImage.jpg' }, { id: 8, name: '1735573696079-petImage.jpg' }, { id: 9, name: '1735573696079-petImage.jpg' }, { id: 10, name: '1735573696079-petImage.jpg' }, { id: 11, name: '1735573696079-petImage.jpg' }, { id: 12, name: '1735573696079-petImage.jpg' }, { id: 13, name: '1735573696079-petImage.jpg' }, { id: 14, name: '1735573696079-petImage.jpg' }, { id: 15, name: '1735573696079-petImage.jpg' }, { id: 16, name: '1735573696079-petImage.jpg' }, { id: 17, name: '1735573696079-petImage.jpg' }, { id: 18, name: '1735573696079-petImage.jpg' }, { id: 19, name: '1735573696079-petImage.jpg' }]);
    const { petId } = useLocalSearchParams();
    // Stores any error message
    const [counter, setCounter] = useState(0);
    const [error, setError] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [images, setImages] = useState([]);

    //const [addedImages, setAddedImages] = useState([]);
    const [pickedImage, setPickedImage] = useState(null);

    //const route = useRoute();

    const getDate = () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };





    //const [medicalSessions, setMedicalSessions] = useState([{ id: 1, diagnosis: 'this is a pet', treatment: 'antibiotics', sessiondate: getDate(), veterinarian: 'Waleed', symptoms: 'high temperature', treatmentplan: 'come back after one week' }, { id: 2, diagnosis: 'this is a pet', treatment: 'antibiotics', sessiondate: getDate(), veterinarian: 'Waleed', symptoms: 'high temperature', treatmentplan: 'come back after one week' }, { id: 3, diagnosis: 'this is a pet', treatment: 'antibiotics', sessiondate: getDate(), veterinarian: 'Waleed', symptoms: 'high temperature', treatmentplan: 'come back after one week' }]);
    const [medicalSessions, setMedicalSessions] = useState([]);
    const [dietaryPreferencesText, setDietaryPreferencesText] = useState('');
    const [notesText, setNotesText] = useState('');

    //const { clientId } = useLocalSearchParams();



    useEffect(() => {

        const fetchImages = async () => {

            try {
                const fetchedMedicalHistory = await MedicalHistoryService.getMedicalHistory(petId);


                //setImageUrls(fetchedMedicalHistory.medicalHistoryImageUrls);


                const fetchedImages = fetchedMedicalHistory.medicalHistoryImageUrls;
                setImages(fetchedImages);
                //console.log(images.length);
                //console.log(fetchedImages);
                const newImages = [];
                for (let i = 0; i < fetchedImages.length; i++) {
                    //console.log(fetchedImages[i]);

                    newImages[i] = { id: i, url: fetchedImages[i] };
                    //setImageUrls([...imageUrls, { id: i, url: fetchedImages[i] }]);
                }
                 setImageUrls(newImages);
                 const counterValue = imageUrls.length + 1;
                 setCounter(counterValue);





                //console.log(counterValue);
                //setCounter(imageUrls);
                //setCounter(counter);
                //console.log(counter);
                //const fetchedMedicalHistoryy = await MedicalHistoryService.updateMedicalHistory({medicalHistoryImageUrls:[],notes:'heyyy'}, petId);
                // console.log(fetchedMedicalHistoryy);
                //console.log(fetchedMedicalHistoryy.medicalHistoryImageUrls);

            } catch (error) {
                console.error('Error fetching medical history', error);
                Alert.alert('Error', 'Failed to load medical history');

            }




        };


        const fetchMedicalSessions = async () => {
            try {
                const fetchedMedicalSessions = await MedicalSessionService.getSessionsByPetId(petId);
                setMedicalSessions(fetchedMedicalSessions);
            } catch (error) {
                console.error("Error fetching medical sessions:", error);
                Alert.alert('Error', 'Failed to load medical sessions.');
            }
        };



        const fetchAllergies = async () => {
            try {
                const fetchedAllergies = await MedicalHistoryService.getAllergies(petId);
                setAllergies(fetchedAllergies);
            } catch (error) {
                console.error("Error fetching allergies:", error);
                Alert.alert('Error', 'Failed to load allergies.');
            }
        };


        const fetchChronicConditions = async () => {
            try {
                const fetchedChronicConditions = await MedicalHistoryService.getChronicConditions(petId);
                setConditions(fetchedChronicConditions);
            } catch (error) {
                console.error("Error fetching chronic conditions:", error);
                Alert.alert('Error', 'Failed to load chronic conditions.');
            }
        };


        const fetchVaccinations = async () => {
            try {
                const fetchedVaccinations = await MedicalHistoryService.getVaccinations(petId);
                setVaccinations(fetchedVaccinations);
            } catch (error) {
                console.error("Error fetching vaccinations:", error);
                Alert.alert('Error', 'Failed to load vaccinations.');
            }
        };


        const fetchSurgeories = async () => {
            try {
                const fetchedSurgeories = await MedicalHistoryService.getSurgeories(petId);
                setSurgeories(fetchedSurgeories);
            } catch (error) {
                console.error("Error fetching surgeories:", error);
                Alert.alert('Error', 'Failed to load surgeories.');
            }
        };

        const fetchDietaryPreferencesText = async () => {
            try {

                const fetchedDietaryPreferencesText = await MedicalHistoryService.getMedicalHistory(petId);
                if (fetchedDietaryPreferencesText.dietaryPreferences === null) {
                    setDietaryPreferencesText('');
                }
                else {
                    setDietaryPreferencesText(fetchedDietaryPreferencesText.dietaryPreferences);
                }
            } catch (error) {
                console.error("Error fetching dietary preferences:", error);
                Alert.alert('Error', 'Failed to load dietary preferences.');
            }
        };


        const fetchNotesText = async () => {
            try {
                const fetchedNotesText = await MedicalHistoryService.getMedicalHistory(petId);
                if (fetchedNotesText.notes === null) {
                    setNotesText('');
                }
                else {
                    setNotesText(fetchedNotesText.notes);
                }

            } catch (error) {
                console.error("Error fetching notes:", error);
                Alert.alert('Error', 'Failed to load notes.');
            }
        };
        fetchImages();
        fetchNotesText();
        fetchDietaryPreferencesText();
        fetchAllergies();
        fetchChronicConditions();
        fetchVaccinations();
        fetchSurgeories();
        fetchMedicalSessions();


    }, []);


//  console.log(imageUrls);
//  console.log(images);

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


                try {
                    () => { counter = counter + 1; };
                    const medicalHistoryImage = await MedicalHistoryService.uploadMedicalHistoryImages(result.assets[0].uri);
                    setImageUrls([...imageUrls, { id: counter, url: medicalHistoryImage }]);
                    setImages([...images, medicalHistoryImage]);
                    const updatedMedicalHistory = await MedicalHistoryService.updateMedicalHistory({ medicalHistoryImageUrls: [...images, medicalHistoryImage] }, petId);

                } catch (error) {
                    console.error('Error uploading medical history image', error);
                    Alert.alert('Error', 'Failed to load medical history image');

                }


                setError(null);


            }
        }
    };


    const deleteChronicConditionHandle = (id) => {
        MedicalHistoryService.deleteChronicConditionById(id);
        const newChronicConditions = conditions.filter(chronicCondition => chronicCondition.id !== id);
        setConditions(newChronicConditions);
    };

    const deleteAllergyHandle = (id) => {
        const newAllergies = allergies.filter(allergy => allergy.id !== id);
        setAllergies(newAllergies);
        MedicalHistoryService.deleteAllergyById(id);

    };

    const deleteVaccinationHandle = (id) => {
        MedicalHistoryService.deleteVaccinationById(id);
        const newVaccinations = vaccinations.filter(vaccination => vaccination.id !== id);
        setVaccinations(newVaccinations);
    };

    const deleteSurgeoryHandle = (id) => {
        MedicalHistoryService.deleteSurgeoryById(id);
        const newSurgeories = surgeories.filter(surgeory => surgeory.id !== id);
        setSurgeories(newSurgeories);
    };

    const addChronicConditionHandle = async () => {
        if (conditionText === '') {
            Alert.alert('Please enter a chronic condition text before you add it')
        }
        else {
            const newChronicCondition = await MedicalHistoryService.createChronicConditionByPetId({ chronicCondition: conditionText }, petId);

            setConditions([...conditions, newChronicCondition]);
            setConditionText('');
        }
    };

    const addAllergyHandle = async () => {
        if (allergyText === '') {
            Alert.alert('Please enter an allergy text before you add it')
        }
        else {
            const newAllergy = await MedicalHistoryService.createAllergyByPetId({ allergy: allergyText }, petId);

            setAllergies([...allergies, newAllergy]);
            setAllergyText('');
        }
    };

    const addVaccinationHandle = async () => {
        if (vaccinationText === '') {
            Alert.alert('Please enter a vaccination text before you add it')
        }
        else {
            const newVaccination = await MedicalHistoryService.createVaccinationByPetId({ vaccination: vaccinationText }, petId);

            setVaccinations([...vaccinations, newVaccination]);
            setVaccinationText('');
        }
    };

    const addSurgeoryHandle = async () => {
        if (surgeoryText === '') {
            Alert.alert('Please enter a surgeory text before you add it')
        }
        else {
            const newSurgeory = await MedicalHistoryService.createSurgeoryByPetId({ surgeory: surgeoryText }, petId);

            setSurgeories([...surgeories, newSurgeory]);
            setSurgeoryText('');
        }
    };

    const updateMedicalHistory = async () => {

        if (dietaryPreferencesText === '') {
            //const newDietaryPreferences = await MedicalHistoryService.updateMedicalHistory({ dietaryPreferences: null, notes: notesText }, petId);
            const newDietaryPreferences = await MedicalHistoryService.updateMedicalHistory({ medicalHistoryImageUrls: [...images], dietaryPreferences: dietaryPreferencesText, notes: notesText }, petId);

            // setDietaryPreferencesText('');
            // setNotesText('');
        }
        if (notesText === '') {
            const newDietaryPreferences = await MedicalHistoryService.updateMedicalHistory({ medicalHistoryImageUrls: [...images], dietaryPreferences: dietaryPreferencesText, notes: notesText }, petId);
            // setDietaryPreferencesText('');
            // setNotesText('');
        }
        const newDietaryPreferences = await MedicalHistoryService.updateMedicalHistory({ medicalHistoryImageUrls: [...images], dietaryPreferences: dietaryPreferencesText, notes: notesText }, petId);
        setDietaryPreferencesText(newDietaryPreferences.dietaryPreferences);
        setNotesText(newDietaryPreferences.notes);
    };





    const deleteImageHandle = async (id, url) => {
        const newImages = images.filter(image => image !== url);
        setImages(newImages);
        const updatedMedicalHistory = await MedicalHistoryService.updateMedicalHistory({ medicalHistoryImageUrls: [...newImages] }, petId);
        const newImageUrls = imageUrls.filter(imageUrl => imageUrl.id !== id);
        setImageUrls(newImageUrls);
    };








    // const deleteAddedImage = (id) => {
    //     MedicalHistoryService.deleteSurgeoryById(id);
    //     const newSurgeories = surgeories.filter(surgeory => surgeory.id !== id);
    //     setSurgeories(newSurgeories);
    // };

    // const addAddedImage = async () => {
    //     if (conditionText === '') {
    //         Alert.alert('Please enter a chronic condition text before you add it')
    //     }
    //     else {
    //         const newChronicCondition = await MedicalHistoryService.createChronicConditionByPetId({ chronicCondition: conditionText }, petId);

    //         setConditions([...conditions, newChronicCondition]);
    //         setConditionText('');
    //     }
    // };












    return (
        <ScrollView>

            <View>
                <Text style={{ fontSize: 35, marginLeft: 10, alignSelf: 'center', marginTop: 20 }}>Medical History</Text>
                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginVertical: 10, fontSize: 30, color: 'white' }} numberOfLines={1}>Chronic Conditions</Text>
                    <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

                        <TextInput value={conditionText} onChangeText={setConditionText} placeholder='Add chronic condition here' placeholderTextColor={'grey'} style={{ paddingLeft: 10, paddingTop: 'auto', height: 40, marginHorizontal: 10, borderWidth: 2, borderRadius: 8, width: '100%', color: 'white', borderColor: 'white' }} ></TextInput>


                        <TouchableOpacity style={{ width: '15%', backgroundColor: '#A1CEDC', borderRadius: 10, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                            <Text style={{ alignSelf: 'center' }} onPress={() => addChronicConditionHandle()} numberOfLines={1}>Add Condition</Text>
                        </TouchableOpacity>

                    </View>
                    <ScrollView style={{ height: 150, backgroundColor: '#508C9B', borderBottomStartRadius: 20, borderBottomEndRadius: 20 }}>
                        {conditions.map((item) => {
                            return (
                                <View key={item.id} style={{ margin: 10, backgroundColor: '#201E43', borderRadius: 8 }} deleteChronicConditionHandle={deleteChronicConditionHandle}>
                                    <View>
                                        <Text style={{ borderTopEndRadius: 8, borderTopStartRadius: 8, margin: 5, color: 'white' }}>{item.chronicCondition}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                                        <TouchableOpacity style={{ backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8, flex: 1 }}>
                                            <Text style={{ color: 'black', alignSelf: 'center' }} onPress={() => deleteChronicConditionHandle(item.id)}>Delete Condition</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>


                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginVertical: 10, fontSize: 30, color: 'white' }} numberOfLines={1}>Allergies</Text>
                    <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

                        <TextInput value={allergyText} onChangeText={setAllergyText} numberOfLines={4} placeholder='Add allergy here' placeholderTextColor={'grey'} style={{ paddingLeft: 10, paddingTop: 'auto', height: 40, marginHorizontal: 10, borderWidth: 2, borderRadius: 8, width: '100%', color: 'white', borderColor: 'white' }} ></TextInput>


                        <TouchableOpacity style={{ width: '15%', backgroundColor: '#A1CEDC', borderRadius: 10, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                            <Text style={{ alignSelf: 'center' }} onPress={() => addAllergyHandle()} numberOfLines={1}>Add Allergy</Text>
                        </TouchableOpacity>

                    </View>
                    <ScrollView style={{ height: 150, backgroundColor: '#508C9B', borderBottomStartRadius: 20, borderBottomEndRadius: 20 }}>
                        {allergies.map((item) => {
                            return (
                                <View key={item.id} style={{ margin: 10, backgroundColor: '#201E43', borderRadius: 8 }} deleteAllergyHandle={deleteAllergyHandle}>
                                    <View>
                                        <Text style={{ borderTopEndRadius: 8, borderTopStartRadius: 8, margin: 5, color: 'white' }}>{item.allergy}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                                        <TouchableOpacity style={{ backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8, flex: 1 }}>
                                            <Text style={{ color: 'black', alignSelf: 'center' }} onPress={() => deleteAllergyHandle(item.id)}>Delete Allergy</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>

                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginVertical: 10, fontSize: 30, color: 'white' }} numberOfLines={1}>Vaccinations</Text>
                    <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

                        <TextInput value={vaccinationText} onChangeText={setVaccinationText} numberOfLines={4} placeholder='Add vaccination here' placeholderTextColor={'grey'} style={{ paddingLeft: 10, paddingTop: 'auto', height: 40, marginHorizontal: 10, borderWidth: 2, borderRadius: 8, width: '100%', color: 'white', borderColor: 'white' }} ></TextInput>


                        <TouchableOpacity style={{ width: '15%', backgroundColor: '#A1CEDC', borderRadius: 10, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                            <Text style={{ alignSelf: 'center' }} onPress={() => addVaccinationHandle()} numberOfLines={1}>Add Vaccination</Text>
                        </TouchableOpacity>

                    </View>
                    <ScrollView style={{ height: 150, backgroundColor: '#508C9B', borderBottomStartRadius: 20, borderBottomEndRadius: 20 }}>
                        {vaccinations.map((item) => {
                            return (
                                <View key={item.id} style={{ margin: 10, backgroundColor: '#201E43', borderRadius: 8 }} deleteVaccinationHandle={deleteVaccinationHandle}>
                                    <View>
                                        <Text style={{ borderTopEndRadius: 8, borderTopStartRadius: 8, margin: 5, color: 'white' }}>{item.vaccination}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                                        <TouchableOpacity style={{ backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8, flex: 1 }}>
                                            <Text style={{ color: 'black', alignSelf: 'center' }} onPress={() => deleteVaccinationHandle(item.id)}>Delete Vaccination</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>


                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginVertical: 10, fontSize: 30, color: 'white' }} numberOfLines={1}>Surgeories</Text>

                    <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

                        <TextInput value={surgeoryText} onChangeText={setSurgeoryText} numberOfLines={4} placeholder='Add surgeory here' placeholderTextColor={'grey'} style={{ paddingLeft: 10, paddingTop: 'auto', height: 40, marginHorizontal: 10, borderWidth: 2, borderRadius: 8, width: '100%', color: 'white', borderColor: 'white' }} ></TextInput>


                        <TouchableOpacity style={{ width: '15%', backgroundColor: '#A1CEDC', borderRadius: 10, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                            <Text style={{ alignSelf: 'center' }} onPress={() => addSurgeoryHandle()} numberOfLines={1}>Add Surgeory</Text>
                        </TouchableOpacity>

                    </View>
                    <ScrollView style={{ height: 150, backgroundColor: '#508C9B', borderBottomStartRadius: 20, borderBottomEndRadius: 20 }}>
                        {surgeories.map((item) => {
                            return (
                                <View key={item.id} style={{ margin: 10, backgroundColor: '#201E43', borderRadius: 8 }} deleteSurgeoryHandle={deleteSurgeoryHandle}>
                                    <View>
                                        <Text style={{ borderTopEndRadius: 8, borderTopStartRadius: 8, margin: 5, color: 'white' }}>{item.surgeory}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                                        <TouchableOpacity style={{ backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8, flex: 1 }}>
                                            <Text style={{ color: 'black', alignSelf: 'center' }} onPress={() => deleteSurgeoryHandle(item.id)}>Delete Surgeory</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                            )
                        })}
                    </ScrollView>

                </View>





















                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginVertical: 10, fontSize: 30, color: 'white' }} numberOfLines={1}>Medical Sessions</Text>

                    <ScrollView style={{ height: 400, backgroundColor: '#508C9B', borderBottomStartRadius: 20, borderBottomEndRadius: 20 }}>
                        {medicalSessions.map((item) => {
                            return (


                                <View key={item.id} style={{ margin: 10, backgroundColor: '#201E43', borderRadius: 8, paddingHorizontal: 10 }}>
                                    {/* <View>
                                        <Text style={{ borderTopEndRadius: 8, borderTopStartRadius: 8, margin: 5, color: 'white' }}>{item.chronicCondition}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                                        <TouchableOpacity style={{ backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8, flex: 1 }}>
                                            <Text style={{ color: 'black', alignSelf: 'center' }} onPress={() => deleteChronicConditionHandle(item.id)}>Delete Condition</Text>
                                        </TouchableOpacity>
                                    </View> */}
                                    <TouchableOpacity>
                                        <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 3 }}>
                                            <Text style={{ fontWeight: 'bold', color: 'white' }}>By: {item.veterinarian}</Text>
                                            <Text style={{ fontWeight: 'bold', color: 'white' }}> {item.sessionDate}</Text>

                                        </View>


                                        <View style={{ padding: 3, marginBottom: 3, backgroundColor: 'white', borderRadius: 5 }}>
                                            <Text><Text style={{ fontWeight: 'bold' }}>Diagnosis:</Text><Text> {item.symptoms}</Text></Text>
                                        </View>


                                        <View style={{ padding: 3, marginBottom: 3, backgroundColor: 'white', borderRadius: 5 }}>
                                            <Text><Text style={{ fontWeight: 'bold' }}>Treatment:</Text><Text> {item.symptoms}</Text></Text>
                                        </View>


                                        <View style={{ padding: 3, marginBottom: 3, backgroundColor: 'white', borderRadius: 5 }}>
                                            <Text><Text style={{ fontWeight: 'bold' }}>Symptoms:</Text><Text> {item.symptoms}</Text></Text>
                                        </View>


                                        <View style={{ padding: 3, marginBottom: 10, backgroundColor: 'white', borderRadius: 5 }}>
                                            <Text><Text style={{ fontWeight: 'bold' }}>Treatment Plan:</Text><Text> {item.symptoms}</Text></Text>
                                        </View>



                                    </TouchableOpacity>
                                </View>

                            )
                        })}
                    </ScrollView>
                </View>







                <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: 40, marginBottom: 10, marginHorizontal: 10, backgroundColor: '#134B70', borderRadius: 20 }}>

                    <Text style={{ marginLeft: 10, marginVertical: 20, fontSize: 30, color: 'white' }} numberOfLines={1}>Medical History Images </Text>


                    <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 20 }}>
                        <Text style={{ color: 'black', alignSelf: 'center', fontSize: 20 }} onPress={pickImage}>Add new image</Text>
                    </TouchableOpacity>


                    {(imageUrls.length != 0) ? (<ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', height: 400 }} style={{ alignSelf: 'center', width: '100%', backgroundColor: '#508C9B', paddingBottom: 10, borderBottomStartRadius: 20, borderBottomEndRadius: 20 }} showsVerticalScrollIndicator={false}>



                        {imageUrls.map((item) => {
                            return (


                                <View key={item.id} style={{ flexShrink: 1, width: (Platform.OS == 'web' ? '20%' : '40%'), backgroundColor: '#133945', height: 300, margin: 20, borderRadius: 15, justifyContent: 'space-evenly', alignItems: 'center' }} >


                                    <View style={{ width: '90%', height: '40%', maxHeight: 120, maxWidth: 120, marginTop: 5, marginBottom: 4 }}>
                                        <Image source={{ uri: `${BASE_URL_IMAGES}${item.url}` }} style={{ borderRadius: '12%', width: '100%', height: '100%' }} resizeMode="stretch"></Image>
                                    </View>


                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'brown', borderRadius: 18, height: 24, width: '90%', marginVertical: 10 }} deleteImageHandle={deleteImageHandle}>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }} numberOfLines={1} onPress={() => deleteImageHandle(item.id, item.url)}>Delete Image</Text>
                                    </TouchableOpacity>
                                </View>


                            )


                        })}


                        {/* {addedImages.map((item) => {
                            return (

                                <View key={item.id} style={{ width: '13%', backgroundColor: '#133945', height: 300, margin: 20, justifyContent: 'space-between', alignItems: 'center', borderRadius: 15 }}>


                                    <Image source={item.url} style={{ width: '100%', height: '100%' }} resizeMode="contain"></Image>

                                </View>


                            )
                        })} */}


                    </ScrollView>) : (<View style={{ alignItems: 'center', backgroundColor: '#508C9B', width: '100%', borderBottomStartRadius: 20, borderBottomEndRadius: 20 }}><Text style={{ color: '#e9eff5', fontSize: 20, fontFamily: 'bold', marginVertical: 20 }}>No images picked for this medical history</Text></View>)}




                </View>





                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginBottom: 10, fontSize: 30, color: 'white' }} numberOfLines={1}>Dietary preferences</Text>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        value={dietaryPreferencesText}
                        onChangeText={setDietaryPreferencesText}
                        onBlur={updateMedicalHistory}
                        style={{ paddingLeft: 15, paddingTop: 15, color: 'white', borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, borderColor: 'white', borderRadius: 12 }}
                    />
                </View>

                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ alignSelf: 'center', marginLeft: 10, marginBottom: 10, fontSize: 30, color: 'white' }} numberOfLines={1}>Notes about the pet</Text>

                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        value={notesText}
                        onChangeText={setNotesText}
                        onBlur={updateMedicalHistory}
                        style={{ paddingLeft: 15, paddingTop: 15, color: 'white', borderWidth: 2, marginHorizontal: 10, marginBottom: 10, borderColor: 'white', borderRadius: 12 }}
                    />
                </View>


                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, borderRadius: 20 }}>
                    <Link href={{ pathname: "/ManagerStack/AddProduct" }} asChild>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#133945', borderRadius: 18, height: 50, marginVertical: 10 }}>
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }} numberOfLines={1}>Download medical history (PDF)</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({

    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',

    },

});



export default MedicalHistory;


