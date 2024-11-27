import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config'; // Adjust the path as necessary

const BASE_URL = `${baseURL.USED_BASE_URL}/api/medical-sessions`;

const MedicalSessionService = {
    // Helper function to get the token
    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },

    // Create a new medical session
    createSession: async (medicalSessionData, veterinarianId) => {
        try {
            const token = await MedicalSessionService.getToken();
            const response = await axios.post(`${BASE_URL}/veterinarian/${veterinarianId}`, medicalSessionData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating medical session:", error);
            throw error;
        }
    },

    // Get a medical session by ID
    getSessionById: async (sessionId) => {
        try {
            const token = await MedicalSessionService.getToken();
            const response = await axios.get(`${BASE_URL}/${sessionId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching medical session by ID:", error);
            throw error;
        }
    },

    // Get all medical sessions for a specific pet
    getSessionsByPetId: async (petId) => {
        try {
            const token = await MedicalSessionService.getToken();
            const response = await axios.get(`${BASE_URL}/pet/${petId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching medical sessions for pet:", error);
            throw error;
        }
    },

    // Update a medical session
    updateSession: async (sessionId, medicalSessionData) => {
        try {
            const token = await MedicalSessionService.getToken();
            const response = await axios.put(`${BASE_URL}/${sessionId}`, medicalSessionData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error updating medical session:", error);
            throw error;
        }
    },

    // Delete a medical session
    deleteSession: async (sessionId) => {
        try {
            const token = await MedicalSessionService.getToken();
            const response = await axios.delete(`${BASE_URL}/${sessionId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting medical session:", error);
            throw error;
        }
    },
};

export default MedicalSessionService;
