import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ManagerReportsScreen = () => {
    const [reports, setReports] = useState([
        { id: '1', type: 'Appointments', details: 'Total Appointments: 20' },
        { id: '2', type: 'Sales', details: 'Total Sales: $500' },
    ]);

    const renderReport = ({ item }) => (
        <View style={styles.report}>
            <Text>{item.type}: {item.details}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Clinic Reports</Text>
            <FlatList
                data={reports}
                renderItem={renderReport}
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
    report: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

export default ManagerReportsScreen;
