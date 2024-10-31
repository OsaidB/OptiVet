import axios from 'axios';
import baseURL from './config'; // Adjust the path as necessary

const USERS_API_BASE_URL = `${baseURL.USED_BASE_URL}/api/users`;

const UserService = {

    fetchVets: async () => {
        try {
            const response = await axios.get(`${USERS_API_BASE_URL}/roles/MANAGER`);
            return response.data; // Return the data for use in the component
        } catch (error) {
            console.error('Error fetching vets:', error);
            throw error; // Rethrow the error for handling in the component
        }
    },
    // Add other user-related methods as needed



    // Fetch all users
    getAllUsers: async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(USERS_API_BASE_URL, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Fetch a user by its ID
    getUserById: async (userId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${USERS_API_BASE_URL}/${userId}`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with ID: ${userId}`, error);
            throw error;
        }
    },

    // Fetch a user by email
    getUserByName: async (email) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${USERS_API_BASE_URL}/users/${email}`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error;
        }
    },

    // Update a user by its ID
    updateUser: async (userId, userData) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(`${USERS_API_BASE_URL}/${userId}`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating user with ID: ${userId}`, error);
            throw error;
        }
    },

    // Delete a user by its ID
    deleteUser: async (userId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${USERS_API_BASE_URL}/${userId}`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
        } catch (error) {
            console.error(`Error deleting user with ID: ${userId}`, error);
            throw error;
        }
    },

    // Fetch users by role ID
    getUsersByRoleId: async (roleId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${USERS_API_BASE_URL}/roles/${roleId}`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching users by role ID: ${roleId}`, error);
            throw error;
        }
    },

    // Fetch manager users
    getManagerUsers: async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${USERS_API_BASE_URL}/roles/MANAGER`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching manager users:', error);
            throw error;
        }
    },

    // Authentication methods
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    isAdmin: () => {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    },

    isUser: () => {
        const role = localStorage.getItem('role');
        return role === 'USER';
    },

    adminOnly: () => {
        return UserService.isAuthenticated() && UserService.isAdmin();
    }
};

export default UserService;
