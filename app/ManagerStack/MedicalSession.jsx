import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const MedicalSession = () => {
    // State for the session details
    const [petName, setPetName] = useState('');
    const [vetName, setVetName] = useState('');
    const [sessionDate, setSessionDate] = useState('');
    const [sessionDetails, setSessionDetails] = useState('');
    const [vitalSigns, setVitalSigns] = useState('');
    const [sessionNotes, setSessionNotes] = useState('');

    // Handle session creation (this can be extended to API call logic)
    const handleCreateSession = () => {
        const sessionSummary = `Session for ${petName} with ${vetName} on ${sessionDate}`;
        console.log(sessionSummary);
        console.log('Session details:', sessionDetails);
        console.log('Vital signs:', vitalSigns);
        console.log('Session notes:', sessionNotes);

        // Here you can call an API to save the session
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Medical Session</Text>

            {/* Input fields for session details */}
            <TextInput
                style={styles.input}
                placeholder="Pet Name"
                value={petName}
                onChangeText={setPetName}
            />
            <TextInput
                style={styles.input}
                placeholder="Vet Name"
                value={vetName}
                onChangeText={setVetName}
            />
            <TextInput
                style={styles.input}
                placeholder="Session Date"
                value={sessionDate}
                onChangeText={setSessionDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Session Details"
                value={sessionDetails}
                onChangeText={setSessionDetails}
            />
            <TextInput
                style={styles.input}
                placeholder="Vital Signs"
                value={vitalSigns}
                onChangeText={setVitalSigns}
            />
            <TextInput
                style={styles.input}
                placeholder="Session Notes"
                value={sessionNotes}
                onChangeText={setSessionNotes}
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
