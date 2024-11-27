import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config'; // Adjust the path as necessary

const USERS_API_BASE_URL = `${baseURL.USED_BASE_URL}/api/users`;

const UserService = {
    // Helper function to get the token
    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },

    // Fetch all users
    getAllUsers: async () => {
        try {
            const token = await UserService.getToken();
            const response = await axios.get(USERS_API_BASE_URL, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Fetch a user by its ID
    getUserById: async (userId) => {
        try {
            const token = await UserService.getToken();
            const response = await axios.get(`${USERS_API_BASE_URL}/${userId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with ID: ${userId}`, error);
            throw error;
        }
    },

    // Fetch a user by email
    getUserByEmail: async (email) => {
        try {
            const token = await UserService.getToken();
            const response = await axios.get(`${USERS_API_BASE_URL}/email/${email}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error;
        }
    },

    // Update a user by its ID
    updateUser: async (userId, userData) => {
        try {
            const token = await UserService.getToken();
            const response = await axios.put(`${USERS_API_BASE_URL}/${userId}`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating user with ID: ${userId}`, error);
            throw error;
        }
    },

    // Delete a user by its ID
    deleteUser: async (userId) => {
        try {
            const token = await UserService.getToken();
            await axios.delete(`${USERS_API_BASE_URL}/${userId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
        } catch (error) {
            console.error(`Error deleting user with ID: ${userId}`, error);
            throw error;
        }
    },

    // Fetch users by role
    getUsersByRole: async (role) => {
        try {
            const token = await UserService.getToken();
            const response = await axios.get(`${USERS_API_BASE_URL}/roles/${role}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching users by role: ${role}`, error);
            throw error;
        }
    },

    // Fetch vets or managers
    fetchVets: async () => {
        return await UserService.getUsersByRole('MANAGER');
    },

    // Authentication methods
    logout: async () => {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('role');
    },

    isAuthenticated: async () => {
        const token = await UserService.getToken();
        return !!token;
    },

    isClient: async () => {
        const role = await AsyncStorage.getItem('role');
        return role === 'ROLE_CLIENT';
    },

    isUser: async () => {
        const role = await AsyncStorage.getItem('role');
        return role === 'ROLE_USER';
    },

    clientOnly: async () => {
        const isAuthenticated = await UserService.isAuthenticated();
        const isClient = await UserService.isClient();
        return isAuthenticated && isClient;
    },

    userOnly: async () => {
        const isAuthenticated = await UserService.isAuthenticated();
        const isUser = await UserService.isUser();
        return isAuthenticated && isUser;
    },
};

export default UserService;
