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


    // Create a new product
    // createProduct: async (product) => {
    //     try {
    //         const token = await ProductService.getToken();
    //         const response = await axios.post(`${BASE_URL}`, product, {
    //             headers: {
    //                 'X-Auth-Token': token,
    //             },

    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error creating product:", error);
    //         throw error;
    //     }
    // },




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
            console.error('Error creating producTTTTTTTTTt:', error);
            throw error;
        }
    },



    // uploadImage: async (imageUri) => {
    //     try {
    //         const token = await PetService.getToken();
    //         const formData = new FormData();

    //         if (Platform.OS === 'web') {
    //             const response = await fetch(imageUri);
    //             const blob = await response.blob();
    //             formData.append('image', blob, 'petImage.jpg');
    //         } else {
    //             formData.append('image', {
    //                 uri: imageUri,
    //                 name: 'petImage.jpg',
    //                 type: 'image/jpeg',
    //             });
    //         }

    //         const response = await axios.post(`${BASE_URL}/uploadImage`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'X-Auth-Token': token,
    //             },
    //         });

    //         return response.data;
    //     } catch (error) {
    //         console.error('Error uploading pet image:', error);
    //         throw error;
    //     }
    // },





    // uploadProductImages: async (imageUris) => {
    //     try {
    //         const token = await ProductService.getToken();
    //         const fdd = new FormData();

    //         if (Platform.OS === 'web') {

    //             const rr = await fetch(imageUris);
    //             const blobb = await rr.blob();
    //             fdd.append('image', blobb, 'productImage.jpg');

    //         } else {


    //             fdd.append('image', {

    //                 uri: imageUris,
    //                 name: 'productImage.jpg',
    //                 type: 'image/jpeg'
    //             });



    //         }

    //         const rrr = await axios.post(`${BASE_URL}/uploadImage`, fdd, {

    //             headers: {

    //                 'Content-Type': 'multipart/form-data',
    //                 'X-Auth-Token': token,

    //             }
    //         });

    //         return rrr.data;
    //     } catch (eee) {
    //         console.error("error uploading product image", eee);
    //         throw eee;
    //     }


    // },








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



    // serveImage: (imagePath) => {
    //     if (!imagePath) {
    //         console.error('Error: Image path is required to serve the image.');
    //         return null;
    //     }
    //     // If the path already starts with '/uploads', use it as-is
    //     if (imagePath.startsWith('/uploads')) {
    //         return `${BASE_URL}${imagePath}`;
    //     }
    //     // Otherwise, assume it's a filename and construct the full path
    //     return `${BASE_URL}/uploads/${imagePath}`;
    // },










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
                //console.log(response);
                const blob = await response.blob();
                formData.append('image', blob, 'productImage.jpg');
                //console.log(formData);
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







        //////////////////////////////////////////////////////////////////////////////////////////


        //         const token = await ProductService.getToken();
        //         console.log(imageUri);
        //         const imageData = new FormData();



        //         fetch(BASE_URL_IMG + imageUri, {
        //             method: "GET",
        //         }).then(response => response.blob()).then(response => {
        //             console.log("Getting success", response);
        //             imageData.append('productImage', response, 'productImage.jpg');

        //             alert("Getting Success")
        //         }).catch(error => { console.log("Getting error", error); alert("Getting failed !") });

        // console.log(imageData);



        //         //imageData.append("productImage", imagee);
        //        // console.log(imageData.get().type() + 'heyyyy');


        //         //imageData.append('productImage', imagee, 'productImage.jpg');

        //         // imageData.append("productImage", {
        //         //     name: 'productImage.jpg',
        //         //     type:'image/jpeg' });



        //         // Object.keys(imageData).forEach(key => {

        //         //   image

        //         // });


        //         // fetch(`${BASE_URL}/uploadImage`, {
        //         //     method: "POST", body: imageData, headers: {
        //         //         'Content-Type': 'multipart/form-data',
        //         //         'X-Auth-Token': token,
        //         //     },
        //         // }).then(response => response.blob()).then(response => {
        //         //     console.log("Upload success", response);
        //         //     alert("Upload Success")
        //         // }).catch(error => { console.log("Upload error", error); alert("Upload failed !") });









        //         const response = await axios.post(`${BASE_URL}/uploadImage`, imageData, {
        //             headers: {
        //                 'Content-Type': 'multipart/form-data',
        //                 'X-Auth-Token': token,
        //             },
        //         });

        //         return response.data;







        //////////////////////////////////////////


        // const response = await axios.post(`${BASE_URL}/uploadImage`, imageData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //         'X-Auth-Token': token,
        //     },
        // });

        // return response.data;

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
            console.error(`Error fetching product with ID: ${categoryId}`, error);
            throw error;
        }
    },













    updateProductById: async (productId, productData) => {
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
