import axios from 'axios';

// Define your API base URL for clients
const API_URL = 'http://192.168.56.1:8080/api/clients'; // Adjust the URL as needed

const ClientService = {
    // Fetch a client by their ID
    getClientById: async (clientId) => {
        try {
            const response = await axios.get(`${API_URL}/${clientId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching client with ID: ${clientId}`, error);
            throw error;
        }
    },

    // Fetch all clients
    getAllClients: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

    // Create a new client
    createClient: async (clientData) => {
        try {
            const response = await axios.post(API_URL, clientData);
            return response.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },

    // Update an existing client
    updateClient: async (clientId, clientData) => {
        try {
            const response = await axios.put(`${API_URL}/${clientId}`, clientData);
            return response.data;
        } catch (error) {
            console.error(`Error updating client with ID: ${clientId}`, error);
            throw error;
        }
    },

    // Delete a client
    deleteClient: async (clientId) => {
        try {
            await axios.delete(`${API_URL}/${clientId}`);
        } catch (error) {
            console.error(`Error deleting client with ID: ${clientId}`, error);
            throw error;
        }
    },

    // Fetch pets for a given client
    getClientPets: async (clientId) => {
        try {
            const response = await axios.get(`${API_URL}/${clientId}/pets`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching pets for client with ID: ${clientId}`, error);
            throw error;
        }
    },
};

export default ClientService;
