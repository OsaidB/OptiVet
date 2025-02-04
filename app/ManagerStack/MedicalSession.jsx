import React, { useEffect, useState } from 'react';
import {ScrollView, View, Text, StyleSheet, Alert, TouchableOpacity, Platform, Image, Switch} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MedicalSessionService from '../../Services/MedicalSessionService';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import PetService from "../../Services/PetService";
import AppointmentService from '../../Services/AppointmentService';
import {format, parseISO} from "date-fns";
import {Picker} from "@react-native-picker/picker";


const MedicalSession = () => {
    const router = useRouter();
    const { petId: initialPetId, clientId: initialOwnerId, appointmentId:initialAppointmentId,vetId:initialVetId,returnTo}= useLocalSearchParams(); // Retrieve petId and ownerId from params

    const { userId } = useLocalSearchParams(); // Retrieve userId from params

    const [sessionDate, setSessionDate] = useState(new Date());
    const [nextAppointmentDate, setNextAppointmentDate] = useState(new Date());
    const [nextAppointmentTime, setNextAppointmentTime] = useState(new Date());

    const [petId, setPetId] = useState(initialPetId || ''); // Initialize with petId from params
    const [ownerId, setOwnerId] = useState(initialOwnerId || ''); // Initialize with ownerId from params
    const [appointmentId, setAppointmentId] = useState(initialAppointmentId || ''); // Initialize with ownerId from params

    const [vetId, setVetId] = useState(initialVetId || '');
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
    const [testResultsImages, setTestResultsImages] = useState([]); // Array to store multiple images
    // const [nextAppointmentDate, setNextAppointmentDate] = useState('');
    const [postTreatmentInstructions, setPostTreatmentInstructions] = useState('');

    const [isSessionDatePickerVisible, setSessionDatePickerVisibility] = useState(false);
    const [isNextAppointmentDatePickerVisible, setNextAppointmentDatePickerVisibility] = useState(false);
    const [isNextAppointmentTimePickerVisible, setNextAppointmentTimePickerVisibility] = useState(false);

    const [availableSlots, setAvailableSlots] = useState([]);
    const GAP_BETWEEN_APPOINTMENTS = 5;
    const [duration, setDuration] = useState(30); // Default duration
    const [isNextAppointmentEnabled, setNextAppointmentEnabled] = useState(false);
    // useEffect(() => {
    //     setLoggedInVetId(userId); // Temporary static ID
    //     setVeterinarianId(loggedInVetId);
    // }, [loggedInVetId]);

    // Handlers for Date and Time Pickers
    const showSessionDatePicker = () => setSessionDatePickerVisibility(true);
    const hideSessionDatePicker = () => setSessionDatePickerVisibility(false);
    const handleConfirmSessionDate = (selectedDate) => {
        setSessionDate(selectedDate);
        hideSessionDatePicker();
    };

    const showNextAppointmentDatePicker = () => setNextAppointmentDatePickerVisibility(true);
    const hideNextAppointmentDatePicker = () => setNextAppointmentDatePickerVisibility(false);
    const handleConfirmNextAppointmentDate = (selectedDate) => {
        setNextAppointmentDate(selectedDate);
        hideNextAppointmentDatePicker();
    };

    const showNextAppointmentTimePicker = () => setNextAppointmentTimePickerVisibility(true);
    const hideNextAppointmentTimePicker = () => setNextAppointmentTimePickerVisibility(false);
    const handleConfirmNextAppointmentTime = (selectedTime) => {
        setNextAppointmentTime(selectedTime);
        hideNextAppointmentTimePicker();
    };


    // const handleWebTimeChange = (event, setter) => {
    //     const [hours, minutes] = event.target.value.split(":");
    //     const updatedTime = new Date();
    //     updatedTime.setHours(hours);
    //     updatedTime.setMinutes(minutes);
    //     setter(updatedTime);
    // };

    const handleWebDateChange = (event, setter) => {
        // setSessionDate(new Date(event.target.value));
        setter(new Date(event.target.value));
    };

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const slots = await AppointmentService.getAppointmentsByVetId(userId);
                setAvailableSlots(slots);
            } catch (error) {
                console.error('Error fetching available slots:', error);
            }
        };
        fetchSlots();
    }, [userId]);

    // useEffect(() => {
    //     const slotsForSelectedDate = availableSlots.filter(slot =>
    //         format(parseISO(slot.appointmentDate), 'yyyy-MM-dd') === nextAppointmentDate
    //     );
    //     setFilteredSlots(slotsForSelectedDate);
    // }, [availableSlots, nextAppointmentDate]);

    const isOverlapping = (startTime, endTime) => {
        if (!availableSlots.length) return false; // ✅ No slots = No overlap

        return availableSlots.some((slot) => {
            const existingStart = parseISO(slot.appointmentDate);
            const existingEnd = new Date(existingStart);
            existingEnd.setMinutes(existingEnd.getMinutes() + (slot.duration || duration) + GAP_BETWEEN_APPOINTMENTS);

            return (
                (startTime >= existingStart && startTime < existingEnd) ||  // ❌ New start falls inside existing slot
                (endTime > existingStart && endTime <= existingEnd) ||  // ❌ New end falls inside existing slot
                (startTime <= existingStart && endTime >= existingEnd)   // ❌ New slot completely overlaps existing
            );
        });
    };




    const handleAddNextAppointment = async () => {
        const formattedTime = format(nextAppointmentTime, 'HH:mm');
        const appointmentDateTime = `${format(nextAppointmentDate, 'yyyy-MM-dd')}T${formattedTime}:00`;

        const newStart = new Date(appointmentDateTime);
        const newEnd = new Date(newStart);
        newEnd.setMinutes(newEnd.getMinutes() + duration);

        // Check for overlapping slots
        if (isOverlapping(newStart, newEnd)) {
            if (Platform.OS === 'web'){
                window.alert('Error, This time slot overlaps with an existing appointment.');
            } else {
                Alert.alert('Error', 'This time slot overlaps with an existing appointment.');
            }
            return;
        }

        const appointmentData = {
            appointmentDate: appointmentDateTime,
            vetId: userId,
            clientId: ownerId,
            petId: petId,
            duration: duration,
            status: 'SCHEDULED',
        };

        try {
            const newSlot = await AppointmentService.createAppointment(appointmentData);
            setAvailableSlots([...availableSlots, newSlot]);
            Alert.alert('Success', 'Follow-up appointment created successfully!');
        } catch (error) {
            console.error('Error saving appointment slot:', error);
            Alert.alert('Error', 'Failed to save the appointment slot. Please try again.');
        }
    }

    const pickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission to access media is required!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setTestResultsImages((prevImages) => [...prevImages, ...result.assets.map((asset) => asset.uri)]);
        } else {
            Alert.alert('No images selected.');
        }
    };

    const removeImage = (uri) => {
        setTestResultsImages((prevImages) => prevImages.filter((image) => image !== uri));
    };

    const updateAppointmentStatus = async (appointmentId) => {
        if (!appointmentId) {
            console.error("Appointment ID is missing");
            return;
        }

        //const currentAppointment = appointmentId.find(appointment => appointment.id === appointmentId);
        const currentAppointment = await AppointmentService.getAppointmentById(appointmentId);
        if (!currentAppointment) {
            console.error("Appointment not found");
            return;
        }

        const updatedData = {
            appointmentDate: currentAppointment.appointmentDate,
            clientId: currentAppointment.clientId,
            petId: currentAppointment.petId,
            vetId: currentAppointment.vetId,
            status: 'DONE',
            duration: currentAppointment.duration,
        };

        try {
            await AppointmentService.updateAppointment(appointmentId, updatedData);
            //Alert.alert('Success', 'Appointment deleted successfully.');
            // fetchAppointments(); // Refresh appointments list after deletion
        } catch (error) {
            console.error(`Error updating appointment with ID: ${appointmentId}`, error.response?.data || error);
            Alert.alert('Error', 'Failed to update the appointment. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(date);
    };

    const handleCreateSession = async () => {
        const formattedSessionDate = sessionDate.toISOString();
        const formattedNextAppointmentDate = nextAppointmentDate;

        // const newStart = new Date(formattedSessionDate);
        // const newEnd = new Date(newStart);
        // newEnd.setMinutes(newEnd.getMinutes() + duration);
        //
        // // 🔴 Check for overlap before creating the session
        // if (isOverlapping(newStart, newEnd)) {
        //     let latestEndTime = new Date(0);
        //
        //     availableSlots.forEach((slot) => {
        //         const slotStart = parseISO(slot.appointmentDate);
        //         const slotEnd = new Date(slotStart);
        //         slotEnd.setMinutes(slotEnd.getMinutes() + (slot.duration || duration) + GAP_BETWEEN_APPOINTMENTS);
        //
        //         if (slotEnd > latestEndTime) {
        //             latestEndTime = slotEnd;
        //         }
        //     });
        //
        //     // ✅ Dynamically find the next available slot
        //     const suggestedTime = new Date(latestEndTime);
        //     suggestedTime.setMinutes(suggestedTime.getMinutes() + GAP_BETWEEN_APPOINTMENTS);
        //     const suggestedTimeFormatted = format(suggestedTime, "yyyy-MM-dd HH:mm");
        //
        //     const errorMessage = `Error: This session overlaps with an existing appointment.\n\n💡 Try scheduling after ${suggestedTimeFormatted}.`;
        //
        //     if (Platform.OS === "web") {
        //         window.alert(errorMessage);
        //     } else {
        //         Alert.alert("Time Slot Conflict", errorMessage);
        //     }
        //     return;
        // }


        const uploadedImageUrls = [];
        for (const imageUri of testResultsImages) {
            try {
                const imageUrl = await PetService.uploadImage(imageUri);
                uploadedImageUrls.push(imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
                if (Platform.OS !== 'web') {
                    Alert.alert('Error', 'Failed to upload one or more images.');
                } else {
                    window.alert('Error: Failed to upload one or more images.');
                }
                return;
            }
        }

        const newMedicalSession = {
            sessionDate: formattedSessionDate,
            petId: Number(petId),
            ownerId: Number(ownerId),
            // petId: 2,
            // ownerId: 1,
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
            testResultsImageUrls: uploadedImageUrls, // Save all uploaded image URLs
            nextAppointmentDate: isNextAppointmentEnabled ? nextAppointmentDate : null,
            postTreatmentInstructions,
        };

        try {

            await MedicalSessionService.createSession(newMedicalSession, userId);

            if(appointmentId){
                await updateAppointmentStatus(appointmentId);
            }
            // await updateAppointmentStatus(appointmentId);

            if(isNextAppointmentEnabled){
                await handleAddNextAppointment();
            }


        // Handle success message and navigation based on the platform
            if (Platform.OS === "web") {
                window.alert("Medical session created successfully!");
                if (returnTo === "WalkInClientsScreen") {
                    router.push("/ManagerStack/WalkInClientsScreen");
                } else if (returnTo === "ManagerAppointmentsScreen") {
                    router.push({
                        pathname: "/ManagerStack/ManagerAppointmentsScreen",
                        params: { userId },
                    });
                } else {
                    router.push({
                        pathname: "/ManagerStack",
                        params: { userId },
                    });
                }
            } else {
                Alert.alert("Success", "Medical session created successfully!", [
                    {
                        text: "OK",
                        onPress: () => {
                            if (returnTo === "WalkInClientsScreen") {
                                router.push("/ManagerStack/WalkInClientsScreen");
                            } else if (returnTo === "ManagerAppointmentsScreen") {
                                router.push({
                                    pathname: "/ManagerStack/ManagerAppointmentsScreen",
                                    params: { userId },
                                });
                            } else {
                                router.push({
                                    pathname: "/ManagerStack",
                                    params: { userId },
                                });
                            }
                        },
                    },
                ]);
            }
        } catch (error) {
            console.error("Error creating medical session:", error);
            if (Platform.OS === "web") {
                window.alert("Error: Failed to create medical session.");
            } else {
                Alert.alert("Error", "Failed to create medical session.");
            }
        }
    };

    const renderPicker = () => {
        if (Platform.OS === 'ios') {
            return (
                <View>
                    {/*Duration Selection */}
                    <View style={styles.iosPickerContainer}>
                        <Text style={styles.sectionTitle}>Select Duration</Text>
                        <Picker
                            selectedValue={duration}
                            onValueChange={(itemValue) => setDuration(itemValue)}
                            style={{ color: 'black', height: 50, width: '100%', justifyContent:'flex-start', alignItems: 'center', marginBottom: 10 }}
                            itemStyle={{ color: 'black', height: 50, width: '100%' }}
                        >
                            <Picker.Item label="30 minutes" value={30} />
                            <Picker.Item label="1 hour" value={60} />
                            <Picker.Item label="1.5 hours" value={90} />
                            <Picker.Item label="2 hours" value={120} />
                            <Picker.Item label="2.5 hours" value={150} />
                            <Picker.Item label="3 hours" value={180} />
                        </Picker>
                    </View>
                </View>
            );
        }

        if (Platform.OS === 'android') {
            return (
                <View>
                    {/*Duration Selection */}
                    <View style={styles.iosPickerContainer}>
                        <Text style={styles.sectionTitle}>Select Duration</Text>
                        <Picker
                            selectedValue={duration}
                            onValueChange={(itemValue) => setDuration(itemValue)}
                            style={{ color: 'black', height: 70, width: '100%', justifyContent:'flex-start', backgroundColor:'#f0f0f0', marginBottom:10}}
                            itemStyle={{ color: 'black', height: 50, width: '100%' }}
                        >
                            <Picker.Item label="30 minutes" value={30} />
                            <Picker.Item label="1 hour" value={60} />
                            <Picker.Item label="1.5 hours" value={90} />
                            <Picker.Item label="2 hours" value={120} />
                            <Picker.Item label="2.5 hours" value={150} />
                            <Picker.Item label="3 hours" value={180} />
                        </Picker>
                    </View>
                </View>
            );
        }

        // Web Platform
        return (
            <View>
                <Text style={styles.sectionTitle}>Select Duration</Text>
                <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    style={styles.picker}

                >
                    <option value={30}>30 minutes Appointment</option>
                    <option value={60}>1 hour Appointment</option>
                    <option value={90}>1.5 hours Appointment</option>
                    <option value={120}>2 hours Appointment</option>
                    <option value={150}>2.5 hours Appointment</option>
                    <option value={180}>3 hours Appointment</option>
                </select>
            </View>
        );
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
                                {sessionDate ? format(sessionDate, 'yyyy-MM-dd HH:mm') : 'Select Session Date'}
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

                    <View>
                        <Text style={styles.sectionTitle}>Test Results:</Text>

                        {/* Image Picker Button for Test Results */}
                        <TouchableOpacity
                            onPress={pickImages}
                            style={styles.photoButton}
                            accessibilityRole="button"
                            accessibilityLabel="Test Results Image Picker"
                        >
                            <Text style={styles.photoButtonText}>Select Test Results Images</Text>
                        </TouchableOpacity>

                        {/* Display Selected Images with Delete Buttons */}
                        <ScrollView horizontal>
                            {testResultsImages.map((uri, index) => (
                                <View key={index} style={styles.photoContainer}>
                                    <Image source={{ uri }} style={styles.testResultImage} />
                                    <TouchableOpacity onPress={() => removeImage(uri)} style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>


                {/* Toggle for Follow-Up Appointment */}
                <View style={styles.section}>
                    <View style={styles.toggleContainer}>
                        <Text style={styles.sectionTitle}>Schedule Follow-Up Appointment?</Text>
                        <Switch
                            value={isNextAppointmentEnabled}
                            onValueChange={setNextAppointmentEnabled}
                        />
                    </View>
                    {isNextAppointmentEnabled && (
                        <>
                            {/* Next Appointment Date */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Next Appointment Date</Text>
                                {Platform.OS === 'web' ? (
                                    <input
                                        type="date"
                                        value={format(nextAppointmentDate, 'yyyy-MM-dd')}
                                        onChange={(e) => setNextAppointmentDate(new Date(e.target.value))}
                                        style={styles.webDatePicker}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        onPress={showNextAppointmentDatePicker}
                                        style={styles.datePickerButton}
                                    >
                                        <Text style={styles.datePickerText}>
                                            {nextAppointmentDate
                                                ? format(nextAppointmentDate, 'yyyy-MM-dd')
                                                : 'Select Date'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {Platform.OS !== 'web' && (
                                    <DateTimePickerModal
                                        isVisible={isNextAppointmentDatePickerVisible}
                                        mode="date"
                                        onConfirm={handleConfirmNextAppointmentDate}
                                        onCancel={hideNextAppointmentDatePicker}
                                        date={nextAppointmentDate}
                                    />
                                )}
                            </View>

                            {/* Next Appointment Time */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Next Appointment Time</Text>
                                {Platform.OS === 'web' ? (
                                    <input
                                        type="time"
                                        value={`${nextAppointmentTime
                                            .getHours()
                                            .toString()
                                            .padStart(2, '0')}:${nextAppointmentTime
                                            .getMinutes()
                                            .toString()
                                            .padStart(2, '0')}`}
                                        onChange={(e) => {
                                            const [hours, minutes] = e.target.value.split(':');
                                            const updatedTime = new Date();
                                            updatedTime.setHours(hours);
                                            updatedTime.setMinutes(minutes);
                                            setNextAppointmentTime(updatedTime);
                                        }}
                                        style={styles.webDatePicker}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        onPress={showNextAppointmentTimePicker}
                                        style={styles.datePickerButton}
                                    >
                                        <Text style={styles.datePickerText}>
                                            {nextAppointmentTime ? format(nextAppointmentTime, 'HH:mm') : 'Select Time'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {Platform.OS !== 'web' && (
                                    <DateTimePickerModal
                                        isVisible={isNextAppointmentTimePickerVisible}
                                        mode="time"
                                        onConfirm={handleConfirmNextAppointmentTime}
                                        onCancel={hideNextAppointmentTimePicker}
                                        date={nextAppointmentTime}
                                    />
                                )}
                            </View>

                            {/* Duration Picker */}
                            {renderPicker()}
                        </>
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
        marginBottom: 10,
    },
    datePickerText: {
        fontSize: 16,
        color: '#333',
    },
    photoButton: {
        backgroundColor: 'rgba(29,61,71,0.55)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        // marginVertical: 10,
    },
    pickerItem: {
        fontSize: 16,
        color: 'black'
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
    photoContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        position: 'relative',
    },
    testResultImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    createButton: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#5DADE2',
        elevation: 3,
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    picker: {
        height: 50,
        backgroundColor: '#f0f0f0',
        marginBottom: 10
    },
    toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});


export default MedicalSession;
