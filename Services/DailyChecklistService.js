import axios from 'axios';
import baseURL from "./config";

const BASE_URL = `${baseURL.USED_BASE_URL}/api/daily-checklists`;

const DailyChecklistService = {
    // Create a new Daily Checklist
    async createDailyChecklist(checklistData) {
        try {
            const response = await axios.post(`${BASE_URL}`, checklistData);
            return response.data;
        } catch (error) {
            console.error("Error creating daily checklist:", error);
            throw error;
        }
    },

    // Get a Daily Checklist by ID
    async getDailyChecklistById(id) {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching daily checklist by ID:", error);
            throw error;
        }
    },

    // Get all Daily Checklists
    async getAllDailyChecklists() {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching all daily checklists:", error);
            throw error;
        }
    },

    // Update an existing Daily Checklist by ID
    async updateDailyChecklist(id, checklistData) {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, checklistData);
            return response.data;
        } catch (error) {
            console.error("Error updating daily checklist:", error);
            throw error;
        }
    },

    // Delete a Daily Checklist by ID
    async deleteDailyChecklist(id) {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error("Error deleting daily checklist:", error);
            throw error;
        }
    }
};

export default DailyChecklistService;
