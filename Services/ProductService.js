import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
const BASE_URL_IMG = `${baseURL.USED_BASE_URL}/api/pets`;



const ProductService = {


    getToken: async () => {
        return await AsyncStorage.getItem('authToken');
    },


    createProduct: async (productData) => {
        try {
            const token = await ProductService.getToken();
            const response = await axios.post(`${BASE_URL}`, productData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },


    uploadProductImages: async (imageUri) => {
        try {
            const token = await ProductService.getToken();
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(imageUri);
                console.log(response);
                const blob = await response.blob();
                formData.append('image', blob, 'productImage.jpg');
            } else {
                formData.append('image', {
                    uri: imageUri,
                    name: 'productImage.jpg',
                    type: 'image/jpeg',
                });
            }

            const response = await axios.post(`${BASE_URL}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Auth-Token': token,
                },
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading product image:', error);
            throw error;
        }
    },




    getProducts: async () => {
        try {
            const token = await ProductService.getToken();
            const response = await axios.get(BASE_URL, {
                headers: {
                    'X-Auth-Token': token,
                },

            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },


    serveProductImage: async (name) => {


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
            console.log('Error serving product image', uploadingError);
            throw uploadingError;

        }
    },



    deleteProduct: async (productId) => {
        try {
            const token = await ProductService.getToken();
            const response = await axios.delete(`${BASE_URL}/${productId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting product with ID: ${productId}`, error);
            throw error;
        }
    },




    handleUpload: async (imageUri) => {

        try {

            const token = await ProductService.getToken();
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(BASE_URL_IMG + imageUri, {
                    method: "GET",
                    headers: {
                        'X-Auth-Token': token,
                    },
                });
                const blob = await response.blob();
                formData.append('image', blob, 'productImage.jpg');
            } else {
                formData.append('image', {
                    uri: imageUri,
                    name: 'productImage.jpg',
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
            console.error('Error uploading product image:', error);
            throw error;
        }


    },



    getProductById: async (productId) => {
        try {
            const token = await ProductService.getToken();
            const response = await axios.get(`${BASE_URL}/${productId}`, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with ID: ${productId}`, error);
            throw error;
        }
    },


    updateProductById: async (productData, productId) => {
        try {
            const token = await ProductService.getToken();
            const response = await axios.put(`${BASE_URL}/${productId}`, productData, {
                headers: {
                    'X-Auth-Token': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating product with ID: ${productId}`, error);
            throw error;
        }
    },




};

export default ProductService;
