import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch, Platform} from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import DailyChecklistService from '../../Services/DailyChecklistService';
import platform from "react-native-web/src/exports/Platform";

const DailyChecklist = () => {
    const router = useRouter();
    const { petId, petName, clientId, checklistId, mode } = useLocalSearchParams();

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
    const [currentChecklist_ID, setCurrentChecklist_ID] = useState('');
    const [loading, setLoading] = useState(true);
    const today = new Date();
    const [checklistDate, setChecklistDate] = useState(today); // Default to today for non-view mode


    const formattedDate = today.toLocaleDateString(undefined, {
        weekday: 'long',
        // year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        const fetchData = async () => {
            console.log("mode: ",mode)
            // Fetch checklist based on mode
            if (mode === "view" && checklistId) {
                await fetchChecklistById(); // Fetch checklist details by ID for view mode
            } else if ((mode === "update" || mode === "create") && petId) {
                await fetchDailyChecklist(); // Fetch today's checklist based on pet ID for update or create mode
            }
        };

        fetchData();
    }, [mode, checklistId, petId]);


    const fetchChecklistById = async () => {
        try {
            setLoading(true);
            console.log("fetching Checklist ById:",checklistId)
            const checklist = await DailyChecklistService.getDailyChecklist_ByRecordId(checklistId);
            setFormData(checklist);
        } catch (error) {
            console.error("Error fetching checklist:", error);
            Alert.alert("Error", "Failed to load checklist.");
        } finally {
            setLoading(false);
        }
    };

    const setFormData = (checklist) => {
        if (!checklist) return;
        console.log("fetched Checklist:",checklist)
        setChecklistDate(new Date(checklist.date)); // Set the checklist date
        setEatingWell(checklist.eatingWell);
        setDrinkingWater(checklist.drinkingWater);
        setActiveBehavior(checklist.activeBehavior);
        setNormalVitalSigns(checklist.normalVitalSigns);
        setHealthObservations(checklist.healthObservations || '');
        setWeightChange(checklist.weightChange || '');
        setInjuriesOrWounds(checklist.injuriesOrWounds || '');
        setFeedingCompleted(checklist.feedingCompleted);
        setCleanedLivingSpace(checklist.cleanedLivingSpace);
        setPoopNormal(checklist.poopNormal);
        setPoopNotes(checklist.poopNotes || '');
        setCriticalIssueFlag(checklist.criticalIssueFlag);
        setCriticalNotes(checklist.criticalNotes || '');
    };





    const fetchDailyChecklist = async () => {
        try {
            setLoading(true);

            const today = new Date().toISOString().split("T")[0];
            const dailyChecklists = await DailyChecklistService.getDailyChecklists_ByPetId(petId); // Fetch all checklists
            console.log("fetching Checklist of today. for PetId:",petId)

            if (Array.isArray(dailyChecklists)) {
                const todayChecklist = dailyChecklists.find((checklist) => checklist.date === today);

                setCurrentChecklist_ID(todayChecklist.id);

                if (todayChecklist) {
                    // Pre-fill the form with today's checklist data
                    setEatingWell(todayChecklist.eatingWell);
                    setDrinkingWater(todayChecklist.drinkingWater);
                    setActiveBehavior(todayChecklist.activeBehavior);
                    setNormalVitalSigns(todayChecklist.normalVitalSigns);
                    setHealthObservations(todayChecklist.healthObservations || '');
                    setWeightChange(todayChecklist.weightChange || '');
                    setInjuriesOrWounds(todayChecklist.injuriesOrWounds || '');
                    setFeedingCompleted(todayChecklist.feedingCompleted);
                    setCleanedLivingSpace(todayChecklist.cleanedLivingSpace);
                    setPoopNormal(todayChecklist.poopNormal);
                    setPoopNotes(todayChecklist.poopNotes || '');
                    setCriticalIssueFlag(todayChecklist.criticalIssueFlag);
                    setCriticalNotes(todayChecklist.criticalNotes || '');

                } else {
                    console.log("No checklist found for today.");
                }
            }
        } catch (error) {
            console.error("Error fetching daily checklist:", error);
            Alert.alert("Error", "Failed to fetch today's checklist.");
        }finally {
            setLoading(false);
        }
    };




    const handleChecklist = async () => {
        if (!poopNormal && poopNotes.trim() === '') {
                if (Platform.OS === 'web') {
                    alert(
                        'Validation Error'                    );
                }else{
                    Alert.alert(
                        'Validation Error',
                        'Please provide notes for poop when "Is poop normal?" is unchecked.'
                    );
                }


            return;
        }

        try {
            const checklistData = {
                date: today.toISOString().split("T")[0], // ISO date for today
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

            if (mode === "update") {
                // const dailyChecklists = await DailyChecklistService.getDailyChecklists_ByPetId(petId);
                // const checklistToUpdate = dailyChecklists.find(
                //     (checklist) => checklist.date === today.toISOString().split("T")[0]
                // );

                if (currentChecklist_ID) {

                    console.log("Updating checklist with ID:", currentChecklist_ID);
                    console.log("Updating checklist with info:", checklistData);

                    await DailyChecklistService.updateDailyChecklist(currentChecklist_ID, checklistData);
                    Alert.alert("Success", "Checklist updated successfully!");
                } else {
                    Alert.alert("Error", "Checklist for today not found.");
                }
            } else {
                console.log("Creating new checklist");
                await DailyChecklistService.createDailyChecklist(checklistData);
                Alert.alert("Success", "Checklist submitted successfully!");
            }

            router.back();
        } catch (error) {
            console.error("Error handling checklist:", error);
            Alert.alert("Error", "Failed to handle the checklist.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading Checklist...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {mode === "view"
                    ? `Checklist for ${petName} - ${checklistDate.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })}`
                    : `Checklist for ${petName} - ${formattedDate}`}
            </Text>

            {/* Health Observations */}
            <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Is {petName} eating well?</Text>
                    <Switch
                        value={eatingWell}
                        onValueChange={setEatingWell}
                        disabled={mode === "view"}
                        style={mode === "view" ? styles.readOnlySwitch : {}}
                    />
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Is {petName} drinking enough water?</Text>
                    <Switch
                        value={drinkingWater}
                        onValueChange={setDrinkingWater}
                        disabled={mode === "view"}
                        style={mode === "view" ? styles.readOnlySwitch : {}}
                    />
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Is {petName} showing active behavior?</Text>
                    <Switch
                        value={activeBehavior}
                        onValueChange={setActiveBehavior}
                        disabled={mode === "view"}
                        style={mode === "view" ? styles.readOnlySwitch : {}}
                    />
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>Are {petName}'s vital signs normal?</Text>
                    <Switch
                        value={normalVitalSigns}
                        onValueChange={setNormalVitalSigns}
                        disabled={mode === "view"}
                        style={mode === "view" ? styles.readOnlySwitch : {}}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Health Observations</Text>
                {mode === "view" ? (
                    <Text style={styles.readOnlyValue}>{healthObservations || "None"}</Text>
                ) : (
                    <TextInput
                        value={healthObservations}
                        onChangeText={setHealthObservations}
                        placeholder="Enter health observations..."
                        style={styles.input}
                    />
                )}
            </View>

            {/* Feeding and Living Space */}
            <View style={styles.rowContainer}>
                <View style={styles.halfWidthSection}>
                    <Text style={styles.label2}>Is feeding completed?</Text>
                    <Switch
                        value={feedingCompleted}
                        onValueChange={setFeedingCompleted}
                        disabled={mode === "view"}
                        style={mode === "view" ? styles.readOnlySwitch : {}}
                    />
                </View>
                <View style={styles.halfWidthSection}>
                    <Text style={styles.label2}>Is living space cleaned?</Text>
                    <Switch
                        value={cleanedLivingSpace}
                        onValueChange={setCleanedLivingSpace}
                        disabled={mode === "view"}
                        style={mode === "view" ? styles.readOnlySwitch : {}}
                    />
                </View>
            </View>

            {/* Poop Observations */}
            <View style={styles.section}>
                <Text style={styles.label2}>Is poop normal?</Text>
                <Switch
                    value={poopNormal}
                    onValueChange={setPoopNormal}
                    disabled={mode === "view"}
                    style={mode === "view" ? styles.readOnlySwitch : {}}
                />
                {!poopNormal && (
                    <>
                        <Text style={styles.label2}>Poop Notes</Text>
                        {mode === "view" ? (
                            <Text style={styles.readOnlyValue}>{poopNotes || "None"}</Text>
                        ) : (
                            <TextInput
                                value={poopNotes}
                                onChangeText={setPoopNotes}
                                placeholder="Enter any notes on poop..."
                                style={styles.input}
                            />
                        )}
                    </>
                )}
            </View>

            {/* Weight and Injuries */}
            <View style={styles.section}>
                <Text style={styles.label2}>Weight Change</Text>
                {mode === "view" ? (
                    <Text style={styles.readOnlyValue}>{weightChange || "None"}</Text>
                ) : (
                    <TextInput
                        value={weightChange}
                        onChangeText={setWeightChange}
                        placeholder="Enter any weight changes..."
                        style={styles.input}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.label2}>Injuries or Wounds</Text>
                {mode === "view" ? (
                    <Text style={styles.readOnlyValue}>{injuriesOrWounds || "None"}</Text>
                ) : (
                    <TextInput
                        value={injuriesOrWounds}
                        onChangeText={setInjuriesOrWounds}
                        placeholder="Describe any injuries or wounds..."
                        style={styles.input}
                    />
                )}
            </View>

            {/* Critical Issue Flag */}
            <View style={styles.section}>
                <Text style={styles.label2}>Mark as Critical Issue</Text>
                <Switch
                    value={criticalIssueFlag}
                    onValueChange={setCriticalIssueFlag}
                    disabled={mode === "view"}
                    style={mode === "view" ? styles.readOnlySwitch : {}}
                />
                {criticalIssueFlag && (
                    <View>
                        <Text style={styles.label2}>Critical Notes</Text>
                        {mode === "view" ? (
                            <Text style={styles.readOnlyValue}>{criticalNotes || "None"}</Text>
                        ) : (
                            <TextInput
                                value={criticalNotes}
                                onChangeText={setCriticalNotes}
                                placeholder="Enter critical notes..."
                                style={styles.input}
                            />
                        )}
                    </View>
                )}
            </View>

            {/* Submit Button */}
            {mode !== "view" && (
                <TouchableOpacity style={styles.submitButton} onPress={handleChecklist}>
                    <Text style={styles.submitButtonText}>
                        {mode === "update" ? "Update Checklist" : "Submit Checklist"}
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );


};

const styles = StyleSheet.create({


    value: {
        fontSize: 16,
        color: '#34495E', // Keep the same text color as editable fields
        backgroundColor: '#FFFFFF', // Match the original background color
        padding: 10,
        borderRadius: 8,
        borderColor: '#E8E8E8', // Lighter border to indicate non-editable
        borderWidth: 1,
        marginTop: 10,
        shadowColor: '#000', // Optional: subtle shadow for depth
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },

    readOnlyValue: {
        opacity: 0.6, // Dim the switch to indicate it's disabled
    },
    readOnlySwitch: {
        opacity: 0.8, // Subtle opacity to indicate it's non-interactive
        color: '#009587',
    },
    // Add this for text display in view mode
    // value: {
    //     fontSize: 16,
    //     color: '#34495E', // Dark gray for text
    //     backgroundColor: '#F8F9FA', // Light gray for read-only
    //     padding: 10,
    //     borderRadius: 8,
    //     borderColor: '#CED6E0', // Light border for clarity
    //     borderWidth: 1,
    //     marginTop: 10,
    // },

    // Add this for loading screen container
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },

    // Add this for loading text style
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#34495E',
        textAlign: 'center',
    },

    // Optional: Add differentiation for view-only rows
    viewModeContainer: {
        backgroundColor: '#F0F4F8', // Subtle background for better readability
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },


    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    halfWidthSection: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },


    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow wrapping to create rows
        justifyContent: 'space-between', // Space out items evenly
        marginBottom: 20,
    },
    gridItem: {
        width: '48%', // Take up approximately half the width
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#34495E', // Neutral dark for labels
        marginBottom: 10,
        textAlign: 'center', // Center-align text for consistency
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F8F9FA', // Neutral background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2C3E50', // Dark gray for title
        textAlign: 'center',
    },
    section: {
        marginBottom: 15,
        backgroundColor: '#FFFFFF', // White background for sections
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label2: {
        fontSize: 16,
        fontWeight: '600',
        color: '#34495E', // Neutral dark for labels
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#CED6E0', // Light gray border
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF', // White background
        color: '#34495E', // Dark text color
        fontSize: 14,
        marginTop: 10,
    },
    submitButton: {
        backgroundColor: '#5DADE2', // Theme soft green
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonText: {
        color: '#FFFFFF', // White text
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
});


export default DailyChecklist;
