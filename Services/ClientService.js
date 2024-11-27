import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config'; // Adjust the path as necessary

const API_URL = `${baseURL.USED_BASE_URL}/api/clients`;

const ClientService = {
    // Helper function to get the token
    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },

    // Fetch a client by their ID
    getClientById: async (clientId) => {
        try {
            const token = await ClientService.getToken();
            const response = await axios.get(`${API_URL}/${clientId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching client with ID: ${clientId}`, error);
            throw error;
        }
    },

    // Fetch all clients
    getAllClients: async () => {
        try {
            const token = await ClientService.getToken();
            const response = await axios.get(API_URL, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            console.log(response);
            console.log('response.data', response.data);

            return response.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

    // Create a new client
    createClient: async (clientData) => {
        try {
            const token = await ClientService.getToken();
            const response = await axios.post(API_URL, clientData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },

    // Update an existing client
    updateClient: async (clientId, clientData) => {
        try {
            const token = await ClientService.getToken();
            const response = await axios.put(`${API_URL}/${clientId}`, clientData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating client with ID: ${clientId}`, error);
            throw error;
        }
    },

    // Delete a client
    deleteClient: async (clientId) => {
        try {
            const token = await ClientService.getToken();
            await axios.delete(`${API_URL}/${clientId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
        } catch (error) {
            console.error(`Error deleting client with ID: ${clientId}`, error);
            throw error;
        }
    },

    // Fetch pets for a given client
    getClientPets: async (clientId) => {
        try {
            const token = await ClientService.getToken();
            const response = await axios.get(`${API_URL}/${clientId}/pets`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching pets for client with ID: ${clientId}`, error);
            throw error;
        }
    },
};

export default ClientService;
