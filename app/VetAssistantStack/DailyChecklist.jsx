import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import DailyChecklistService from '../../Services/DailyChecklistService';

const DailyChecklist = () => {
    const router = useRouter();
    const { petId, petName, clientId } = useLocalSearchParams();

    const [eatingWell, setEatingWell] = useState(false);
    const [drinkingWater, setDrinkingWater] = useState(false);
    const [activeBehavior, setActiveBehavior] = useState(false);
    const [normalVitalSigns, setNormalVitalSigns] = useState(false);
    const [healthObservations, setHealthObservations] = useState('');
    const [weightChange, setWeightChange] = useState('');
    const [injuriesOrWounds, setInjuriesOrWounds] = useState('');
    const [feedingCompleted, setFeedingCompleted] = useState(false);
    const [cleanedLivingSpace, setCleanedLivingSpace] = useState(false);
    const [poopNormal, setPoopNormal] = useState(false);
    const [poopNotes, setPoopNotes] = useState('');
    const [criticalIssueFlag, setCriticalIssueFlag] = useState(false);
    const [criticalNotes, setCriticalNotes] = useState('');

    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleSubmitChecklist = async () => {
        try {
            const checklistData = {
                date: today.toISOString(),
                petId,
                eatingWell,
                drinkingWater,
                activeBehavior,
                normalVitalSigns,
                healthObservations,
                weightChange,
                injuriesOrWounds,
                feedingCompleted,
                cleanedLivingSpace,
                poopNormal,
                poopNotes,
                criticalIssueFlag,
                criticalNotes,
            };

            await DailyChecklistService.submitChecklist(checklistData);
            Alert.alert('Success', 'Checklist submitted successfully!');
            router.back();
        } catch (error) {
            console.error("Error submitting checklist:", error);
            Alert.alert('Error', 'Failed to submit checklist.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Daily Checklist for {petName} - Today, {formattedDate}</Text>

            {/* Health Observations */}
            <View style={styles.section}>
                <Text style={styles.label}>Is {petName} eating well?</Text>
                <Switch value={eatingWell} onValueChange={setEatingWell} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Is {petName} drinking enough water?</Text>
                <Switch value={drinkingWater} onValueChange={setDrinkingWater} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Is {petName} showing active behavior?</Text>
                <Switch value={activeBehavior} onValueChange={setActiveBehavior} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Are {petName}'s vital signs normal?</Text>
                <Switch value={normalVitalSigns} onValueChange={setNormalVitalSigns} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Health Observations</Text>
                <TextInput
                    value={healthObservations}
                    onChangeText={setHealthObservations}
                    placeholder="Enter health observations..."
                    style={styles.input}
                />
            </View>

            {/* Feeding and Living Space */}
            <View style={styles.section}>
                <Text style={styles.label}>Is feeding completed?</Text>
                <Switch value={feedingCompleted} onValueChange={setFeedingCompleted} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Is living space cleaned?</Text>
                <Switch value={cleanedLivingSpace} onValueChange={setCleanedLivingSpace} />
            </View>

            {/* Poop Observations */}
            <View style={styles.section}>
                <Text style={styles.label}>Is poop normal?</Text>
                <Switch value={poopNormal} onValueChange={setPoopNormal} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Poop Notes</Text>
                <TextInput
                    value={poopNotes}
                    onChangeText={setPoopNotes}
                    placeholder="Enter any notes on poop..."
                    style={styles.input}
                />
            </View>

            {/* Weight and Injuries */}
            <View style={styles.section}>
                <Text style={styles.label}>Weight Change</Text>
                <TextInput
                    value={weightChange}
                    onChangeText={setWeightChange}
                    placeholder="Enter any weight changes..."
                    style={styles.input}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Injuries or Wounds</Text>
                <TextInput
                    value={injuriesOrWounds}
                    onChangeText={setInjuriesOrWounds}
                    placeholder="Describe any injuries or wounds..."
                    style={styles.input}
                />
            </View>

            {/* Critical Issue Flag */}
            <View style={styles.section}>
                <Text style={styles.label}>Mark as Critical Issue</Text>
                <Switch value={criticalIssueFlag} onValueChange={setCriticalIssueFlag} />
            </View>

            {criticalIssueFlag && (
                <View style={styles.section}>
                    <Text style={styles.label}>Critical Notes</Text>
                    <TextInput
                        value={criticalNotes}
                        onChangeText={setCriticalNotes}
                        placeholder="Enter critical notes..."
                        style={styles.input}
                    />
                </View>
            )}

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
    section: {
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
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DailyChecklist;
