import axios from 'axios';


// const API_URL = 'http://192.168.1.51:8080/api/appointments'; // Osaid
const API_URL = 'http://192.168.56.1:8080/api/appointments'; // Murrar's lap ip
//const API_URL = 'http://192.168.1.52/api/appointments'; // Murrar's phone ip
const AppointmentService = {
    // Create a new appointment

    // getAppointmentsByDateAndVet: (vetId, date) => {
    //     return axios.get(`${API_URL}/vet/${vetId}/date`, {
    //         params: { date: date.toISOString() }
    //     });
    // },

    createAppointment: async (appointmentData) => {
        try {
            const response = await axios.post(`${API_URL}`, appointmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // Fetch all appointments
    getAllAppointments: async () => {
        try {
            const response = await axios.get(`${API_URL}`);
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
            const response = await axios.put(`${API_URL}/${appointmentId}`, appointmentData);
            return response.data;
        } catch (error) {
            console.error(`Error updating appointment with ID: ${appointmentId}`, error);
            throw error;
        }
    },

    // Delete appointment
    deleteAppointment: async (appointmentId) => {
        try {
            await axios.delete(`${API_URL}/${appointmentId}`);
        } catch (error) {
            console.error(`Error deleting appointment with ID: ${appointmentId}`, error);
            throw error;
        }
    },

    // Fetch available slots for a selected vet
    getAvailableSlots: async (vetId) => {
        try {
            const response = await axios.get(`${API_URL}/available-slots`, {
                params: {
                    vetId: vetId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching available slots:', error);
            throw error;
        }
    },

    getAppointmentsByClient: async (clientId) => {
        try {
            const response = await axios.get(`${API_URL}/client/${clientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    getScheduledAppointments: async (vetId) => {
        try {
            const response = await axios.get(`${API_URL}/appointments`, { params: { vetId, status: "SCHEDULED" } });
            return response.data;
        } catch (error) {
            console.error(`Error fetching scheduled appointments for vet ID: ${vetId}`, error);
            throw error;
        }
    },


};

export default AppointmentService;
