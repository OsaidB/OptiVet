import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ManagerScheduleScreen = () => {
    const [appointments, setAppointments] = useState([
        { id: '1', time: '10:00 AM', patient: 'Bella', owner: 'John Doe' },
        { id: '2', time: '11:30 AM', patient: 'Max', owner: 'Jane Smith' },
    ]);

    const renderAppointment = ({ item }) => (
        <View style={styles.appointment}>
            <Text>{item.time} - {item.patient} (Owner: {item.owner})</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Appointment Schedule</Text>
            <FlatList
                data={appointments}
                renderItem={renderAppointment}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    appointment: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

export default ManagerScheduleScreen;
