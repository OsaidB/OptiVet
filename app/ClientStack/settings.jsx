import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "../../hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClientService from "../../Services/ClientService";

const settings = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [clientInfo, setClientInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClientInfo = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                if (storedEmail) {
                    const data = await ClientService.getClientByEmail(storedEmail);
                    setClientInfo({
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        password: ""
                    });
                }
            } catch (error) {
                console.error("Error fetching client info:", error);
                Alert.alert("Error", "Failed to load manager information.");
            }
        };

        fetchClientInfo();
    }, []);

    const handleUpdateProfile = async () => {
        if (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.email || !clientInfo.phoneNumber) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            const previousEmail = await AsyncStorage.getItem('email');
            const updatedData = {
                firstName: clientInfo.firstName,
                lastName: clientInfo.lastName,
                email: clientInfo.email,
                phoneNumber: clientInfo.phoneNumber,
                ...(clientInfo.password ? { password: clientInfo.password } : {}), // Include password only if changed
            };

            await ClientService.updateClient(clientInfo.id, updatedData);

            // If email was changed, update AsyncStorage
            if (clientInfo.email !== previousEmail) {
                await AsyncStorage.setItem('email', clientInfo.email);
            }

            Alert.alert("Success", "Your profile has been updated successfully.");
            window.alert("Success, Your profile has been updated successfully.")
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <View style={styles.container}>
                <Text style={styles.title}>Update Profile</Text>

                {/* First Name */}
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#1D3D47" />
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        value={clientInfo.firstName}
                        onChangeText={(text) => setClientInfo({ ...clientInfo, firstName: text })}
                    />
                </View>

                {/* Last Name */}
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#1D3D47" />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        value={clientInfo.lastName}
                        onChangeText={(text) => setClientInfo({ ...clientInfo, lastName: text })}
                    />
                </View>

                {/*/!* Email *!/*/}
                {/*<View style={styles.inputContainer}>*/}
                {/*    <Ionicons name="mail-outline" size={20} color="#1D3D47" />*/}
                {/*    <TextInput*/}
                {/*        style={styles.input}*/}
                {/*        placeholder="Email"*/}
                {/*        keyboardType="email-address"*/}
                {/*        value={clientInfo.email}*/}
                {/*        onChangeText={(text) => setClientInfo({ ...clientInfo, email: text })}*/}
                {/*    />*/}
                {/*</View>*/}

                {/* Phone */}
                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#1D3D47" />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                        value={clientInfo.phoneNumber}
                        onChangeText={(text) => setClientInfo({ ...clientInfo, phoneNumber: text })}
                    />
                </View>

                {/*/!* Password *!/*/}
                {/*<View style={styles.inputContainer}>*/}
                {/*    <Ionicons name="lock-closed-outline" size={20} color="#1D3D47" />*/}
                {/*    <TextInput*/}
                {/*        style={styles.input}*/}
                {/*        placeholder="New Password (optional)"*/}
                {/*        secureTextEntry*/}
                {/*        value={clientInfo.password}*/}
                {/*        placeholderTextColor={'#a19f9f'}*/}
                {/*        onChangeText={(text) => setClientInfo({ ...clientInfo, password: text })}*/}
                {/*    />*/}
                {/*</View>*/}

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
                </TouchableOpacity>

                {/*/!* Logout Button at Bottom *!/*/}
                {/*<View style={styles.footer}>*/}
                {/*    <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("")}>*/}
                {/*        <Ionicons name="log-out-outline" size={24} color="#FFF" />*/}
                {/*        <Text style={styles.logoutText}>Logout</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}
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
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1D3D47",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#1D3D47",

    },
    saveButton: {
        backgroundColor: "#1D3D47",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    saveButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        width: "100%",
        paddingHorizontal: 20,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D9534F",
        paddingVertical: 15,
        borderRadius: 12,
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

export default settings;
