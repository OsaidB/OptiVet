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
    ScrollView,
} from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../Services/UserService";
import { Link } from "expo-router";

export default function ManagerStackLayout() {
    const colorScheme = useColorScheme();
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

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            {/* Header */}
            <View
                style={[
                    styles.header,
                    { backgroundColor: colorScheme === "dark" ? "#1D3D47" : "#A1CEDC" },
                ]}
            >
                <TouchableOpacity style={styles.iconButton}>
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
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
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
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Main Stack Navigation */}
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colorScheme === "dark" ? "#121212" : "#F9F9F9" },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" options={{ title: "Page Not Found" }} />
            </Stack>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: colorScheme === "dark" ? "#1D3D47" : "#FFFFFF" }]}>
                <Link href="/ManagerStack" asChild>
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="home-outline" size={24} color="#FFF" />
                        <Text style={styles.footerButtonText}>Home</Text>
                    </TouchableOpacity>
                </Link>
                {/* Other footer links */}
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFF",
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
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
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
    },
    profileEmail: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    profilePhone: {
        fontSize: 14,
        color: "#666",
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButtonText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    footerButton: {
        alignItems: "center",
    },
    footerButtonText: {
        fontSize: 12,
        marginTop: 5,
        color: "#FFF",
    },
});
