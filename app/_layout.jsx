// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import Toast from 'react-native-toast-message'; // Import Toast
// import CustomToast from './Toast.config'; // Import custom Toast config
//
// SplashScreen.preventAutoHideAsync();
//
// export default function RootLayout() {
//     const colorScheme = useColorScheme(); // Detect system theme (light/dark)
//
//     // Load custom fonts
//     const [loaded] = useFonts({
//         PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
//         PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
//         NunitoRegular: require('../assets/fonts/Nunito-Regular.ttf'),
//         NunitoLight: require('../assets/fonts/Nunito-Light.ttf'),
//     });
//
//     // Hide splash screen once fonts are loaded
//     useEffect(() => {
//         if (loaded) {
//             SplashScreen.hideAsync();
//         }
//     }, [loaded]);
//
//     if (!loaded) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#007BFF" />
//             </View>
//         );
//     }
//
//     return (
//         <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//             {/* Dynamic Status Bar based on theme */}
//             <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
//
//             {/* Main Stack Navigation */}
//             <Stack
//                 screenOptions={({ route }) => ({
//                     headerShown: !['index', 'SignUpScreen'].includes(route.name),
//                     contentStyle: {
//                         backgroundColor: colorScheme === 'dark' ? '#121212' : '#F9F9F9',
//                     },
//                 })}
//             >
//                 <Stack.Screen name="index" />
//                 <Stack.Screen name="SignUpScreen" />
//                 <Stack.Screen name="(tabs)" />
//                 <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
//             </Stack>
//
//             {/* Footer */}
//             <View style={[styles.footer, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#FFFFFF' }]}>
//                 <Text style={styles.footerText}>© 2024 OptiVet. All Rights Reserved.</Text>
//             </View>
//
//             {/* Global Toast Notifications */}
//             <Toast config={CustomToast} />
//         </ThemeProvider>
//     );
// }
//
// const styles = StyleSheet.create({
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F9F9F9',
//     },
//     footer: {
//         padding: 10,
//         alignItems: 'center',
//         borderTopWidth: 1,
//         borderTopColor: '#E0E0E0',
//     },
//     footerText: {
//         fontSize: 14,
//         fontFamily: 'NunitoRegular',
//         color: '#555',
//     },
// });
