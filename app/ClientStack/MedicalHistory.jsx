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
    const petId = 2;

    // Fetches and sets each piece of medical history data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setAllergies(await MedicalHistoryService.getAllergies(petId));
                setConditions(await MedicalHistoryService.getChronicConditions(petId));
                setVaccinations(await MedicalHistoryService.getVaccinations(petId));
                setSurgeries(await MedicalHistoryService.getSurgeories(petId));

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
    const deleteSurgery = (id) => handleDeleteItem(id, surgeries, setSurgeries, MedicalHistoryService.deleteSurgeoryById);

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
    const addSurgery = () => handleAddItem(surgeryText, setSurgeryText, setSurgeries, MedicalHistoryService.createSurgeoryByPetId, "surgeory");

    // Updates dietary preferences and notes
    const updateMedicalHistory = async () => {
        try {
            const updatedHistory = await MedicalHistoryService.updateMedicalHistory({
                dietaryPreferences: dietaryPreferencesText || null,
                notes: notesText || null,
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
        backgroundColor: '#F7F3FC', // Very light lavender for a clean background
        padding: 20,
    },
    sectionContainer: {
        backgroundColor: '#EDE7F6', // Light lavender with a slight tint for subtle contrast
        borderRadius: 15,
        padding: 20,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 22,
        color: '#4A3B53', // Soft, deep lavender for primary text
        marginBottom: 15,
        fontWeight: '700',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    textInput: {
        flex: 3,
        height: 40,
        borderColor: '#D1C4E9', // Light purple for input borders
        borderWidth: 1.5,
        borderRadius: 10,
        color: '#4A3B53', // Darker text for readability
        backgroundColor: '#FAF8FC', // Slightly off-white to soften the input area
        paddingHorizontal: 12,
        fontSize: 16,
        marginRight: 10,
    },
    addButton: {
        flex: 1,
        backgroundColor: '#D4A5A5', // Soft peach-pink for button backgrounds
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: '#4A3B53', // Darker text color on buttons
        fontWeight: '600',
        fontSize: 15,
    },
    scrollView: {
        maxHeight: 150,
        backgroundColor: '#EFE3F4', // Very light lavender-pink for list background
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    listItemContainer: {
        backgroundColor: '#D9CDE4', // Soft muted purple for items
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    itemText: {
        color: '#4A3B53',
        fontSize: 16,
        fontWeight: '500',
    },
    deleteButton: {
        backgroundColor: '#E8A2A2', // Soft muted pink for delete button
        borderRadius: 10,
        paddingVertical: 5,
        marginTop: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    deleteButtonText: {
        color: '#4A3B53',
        fontWeight: '700',
    },
    textArea: {
        color: '#4A3B53',
        borderWidth: 1.5,
        borderColor: '#D1C4E9', // Light purple for border
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        height: 90,
        backgroundColor: '#FAF8FC', // Soft off-white background
        marginTop: 10,
    },
});

