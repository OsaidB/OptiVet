import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

import UserService from '../../Services/UserService'; // Import the updated UserService
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClientService from "../../Services/ClientService";

export default function HomeScreen() {
    const router = useRouter();
    const [role, setRole] = useState(null);
    const [loggedInEmployeeInfo, setLoggedInEmployeeInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [employeeRole, setEmployeeRole] = useState(null);
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const decodedRole = await UserService.getRoleFromToken();
                console.log("decoded Role:",decodedRole);
                setRole(decodedRole);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        if (role === 'ROLE_CLIENT') {
            router.replace('/ClientStack');
        } else if (role === 'ROLE_USER') {

        }
    }, [role]);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email'); // Fetch stored email
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    console.error("No email found in AsyncStorage");
                    Alert.alert('Error', 'No email found. Please log in again.');
                }
            } catch (error) {
                console.error("Error fetching email from AsyncStorage:", error);
                Alert.alert('Error', 'Failed to retrieve email.');
            }
        };

        const fetchClientInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email); // Fetch client by email
                setLoggedInEmployeeInfo(data);
                setEmployeeRole(data.role);
            } catch (error) {
                console.error("Error fetching client info:", error);
                Alert.alert('Error', 'Failed to load client information.');
            }
        };

        fetchEmail();
        fetchClientInfo();
    }, [email]);

    useEffect(() => {
        if (!role || !employeeRole) return;

        if (role === 'ROLE_CLIENT') {
            router.replace('/ClientStack');
        } else if (role === 'ROLE_USER') {
            switch (employeeRole) {
                case 'VET_ASSISTANT':
                    router.replace('/VetAssistantStack');
                    break;
                case 'SECRETARY':
                    router.replace('/SecretaryStack');
                    break;
                case 'MANAGER':
                case 'VET':
                    router.replace('/ManagerStack');
                    break;
                default:
                    Alert.alert('Error', 'No role assigned or authenticated.');
            }
        }
    }, [role, employeeRole]);

    // const renderRoleButtons = () => {
    //     if (role === 'ROLE_CLIENT') {
    //         return (
    //             <Link href="/ClientStack" asChild>
    //                 <TouchableOpacity style={styles.button}>
    //                     <Text style={styles.buttonText}>Go to Client Dashboard</Text>
    //                 </TouchableOpacity>
    //             </Link>
    //         );
    //     }
    //
    //     if (role === 'ROLE_USER') {
    //         switch (employeeRole) {
    //             case 'VET_ASSISTANT':
    //                 return (
    //                     <Link href="/VetAssistantStack" asChild>
    //                         <TouchableOpacity style={styles.button}>
    //                             <Text style={styles.buttonText}>Go to Vet Assistant Dashboard</Text>
    //                         </TouchableOpacity>
    //                     </Link>
    //                 );
    //             case 'SECRETARY':
    //                 return (
    //                     <Link href="/SecretaryStack" asChild>
    //                         <TouchableOpacity style={styles.button}>
    //                             <Text style={styles.buttonText}>Go to Secretary Dashboard</Text>
    //                         </TouchableOpacity>
    //                     </Link>
    //                 );
    //             case 'MANAGER':
    //             case 'VET':
    //                 return (
    //                     <Link href="/ManagerStack" asChild>
    //                         <TouchableOpacity style={styles.button}>
    //                             <Text style={styles.buttonText}>Go to Manager (Veterinarian) Dashboard</Text>
    //                         </TouchableOpacity>
    //                     </Link>
    //                 );
    //             default:
    //                 return (
    //                     <View>
    //                         <Text style={styles.noAccessText}>No role assigned or authenticated.</Text>
    //                     </View>
    //                 );
    //         }
    //     }
    // };


    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
                <HelloWave />
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Loading Dashboard...</ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});