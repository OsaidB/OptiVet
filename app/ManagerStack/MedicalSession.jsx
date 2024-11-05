import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MedicalSessionService from '../../Services/MedicalSessionService';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import PetService from "../../Services/PetService";

const MedicalSession = () => {
    const router = useRouter();
    const { petId: initialPetId, clientId: initialOwnerId } = useLocalSearchParams(); // Retrieve petId and ownerId from params

    const [sessionDate, setSessionDate] = useState(new Date());
    const [nextAppointmentDate, setNextAppointmentDate] = useState(new Date());

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

    // const [testResultsImageUrl, setTestResultsImageUrl] = useState(null);
    const [testResultsImageUri, setTestResultsImageUri] = useState(null);
    // const [nextAppointmentDate, setNextAppointmentDate] = useState('');
    const [postTreatmentInstructions, setPostTreatmentInstructions] = useState('');

    const [isSessionDatePickerVisible, setSessionDatePickerVisibility] = useState(false);
    const [isNextAppointmentDatePickerVisible, setNextAppointmentDatePickerVisibility] = useState(false);

    useEffect(() => {
        setLoggedInVetId(1); // Temporary static ID
        setVeterinarianId(loggedInVetId);
    }, [loggedInVetId]);

    const showNextAppointmentDatePicker = () => setNextAppointmentDatePickerVisibility(true);
    const hideNextAppointmentDatePicker = () => setNextAppointmentDatePickerVisibility(false);
    const handleConfirmNextAppointmentDate = (selectedDate) => {
        setNextAppointmentDate(selectedDate);
        hideNextAppointmentDatePicker();
    };

    const showSessionDatePicker = () => setSessionDatePickerVisibility(true);
    const hideSessionDatePicker = () => setSessionDatePickerVisibility(false);
    const handleConfirmSessionDate = (selectedDate) => {
        setSessionDate(selectedDate);
        hideSessionDatePicker();
    };

    const handleWebDateChange = (event, setter) => {
        // setSessionDate(new Date(event.target.value));
        setter(new Date(event.target.value));
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission to access media is required!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            // setTestResultsImageUrl(result.assets[0].uri);
            setTestResultsImageUri(result.assets[0].uri);
        } else {
            Alert.alert('No image selected.');
        }
    };

    const handleCreateSession = async () => {
        const formattedSessionDate = sessionDate.toISOString();
        const formattedNextAppointmentDate = nextAppointmentDate.toISOString();

        let testResultsImageUrl = null;

        if (testResultsImageUri) {
            try {
                console.log("Uploading test results image...");
                testResultsImageUrl = await PetService.uploadImage(testResultsImageUri);
                console.log("Image uploaded, URL:", testResultsImageUrl);
            } catch (error) {
                console.error('Error uploading test results image:', error);
                if (Platform.OS !== 'web') {
                    Alert.alert('Error', 'Failed to upload test results image.');
                } else {
                    window.alert('Error: Failed to upload test results image.');
                }
                return;
            }
        }

        const newMedicalSession = {
            sessionDate: formattedSessionDate,
            // petId: Number(petId),
            // ownerId: Number(ownerId),
            petId: 1,
            ownerId: 1,
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
            nextAppointmentDate: formattedNextAppointmentDate,
            postTreatmentInstructions,
        };

        try {
            await MedicalSessionService.createSession(newMedicalSession, veterinarianId);

            // Handle success message and navigation based on the platform
            if (Platform.OS === 'web') {
                window.alert('Medical session created successfully!');
                router.push("../ManagerStack/ManagerAppointmentsScreen");
            } else {
                Alert.alert('Success', 'Medical session created successfully!', [
                    { text: 'OK', onPress: () => router.push("../ManagerStack/ManagerAppointmentsScreen") }
                ]);
            }
        } catch (error) {
            console.error('Error creating medical session:', error);
            if (Platform.OS === 'web') {
                window.alert('Error: Failed to create medical session.');
            } else {
                Alert.alert('Error', 'Failed to create medical session.');
            }
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
                            onChange={(e) => handleWebDateChange(e, setSessionDate)}
                            style={styles.webDatePicker}
                        />
                    ) : (
                        <TouchableOpacity onPress={showSessionDatePicker} style={styles.datePickerButton}>
                            <Text style={styles.datePickerText}>
                                {sessionDate ? sessionDate.toLocaleDateString() : 'Select Session Date'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {Platform.OS !== 'web' && (
                        <DateTimePickerModal
                            isVisible={isSessionDatePickerVisible}
                            mode="datetime"
                            onConfirm={handleConfirmSessionDate}
                            onCancel={hideSessionDatePicker}
                            date={sessionDate}
                        />
                    )}
                </View>

                {/*/!* Basic Information *!/*/}
                {/*<View style={styles.section}>*/}
                {/*    <Text style={styles.sectionTitle}>Basic Information</Text>*/}
                {/*    <PaperTextInput*/}
                {/*        label="Pet ID"*/}
                {/*        value={petId.toString()}*/}
                {/*        onChangeText={setPetId}*/}
                {/*        mode="outlined"*/}
                {/*        style={styles.input}*/}
                {/*    />*/}
                {/*    <PaperTextInput*/}
                {/*        label="Owner ID"*/}
                {/*        value={ownerId.toString()}*/}
                {/*        onChangeText={setOwnerId}*/}
                {/*        mode="outlined"*/}
                {/*        style={styles.input}*/}
                {/*    />*/}
                {/*</View>*/}

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

                {/* Additional Notes Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Additional Notes</Text>

                    <PaperTextInput
                        label="Veterinarian Notes"
                        value={veterinarianNotes}
                        onChangeText={setVeterinarianNotes}
                        mode="outlined"
                        style={styles.input}
                        accessibilityLabel="Veterinarian Notes Input"
                    />

                    <PaperTextInput
                        label="Tests Ordered"
                        value={testsOrdered}
                        onChangeText={setTestsOrdered}
                        mode="outlined"
                        style={styles.input}
                        accessibilityLabel="Tests Ordered Input"
                    />

                    <View style={[styles.rowContainer, styles.input]}>
                        <Text style={styles.sectionTitle}>Test Results:</Text>

                        {/* Image Picker Button for Test Results */}
                        <TouchableOpacity
                            onPress={pickImage}
                            style={styles.photoButton}
                            accessibilityRole="button"
                            accessibilityLabel="Test Results Image Picker"
                        >
                            <Text style={styles.photoButtonText}>
                                {testResultsImageUri ? "Change Image" : "Select Test Results Image"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Follow-Up Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Follow-Up Actions</Text>

                    {/* Next Appointment Date Picker */}
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.inputLabel}>Next Appointment Date</Text>
                        {Platform.OS === 'web' ? (
                            <input
                                type="date"
                                value={nextAppointmentDate ? nextAppointmentDate.toISOString().substring(0, 10) : ""}
                                onChange={(e) => handleWebDateChange(e, setNextAppointmentDate)}
                                style={styles.webDatePicker}
                            />
                        ) : (
                            <TouchableOpacity onPress={showNextAppointmentDatePicker} style={styles.datePickerButton}>
                                <Text style={styles.datePickerText}>
                                    {nextAppointmentDate ? nextAppointmentDate.toLocaleDateString() : 'Select Next Appointment Date'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        {Platform.OS !== 'web' && (
                            <DateTimePickerModal
                                isVisible={isNextAppointmentDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirmNextAppointmentDate}
                                onCancel={hideNextAppointmentDatePicker}
                                date={nextAppointmentDate || new Date()}
                            />
                        )}
                    </View>

                    {/* Post Treatment Instructions */}
                    <PaperTextInput
                        label="Post Treatment Instructions"
                        value={postTreatmentInstructions}
                        onChangeText={setPostTreatmentInstructions}
                        mode="outlined"
                        style={styles.input}
                    />
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

    datePickerContainer: {
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
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
    // datePickerButton: {
    //     backgroundColor: '#e6f7ff',
    //     padding: 12,
    //     borderRadius: 8,
    //     marginBottom: 15,
    //     alignItems: 'center',
    //     borderColor: '#ddd',
    //     borderWidth: 1,
    // },
    // datePickerText: {
    //     fontSize: 16,
    //     color: '#333',
    // },
    // webDatePicker: {
    //     width: '100%',
    //     height: 50,
    //     borderRadius: 8,
    //     borderColor: '#ddd',
    //     borderWidth: 1,
    //     padding: 10,
    //     marginBottom: 15,
    //     fontSize: 16,
    //     backgroundColor: '#f0f8ff',
    // },

    webDatePicker: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    datePickerButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        alignItems: 'center',
    },
    datePickerText: {
        fontSize: 16,
        color: '#333',
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
    photoButton: {
        backgroundColor: '#1D3D47',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        // marginVertical: 10,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",   // Aligns items vertically centered within the row
        justifyContent: "space-between",  // Adjusts spacing between items if needed
    },
    photoButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});


export default MedicalSession;
