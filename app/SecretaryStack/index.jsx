import { useState, useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput, ScrollView, Platform
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

    return (




















        <View style={{ justifyContent: 'space-evenly', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#2e3f51', width: '100%', alignItems: 'center' }}>

                <View style={{ backgroundColor: '#2e3f51', borderRadius: '100%', marginTop: 20, height: 200, width: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/images/Screenshot 2025-01-14 045424.png')} style={{ borderRadius: '100%', width: '100%', height: '100%' }} resizeMode='cover'></Image>
                </View>

                <View style={{ backgroundColor: '#2e3f51', height: 120, width: '100%', marginTop: 20,justifyContent:'space-around'}}>
                    <View style={{ flexDirection:'row',justifyContent:'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white',margin:4,fontWeight:'bold' }}>Dr. Khaled Mustafa</Text>
                    </View>


                    <View style={{ flexDirection:'row',justifyContent:'center', alignItems: 'center' }}>
                <Ionicons name="location-outline" size={24} color={'white'} />
                    <Text style={{ color: 'white',margin:4,fontWeight:'bold' }}>Birzeit</Text>
                    </View>


                    <View style={{ flexDirection:'row',justifyContent:'center', alignItems: 'center' }}>
                <Ionicons name="mail-outline" size={24} color={'white'} />
                    <Text style={{ color: 'white',margin:4,fontWeight:'bold' }}>KhaledMustafa@gmail.com</Text>
                    </View>
                </View>
                


                <View style={{ backgroundColor: '#a0cedd', width: '100%', height: 240, justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Link href={{ pathname: "/SecretaryStack/AddPetForAdoption" }} asChild>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', width: '40%', borderRadius: 18, height: 50, padding: 12, marginVertical: 10 }}>
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Pets for adoption</Text>
                        </TouchableOpacity>
                    </Link>


                    <Link href={{ pathname: "/SecretaryStack/AddPetForAdoption" }} asChild>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, width: '40%', height: 50, padding: 12, marginVertical: 10 }}>
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Store</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>


        </View>




        // <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        //     <View style={{ alignSelf: 'center' }}><Text style={{ fontSize: 40 }}>Pets for adoption</Text></View>



        //     <ScrollView
        //         contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }} style={{ alignSelf: 'center', width: '90%', marginVertical: 10 }}>



        //         {pets.map((item) => {
        //             return (

        //                 <View key={item.id} style={{ width: widthRatio, backgroundColor: '#133945', height: 300, margin: 20, justifyContent: 'space-between', alignItems: 'center', borderRadius: 15 }} SearchProduct={SearchProduct} setSearchText={setSearchText}>

        //                     <View style={{ width: '90%', height: '50%', marginTop: 5 }}>
        //                         <Image source={{ uri: `${BASE_URL_IMAGES}${item.productImageUrl}` }} style={{ width: '100%', height: '100%' }} resizeMode="contain"></Image>
        //                     </View>


        //                     <Text style={{ fontSize: 20, color: 'white' }}>{item.name}</Text>




        //                     <Text style={{ fontSize: 20, color: 'white' }}>{item.price + '₪'}</Text>




        //                     <Text style={{ fontSize: 20, color: '#dddd', fontFamily: 'bold' }}>{item.productCategory}</Text>


        //                     <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '30%', height: '30%' }}>


        //                         <Link href={{ pathname: '../ManagerStack/UpdateProduct', params: { productId } }} onPress={() => { setProductId(item.id) }} asChild>
        //                             <TouchableOpacity style={{ alignItems: 'center', height: '60%', width: '100%', backgroundColor: 'white', borderRadius: '100%', marginBottom: 20, marginHorizontal: 10 }}>

        //                                 <Image source={require('../../assets/images/pencil (2).png')} style={{ flex: 1, width: 30, height: 30 }} resizeMode='contain'></Image>

        //                             </TouchableOpacity>
        //                         </Link>



        //                         <TouchableOpacity style={{ alignItems: 'center', height: '60%', width: '100%', backgroundColor: 'white', borderRadius: '100%', marginBottom: 20, marginHorizontal: 10 }} onPress={() => deleteProductHandle(item.id)}>

        //                             <Image source={require('../../assets/images/trash.png')} style={{ flex: 1, width: 30, height: 30 }} resizeMode='contain'></Image>

        //                         </TouchableOpacity>



        //                     </View>
        //                 </View>


        //             )
        //         })}



        //     </ScrollView>








        //     <Link href={{ pathname: "/SecretaryStack/PetsForAdoption" }} asChild>
        //         <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: 50, width: '50%', marginVertical: 10 }}>
        //             <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Add New Pet</Text>
        //         </TouchableOpacity>
        //     </Link>

        // </View>









































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

export default SecretaryStack;
