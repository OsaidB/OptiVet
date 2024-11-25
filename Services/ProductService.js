import axios from 'axios';
import { Platform } from 'react-native';

import baseURL from './config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;


const ProductService = {
    // Create a new product
    createProduct: async (product) => {
        try {
            const response = await axios.post(`${BASE_URL}`, product);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },







    uploadProductImages: async (imageUris) => {
        try {
            const fdd = new FormData();

            if (Platform.OS === 'web') {

                const rr = await fetch(imageUris);
                const blobb = await rr.blob();
                fdd.append('image', blobb, 'productImage');

            } else {


                fdd.append('image', {

                    uri: imageUris,
                    name: 'productImage.jpg',
                    type: 'image/jpeg'
                });



            }

            const rrr = await axios.post(`${BASE_URL}/uploadImage`, fdd, {

                headers: {

                    'Content-Type': 'multipart/form-data',
                }
            });

            return rrr.data;
        } catch (eee) {
            console.error("error uploading product image", eee);
            throw eee;
        }


    },



    getProducts: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },


    serveProductImage: async (name) => {


        try {
          
            const response = await axios.get(`${BASE_URL}/uploads/${name}`,
                {
                    responseType: 'blob',
                }
            );
            

            return URL.createObjectURL(response.data);

        } catch (uploadingError) {
            console.log('Error serving product image', uploadingError);
            throw uploadingError;

        }
    }
















































































};

export default ProductService;
