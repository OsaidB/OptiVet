import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, Button, button, Input, Alert } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MedicalHistoryService from "../../Services/MedicalHistoryService";
import PetService from '../../Services/PetService';
import baseURL from '../../Services/config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/medicalHistories`;
//import { useRouter } from 'expo-router';
//import { useRoute } from '@react-navigation/native';
import MedicalSessionService from '../../Services/MedicalSessionService';
//import { newDate } from 'react-datepicker/dist/date_utils';


export default function MedicalHistory() {
    const [conditionText, setConditionText] = useState('');
    const [allergyText, setAllergyText] = useState('');
    const [vaccinationText, setVaccinationText] = useState('');
    const [surgeoryText, setSurgeoryText] = useState('');
    const [conditions, setConditions] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [surgeories, setSurgeories] = useState([]);

    const { petId } = useLocalSearchParams(); // Retrieve clientId dynamically


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

        fetchNotesText();
        fetchDietaryPreferencesText();
        fetchAllergies();
        fetchChronicConditions();
        fetchVaccinations();
        fetchSurgeories();
        fetchMedicalSessions();


    }, []);

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
            const newDietaryPreferences = await MedicalHistoryService.updateMedicalHistory({ dietaryPreferences: null, notes: notesText }, petId);
            setDietaryPreferencesText('');
            setNotesText('');
        }
        if (notesText === '') {
            const newDietaryPreferences = await MedicalHistoryService.updateMedicalHistory({ dietaryPreferences: dietaryPreferencesText, notes: null }, petId);
            setDietaryPreferencesText('');
            setNotesText('');
        }
        const newDietaryPreferences = await MedicalHistoryService.updateMedicalHistory({ dietaryPreferences: dietaryPreferencesText, notes: notesText }, petId);
        setDietaryPreferencesText(newDietaryPreferences.dietaryPreferences);
        setNotesText(newDietaryPreferences.notes);
    };

    return (
        <ScrollView>
            <View>
                <Text style={{ fontSize: 35, marginLeft: 10 }}>Medical History:</Text>
                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25, color: 'white' }}>Chronic Conditions:</Text>
                    <View style={{ margin: 10, flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 3, margin: 10 }}>
                            <TextInput value={conditionText} onChangeText={setConditionText} multiline numberOfLines={4} placeholder='add Chronic Condition Here' placeholderTextColor={'grey'} style={{ borderWidth: 2, borderRadius: 8, color: 'white', borderColor: 'white' }} ></TextInput>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'orange', alignSelf: 'center', borderWidth: 2, borderRadius: 8, borderColor: 'black' }}>
                            <TouchableOpacity>
                                <Text style={{ flex: 1, alignSelf: 'center' }} onPress={() => addChronicConditionHandle()}>Add Condition</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{ height: 150, backgroundColor: '#508C9B' }}>
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
                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25, color: 'white' }}>Allergies:</Text>
                    <View style={{ margin: 10, flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 3, margin: 10 }}>
                            <TextInput value={allergyText} onChangeText={setAllergyText} multiline numberOfLines={4} placeholder='add Chronic Condition Here' placeholderTextColor={'grey'} style={{ borderWidth: 2, borderRadius: 8, color: 'white', borderColor: 'white' }} ></TextInput>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'orange', alignSelf: 'center', borderWidth: 2, borderRadius: 8, borderColor: 'black' }}>
                            <TouchableOpacity>
                                <Text style={{ flex: 1, alignSelf: 'center' }} onPress={() => addAllergyHandle()}>Add Allergy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{ height: 150, backgroundColor: '#508C9B' }}>
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
                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25, color: 'white' }}>Vaccinations:</Text>
                    <View style={{ margin: 10, flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 3, margin: 10 }}>
                            <TextInput value={vaccinationText} onChangeText={setVaccinationText} multiline numberOfLines={4} placeholder='add Chronic Condition Here' placeholderTextColor={'grey'} style={{ borderWidth: 2, borderRadius: 8, color: 'white', borderColor: 'white' }} ></TextInput>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'orange', alignSelf: 'center', borderWidth: 2, borderRadius: 8, borderColor: 'black' }}>
                            <TouchableOpacity>
                                <Text style={{ flex: 1, alignSelf: 'center' }} onPress={() => addVaccinationHandle()}>Add Vaccination</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{ height: 150, backgroundColor: '#508C9B' }}>
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
                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25, color: 'white' }}>Surgeories:</Text>
                    <View style={{ margin: 10, flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 3, margin: 10 }}>
                            <TextInput value={surgeoryText} onChangeText={setSurgeoryText} multiline numberOfLines={4} placeholder='add Chronic Condition Here' placeholderTextColor={'grey'} style={{ borderWidth: 2, borderRadius: 8, color: 'white', borderColor: 'white' }} ></TextInput>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'orange', alignSelf: 'center', borderWidth: 2, borderRadius: 8, borderColor: 'black' }}>
                            <TouchableOpacity>
                                <Text style={{ flex: 1, alignSelf: 'center' }} onPress={() => addSurgeoryHandle()}>Add Surgeory</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{ height: 150, backgroundColor: '#508C9B' }}>
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
                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25, color: 'white' }}>Medical Sessions: </Text>

                    <ScrollView style={{ height: 400, backgroundColor: '#508C9B' }}>
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
                                            <Text style={{ fontWeight: 'bold', color: 'white' }}> {item.sessiondate}</Text>

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


















                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25, color: 'white' }}>Dietary Preferences:</Text>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        value={dietaryPreferencesText}
                        onChangeText={setDietaryPreferencesText}
                        onBlur={updateMedicalHistory}
                        style={{ color: 'white', borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, borderColor: 'white' }}
                    />
                </View>

                <View style={{ marginTop: 40, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#134B70', borderRadius: 20 }}>
                    <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25, color: 'white' }}>Notes About The Pet:</Text>

                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        value={notesText}
                        onChangeText={setNotesText}
                        onBlur={updateMedicalHistory}
                        style={{ color: 'white', borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, borderColor: 'white' }}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
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