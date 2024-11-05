import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MedicalHistoryService from "../../Services/MedicalHistoryService";

export default function MedicalHistory() {
    const [conditionText, setConditionText] = useState('');
    const [allergyText, setAllergyText] = useState('');
    const [vaccinationText, setVaccinationText] = useState('');
    const [surgeryText, setSurgeryText] = useState('');

    const [conditions, setConditions] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [surgeries, setSurgeries] = useState([]);

    const [dietaryPreferencesText, setDietaryPreferencesText] = useState('');
    const [notesText, setNotesText] = useState('');
    const petId = 30;

    // Fetches and sets each piece of medical history data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setAllergies(await MedicalHistoryService.getAllergies(petId));
                setConditions(await MedicalHistoryService.getChronicConditions(petId));
                setVaccinations(await MedicalHistoryService.getVaccinations(petId));
                setSurgeries(await MedicalHistoryService.getSurgeries(petId));

                const medicalHistory = await MedicalHistoryService.getMedicalHistory(petId);
                setDietaryPreferencesText(medicalHistory.dietaryPreferences || '');
                setNotesText(medicalHistory.notes || '');
            } catch (error) {
                console.error("Error fetching medical history:", error);
                Alert.alert('Error', 'Failed to load medical history.');
            }
        };
        fetchData();
    }, []);

    // Generalized delete handler to remove items from lists
    const handleDeleteItem = async (id, items, setItems, serviceMethod) => {
        try {
            await serviceMethod(id);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
            Alert.alert("Error", "Failed to delete item.");
        }
    };

    const deleteChronicCondition = (id) => handleDeleteItem(id, conditions, setConditions, MedicalHistoryService.deleteChronicConditionById);
    const deleteAllergy = (id) => handleDeleteItem(id, allergies, setAllergies, MedicalHistoryService.deleteAllergyById);
    const deleteVaccination = (id) => handleDeleteItem(id, vaccinations, setVaccinations, MedicalHistoryService.deleteVaccinationById);
    const deleteSurgery = (id) => handleDeleteItem(id, surgeries, setSurgeries, MedicalHistoryService.deleteSurgeryById);

    // Generalized add handler to add items to lists
    const handleAddItem = async (text, setText, setItems, serviceMethod, type) => {
        if (!text.trim()) {
            Alert.alert(`Please enter a ${type.toLowerCase()} before adding.`);
            return;
        }
        try {
            const newItem = await serviceMethod({[type]: text.trim()}, petId);
            setItems(prevItems => [...prevItems, newItem]);
            setText('');
        } catch (error) {
            console.error(`Error adding ${type.toLowerCase()}:`, error);
            Alert.alert("Error", `Failed to add ${type.toLowerCase()}.`);
        }
    };

    const addChronicCondition = () => handleAddItem(conditionText, setConditionText, setConditions, MedicalHistoryService.createChronicConditionByPetId, "chronicCondition");
    const addAllergy = () => handleAddItem(allergyText, setAllergyText, setAllergies, MedicalHistoryService.createAllergyByPetId, "allergy");
    const addVaccination = () => handleAddItem(vaccinationText, setVaccinationText, setVaccinations, MedicalHistoryService.createVaccinationByPetId, "vaccination");
    const addSurgery = () => handleAddItem(surgeryText, setSurgeryText, setSurgeries, MedicalHistoryService.createSurgeryByPetId, "surgery");

    // Updates dietary preferences and notes
    const updateMedicalHistory = async () => {
        try {
            const updatedHistory = await MedicalHistoryService.updateMedicalHistory({
                dietaryPreferences: dietaryPreferencesText.trim() || null,
                notes: notesText.trim() || null,
            }, petId);
            setDietaryPreferencesText(updatedHistory.dietaryPreferences);
            setNotesText(updatedHistory.notes);
        } catch (error) {
            console.error("Error updating medical history:", error);
            Alert.alert("Error", "Failed to update medical history.");
        }
    };


    return (
        <ScrollView>
            <View>
                <Text style={{ fontSize: 35, marginLeft: 10 }}>Medical History:</Text>

                {/* Chronic Conditions Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Chronic Conditions:</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            value={conditionText}
                            onChangeText={setConditionText}
                            multiline
                            numberOfLines={4}
                            placeholder="Add Chronic Condition Here"
                            placeholderTextColor="grey"
                            style={styles.textInput}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addChronicCondition}>
                            <Text style={styles.buttonText}>Add Condition</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        {conditions.map((item) => (
                            <View key={item.id} style={styles.listItemContainer}>
                                <Text style={styles.itemText}>{item.chronicCondition}</Text>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteChronicCondition(item.id)}>
                                    <Text style={styles.deleteButtonText}>Delete Condition</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Allergies Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Allergies:</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            value={allergyText}
                            onChangeText={setAllergyText}
                            multiline
                            numberOfLines={4}
                            placeholder="Add Allergy Here"
                            placeholderTextColor="grey"
                            style={styles.textInput}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
                            <Text style={styles.buttonText}>Add Allergy</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        {allergies.map((item) => (
                            <View key={item.id} style={styles.listItemContainer}>
                                <Text style={styles.itemText}>{item.allergy}</Text>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAllergy(item.id)}>
                                    <Text style={styles.deleteButtonText}>Delete Allergy</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Vaccinations:</Text>

                    <View style={styles.inputRow}>
                        <TextInput
                            value={vaccinationText}
                            onChangeText={setVaccinationText}
                            multiline
                            numberOfLines={4}
                            placeholder="Add Vaccination Here"
                            placeholderTextColor="grey"
                            style={styles.textInput}
                        />

                        <TouchableOpacity style={styles.addButton} onPress={addVaccination}>
                            <Text style={styles.buttonText}>Add Vaccination</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {vaccinations.map((item) => (
                            <View key={item.id} style={styles.listItemContainer}>
                                <Text style={styles.itemText}>{item.vaccination}</Text>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteVaccination(item.id)}>
                                    <Text style={styles.deleteButtonText}>Delete Vaccination</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Surgeries:</Text>

                    <View style={styles.inputRow}>
                        <TextInput
                            value={surgeryText}
                            onChangeText={setSurgeryText}
                            multiline
                            numberOfLines={4}
                            placeholder="Add Surgery Here"
                            placeholderTextColor="grey"
                            style={styles.textInput}
                        />

                        <TouchableOpacity style={styles.addButton} onPress={addSurgery}>
                            <Text style={styles.buttonText}>Add Surgery</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {surgeries.map((item) => (
                            <View key={item.id} style={styles.listItemContainer}>
                                <Text style={styles.itemText}>{item.surgery}</Text>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSurgery(item.id)}>
                                    <Text style={styles.deleteButtonText}>Delete Surgery</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Dietary Preferences:</Text>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        value={dietaryPreferencesText}
                        onChangeText={setDietaryPreferencesText}
                        onBlur={updateMedicalHistory}
                        style={styles.textArea}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Notes About The Pet:</Text>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={3}
                        value={notesText}
                        onChangeText={setNotesText}
                        onBlur={updateMedicalHistory}
                        style={styles.textArea}
                    />
                </View>

            </View>
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9EABA2', // Main background color
        padding: 20,
    },
    sectionContainer: {
        backgroundColor: '#A36361', // Primary color for section background
        borderRadius: 12,
        padding: 15,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 22,
        color: '#FFFFFF',
        marginBottom: 10,
        fontWeight: '700',
        paddingLeft: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
    },
    textInput: {
        flex: 3,
        height: 45,
        borderColor: '#BDD1C5', // Light green for input borders
        borderWidth: 1.5,
        borderRadius: 8,
        color: '#FFFFFF',
        backgroundColor: '#E8B298', // Light peach color for input background
        paddingHorizontal: 10,
        marginRight: 10,
        fontSize: 16,
    },
    addButton: {
        flex: 1,
        backgroundColor: '#D3A29D', // Accent color for button background
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        height: 45,
    },
    buttonText: {
        color: '#1A1A1A',
        fontWeight: 'bold',
        fontSize: 14,
    },
    scrollView: {
        maxHeight: 150,
        backgroundColor: '#BDD1C5', // Light green for scroll view background
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginHorizontal: 10,
    },
    listItemContainer: {
        backgroundColor: '#E8B298', // Light peach color for list items
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: 8,
        marginHorizontal: 5,
    },
    itemText: {
        color: '#A36361', // Primary color for text within list items
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: '#EECC8C', // Light yellow for delete button
        borderRadius: 8,
        paddingVertical: 5,
        alignItems: 'center',
        marginTop: 8,
    },
    deleteButtonText: {
        color: '#1A1A1A',
        fontWeight: 'bold',
        fontSize: 14,
    },
    textArea: {
        color: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#BDD1C5', // Light green border for text areas
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        fontSize: 16,
        height: 90,
        backgroundColor: '#E8B298', // Light peach for text area background
    },
});