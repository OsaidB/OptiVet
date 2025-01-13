import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useRouter, usePathname } from 'expo-router';
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../Services/UserService";


export default function ManagerStackLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
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
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC' }]}>
                <TouchableOpacity onPress={() => router.push("/ManagerStack/MenuScreen")} style={styles.iconButton}>
                    <Ionicons name="menu" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manager Dashboard</Text>
                <TouchableOpacity onPress={() => console.log('Profile pressed')} style={styles.iconButton}>
                    <Ionicons name="person-circle" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Main Stack Navigation */}
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colorScheme === 'dark' ? '#121212' : '#F9F9F9' },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
            </Stack>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#FFFFFF' }]}>
                <Link href="/ManagerStack" asChild>
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="home-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
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
                        <Ionicons name="calendar-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                        <Text style={styles.footerButtonText}>Appointments</Text>
                    </TouchableOpacity>
                </Link>
                <Link
                    href={{
                        pathname: "/ManagerStack/WalkInClientsScreen",
                        params: { vetId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="people-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                        <Text style={styles.footerButtonText}>Clients</Text>
                    </TouchableOpacity>
                </Link>
                <Link
                    href={{
                        pathname: "/ManagerStack/MsgsScreen",
                        params: { userId: managerInfo?.userId },
                    }}
                    asChild
                >
                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={() => console.log('Messages')}
                    >
                        <Ionicons name="chatbox-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                        <Text style={styles.footerButtonText}>Messages</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    iconButton: {
        padding: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 12,
        marginTop: 5,
        color: 'white',
    },
});
