import axios from 'axios';

import baseURL from './config'; // Adjust the path as necessary
const API_URL= `${baseURL.USED_BASE_URL}/api/clients`;

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
            console.log(response);
            console.log("response.data",response.data);

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
