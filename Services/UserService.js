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
    getUserByName: async (email) => {
        try {
            const token = await UserService.getToken();
            const response = await axios.get(`${USERS_API_BASE_URL}/users/${email}`, {
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

    // Fetch users by role ID
    getUsersByRoleId: async (roleId) => {
        try {
            const token = await UserService.getToken();
            const response = await axios.get(`${USERS_API_BASE_URL}/roles/${roleId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching users by role ID: ${roleId}`, error);
            throw error;
        }
    },

    // Fetch manager users
    getManagerUsers: async () => {
        try {
            const token = await UserService.getToken();
            const response = await axios.get(`${USERS_API_BASE_URL}/roles/MANAGER`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching manager users:', error);
            throw error;
        }
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

    isAdmin: async () => {
        const role = await AsyncStorage.getItem('role');
        return role === 'ADMIN';
    },

    isUser: async () => {
        const role = await AsyncStorage.getItem('role');
        return role === 'USER';
    },

    adminOnly: async () => {
        const isAuthenticated = await UserService.isAuthenticated();
        const isAdmin = await UserService.isAdmin();
        return isAuthenticated && isAdmin;
    },

    // Fetch vets (example of additional method)
    fetchVets: async () => {
        try {
            const token = await UserService.getToken();
            const response = await axios.get(`${USERS_API_BASE_URL}/roles/MANAGER`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching vets:', error);
            throw error;
        }
    },
};

export default UserService;
