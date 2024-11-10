import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
// import ChecklistService from '../../Services/ChecklistService';

const DailyChecklist = () => {
    const router = useRouter();
    const { petId, petName, clientId } = useLocalSearchParams();
    const [healthStatus, setHealthStatus] = useState('');
    const [feedingNotes, setFeedingNotes] = useState('');
    const [groomingNotes, setGroomingNotes] = useState('');
    const [otherObservations, setOtherObservations] = useState('');
    const [isCritical, setIsCritical] = useState(false);

    // Get the current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Function to handle checklist submission
    const handleSubmitChecklist = async () => {
        try {
            const checklistData = {
                petId,
                healthStatus,
                feedingNotes,
                groomingNotes,
                otherObservations,
                isCritical,
            };
            // await ChecklistService.submitChecklist(checklistData);
            Alert.alert('Success', 'Checklist submitted successfully!');
            router.back(); // Go back to the previous screen
        } catch (error) {
            console.error("Error submitting checklist:", error);
            Alert.alert('Error', 'Failed to submit checklist.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Daily Checklist for {petName} - Today, {formattedDate}</Text>

            {/* Health Status */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Health Status</Text>
                <TextInput
                    value={healthStatus}
                    onChangeText={setHealthStatus}
                    placeholder="Enter health status..."
                    style={styles.input}
                />
            </View>

            {/* Feeding Notes */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Feeding Notes</Text>
                <TextInput
                    value={feedingNotes}
                    onChangeText={setFeedingNotes}
                    placeholder="Enter feeding notes..."
                    style={styles.input}
                />
            </View>

            {/* Grooming Notes */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Grooming Notes</Text>
                <TextInput
                    value={groomingNotes}
                    onChangeText={setGroomingNotes}
                    placeholder="Enter grooming notes..."
                    style={styles.input}
                />
            </View>

            {/* Other Observations */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Other Observations</Text>
                <TextInput
                    value={otherObservations}
                    onChangeText={setOtherObservations}
                    placeholder="Enter any other observations..."
                    style={styles.input}
                />
            </View>

            {/* Mark as Critical */}
            <View style={styles.criticalContainer}>
                <Text style={styles.label}>Mark as Critical</Text>
                <TouchableOpacity
                    style={[styles.criticalButton, isCritical ? styles.criticalButtonActive : null]}
                    onPress={() => setIsCritical(!isCritical)}
                >
                    <Text style={styles.criticalButtonText}>{isCritical ? "Marked as Critical" : "Mark as Critical"}</Text>
                </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitChecklist}>
                <Text style={styles.submitButtonText}>Submit Checklist</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    criticalContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    criticalButton: {
        backgroundColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    criticalButtonActive: {
        backgroundColor: '#FF6B6B', // Red color for critical state
    },
    criticalButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DailyChecklist;
