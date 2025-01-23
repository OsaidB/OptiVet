import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/petsForAdoption`;
const BASE_URL_IMG = `${baseURL.USED_BASE_URL}/api/pets`;



const PetForAdoptionService = {

    
    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },



    createPetForAdoption: async (petForAdoptionData) => {
        try {
            const token = await PetForAdoptionService.getToken();
            const response = await axios.post(`${BASE_URL}`, petForAdoptionData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating pet for adoption:', error);
            throw error;
        }
    },




    uploadPetForAdoptionImages: async (imageUri) => {
        try {
            const token = await PetForAdoptionService.getToken();
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(imageUri);
                console.log(response);
                const blob = await response.blob();
                formData.append('image', blob, 'petForAdoptionImage.jpg');
            } else {
                formData.append('image', {
                    uri: imageUri,
                    name: 'petForAdoptionImage.jpg',
                    type: 'image/jpeg',
                });
            }

            const response = await axios.post(`${BASE_URL}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Auth-Token': token,
                },
            });
console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading pet for adoption image:', error);
            throw error;
        }
    },






    getpetsForAdoption: async () => {
        try {
            const token = await PetForAdoptionService.getToken();
            const response = await axios.get(BASE_URL, {
                headers: {
                    'X-Auth-Token': token,
                },

            });
            return response.data;
        } catch (error) {
            console.error('Error fetching pets for adoption:', error);
            throw error;
        }
    },


    servePetForAdoptionImage: async (name) => {


        try {

            const response = await axios.get(`${BASE_URL}/uploads/${name}`, {
                headers: {

                    'X-Auth-Token': token,

                },




            },
                { responseType: 'blob' }
            );


            return URL.createObjectURL(response.data);

        } catch (uploadingError) {
            console.log('Error serving pet for adoption image', uploadingError);
            throw uploadingError;

        }
    },




    deletePetForAdoption: async (petForAdoptionId) => {
        try {
            const token = await PetForAdoptionService.getToken();
            const response = await axios.delete(`${BASE_URL}/${petForAdoptionId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting pet for adoption with ID: ${petForAdoptionId}`, error);
            throw error;
        }
    },






    handleUpload: async (imageUri) => {

        try {

            const token = await PetForAdoptionService.getToken();
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(BASE_URL_IMG + imageUri, {
                    method: "GET",
                    headers: {
                        'X-Auth-Token': token,
                    },
                });
                //console.log(response);
                const blob = await response.blob();
                formData.append('image', blob, 'petForAdoptionImage.jpg');
                //console.log(formData);
            } else {
                formData.append('image', {
                    uri: imageUri,
                    name: 'petForAdoptionImage.jpg',
                    type: 'image/jpeg',
                });
            }

            const response = await axios.post(`${BASE_URL}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Auth-Token': token,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading pet for adoption image:', error);
            throw error;
        }


    },













    getPetForAdoptionById: async (petForAdoptionId) => {
        try {
            const token = await PetForAdoptionService.getToken();
            const response = await axios.get(`${BASE_URL}/${petForAdoptionId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching pet for adoption with ID: ${petForAdoptionId}`, error);
            throw error;
        }
    },













    updatePetForAdoptionById: async (petForAdoptionData, petForAdoptionId ) => {
        try {
            const token = await PetForAdoptionService.getToken();
            const response = await axios.put(`${BASE_URL}/${petForAdoptionId}`, petForAdoptionData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating pet for adoption with ID: ${petForAdoptionId}`, error);
            throw error;
        }
    },



};

export default PetForAdoptionService;
