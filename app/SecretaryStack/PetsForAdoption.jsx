import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput, ScrollView, Platform, Modal
} from "react-native";
import { useRouter, Link, useLocalSearchParams, usePathname } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from "@rneui/themed";
import { createFilter } from "react-native-search-filter";
import ProductService from "../../Services/ProductService";
import baseURL from '../../Services/config'; // Adjust the path as necessary
import PetForAdoptionService from "../../Services/PetForAdoptionService";
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

const PetsForAdoption = () => {
    const navigation = useNavigation();
   //const router = useRouter();


    const [pets, setPets] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [petId, setpPetId] = useState();
    const [selectedPet,setSelectedPet] = useState('');
    const[petForEdit, setPetForEdit] = useState();



    useEffect(() => {
        const fetchPetsForAdoption = async () => {
            try {
                const fetchPetsForAdoption = await PetForAdoptionService.getpetsForAdoption();
                setPets(fetchPetsForAdoption);
                //setSearchedProducts(fetchProducts);
            } catch (error) {
                console.error("Error fetching pets for adoption:", error);
                Alert.alert('Error', 'Failed to load pets for adoption.');
            }
        };

        fetchPetsForAdoption();

    }, []);



    return (

        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>





            <Modal
                animationType="none"
                transparent={true}
                visible={viewModal}
                onRequestClose={() => {
                    //Alert.alert('Modal has been closed.');
                    setViewModal(!viewModal);
                }}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', width: 540, height: '90%', backgroundColor: '#97989c', borderWidth: 4 }}>

                        <View style={{ borderWidth: 2, borderRadius: 4, backgroundColor: 'white', marginBottom: 20 }}>

                            <Image source={require('../../assets/images/pencil (2).png')} style={{ height: 120, width: 120 }}></Image>


                        </View>

                        <Text style={{ fontSize: 20, marginBottom: 4 }}>Name</Text>
                        <TextInput editable={false} value={selectedPet.name} style={{ borderWidth: 3, borderRadius: 4, marginBottom: 20, padding: 4 }}></TextInput>

                        <Text style={{ fontSize: 20, marginBottom: 4 }}>Type</Text>
                        <TextInput editable={false} value="heyyyy" style={{ borderWidth: 3, marginBottom: 20, padding: 4, borderRadius: 4 }}></TextInput>

                        <Text style={{ fontSize: 20, marginBottom: 4 }}>Age</Text>
                        <TextInput editable={false} value="heyyyy" style={{ borderWidth: 3, marginBottom: 20, padding: 4, borderRadius: 4 }}></TextInput>



                        <Text style={{ fontSize: 20, marginBottom: 4 }}>Description</Text>
                        <TextInput multiline editable={false} value="" style={{ borderWidth: 3, padding: 4, borderRadius: 4, height: 120, width: 400, marginBottom: 20 }}></TextInput>


                        <TouchableOpacity>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }} onPress={() => { setViewModal(!viewModal) }}>Close</Text>
                        </TouchableOpacity>


                    </View>
                </View>



            </Modal>









            <Text style={{ fontSize: 40 }}>Pets for adoption</Text>






            <ScrollView
                contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }} style={{ alignSelf: 'center', width: '90%', marginVertical: 10, backgroundColor: 'black' }}>



                {pets.map((item) => {
                    return (
                        <View key={item.id} style={{ width: '20%', backgroundColor: '#133945', height: 300, margin: 20, borderRadius: 15, justifyContent: 'flex-start', alignItems: 'center' }} >


                            <View style={{ width: '90%', height: '30%', marginTop: 5,marginBottom:12 }}>
                                <Image source={require('../../assets/images/pencil (2).png')} style={{ width: '100%', height: '100%' }} resizeMode="contain"></Image>
                            </View>


                            <Text style={{ fontSize: 20, color: 'white',marginBottom:4 }} numberOfLines={1} >{item.name}</Text>




                            <Text numberOfLines={1} style={{ fontSize: 24, color: '#97989c' }}>{item.category}</Text>






                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '24%' }}>


                                <Link style={{ flexShrink: 1, justifyContent: 'center', alignItems: 'center', height: 44, width: 44, backgroundColor: 'white', borderRadius: '100%', marginHorizontal: 10 }} href={{ pathname: 'EditPetForAdoption', params: {petId:item.id,nameOfPet:item.name,descriptionOfPet:item.description,ageOfPet:item.ageOfPet}  }} onPress={() => { setPetForEdit(item.id) }} asChild>
                                    <TouchableOpacity>

                                        <Image source={require('../../assets/images/pencil (2).png')} style={{ width: '80%', height: 30 }} resizeMode='contain'></Image>

                                    </TouchableOpacity>
                                </Link>



                                <TouchableOpacity style={{ flexShrink: 1, alignItems: 'center', justifyContent: 'center', height: 40, width: 40, backgroundColor: 'white', borderRadius: '100%', marginHorizontal: 10 }} onPress={() => deleteProductHandle(item.id)}>

                                    <Image source={require('../../assets/images/trash.png')} style={{ width: '80%', height: 30 }} resizeMode='contain'></Image>

                                </TouchableOpacity>



                            </View>



                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 18, height: 24, width: '90%', marginVertical: 10 }} onPress={() => { setViewModal(!viewModal); setSelectedPet(item); }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }} numberOfLines={1}>View Details</Text>
                            </TouchableOpacity>
                        </View>

                    )
                })}



            </ScrollView>








            <Link href={{ pathname: "/SecretaryStack/AddPetForAdoption" }} asChild>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: 50, width: '50%', marginVertical: 10 }}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Add New Pet</Text>
                </TouchableOpacity>
            </Link>

        </View>









































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

export default PetsForAdoption;
