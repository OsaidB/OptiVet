import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MedicalSessionService from '../../Services/MedicalSessionService';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';

const MedicalSession = () => {
    const router = useRouter();
    const { petId: initialPetId, ownerId: initialOwnerId } = useLocalSearchParams(); // Retrieve petId and ownerId from params

    const [sessionDate, setSessionDate] = useState(new Date());

    const [petId, setPetId] = useState(initialPetId || ''); // Initialize with petId from params
    const [ownerId, setOwnerId] = useState(initialOwnerId || ''); // Initialize with ownerId from params

    const [veterinarianId, setVeterinarianId] = useState('');
    const [loggedInVetId, setLoggedInVetId] = useState('');

    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [medicationsPrescribed, setMedicationsPrescribed] = useState('');
    const [weight, setWeight] = useState('');
    const [temperature, setTemperature] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [veterinarianNotes, setVeterinarianNotes] = useState('');
    const [testsOrdered, setTestsOrdered] = useState('');
    const [testResultsImageUrl, setTestResultsImageUrl] = useState('');
    const [nextAppointmentDate, setNextAppointmentDate] = useState('');
    const [postTreatmentInstructions, setPostTreatmentInstructions] = useState('');

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        setLoggedInVetId(1); // Temporary static ID
        setVeterinarianId(loggedInVetId);
    }, [loggedInVetId]);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirmDate = (selectedDate) => {
        setSessionDate(selectedDate);
        hideDatePicker();
    };

    const handleWebDateChange = (event) => {
        setSessionDate(new Date(event.target.value));
    };

    const handleCreateSession = async () => {
        const formattedSessionDate = sessionDate.toISOString();
        const newMedicalSession = {
            sessionDate: formattedSessionDate,
            petId: Number(petId),
            ownerId: Number(ownerId),
            diagnosis,
            treatment,
            symptoms,
            treatmentPlan,
            medicationsPrescribed,
            weight: parseFloat(weight),
            temperature: parseFloat(temperature),
            heartRate: parseInt(heartRate),
            veterinarianNotes,
            testsOrdered,
            testResultsImageUrl,
            nextAppointmentDate,
            postTreatmentInstructions,
        };

        try {
            const response = await MedicalSessionService.createSession(newMedicalSession, veterinarianId);
            Alert.alert('Success', 'Medical session created successfully!');
        } catch (error) {
            console.error('Error creating medical session:', error);
            Alert.alert('Error', 'Failed to create medical session.');
        }
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Create Medical Session</Text>

                {/* Session Date Picker */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Session Date</Text>
                    {Platform.OS === 'web' ? (
                        <input
                            type="datetime-local"
                            value={sessionDate.toISOString().substring(0, 16)}
                            onChange={handleWebDateChange}
                            style={styles.webDatePicker}
                        />
                    ) : (
                        <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                            <Text style={styles.datePickerText}>
                                {sessionDate ? sessionDate.toLocaleDateString() : 'Select Session Date'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {Platform.OS !== 'web' && (
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="datetime"
                            onConfirm={handleConfirmDate}
                            onCancel={hideDatePicker}
                            date={sessionDate}
                        />
                    )}
                </View>

                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <PaperTextInput
                        label="Pet ID"
                        value={petId.toString()}
                        onChangeText={setPetId}
                        mode="outlined"
                        style={styles.input}
                    />
                    <PaperTextInput
                        label="Owner ID"
                        value={ownerId.toString()}
                        onChangeText={setOwnerId}
                        mode="outlined"
                        style={styles.input}
                    />
                </View>

                {/* Medical Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Medical Details</Text>
                    <PaperTextInput label="Diagnosis" value={diagnosis} onChangeText={setDiagnosis} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Treatment" value={treatment} onChangeText={setTreatment} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Symptoms" value={symptoms} onChangeText={setSymptoms} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Treatment Plan" value={treatmentPlan} onChangeText={setTreatmentPlan} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Medications Prescribed" value={medicationsPrescribed} onChangeText={setMedicationsPrescribed} mode="outlined" style={styles.input} />
                </View>

                {/* Vital Signs */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vital Signs</Text>
                    <PaperTextInput label="Weight (kg)" value={weight} onChangeText={setWeight} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Temperature (°C)" value={temperature} onChangeText={setTemperature} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Heart Rate (BPM)" value={heartRate} onChangeText={setHeartRate} mode="outlined" style={styles.input} />
                </View>

                {/* Additional Notes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Additional Notes</Text>
                    <PaperTextInput label="Veterinarian Notes" value={veterinarianNotes} onChangeText={setVeterinarianNotes} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Tests Ordered" value={testsOrdered} onChangeText={setTestsOrdered} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Test Results Image URL" value={testResultsImageUrl} onChangeText={setTestResultsImageUrl} mode="outlined" style={styles.input} />
                </View>

                {/* Follow-Up Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Follow-Up Actions</Text>
                    <PaperTextInput label="Next Appointment Date (YYYY-MM-DD)" value={nextAppointmentDate} onChangeText={setNextAppointmentDate} mode="outlined" style={styles.input} />
                    <PaperTextInput label="Post Treatment Instructions" value={postTreatmentInstructions} onChangeText={setPostTreatmentInstructions} mode="outlined" style={styles.input} />
                </View>

                {/* Button to create the session */}
                <Button mode="contained" onPress={handleCreateSession} style={styles.createButton}>
                    Create Session
                </Button>
            </View>
        </ScrollView>
    );


};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 25,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f0f8ff',
        fontSize: 16,
        color: '#333',
    },
    datePickerButton: {
        backgroundColor: '#e6f7ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    datePickerText: {
        fontSize: 16,
        color: '#333',
    },
    webDatePicker: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f0f8ff',
    },
    createButton: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#6200ee',
        elevation: 3,
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
});


export default MedicalSession;
