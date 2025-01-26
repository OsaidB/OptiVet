import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AuthService from "../../Services/authService"; // Import AuthService for logout logic

const MenuScreen = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const success = await AuthService.logout();
            if (success) {
                console.log("Logged out successfully");
                router.replace(""); // Redirect to the login screen
            } else {
                Alert.alert("Logout Failed", "An error occurred during logout. Please try again.");
            }
        } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Logout Error", "Something went wrong. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menu</Text>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => {
                    console.log("Navigating to Settings");
                    router.push("/ManagerStack/SettingsScreen"); // Replace with your settings screen route
                }}
            >
                <Text style={styles.menuButtonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => {
                    console.log("Navigating to create an employee");
                    router.push("/ManagerStack/AddEmployee"); // Replace with your settings screen route
                }}
            >
                <Text style={styles.menuButtonText}>Add Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
                <Text style={styles.menuButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F7FA",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1D3D47",
        marginBottom: 30,
    },
    menuButton: {
        backgroundColor: "#1D3D47",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
        alignItems: "center",
    },
    menuButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default MenuScreen;
