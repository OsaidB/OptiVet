import axios from 'axios';

const BASE_URL = 'http://192.168.1.51:8080/api/medical-sessions'; //Osaid
// const BASE_URL = 'http://192.168.56.1:8080/api/medical-sessions'; //murrar

const MedicalSessionService = {
    // Create a new medical session
    createSession: async (medicalSessionData, veterinarianId) => {
        try {
            const response = await axios.post(`${BASE_URL}/veterinarian/${veterinarianId}`, medicalSessionData);
            return response.data;
        } catch (error) {
            console.error("Error creating medical session:", error);
            throw error;
        }
    },

    // Get a medical session by ID
    getSessionById: async (sessionId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching medical session by ID:", error);
            throw error;
        }
    },

    // Get all medical sessions for a specific pet
    getSessionsByPetId: async (petId) => {
        try {
            const response = await axios.get(`${BASE_URL}/pet/${petId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching medical sessions for pet:", error);
            throw error;
        }
    },

    // Update a medical session
    updateSession: async (sessionId, medicalSessionData) => {
        try {
            const response = await axios.put(`${BASE_URL}/${sessionId}`, medicalSessionData);
            return response.data;
        } catch (error) {
            console.error("Error updating medical session:", error);
            throw error;
        }
    },

    // Delete a medical session
    deleteSession: async (sessionId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting medical session:", error);
            throw error;
        }
    }
};

export default MedicalSessionService;
