import axios from 'axios';
import { Platform } from 'react-native';

import baseURL from './config'; // Adjust the path as necessary
const BASE_URL=baseURL;


const PetService = {
    // Create a new pet
    createPet: async (petData) => {
        try {
            const response = await axios.post(`${BASE_URL}`, petData);
            return response.data;
        } catch (error) {
            console.error("Error creating pet:", error);
            throw error;
        }
    },

    // // Upload pet image
    // uploadPetImage: async (imageUri) => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('image', {
    //             uri: imageUri,
    //             name: 'petImage.jpg',
    //             type: 'image/jpeg',
    //         });
    //         console.log("uploadPetImage",formData);
    //         const response = await axios.post(`${BASE_URL}/uploadImage`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         return response.data; // URL of the uploaded image
    //     } catch (error) {
    //         console.error("Error uploading pet image:", error);
    //         throw error;
    //     }
    // },

    uploadImage: async (imageUri) => {
        try {
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                formData.append('image', blob, 'petImage.jpg');
            } else {
                formData.append('image', {
                    uri: imageUri,
                    name: 'petImage.jpg',
                    type: 'image/jpeg',
                });
            }

            const response = await axios.post(`${BASE_URL}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error uploading pet image:", error);
            throw error;
        }
    },
    // Get a pet by its ID
    getPetById: async (petId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${petId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching pet by ID:", error);
            throw error;
        }
    },

    // Get all pets
    getAllPets: async () => {
        try {
            const response = await axios.get(`${BASE_URL}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all pets:", error);
            throw error;
        }
    },

    // Get all pets by owner's ID
    getPetsByOwnerId: async (ownerId) => {
        try {
            const response = await axios.get(`${BASE_URL}/owner/${ownerId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching pets by owner ID:", error);
            throw error;
        }
    },

    // Update a pet by its ID
    updatePet: async (petId, petData) => {
        try {
            const response = await axios.put(`${BASE_URL}/${petId}`, petData);
            return response.data;
        } catch (error) {
            console.error("Error updating pet:", error);
            throw error;
        }
    },

    // Delete a pet by its ID
    deletePet: async (petId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${petId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting pet:", error);
            throw error;
        }
    }
};

export default PetService;
