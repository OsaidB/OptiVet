import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ManagerNotesScreen = () => {
    const [notes, setNotes] = useState([
        { id: '1', from: 'Vet Assistant', content: 'Check on Bella\'s condition.' },
        { id: '2', from: 'Secretary', content: 'Update medical record for Max.' },
    ]);

    const renderNote = ({ item }) => (
        <View style={styles.note}>
            <Text>{item.from}: {item.content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Notes from Staff</Text>
            <FlatList
                data={notes}
                renderItem={renderNote}
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
    note: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

export default ManagerNotesScreen;
