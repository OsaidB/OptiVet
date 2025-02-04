import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput, ScrollView, Platform, Modal, SafeAreaView
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




const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;

const imagess = [];




const PetsForAdoption = () => {
    const navigation = useNavigation();
    




    const [pets, setPets] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [petId, setpPetId] = useState();
    const [selectedPet, setSelectedPet] = useState('');
    const [petForEdit, setPetForEdit] = useState();
    



    useEffect(() => {
        const fetchPetForAdoption = async () => {
            try {
                const fetchPetsForAdoption = await PetForAdoptionService.getpetsForAdoption();
                setPets(fetchPetsForAdoption);
                
            } catch (error) {
                console.error("Error fetching pets for adoption:", error);
                Alert.alert('Error', 'Failed to load pets for adoption.');
            }
        };

        fetchPetForAdoption();

    }, []);


    const deletePetForAdoptionHandle = (id) => {
        PetForAdoptionService.deletePetForAdoption(id);
        const newPetsForAdoption = pets.filter(pet => pet.id !== id);
        setPets(newPetsForAdoption);
    };

    return (




        <SafeAreaView style={styles.container}>
            <Modal
                animationType="none"
                transparent={true}
                visible={viewModal}
                onRequestClose={() => {
                    
                    setViewModal(!viewModal);
                }}>
                <View style={styles.modalContainer}>
                    <View
                        style={styles.modalStyle}>
                        <View style={styles.modalImageStyle}>
                            <Image
                                source={ selectedPet.petForAdoptionImageUrl ? { uri: `${BASE_URL_IMAGES}${selectedPet.petForAdoptionImageUrl}` } : require('../../assets/images/cat (1).png')}
                                style={styles.modalImageStyling}
                                resizeMode="cover"></Image>
                        </View>

                        <Text style={styles.textStyle}>Name</Text>
                        <View
                            style={styles.textElementStyle}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                <Text
                                    style={styles.textStyling}>
                                    {selectedPet.name}
                                </Text>
                            </ScrollView>
                        </View>

                        <Text style={styles.textStyle}>Type</Text>
                        <View
                            style={styles.textElementStyle}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                <Text
                                    style={styles.textStyling}>
                                    {selectedPet.type}
                                </Text>
                            </ScrollView>
                        </View>

                        <Text style={styles.textStyle}>Date of Birth</Text>
                        <View
                            style={styles.textElementStyle}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                <Text
                                    style={styles.textStyling}>
                                    {selectedPet.birthDate}
                                </Text>
                            </ScrollView>
                        </View>

                        <Text style={styles.textStyle}>Description</Text>
                        <View
                            style={styles.textElementStyle}>
                            <ScrollView showsHorizontalScrollIndicator={false}>
                                <Text
                                    style={styles.textStyling}>
                                    {selectedPet.petForAdoptionDescription}
                                </Text>
                            </ScrollView>
                        </View>

                        <TouchableOpacity>
                            <Text
                                style={styles.modalButton}
                                onPress={() => {
                                    setViewModal(!viewModal);
                                }}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Text style={styles.title}>Pets for adoption</Text>

            {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

            <ScrollView
                contentContainerStyle={styles.content}
                style={styles.contentStyle}>
                {pets.map((item) => {
                    return (
                        <View
                            key={item.id}
                            style={styles.petElement}>
                            <View
                                style={styles.petImageStyle}>
                                <Image
                                    source={ item.petForAdoptionImageUrl ? { uri: `${BASE_URL_IMAGES}${item.petForAdoptionImageUrl}` } : require('../../assets/images/cat (1).png')}
                                    style={styles.petImageStyling}
                                    resizeMode="cover"></Image>
                            </View>

                            <Text
                                style={styles.nameText}
                                numberOfLines = {Platform.OS == 'web' ? 1 : 2}>
                                {item.name}
                            </Text>

                            <Text
                                numberOfLines={1}
                                style={styles.typeBreedText}>
                                {item.type} - {item.breed}
                            </Text>

                            <View
                                style={styles.petElementButtons}>
                                <Link
                                    style={styles.petElementEditButton}
                                    href={{
                                        pathname: '../SecretaryStack/EditPetForAdoption',
                                        params: { petId },
                                    }}
                                    onPress={() => {
                                        setpPetId(item.id);
                                    }}
                                    asChild>
                                    <TouchableOpacity>
                                        <Image
                                            source={require('../../assets/images/pencil (2).png')}
                                            style={styles.petElementButtonImage}
                                            resizeMode="contain"></Image>
                                    </TouchableOpacity>
                                </Link>

                                <TouchableOpacity
                                    style={styles.petElementRemoveButton}
                                    onPress={() => deletePetForAdoptionHandle(item.id)}>
                                    <Image
                                        source={require('../../assets/images/trash.png')}
                                        style={styles.petElementButtonImage}
                                        resizeMode="contain"></Image>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.petElementViewDButton}
                                onPress={() => {
                                    setViewModal(!viewModal);
                                    setSelectedPet(item);
                                }}>
                                <Text
                                    style={{ fontSize: 12, fontWeight: 'bold' }}
                                    numberOfLines={1}>
                                    View Details
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>

            <Link href={{ pathname: '/SecretaryStack/AddPetForAdoption' }} asChild>
                <TouchableOpacity
                    style={styles.linkButton}>
                    <Text style={styles.linkButtonText}>
                        Add New Pet
                    </Text>
                </TouchableOpacity>
            </Link>
        </SafeAreaView>














    );
};






const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalStyle: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        width: Platform.OS == 'web' ? '60%' : '84%',
        height: Platform.OS == 'web' ? 650 : '80%',
        backgroundColor: '#c4d3c7',
        borderWidth: 4,
    },
    modalImageStyle: {
        borderWidth: 2,
        borderRadius: 4,
        marginBottom: 20,
        padding: 4
    },
    modalImageStyling: {
        height: 120,
        width: 120
    },

    textStyle: {
        fontSize: 20,
        marginBottom: 4
    },
    textElementStyle: {
        height: 40,
        borderWidth: 4,
        borderRadius: 4,
        width: '84%',
        marginBottom: 20,
    },
    textStyling: {
        padding: 4,
    },
    modalButton: {
        fontWeight: 'bold',
        fontSize: 25

    },
    title: {
        fontSize: 40,
        marginVertical: Platform.OS == 'web' ? 0 : 30
        
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    contentStyle: {
        alignSelf: 'center',
        width: '90%',
        marginVertical: 10
    },
    petElement: {
        flexShrink: 1,
        paddingTop:12,
        width: Platform.OS == 'web' ? '20%' : '40%',
        backgroundColor: '#133945',
        height: 320,
        margin: 12,
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    petImageStyle: {
        borderRadius: 100,
        width: '90%',
        height: '40%',
        maxHeight: 120,
        maxWidth: 120,
        marginBottom: 4,
    },

    petImageStyling: {
        borderRadius: 100,
        width: '100%',
        height: '100%',
        borderWidth:2,
        borderColor:'white'
    },
    nameText: {
    
        fontSize: 20,
        color: 'white',
        marginBottom: 4,
    
    },

    typeBreedText: {
    
        fontSize: 20,
        color: '#97989c',
        marginBottom: 20,
    },

    petElementButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: '12%',
    },
    petElementEditButton: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        width: 44,
        backgroundColor: 'white',
        borderRadius: 100,
        marginHorizontal: 10,
    },

    petElementRemoveButton: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 100,
        marginHorizontal: 10,
    },

    petElementButtonImage: {
        width: '80%',
        height: 30
    },
    petElementViewDButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 18,
        height: 24,
        width: '90%',
        marginVertical: 10,
    },
    linkButton: {

        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#133945',
        borderRadius: 18,
        height: 50,
        width: '50%',
        marginVertical: 10,
        padding:12
    },
    linkButtonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    }

});

export default PetsForAdoption;
