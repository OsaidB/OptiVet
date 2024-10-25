import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MedicalSessionService from '../../Services/MedicalSessionService';

const MedicalSession = () => {
    const [sessionDate, setSessionDate] = useState(new Date());
    const [petId, setPetId] = useState('');
    const [ownerId, setOwnerId] = useState('');
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

                {/* Cross-platform date picker */}
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

                {/* Input fields for session details */}
                <TextInput style={styles.input} placeholder="Pet ID" value={petId} onChangeText={setPetId} />
                <TextInput style={styles.input} placeholder="Owner ID" value={ownerId} onChangeText={setOwnerId} />
                <TextInput style={styles.input} placeholder="Diagnosis" value={diagnosis} onChangeText={setDiagnosis} />
                <TextInput style={styles.input} placeholder="Treatment" value={treatment} onChangeText={setTreatment} />
                <TextInput style={styles.input} placeholder="Symptoms" value={symptoms} onChangeText={setSymptoms} />
                <TextInput style={styles.input} placeholder="Treatment Plan" value={treatmentPlan} onChangeText={setTreatmentPlan} />
                <TextInput style={styles.input} placeholder="Medications Prescribed" value={medicationsPrescribed} onChangeText={setMedicationsPrescribed} />
                <TextInput style={styles.input} placeholder="Weight (kg)" value={weight} onChangeText={setWeight} />
                <TextInput style={styles.input} placeholder="Temperature (°C)" value={temperature} onChangeText={setTemperature} />
                <TextInput style={styles.input} placeholder="Heart Rate (BPM)" value={heartRate} onChangeText={setHeartRate} />
                <TextInput style={styles.input} placeholder="Veterinarian Notes" value={veterinarianNotes} onChangeText={setVeterinarianNotes} />
                <TextInput style={styles.input} placeholder="Tests Ordered" value={testsOrdered} onChangeText={setTestsOrdered} />
                <TextInput style={styles.input} placeholder="Test Results Image URL" value={testResultsImageUrl} onChangeText={setTestResultsImageUrl} />
                <TextInput style={styles.input} placeholder="Next Appointment Date (YYYY-MM-DD)" value={nextAppointmentDate} onChangeText={setNextAppointmentDate} />
                <TextInput style={styles.input} placeholder="Post Treatment Instructions" value={postTreatmentInstructions} onChangeText={setPostTreatmentInstructions} />

                {/* Button to create the session */}
                <Button title="Create Session" onPress={handleCreateSession} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    datePickerButton: {
        backgroundColor: '#f0f8ff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
    },
    datePickerText: {
        fontSize: 16,
        color: '#333',
    },
    webDatePicker: {
        width: '100%',
        height: 40,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
});

export default MedicalSession;
