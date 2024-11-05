import axios from 'axios';

import baseURL from './config'; // Adjust the path as necessary
const API_URL= `${baseURL.USED_BASE_URL}/api/medicalHistories`;

const MedicalHistoryService = {
    
    // Update a medical history
    updateMedicalHistory: async (medicalHistoryData, petId) => {
        try {
            const response = await axios.put(`${API_URL}/${petId}`, medicalHistoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating medical history:', error);
            throw error;
        }
    },


    // Get medical history
    getMedicalHistory: async (petId) => {
        try {
            const response = await axios.get(`${API_URL}/${petId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting medical history:', error);
            throw error;
        }
    },



    // Fetch all chronic conditions
    getChronicConditions: async (petId) => {
        try {
            const response = await axios.get(`${API_URL}/chronicConditions/${petId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chronic conditions:', error);
            throw error;
        }
    },

        // Fetch all allergies
        getAllergies: async (petId) => {
            try {
                const response = await axios.get(`${API_URL}/allergies/${petId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching allergies:', error);
                throw error;
            }
        },

            // Fetch all vaccinations
    getVaccinations: async (petId) => {
        try {
            const response = await axios.get(`${API_URL}/vaccinations/${petId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vaccinations:', error);
            throw error;
        }
    },


        // Fetch all surgeories
        getSurgeories: async (petId) => {
            try {
                const response = await axios.get(`${API_URL}/surgeories/${petId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching surgeories:', error);
                throw error;
            }
        },










    // Delete chronic condition by ID
    deleteChronicConditionById: async (chronicConditionId) => {
        try {
            const response = await axios.delete(`${API_URL}/chronicConditions/${chronicConditionId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting chronic condition with ID: ${chronicConditionId}`, error);
            throw error;
        }
    },



        // Delete allergy by ID
        deleteAllergyById: async (allergyId) => {
            try {
                const response = await axios.delete(`${API_URL}/allergies/${allergyId}`);
                return response.data;
            } catch (error) {
                console.error(`Error deleting allergy with ID: ${allergyId}`, error);
                throw error;
            }
        },



            // Delete vaccination by ID
    deleteVaccinationById: async (vaccinationId) => {
        try {
            const response = await axios.delete(`${API_URL}/vaccinations/${vaccinationId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting vaccination with ID: ${vaccinationId}`, error);
            throw error;
        }
    },



        // Delete surgeory by ID
        deleteSurgeoryById: async (surgeoryId) => {
            try {
                const response = await axios.delete(`${API_URL}/surgeories/${surgeoryId}`);
                return response.data;
            } catch (error) {
                console.error(`Error deleting surgeory with ID: ${surgeoryId}`, error);
                throw error;
            }
        },






        // Create chronic condition by pet ID
        createChronicConditionByPetId: async (chronicConditionData,petId) => {
            try {
                const response = await axios.post(`${API_URL}/chronicConditions/${petId}`, chronicConditionData);
                return response.data;
            } catch (error) {
                console.error(`Error creating chronic condition for pet id : ${petId}`, error);
                throw error;
            }
        },




                // Create allergy by pet ID
                createAllergyByPetId: async (allergyData,petId) => {
                    try {
                        const response = await axios.post(`${API_URL}/allergies/${petId}`, allergyData);
                        return response.data;
                    } catch (error) {
                        console.error(`Error creating allergy for pet id : ${petId}`, error);
                        throw error;
                    }
                },




                        // Create vaccination by pet ID
        createVaccinationByPetId: async (vaccinationData,petId) => {
            try {
                const response = await axios.post(`${API_URL}/vaccinations/${petId}`, vaccinationData);
                return response.data;
            } catch (error) {
                console.error(`Error creating vaccination for pet id : ${petId}`, error);
                throw error;
            }
        },




        // Create surgeory by pet ID
        createSurgeoryByPetId: async (surgeoryData,petId) => {
            try {
                const response = await axios.post(`${API_URL}/surgeories/${petId}`, surgeoryData);
                return response.data;
            } catch (error) {
                console.error(`Error creating surgeory for pet id : ${petId}`, error);
                throw error;
            }
        },


};

export default MedicalHistoryService;
