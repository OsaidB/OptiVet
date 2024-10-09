import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const ManagerUserManagementScreen = () => {
    const [users, setUsers] = useState([
        { id: '1', name: 'Jane Doe', role: 'Vet Assistant' },
        { id: '2', name: 'John Smith', role: 'Secretary' },
    ]);

    const updateRole = (id, newRole) => {
        const updatedUsers = users.map(user =>
            user.id === id ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
    };

    const renderUser = ({ item }) => (
        <View style={styles.user}>
            <Text>{item.name} ({item.role})</Text>
            <Button title="Promote to Manager" onPress={() => updateRole(item.id, 'Manager')} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>User Management</Text>
            <FlatList
                data={users}
                renderItem={renderUser}
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
    user: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

export default ManagerUserManagementScreen;
