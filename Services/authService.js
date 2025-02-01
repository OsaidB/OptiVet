// authService.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import axios from 'react-native-axios';
// import https from 'https';
import baseURL from './config'; // Adjust the path as necessary
const BASE_URL= `${baseURL.USED_BASE_URL}/auth`;

// // Create an Axios instance with SSL verification disabled
// const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     timeout: 10000, // Optional: Add a timeout for requests
//     validateStatus: () => true, // Accept all status codes
// });


class AuthService {

    // Function to request a password reset
// Function to request a password reset
    async requestPasswordReset(email) {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.post(`${BASE_URL}/password-reset`, { email }, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Function to reset the password with a token
    async resetPassword(resetToken, newPassword) {
        const token = localStorage.getItem("authToken");
        try {
            const response = await axios.post(`${BASE_URL}/password-reset/confirm`, { resetToken, newPassword }, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }



    // Function to log in a user
    async login(password, email) {
        try {
            const response = await axios.post(`${BASE_URL}`, { password, email });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Function to register a new user
    async register(userData) {
        try {
            const response = await axios.post(`${BASE_URL}/register`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Function to register a new employee
    async registerEmployee(employeeData) {
        try {
            const token = await AsyncStorage.getItem("authToken"); // Use AsyncStorage instead of localStorage
            const response = await axios.post(`${BASE_URL}/register-employee`, employeeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': token || '', // Ensure token is not null
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Logout method
    async logout() {
        try {
            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('authToken');

            // Notify the backend to invalidate the token
            if (token) {
                await axios.post(`${BASE_URL}/logout`, {}, {
                    headers: {
                        'X-Auth-Token': token, // Send token in the header
                    },
                });
            }

            // Clear AsyncStorage (authToken, email, role)
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('role');

            console.log('Logout successful.');
            return true; // Return success
        } catch (error) {
            console.error('Error during logout:', error);
            return false; // Return failure
        }
    }

}

export default new AuthService();