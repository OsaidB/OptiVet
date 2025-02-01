import { useState, useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput, ScrollView, Platform, SafeAreaView
} from "react-native";
import { useRouter, Link, useLocalSearchParams, usePathname } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from "@rneui/themed";
import { createFilter } from "react-native-search-filter";
import ProductService from "../../Services/ProductService";
import { useNavigation } from "expo-router";
import baseURL from '../../Services/config'; // Adjust the path as necessary
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../../Services/UserService";

//import { useRouter, useLocalSearchParams, Link } from 'expo-router'; // Import useLocalSearchParams
//import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams



const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;



// import { createStackNavigator } from '@react-navigation/stack';
// import ManagerScheduleScreen from '../../app/ManagerStack/ManagerScheduleScreen';
// import ManagerNotesScreen from '../../app/ManagerStack/ManagerNotesScreen';
// import ManagerUserManagementScreen from '../../app/ManagerStack/ManagerUserManagementScreen';
// import ManagerReportsScreen from '../../app/ManagerStack/ManagerReportsScreen';


// const Stack = createStackNavigator();

const SecretaryStack = () => {

    const colorScheme = useColorScheme();


    const [pets, setPets] = useState([]);
    const [secretaryInfo, setSecretaryInfo] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {

        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmail(storedEmail);

                }
                else {
                    console.error('No email found in AsynchStorage');
                    Alert.alert('Error', 'No email found. Please log in again.');
                }

            } catch (error) {
                console.error('Error fetching emil from AsynchStorage:', error);
                Alert.alert('Error', 'Failed to retrieve email.');
            }

        };

        const fetchSecretaryInfo = async () => {
            if (!email) return;
            try {
                const data = await UserService.getUserByEmail(email);
                setSecretaryInfo(data);
            } catch (error) {
                console.error('Error fetching secretary info:', error);
                Alert.alert('Error', 'Failed to load secretary information.');
            }


        };

        fetchEmail();
        fetchSecretaryInfo();

    }, [email]);

    return (


        <SafeAreaView style={styles.main}>
            <View
                style={styles.firstPart}>
                <View
                    style={styles.imageStyle}>
                    <Image
                        source={secretaryInfo?.profileImageUrl ? { uri: secretaryInfo.profileImageUrl } : require('../../assets/images/default_user.png')}
                        style={styles.imageStyling}
                        resizeMode="contain"></Image>
                </View>
                {secretaryInfo ? (

                    <>

                        <View
                            style={styles.user}>
                            <View
                                style={styles.textElement}>
                                <Ionicons name="person-outline" size={24} color={'white'} />
                                <Text style={styles.textStyle} numberOfLines={1}>
                                    {secretaryInfo.firstName} {secretaryInfo.lastName}
                                </Text>
                            </View>

                            <View
                                style={styles.textElement}>
                                <Ionicons name="mail-outline" size={24} color={'white'} />
                                <Text style={styles.textStyle} numberOfLines={1}>
                                    {secretaryInfo.email}
                                </Text>
                            </View>
                        </View>


                    </>

                ) : (
                    <Text style={styles.loadingText}>Loading secretary info......</Text>
                )}

            </View>

            <View
                style={styles.secondPart}>
                <View
                    style={styles.secondPartComponents}>
                    <Link href={{ pathname: '/SecretaryStack/PetsForAdoption' }} asChild>
                        <TouchableOpacity
                            style={styles.button}>
                            <Text
                                style={styles.buttonText} numberOfLines={1}>
                                Pets for adoption
                            </Text>
                        </TouchableOpacity>
                    </Link>

                    <Link href={{ pathname: '/SecretaryStack/Products' }} asChild>
                        <TouchableOpacity
                            style={styles.button}>
                            <Text
                                style={styles.buttonText} numberOfLines={1}>
                                Store
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({

    main: {
        flex: 1
    },

    firstPart: {
        flex: 2,
        backgroundColor: '#2e3f51',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    secondPart: {
        flex: 1,
        backgroundColor: '#a0cedd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        borderRadius: 100,
        borderWidth: 4,
        borderColor: 'white',
        marginTop: 20,
        height: 200,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyling: {
        borderRadius: 100,
        width: '100%',
        height: '100%'
    },
    user: {
        height: 120,
        width: '100%',
        marginTop: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    textElement: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: 'white',
        margin: 4,
        fontWeight: 'bold'
    },
    secondPartComponents: {
        width: '80%',
        height: '80%',
        justifyContent: 'space-evenly',
        alignItems: 'center',

    },
    button: {
        backgroundColor: '#133945',
        borderRadius: 18,
        height: 50,
        padding: 12,
        minWidth: 120,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#7F8C8D'
    }
});



export default SecretaryStack;
