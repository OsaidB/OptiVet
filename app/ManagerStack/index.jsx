import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import ManagerScheduleScreen from '../../app/ManagerStack/ManagerScheduleScreen';
// import ManagerNotesScreen from '../../app/ManagerStack/ManagerNotesScreen';
// import ManagerUserManagementScreen from '../../app/ManagerStack/ManagerUserManagementScreen';
// import ManagerReportsScreen from '../../app/ManagerStack/ManagerReportsScreen';
import {Text} from "react-native";

// const Stack = createStackNavigator();

const ManagerStack = () => {
    return (
        <Text>Manager (Veterinarian) Dashboard</Text>
        // <Stack.Navigator>
        //     <Stack.Screen
        //         name="Schedule"
        //         component={ManagerScheduleScreen}
        //         options={{ title: 'Appointment Schedule' }}
        //     />
        //     <Stack.Screen
        //         name="Notes"
        //         component={ManagerNotesScreen}
        //         options={{ title: 'Staff Notes' }}
        //     />
        //     <Stack.Screen
        //         name="UserManagement"
        //         component={ManagerUserManagementScreen}
        //         options={{ title: 'User Management' }}
        //     />
        //     <Stack.Screen
        //         name="Reports"
        //         component={ManagerReportsScreen}
        //         options={{ title: 'Clinic Reports' }}
        //     />
        // </Stack.Navigator>
    );
};

export default ManagerStack;
