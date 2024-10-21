import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import { Link } from 'expo-router';

const ManagerStack = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}> Manager / Vet Dashboard</Text>
            <Link href="ManagerStack/ManagerScheduleScreen" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Manage your meets !</Text>
                </TouchableOpacity>
            </Link>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        width: '80%', // Make buttons wider for better accessibility
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ManagerStack;



// const Stack = createStackNavigator();
//const ManagerStack = () => {
//     return (
//         <Text>Manager (Veterinarian) Dashboard</Text>
//         // <Stack.Navigator>
//         //     <Stack.Screen
//         //         name="Schedule"
//         //         component={ManagerScheduleScreen}
//         //         options={{ title: 'Appointment Schedule' }}
//         //     />
//         //     <Stack.Screen
//         //         name="Notes"
//         //         component={ManagerNotesScreen}
//         //         options={{ title: 'Staff Notes' }}
//         //     />
//         //     <Stack.Screen
//         //         name="UserManagement"
//         //         component={ManagerUserManagementScreen}
//         //         options={{ title: 'User Management' }}
//         //     />
//         //     <Stack.Screen
//         //         name="Reports"
//         //         component={ManagerReportsScreen}
//         //         options={{ title: 'Clinic Reports' }}
//         //     />
//         // </Stack.Navigator>
//     );
// };