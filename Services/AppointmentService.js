import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config'; // Adjust the path as necessary

const API_URL = `${baseURL.USED_BASE_URL}/api/appointments`;

const AppointmentService = {
    // Helper function to get the token
    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },

    // Fetch appointments by vet ID
    getAppointmentsByVetId: async (vetId) => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.get(`${API_URL}/vet/${vetId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointments for vet ID: ${vetId}`, error);
            throw error;
        }
    },

    // Create a new appointment
    createAppointment: async (appointmentData) => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.post(`${API_URL}`, appointmentData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // Fetch all appointments
    getAllAppointments: async () => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.get(`${API_URL}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    // Get appointment by ID
    getAppointmentById: async (appointmentId) => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.get(`${API_URL}/${appointmentId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointment with ID: ${appointmentId}`, error);
            throw error;
        }
    },

    // Update appointment
    updateAppointment: async (appointmentId, appointmentData) => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.put(`${API_URL}/${appointmentId}`, appointmentData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating appointment with ID: ${appointmentId}`, error);
            throw error;
        }
    },

    // Delete appointment
    deleteAppointment: async (appointmentId) => {
        try {
            const token = await AppointmentService.getToken();
            await axios.delete(`${API_URL}/${appointmentId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
        } catch (error) {
            console.error(`Error deleting appointment with ID: ${appointmentId}`, error);
            throw error;
        }
    },

    // Fetch available slots for a selected vet
    getAvailableSlots: async (vetId) => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.get(`${API_URL}/available-slots`, {
                headers: {
                    'X-Auth-Token': token,
                },
                params: {
                    vetId: vetId,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching available slots:', error);
            throw error;
        }
    },

    // Fetch appointments by client
    getAppointmentsByClient: async (clientId) => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.get(`${API_URL}/client/${clientId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    // Fetch scheduled appointments for a specific vet
    getScheduledAppointments: async (vetId) => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.get(`${API_URL}/appointments`, {
                headers: {
                    'X-Auth-Token': token,
                },
                params: { vetId, status: 'SCHEDULED' },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching scheduled appointments for vet ID: ${vetId}`, error);
            throw error;
        }
    },

    getScheduledAppointmentsByClient: async (clientId) => {
        try {
            const token = await AppointmentService.getToken();
            const response = await axios.get(`${API_URL}/client/${clientId}/scheduled`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching scheduled appointments for client ID: ${clientId}`, error);
            throw error;
        }
    },

};

export default AppointmentService;
