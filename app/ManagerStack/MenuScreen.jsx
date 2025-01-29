import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "../../hooks/useColorScheme";
import AuthService from "../../Services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../Services/UserService";
import Toast from "react-native-toast-message";

const MenuScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [managerInfo, setManagerInfo] = useState(null);

    useEffect(() => {
        const fetchManagerInfo = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                if (storedEmail) {
                    const data = await UserService.getUserByEmail(storedEmail);
                    setManagerInfo(data);
                }
            } catch (error) {
                console.error("Error fetching manager info:", error);
                Alert.alert("Error", "Failed to load manager information.");
            }
        };

        fetchManagerInfo();
    }, []);

    const handleLogout = async () => {
        try {
            const success = await AuthService.logout();
            if (success) {
                Toast.show({
                    type: 'success',
                    text1: 'Logged Out',
                    text2: 'You have been successfully logged out.',
                });
                //toggleModal(); // Close the modal
                router.replace(''); // Redirect to the login screen
            } else {
                Alert.alert('Logout Failed', 'An error occurred during logout. Please try again.');
            }
        } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Logout Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    {/* Profile Info */}
                    <View style={styles.profileCard}>
                        <Ionicons name="person-circle" size={50} color="#1D3D47" />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.profileName}>
                                {managerInfo?.firstName} {managerInfo?.lastName}
                            </Text>
                            <Text style={styles.profileEmail}>{managerInfo?.email}</Text>
                        </View>
                    </View>

                    {/* Settings Options */}
                    <TouchableOpacity style={styles.optionCard} onPress={() => router.push("/ManagerStack/ManagerSettings")}>
                        <Ionicons name="person-outline" size={24} color="#1D3D47" />
                        <Text style={styles.optionText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={24} color="#A1CEDC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionCard} onPress={() => router.push("/ManagerStack/AddEmployee")}>
                        <Ionicons name="person-add-outline" size={24} color="#1D3D47" />
                        <Text style={styles.optionText}>Add New Employee</Text>
                        <Ionicons name="chevron-forward" size={24} color="#A1CEDC" />
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={styles.optionCard} onPress={() => router.push("/ManagerStack/PrivacyScreen")}>*/}
                    {/*    <Ionicons name="lock-closed-outline" size={24} color="#1D3D47" />*/}
                    {/*    <Text style={styles.optionText}>Privacy & Security</Text>*/}
                    {/*    <Ionicons name="chevron-forward" size={24} color="#A1CEDC" />*/}
                    {/*</TouchableOpacity>*/}

                </ScrollView>
                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FFF" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ThemeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6F2F2",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#1D3D47",
        elevation: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    iconButton: {
        padding: 5,
    },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },
    profileTextContainer: {
        marginLeft: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1D3D47",
    },
    profileEmail: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
        justifyContent: "space-between",
    },
    optionText: {
        fontSize: 16,
        fontWeight: "500",
        flex: 1,
        marginLeft: 10,
        color: "#1D3D47",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D9534F",
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 30,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    logoutText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
});

export default MenuScreen;
