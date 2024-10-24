import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import MedicalSessionService from '../../Services/MedicalSessionService'; // Import the service

const MedicalSession = () => {
    // State for the session details
    const [sessionDate, setSessionDate] = useState('');
    const [petId, setPetId] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [veterinarianId, setVeterinarianId] = useState(''); // Veterinarian ID to be passed to the service
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

    // Function to create a new medical session and send it to the backend
    const handleCreateSession = async () => {
        const newMedicalSession = {
            sessionDate,
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
        <View style={styles.container}>
            <Text style={styles.title}>Create Medical Session</Text>

            {/* Input fields for session details */}
            <TextInput
                style={styles.input}
                placeholder="Session Date (YYYY-MM-DD HH:MM:SS)"
                value={sessionDate}
                onChangeText={setSessionDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Pet ID"
                value={petId}
                onChangeText={setPetId}
            />
            <TextInput
                style={styles.input}
                placeholder="Owner ID"
                value={ownerId}
                onChangeText={setOwnerId}
            />
            <TextInput
                style={styles.input}
                placeholder="Veterinarian ID"
                value={veterinarianId}
                onChangeText={setVeterinarianId}
            />
            <TextInput
                style={styles.input}
                placeholder="Diagnosis"
                value={diagnosis}
                onChangeText={setDiagnosis}
            />
            <TextInput
                style={styles.input}
                placeholder="Treatment"
                value={treatment}
                onChangeText={setTreatment}
            />
            <TextInput
                style={styles.input}
                placeholder="Symptoms"
                value={symptoms}
                onChangeText={setSymptoms}
            />
            <TextInput
                style={styles.input}
                placeholder="Treatment Plan"
                value={treatmentPlan}
                onChangeText={setTreatmentPlan}
            />
            <TextInput
                style={styles.input}
                placeholder="Medications Prescribed"
                value={medicationsPrescribed}
                onChangeText={setMedicationsPrescribed}
            />
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
            />
            <TextInput
                style={styles.input}
                placeholder="Temperature (°C)"
                value={temperature}
                onChangeText={setTemperature}
            />
            <TextInput
                style={styles.input}
                placeholder="Heart Rate (BPM)"
                value={heartRate}
                onChangeText={setHeartRate}
            />
            <TextInput
                style={styles.input}
                placeholder="Veterinarian Notes"
                value={veterinarianNotes}
                onChangeText={setVeterinarianNotes}
            />
            <TextInput
                style={styles.input}
                placeholder="Tests Ordered"
                value={testsOrdered}
                onChangeText={setTestsOrdered}
            />
            <TextInput
                style={styles.input}
                placeholder="Test Results Image URL"
                value={testResultsImageUrl}
                onChangeText={setTestResultsImageUrl}
            />
            <TextInput
                style={styles.input}
                placeholder="Next Appointment Date (YYYY-MM-DD)"
                value={nextAppointmentDate}
                onChangeText={setNextAppointmentDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Post Treatment Instructions"
                value={postTreatmentInstructions}
                onChangeText={setPostTreatmentInstructions}
            />

            {/* Button to create the session */}
            <Button title="Create Session" onPress={handleCreateSession} />
        </View>
    );
};

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
});

export default MedicalSession;
