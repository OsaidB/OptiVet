import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config';
import { Platform } from 'react-native';

const API_URL = `${baseURL.USED_BASE_URL}/api/medicalHistories`;
const BASE_URL_IMG = `${baseURL.USED_BASE_URL}/api/pets`;
const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;



const MedicalHistoryService = {
    // Helper function to get the token
    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },

    // Update a medical history
    updateMedicalHistory: async (medicalHistoryData, petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.put(`${API_URL}/${petId}`, medicalHistoryData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating medical history:', error);
            throw error;
        }
    },

    // Get medical history
    getMedicalHistory: async (petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.get(`${API_URL}/${petId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error getting medical history:', error);
            throw error;
        }
    },

    // Fetch all chronic conditions
    getChronicConditions: async (petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.get(`${API_URL}/chronicConditions/${petId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching chronic conditions:', error);
            throw error;
        }
    },

    // Fetch all allergies
    getAllergies: async (petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.get(`${API_URL}/allergies/${petId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching allergies:', error);
            throw error;
        }
    },

    // Fetch all vaccinations
    getVaccinations: async (petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.get(`${API_URL}/vaccinations/${petId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching vaccinations:', error);
            throw error;
        }
    },

    // Fetch all surgeories
    getSurgeories: async (petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.get(`${API_URL}/surgeories/${petId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching surgeories:', error);
            throw error;
        }
    },

    // Delete chronic condition by ID
    deleteChronicConditionById: async (chronicConditionId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.delete(`${API_URL}/chronicConditions/${chronicConditionId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting chronic condition with ID: ${chronicConditionId}`, error);
            throw error;
        }
    },

    // Delete allergy by ID
    deleteAllergyById: async (allergyId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.delete(`${API_URL}/allergies/${allergyId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting allergy with ID: ${allergyId}`, error);
            throw error;
        }
    },

    // Delete vaccination by ID
    deleteVaccinationById: async (vaccinationId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.delete(`${API_URL}/vaccinations/${vaccinationId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting vaccination with ID: ${vaccinationId}`, error);
            throw error;
        }
    },

    // Delete surgeory by ID
    deleteSurgeoryById: async (surgeoryId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.delete(`${API_URL}/surgeories/${surgeoryId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting surgeory with ID: ${surgeoryId}`, error);
            throw error;
        }
    },

    // Create chronic condition by pet ID
    createChronicConditionByPetId: async (chronicConditionData, petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.post(`${API_URL}/chronicConditions/${petId}`, chronicConditionData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error creating chronic condition for pet id: ${petId}`, error);
            throw error;
        }
    },

    // Create allergy by pet ID
    createAllergyByPetId: async (allergyData, petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.post(`${API_URL}/allergies/${petId}`, allergyData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error creating allergy for pet id: ${petId}`, error);
            throw error;
        }
    },

    // Create vaccination by pet ID
    createVaccinationByPetId: async (vaccinationData, petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.post(`${API_URL}/vaccinations/${petId}`, vaccinationData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error creating vaccination for pet id: ${petId}`, error);
            throw error;
        }
    },

    // Create surgeory by pet ID
    createSurgeoryByPetId: async (surgeoryData, petId) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const response = await axios.post(`${API_URL}/surgeories/${petId}`, surgeoryData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error creating surgeory for pet id: ${petId}`, error);
            throw error;
        }
    },




    uploadMedicalHistoryImages: async (imageUri) => {
        try {
            const token = await MedicalHistoryService.getToken();
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(imageUri);

                const blob = await response.blob();
                formData.append('image', blob, 'MedicalHistoryImage.jpg');
            } else {
                formData.append('image', {
                    uri: imageUri,
                    name: 'MedicalHistoryImage.jpg',
                    type: 'image/jpeg',
                });
            }
            //console.log(response);
            const response = await axios.post(`${BASE_URL}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Auth-Token': token,
                },
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading medical history image:', error);
            throw error;
        }
    },



};

export default MedicalHistoryService;
