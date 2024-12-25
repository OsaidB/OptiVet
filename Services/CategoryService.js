import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config';
const BASE_URL = `${baseURL.USED_BASE_URL}/api/categories`;


const CategoryService = {


    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },





    createCategory: async (categoryData) => {
        try {
            const token = await CategoryService.getToken();
            const response = await axios.post(`${BASE_URL}`, categoryData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },





    uploadCategoryImage: async (imageUri) => {
        try {
            const token = await CategoryService.getToken();
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                formData.append('image', blob, 'categoryImage.jpg');
            } else {
                formData.append('image', {
                    uri: imageUri,
                    name: 'categoryImage.jpg',
                    type: 'image/jpeg',
                });
            }

            const response = await axios.post(`${BASE_URL}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Auth-Token': token,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading category image:', error);
            throw error;
        }
    },






    getCategories: async () => {
        try {
            const token = await CategoryService.getToken();
            const response = await axios.get(BASE_URL, {
                headers: {
                    'X-Auth-Token': token,
                },

            });
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },


    serveCategoryImage: async (name) => {

        const token = await CategoryService.getToken();

        try {

            const response = await axios.get(`${BASE_URL}/uploads/${name}`, {
                headers: {

                    'X-Auth-Token': token,

                },




            },
                { responseType: 'blob' }
            );


            return URL.createObjectURL(response.data);

        } catch (uploadingError) {
            console.log('Error serving category image', uploadingError);
            throw uploadingError;

        }
    },





    // deleteCategory: async (categoryId) => {
    //     try {
    //         const token = await CategoryService.getToken();
    //         await axios.delete(`${BASE_URL}/${categoryId}`, {
    //             headers: {
    //                 'X-Auth-Token': token,
    //             },
    //         });
    //     } catch (error) {
    //         console.error(`Error deleting category with ID: ${categoryId}`, error);
    //         throw error;
    //     }
    // },




    deleteCategory: async (categoryId) => {
        try {
            const token = await CategoryService.getToken();
            const response = await axios.delete(`${BASE_URL}/${categoryId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting category with ID: ${categoryId}`, error);
            throw error;
        }
    },






    getCategoryById: async (categoryId) => {
        try {
            const token = await CategoryService.getToken();
            const response = await axios.get(`${BASE_URL}/${categoryId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching category with ID: ${categoryId}`, error);
            throw error;
        }
    },

};












export default CategoryService;
