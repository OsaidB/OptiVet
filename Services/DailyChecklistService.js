import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from "./config";

const BASE_URL = `${baseURL.USED_BASE_URL}/api/daily-checklists`;

const DailyChecklistService = {
    // Helper function to get the token
    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },

    // Create a new Daily Checklist
    async createDailyChecklist(checklistData) {
        try {
            const token = await this.getToken();
            const response = await axios.post(`${BASE_URL}`, checklistData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating daily checklist:", error);
            throw error;
        }
    },

    // Get a Daily Checklist by ID
    async getDailyChecklistById(id) {
        try {
            const token = await this.getToken();
            const response = await axios.get(`${BASE_URL}/${id}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching daily checklist by ID:", error);
            throw error;
        }
    },


    // Get all Daily Checklists
    async getAllDailyChecklists() {
        try {
            const token = await this.getToken();
            const response = await axios.get(BASE_URL, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching all daily checklists:", error);
            throw error;
        }
    },

    // Update an existing Daily Checklist by ID
    async updateDailyChecklist(id, checklistData) {
        try {
            const token = await this.getToken();
            const response = await axios.put(`${BASE_URL}/${id}`, checklistData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error updating daily checklist:", error);
            throw error;
        }
    },

    // Delete a Daily Checklist by ID
    async deleteDailyChecklist(id) {
        try {
            const token = await this.getToken();
            await axios.delete(`${BASE_URL}/${id}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
        } catch (error) {
            console.error("Error deleting daily checklist:", error);
            throw error;
        }
    },

    async getCriticalDailyChecklists() {
        try {
            const response = await axios.get(`${BASE_URL}/critical`);
            return response.data;
        } catch (error) {
            console.error("Error fetching critical daily checklists:", error);
            throw error;
        }
    },

    // Add this method to the DailyChecklistService
    async getDailyChecklistsByPetId(petId) {
        try {
            const token = await this.getToken();
            const response = await axios.get(`${BASE_URL}/${petId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching daily checklists by pet ID:", error);
            throw error;
        }
    }

};

export default DailyChecklistService;
