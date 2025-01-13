import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, ScrollView, Alert, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../Services/UserService";
import PetService from "../../Services/PetService";
import { Ionicons } from "@expo/vector-icons";

const ManagerStack = () => {
    const [managerInfo, setManagerInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [criticalNotes, setCriticalNotes] = useState(0);
    const [registeredPets, setRegisteredPets] = useState(0);
    const [appointments, setAppointments] = useState(15); // Example value for appointments
    const [clients, setClients] = useState(0);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    Alert.alert("Error", "No email found. Please log in again.");
                }
            } catch (error) {
                Alert.alert("Error", "Failed to retrieve email.");
                console.error(error);
            }
        };

        const fetchManagerInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email);
                setManagerInfo(data);
            } catch (error) {
                Alert.alert("Error", "Failed to load manager information.");
                console.error(error);
            }
        };

        const fetchMetrics = async () => {
            try {
                const [notesCount, petsCount, clientsCount] = await Promise.all([
                    // UserService.getCriticalNotesCount(),
                    // PetService.getPetsCount(),
                    // UserService.getClientsCount(),
                    4,
                   31,
                    17,
                ]);
                setCriticalNotes(notesCount);
                setRegisteredPets(petsCount);
                setClients(clientsCount);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch metrics.");
                console.error(error);
            }
        };

        fetchEmail();
        fetchManagerInfo();
        fetchMetrics();
    }, [email]);

    return (
        <ImageBackground
            source={require("../../assets/images/dog-and-cat.avif")} // Add your background image
            resizeMode="cover" // Adjust how the image fits
            style={styles.backgroundImage}
        >
        <ScrollView contentContainerStyle={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileCard}>
                {/* Static Image */}
                <Image
                    source={require("../../assets/images/dr-ahmad-khalil.jpg")} // Local static image
                    style={styles.profileImage}
                />
                {managerInfo ? (
                    <>
                        <Text style={styles.profileName}>
                            {managerInfo.firstName} {managerInfo.lastName}
                        </Text>
                        <Text style={styles.profileEmail}>{managerInfo.email}</Text>
                    </>
                ) : (
                    <Text style={styles.loadingText}>Loading manager information...</Text>
                )}
            </View>

            {/* Metrics Section */}
            <View style={styles.metricsContainer}>
                <View style={styles.metricBox}>
                    <Ionicons name="alert-circle-outline" size={28} color="#007BFF" />
                    <Text style={styles.metricValue}>{criticalNotes}</Text>
                    <Text style={styles.metricLabel}>Critical Notes</Text>
                </View>
                <View style={styles.metricBox}>
                    <Ionicons name="paw-outline" size={28} color="#007BFF" />
                    <Text style={styles.metricValue}>{registeredPets}</Text>
                    <Text style={styles.metricLabel}>Registered Pets</Text>
                </View>
                <View style={styles.metricBox}>
                    <Ionicons name="calendar-outline" size={28} color="#007BFF" />
                    <Text style={styles.metricValue}>{appointments}</Text>
                    <Text style={styles.metricLabel}>Appointments</Text>
                </View>
                <View style={styles.metricBox}>
                    <Ionicons name="people-outline" size={28} color="#007BFF" />
                    <Text style={styles.metricValue}>{clients}</Text>
                    <Text style={styles.metricLabel}>Registered Clients</Text>
                </View>
            </View>

            {/* Highlights Section */}
            <View style={styles.highlightsSection}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Manage Your Schedule</Text>
                    <Text style={styles.actionDescription}>View and update your availability for appointments.</Text>
                </View>
                <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Handle Walk-In Clients</Text>
                    <Text style={styles.actionDescription}>
                        Quickly address the needs of walk-in clients and their pets.
                    </Text>
                </View>
                <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Important Messages</Text>
                    <Text style={styles.actionDescription}>Stay updated with critical messages and notifications.</Text>
                </View>
            </View>
        </ScrollView>
</ImageBackground>

);
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
    },
    container: {
        flexGrow: 1,
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight white overlay for readability
        padding: 20,
    },
    profileCard: {
        backgroundColor: "#3498DB",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    profileName: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    profileEmail: {
        fontSize: 16,
        color: "#D1E8E2",
    },
    metricsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    metricBox: {
        width: "48%", // Make two boxes fit in one row
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2C3E50",
        marginVertical: 5,
    },
    metricLabel: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    highlightsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1D3D47",
        marginBottom: 15,
    },
    actionCard: {
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 5,
    },
    actionDescription: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
});


export default ManagerStack;
