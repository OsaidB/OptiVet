import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function ClientStackLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC' }]}>
                <TouchableOpacity onPress={() => console.log('Back pressed')} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Client Dashboard</Text>
                <TouchableOpacity onPress={() => console.log('Profile pressed')} style={styles.iconButton}>
                    <Ionicons name="person-circle" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Main Stack Navigation */}
            <Stack
                screenOptions={{
                    headerShown: false, // Disable the default header
                    contentStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#121212' : '#F9F9F9',
                    },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
            </Stack>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#FFFFFF' }]}>
                <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Home')}>
                    <Ionicons name="home-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Pets')}>
                    <Ionicons name="paw-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Pets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Appointments')}>
                    <Ionicons name="calendar-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Appointments</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Settings')}>
                    <Ionicons name="settings-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'PoppinsBold',
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
        color: '#1D3D47',
    },
});
