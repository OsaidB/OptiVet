import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput,
    Modal, ScrollView,
    Platform, SafeAreaView
} from "react-native";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import baseURL from '../../Services/config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/petsForAdoption`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;
import ProductService from '../../Services/ProductService';
import CategoryService from '../../Services/CategoryService';
import { WINDOWS } from "nativewind/dist/utils/selector";
import axios from "axios";
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams






export default function UpdateProduct() {
    const router = useRouter();
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [applyImage, setApplyImage] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productImageUrl, setProductImageUrl] = useState(null);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);


    const { productId } = useLocalSearchParams();



    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchProduct = await ProductService.getProductById(productId);
                setProduct(fetchProduct);
                setProductName(fetchProduct.name);
                setProductPrice(fetchProduct.price);
                setProductCategory(fetchProduct.productCategory);
                setProductImageUrl(fetchProduct.productImageUrl);
                setApplyImage(true);

            } catch (error) {
                console.error("Error fetching product:", error);
                Alert.alert('Error', 'Failed to load product.');
            }
        };


        const fetchCategories = async () => {
            try {
                const fetchCategories = await CategoryService.getCategories();
                setCategories(fetchCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
                Alert.alert('Error', 'Failed to load categories.');
            }
        };

        fetchProduct();
        fetchCategories();

    }, []);






    const pickImage = async () => {
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {

            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera 
                 roll permission to upload images.`
            );
        } else {

            const result =
                await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {

                setProductImage(result.assets[0].uri);
                setApplyImage(true);
                setError(null);

            }
        }
    };



    const deleteProductImage = () => {
        setProductImage(null);
        setApplyImage(false);


    };


    const deleteProductImageUrl = () => {
        setProductImageUrl(null);
        setApplyImage(false);


    };



    const updateProductHandle = async () => {


        if (!productName) {
            Alert.alert('entering the name of the product in mandatory');
            console.log('entering the name of the product in mandatory');
        }

        else if (!productPrice && !checkValueIsNumberOrNot()) {
            Alert.alert('entering the price properly of the product is mandatory');
            console.log('entering the price properly of the product in mandatory');
        }

        else if (!productCategory) {
            Alert.alert('entering the category of the product in mandatory');
            console.log('entering the category of the product in mandatory');
        }

        else {

            try {


                if (productImage) {
                    const imageOfProduct = await ProductService.uploadProductImages(productImage);
                    const updatedProduct = await ProductService.updateProductById({

                        name: productName,
                        productImageUrl: imageOfProduct,
                        price: productPrice,
                        productCategory: productCategory
                    }, productId);

                }
                if (!productImage) {


                    const updatedProduct = await ProductService.updateProductById({

                        name: productName,
                        productImageUrl: product.productImageUrl,
                        price: productPrice,
                        productCategory: productCategory
                    }, productId);

                }




                router.push({
                    pathname: '/SecretaryStack/Products',

                });
            } catch (error) {
                Alert.alert('error updating product', error);
            }



        }

    };



    const checkValueIsNumberOrNot = () => {

        if (isNaN(productPrice)) {

            return false;
        } else {


            setProductPrice(parseFloat(productPrice));
            return true;
        }
    };


    return (
        <SafeAreaView
            style={styles.container}>
            <ScrollView style={styles.scroll}>


                <Text style={styles.title}>Update Product</Text>


                <View>

                    <Text style={styles.elementText}>Product Name:</Text>
                    <TextInput
                        editable
                        placeholder="Product Name"
                        placeholderTextColor='#787170'
                        numberOfLines={3}
                        value={productName}
                        onChangeText={setProductName}
                        maxLength={100}
                        // onBlur={}
                        style={styles.textInputStyle}
                    />
                </View>



                <View>

                    <Text style={styles.elementText}>Product Price:</Text>
                    <TextInput
                        editable
                        placeholder="Product Price"
                        placeholderTextColor='#787170'
                        numberOfLines={3}
                        value={productPrice}
                        onChangeText={setProductPrice}
                        keyboardType="numeric"
                        maxLength={100}
                        // onBlur={}
                        style={styles.textInputStyle}

                    />
                </View>



                <View>
                    <Text style={styles.elementText}>Product Category:</Text>

                    <Picker
                        style={
                            Platform.OS == ('web' || 'android')
                                ? styles.picker
                                : styles.pickerIos
                        }
                        selectedValue={productCategory}
                        onValueChange={(itemValue) => {
                            setProductCategory(itemValue);
                            //setSelectedCategoryId(itemValue);
                        }}
                        prompt="Select product category"

                    >

                        <Picker.Item label="Select product category" value="" />


                        {categories.map((item) => {


                            return (

                                <Picker.Item key={item.id} label={item.name} value={item.name} />

                            )
                        })}

                    </Picker>


                </View>



                <Text style={styles.elementText}>Edit Product Image:</Text>
                <View style={styles.imagePart}>



                    {(!(productImage) && !(productImageUrl)) && (
                        <View style={styles.imageStyle}>

                            <Image source={require('../../assets/images/upload (3).png')} style={styles.uploadImageStyling} resizeMode='contain'></Image>

                            <TouchableOpacity style={styles.button} onPress={pickImage}>
                                <Text style={styles.buttonText} adjustsFontSizeToFit>Upload Image</Text>
                            </TouchableOpacity>

                        </View>)}



                    {(applyImage && productImageUrl) && (


                        <View style={styles.imageStyle} deleteProductImageUrl={deleteProductImageUrl}>


                            <Image source={{ uri: `${BASE_URL_IMAGES}${productImageUrl}` }} style={styles.petImageStyling} resizeMode='contain'></Image>

                            <TouchableOpacity style={styles.deleteImageButton} onPress={deleteProductImageUrl}>
                                <Text style={styles.deleteImageButtonStyling}>X</Text>

                            </TouchableOpacity>

                        </View>

                    )}



                    {(applyImage && productImage) && (

                        <View style={styles.imageStyle} deleteProductImage={deleteProductImage}>


                            <Image source={productImage} style={styles.petImageStyling} resizeMode='contain'></Image>

                            <TouchableOpacity style={styles.deleteImageButtonStyling} onPress={deleteProductImage}>
                                <Text style={styles.deleteImageButtonStyling}>X</Text>

                            </TouchableOpacity>

                        </View>

                    )}


                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={updateProductHandle}>
                    <Text
                        style={styles.addButtonText}>
                        Update Product
                    </Text>
                </TouchableOpacity>



            </ScrollView>
        </SafeAreaView>


    );
}


const styles = StyleSheet.create({


    container: {

        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: Platform.OS == 'web' ? 0 : 30
    },

    scroll: {
        width: '100%',
        marginVertical: Platform.OS == 'web' ? 0 : 30
    },


    elementText: {
        marginLeft: 10,
        marginBottom: 12,
        fontSize: 25
    },

    textInputStyle: {

        borderWidth: 2,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
        height: 40,
        paddingLeft: 20,
        borderRadius: 4,
        backgroundColor: 'white',
    },


    textDescriptionInput: {
        padding: 12,
        borderWidth: 2,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 12,
        justifyContent: 'center',
    },

    sliderText: {
        marginLeft: 10,
        fontSize: 25
    },

    pickerIos: {
        borderWidth: 4,
        borderColor: '#f5f5f5',
        marginBottom: 20,

    },

    imagePart: {
        backgroundColor: '#c7bcbc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        marginBottom: 20,
    },

    imageStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'white',
    },

    uploadImageStyling: {
        width: 100,
        height: 100,
        marginTop: 10
    },

    button: {
        backgroundColor: '#133945',
        borderRadius: 8,
        padding: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteImageButton: {
        borderRadius: 100,
        backgroundColor: 'brown',
        width: 30,
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        left: -10,
        top: -10,
    },

    deleteImageButtonStyling: {
        alignSelf: 'center',
        fontSize: 20
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    picker: {
        height: 40,
        marginTop: 12,
        marginBottom: 20,
        marginHorizontal: 12,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        color: '#1D3D47',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
        alignSelf: 'center',
    },

    slider: {
        height: 40,
        marginHorizontal: 10,
        marginBottom: 12,
    },
    addButtonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    petImageStyling: {
        width: 120,
        height: 120,
        borderRadius: 8
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#133945',
        borderRadius: 18,
        padding: 12,
        marginVertical: 10,
    }
});


















