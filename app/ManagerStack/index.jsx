import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Link } from 'expo-router';

const ManagerStack = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manager / Vet Dashboard</Text>

            <Link href="ManagerStack/ManagerScheduleScreen" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Manage your meets!</Text>
                </TouchableOpacity>
            </Link>

            {/* Button to view assigned appointments */}
            <Link href="ManagerStack/ManagerAppointmentsScreen" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Your Appointments</Text>
                </TouchableOpacity>
            </Link>

            {/* Button for walk-in clients */}
            <Link href="ManagerStack/WalkInClientsScreen" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Handle Walk-in Clients</Text>
                </TouchableOpacity>
            </Link>


{/* 
            <Link href="ManagerStack/AddProduct" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Add Product!</Text>
                </TouchableOpacity>
            </Link> */}


            <Link href="ManagerStack/Products" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Products</Text>
                </TouchableOpacity>
            </Link>


            <Link href="ManagerStack/AddProduct" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>addProduct</Text>
                </TouchableOpacity>
            </Link>







        </View>
    );
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
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ManagerStack;
