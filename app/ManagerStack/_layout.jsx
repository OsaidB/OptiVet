import React, { useEffect, useState } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    Image,
    ScrollView, Platform,
} from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../Services/UserService";
import { Link, useRouter } from "expo-router";
import AuthService from "../../Services/authService";
import Toast from "react-native-toast-message";

import AuthGuard from '../AuthGuard';
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Import the AuthGuard component

export default function ManagerStackLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter(); // Reintroducing the router for navigation
    const [managerInfo, setManagerInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state

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

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };



    // Logout function
    const handleLogout = async () => {
        try {
            const success = await AuthService.logout();
            if (success) {
                Toast.show({
                    type: 'success',
                    text1: 'Logged Out',
                    text2: 'You have been successfully logged out.',
                });
                toggleModal(); // Close the modal
                router.replace(''); // Redirect to the login screen
            } else {
                Alert.alert('Logout Failed', 'An error occurred during logout. Please try again.');
            }
        } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Logout Error', 'Something went wrong. Please try again.');
        }
    };

    if (!managerInfo) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading Veterinarian data...</Text>
            </View>
        );
    }

    return (
        <AuthGuard allowedRoles={['MANAGER', 'VET']}> {/* Ensure only clients can access this stack */}

            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            {/* Header */}
            <View
                style={[
                    styles.header,
                    { backgroundColor : "#A1CEDC" },
                ]}
            >
                {/* Menu Navigation Button */}
                <TouchableOpacity
                    onPress={() => router.push("/ManagerStack/MenuScreen")}
                    style={styles.iconButton}
                >
                    <Ionicons name="menu" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🐾OptiVet</Text>
                <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
                    <Ionicons name="person-circle" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Modal for Profile Information */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType={Platform.OS === 'web' ? 'none' : 'slide'}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Close Icon */}
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                            <FontAwesome name="close" size={24} color="black" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Profile Information</Text>
                        {/* Static Image */}
                        <Image
                            source={require("../../assets/images/dr-ahmad-khalil.jpg")} // Local static image
                            style={styles.profileImage}
                        />
                        {managerInfo ? (
                            <>
                                {/*<Image*/}
                                {/*    source={{ uri: "https://via.placeholder.com/100" }}*/}
                                {/*    style={styles.profileImage}*/}
                                {/*/>*/}
                                <Text style={styles.profileName}>
                                    {managerInfo.firstName} {managerInfo.lastName}
                                </Text>
                                <Text style={styles.profileEmail}>{managerInfo.email}</Text>
                                <Text style={styles.profilePhone}>
                                    Phone: {managerInfo.phoneNumber || "N/A"}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.loadingText}>Loading profile...</Text>
                        )}

                        <View>

                            <TouchableOpacity onPress={handleLogout} style={styles.logOutButton}>
                                <FontAwesome name="sign-out" size={20} color="#FFFFFF" />
                                <Text style={styles.logOutButtonText}>Logout</Text>
                            </TouchableOpacity>

                            {/*<TouchableOpacity onPress={toggleModal} style={styles.closeButton}>*/}
                            {/*    <Text style={styles.closeButtonText}>Close</Text>*/}
                            {/*</TouchableOpacity>*/}
                        </View>


                    </View>
                </View>
            </Modal>

            {/* Main Stack Navigation */}
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#F9F9F9" },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" options={{ title: "Page Not Found" }} />
            </Stack>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor:  "#1D3D47"  }]}>
                <Link href="/ManagerStack" asChild>
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="home-outline" size={24} color="#FFF" />
                        <Text style={styles.footerButtonText}>Home</Text>
                    </TouchableOpacity>
                </Link>
                <Link
                    href={{
                        pathname: "/ManagerStack/ManagerAppointmentsScreen",
                        params: { userId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="calendar-outline" size={24} color="#FFF" />
                        <Text style={styles.footerButtonText}>Appointments</Text>
                    </TouchableOpacity>
                </Link>
                <Link
                    href={{
                        pathname: "/ManagerStack/WalkInClientsScreen",
                        params: { userId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="people-outline" size={24} color="#FFF" />
                        <Text style={styles.footerButtonText}>Walk-in Clients</Text>
                    </TouchableOpacity>
                </Link>
                <Link
                    href={{
                        pathname: "/ManagerStack/MsgsScreen",
                        params: { userId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="chatbox-outline" size={24} color="#FFF" />
                        <Text style={styles.footerButtonText}>Critical Messages</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ThemeProvider>
        </AuthGuard>
    );
}

const styles = StyleSheet.create({
    logOutButton: {
        marginTop: 15,
        backgroundColor: "#E74C3C",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    logOutButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        marginLeft: 5
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#D1E1F6",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    iconButton: {
        padding: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#2C3E50",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#2C3E50",
    },
    profileEmail: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 5,
    },
    profilePhone: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "#2C3E50",
    },
    footerButton: {
        alignItems: "center",
    },
    footerButtonText: {
        fontSize: 12,
        marginTop: 5,
        color: "#D1E1F6",
    },
});
