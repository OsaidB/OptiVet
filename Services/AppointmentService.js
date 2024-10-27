import axios from 'axios';


const API_URL = 'http://192.168.1.51:8080/api/appointments'; //Osaid
// const API_URL = 'http://192.168.56.1:8080/api/appointments'; //murrar
const AppointmentService = {
    // Create a new appointment
    createAppointment: async (appointmentData) => {
        try {
            const response = await axios.post(`${API_URL}/appointments`, appointmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // Fetch all appointments
    getAllAppointments: async () => {
        try {
            const response = await axios.get(`${API_URL}/appointments`);
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    // Get appointment by ID
    getAppointmentById: async (appointmentId) => {
        try {
            const response = await axios.get(`${API_URL}/appointments/${appointmentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointment with ID: ${appointmentId}`, error);
            throw error;
        }
    },

    // Update appointment
    updateAppointment: async (appointmentId, appointmentData) => {
        try {
            const response = await axios.put(`${API_URL}/appointments/${appointmentId}`, appointmentData);
            return response.data;
        } catch (error) {
            console.error(`Error updating appointment with ID: ${appointmentId}`, error);
            throw error;
        }
    },

    // Delete appointment
    deleteAppointment: async (appointmentId) => {
        try {
            await axios.delete(`${API_URL}/appointments/${appointmentId}`);
        } catch (error) {
            console.error(`Error deleting appointment with ID: ${appointmentId}`, error);
            throw error;
        }
    },
};

export default AppointmentService;
