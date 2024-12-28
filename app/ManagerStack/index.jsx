import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Alert, Image, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../Services/UserService";
import ManagerStackLayout from './_layout'; // Adjust path as needed

const ManagerStack = () => {
    const [managerInfo, setManagerInfo] = useState(null);
    const [email, setEmail] = useState(null);
    // console.log(ManagerStackLayout);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    console.error("No email found in AsyncStorage");
                    Alert.alert("Error", "No email found. Please log in again.");
                }
            } catch (error) {
                console.error("Error fetching email from AsyncStorage:", error);
                Alert.alert("Error", "Failed to retrieve email.");
            }
        };

        const fetchManagerInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email);
                setManagerInfo(data);
            } catch (error) {
                console.error("Error fetching manager info:", error);
                Alert.alert("Error", "Failed to load manager information.");
            }
        };

        fetchEmail();
        fetchManagerInfo();
    }, [email]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Profile Header */}
            <View style={styles.profileCard}>
                <Image
                    source={{ uri: "https://via.placeholder.com/100" }}
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

            {/* Navigation Buttons */}
            <View style={styles.navSection}>
                <Text style={styles.sectionTitle}>Appointments</Text>
                <Link
                    href={{
                        pathname: "/ManagerStack/ManagerScheduleScreen",
                        params: { userId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>Manage Your Schedule</Text>
                    </TouchableOpacity>
                </Link>

                <Link
                    href={{
                        pathname: "/ManagerStack/ManagerAppointmentsScreen",
                        params: { userId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>View Appointments</Text>
                    </TouchableOpacity>
                </Link>

                <Text style={styles.sectionTitle}>Clients</Text>
                <Link
                    href={{
                        pathname: "/ManagerStack/WalkInClientsScreen",
                        params: { vetId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>Handle Walk-in Clients</Text>
                    </TouchableOpacity>
                </Link>

                <Text style={styles.sectionTitle}>Other</Text>
                <Link
                    href={{
                        pathname: "/ManagerStack/MsgsScreen",
                        params: { userId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>Important Messages</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="ManagerStack/AddEmployee" asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>Create Employee Account</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#F3F7FA",
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    profileCard: {
        alignItems: "center",
        backgroundColor: "#007BFF",
        padding: 20,
        borderRadius: 12,
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 22,
        color: "white",
        fontWeight: "bold",
    },
    profileEmail: {
        fontSize: 16,
        color: "#D1E8E2",
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
    navSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1D3D47",
        marginBottom: 10,
    },
    navButton: {
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
        alignItems: "center",
    },
    navButtonText: {
        fontSize: 16,
        color: "#1D3D47",
        fontWeight: "bold",
    },
});

export default ManagerStack;
