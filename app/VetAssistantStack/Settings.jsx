
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Settings = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input} placeholder="Enter your username" />

            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} placeholder="Enter your email" keyboardType="email-address" />

            <Text style={styles.label}>Password:</Text>
            <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#1D3D47',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Settings;
