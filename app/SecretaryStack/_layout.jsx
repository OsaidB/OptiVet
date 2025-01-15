import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import CustomToast from '../Toast.config';
import { Link } from 'expo-router';

export default function SecretaryStackLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC' }]}>
                <TouchableOpacity onPress={() => console.log('Menu pressed')} style={styles.iconButton}>
                    <Ionicons name="menu" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🐾OptiVet</Text>
                <TouchableOpacity onPress={() => console.log('Profile pressed')} style={styles.iconButton}>
                    <Ionicons name="person-circle" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Main Stack Navigation */}
            <Stack
                screenOptions={{
                    headerShown: false,
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
                    <Ionicons name="location-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Products')}>
                    <Ionicons name="cart-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Products</Text>
                </TouchableOpacity>
                
                <Link href="/SecretaryStack/PetsForAdoption" asChild>
                    <TouchableOpacity style={styles.footerButton}>
                                <Image source={require('../../assets/images/cat (2).png')} style={{ width: '80%', height: 30 }} resizeMode='contain'></Image>
                        <Text style={styles.footerButtonText}>Pets For Adoption</Text>
                    </TouchableOpacity>
                </Link>

                <TouchableOpacity style={styles.footerButton} onPress={() => console.log('Settings')}>
                    <Ionicons name="settings-outline" size={24} color={colorScheme === 'dark' ? '#FFF' : '#1D3D47'} />
                    <Text style={styles.footerButtonText}>Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Global Toast Notifications */}
            <Toast config={CustomToast} />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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
    },
});
