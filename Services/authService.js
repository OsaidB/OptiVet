// authService.js

import axios from 'axios';

import baseURL from './config'; // Adjust the path as necessary
const BASE_URL= `${baseURL.USED_BASE_URL}/auth`;

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
            const token = localStorage.getItem("token"); // Retrieve the token for authentication
            const response = await axios.post(`${BASE_URL}/register-employee`, employeeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': token, // Include token in the request headers
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
}

export default new AuthService();