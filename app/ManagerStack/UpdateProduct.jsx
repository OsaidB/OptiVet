import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput,
    Modal, ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// import { ImageBackground } from "react-native-web";
import { Ionicons } from '@expo/vector-icons';
import baseURL from '../../Services/config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;
import ProductService from '../../Services/ProductService';
import { WINDOWS } from "nativewind/dist/utils/selector";
import { useRouter, Link, useLocalSearchParams, usePathname } from 'expo-router';
import CategoryService from '../../Services/CategoryService';



export default function AddProduct() {
    const [countKey, setCountKey] = useState(0);
    const [product, setProduct] = useState(null);
    const [numOfImages, setNumOfImages] = useState(0);
    const [productImage, setProductImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImageUrl, setProductImageUrl] = useState('');
    const windowDimensions = Dimensions.get('window');
    const screenDimensions = Dimensions.get('screen');
    const [nannam, setNannam] = useState('');
    // Stores the selected image URI
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([{ id: 1, name: 'ddd' }, { id: 2, name: 'ddd' }, { id: 3, name: 'ddd' }, { id: 4, name: 'ddd' }, { id: 5, name: 'ddd' }, { id: 6, name: 'ddd' }, { id: 7, name: 'ddd' }, { id: 8, name: 'ddd' }, { id: 9, name: 'ddd' }, { id: 10, name: 'ddd' }, { id: 11, name: 'ddd' }, { id: 12, name: 'ddd' }, { id: 13, name: 'ddd' }, { id: 14, name: 'ddd' }, { id: 15, name: 'ddd' }, { id: 16, name: 'ddd' }, { id: 17, name: 'ddd' }, { id: 18, name: 'ddd' },])
    
    // Stores any error message
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // const windowWidth = Dimensions.get('window').width;
    // const windowHeight = Dimensions.get('window').height;
    // Function to pick an image from 
    //the device's media library
    const { productId } = useLocalSearchParams(); // Retrieve clientId dynamically


    const [dimensions, setDimensions] = useState({
        window: windowDimensions,
        screen: screenDimensions,
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
            'change',
            ({ window, screen }) => {
                setDimensions({ window, screen });
            },
        );
        return () => subscription?.remove();
    });




    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchCategories = await CategoryService.getCategories();
                setCategories(fetchCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
                Alert.alert('Error', 'Failed to load categories.');
            }
        };

        fetchCategories();

    }, []);






    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchProduct = await ProductService.getProductById(productId);

                setProduct(fetchProduct);
                setProductName(fetchProduct.name);
                setProductPrice(fetchProduct.price);
                setProductCategory('T');

                //setProductCategory(fetchProduct.productCategory);


                //console.log(BASE_URL_IMAGES+fetchProduct.productImageUrl);
                //console.log('heyyy');
                setProductImageUrl(BASE_URL_IMAGES + fetchProduct.productImageUrl);
                //console.log(productImageUrl+'heyyy');
            } catch (error) {
                console.error("Error fetching products:", error);
                Alert.alert('Error', 'Failed to load products.');
            }
        };

        fetchProduct();

    }, []);







    const pickImage = async () => {
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {

            // If permission is denied, show an alert
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera 
                 roll permission to upload images.`
            );
        } else {

            // Launch the image library and get
            // the selected image
            const result =
                await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {

                // If an image is selected (not cancelled), 
                // update the file state variable
                setProductImage(result.assets[0].uri);
                setNumOfImages(a => a + 1);
                setCountKey(b => b + 1);
                // Clear any previous errors
                setError(null);
                //console.log(imageUris[imageUris.length - 1]);
                // console.log(numOfImages);
                console.log(result.assets[0].uri);
                // Alert.alert(result.uri);
                // console.log(result.assets[0].uri);



            }
        }
    };





    const deleteImage = () => {
        setProductImageUrl(null);



    };








    const updateProductHandle = async () => {

        if (!productName) {
            Alert.alert('entering the name of the product in mandatory');
            console.log('entering the name of the product in mandatory');
        }

        else if (!productPrice && !checkValueIsNumberOrNot()) {
            Alert.alert('entering the price prperly of the product is mandatory');
            console.log('entering the price prperly of the product in mandatory');
        }

        else if (!productCategory) {
            Alert.alert('entering the category of the product in mandatory');
            console.log('entering the category of the product in mandatory');
        }


        // else if (!productImageUrl) {
        //     Alert.alert('entering product image in mandatory');
        //     console.log('entering product image in mandatory');
        // }
        else {

            try {

            if(productImage){
                const imageUrl = await ProductService.uploadProductImages(productImage);
                const product = await ProductService.updateProductById(productId, {

                    name: productName,
                    productImageUrl: imageUrl,
                    price: productPrice,
                    productCategory: productCategory
                });

            }

            else{
                const product = await ProductService.updateProductById(productId, {

                    name: productName,
                    productImageUrl: productImageUrl,
                    price: productPrice,
                    productCategory: productCategory
                });
            }
                // setConditions([...conditions, newChronicCondition]);
                // setConditionText('');
                router.back({
                    pathname: '/ManagerStack/Products',

                });

            } catch (error) {
                Alert.alert('error creating a new product', error);
            }





        }


    };





    return (




        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>




            <Text style={styles.title}>Update product :</Text>



            <View style={{}}>
                <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Name:</Text>
                <TextInput
                    editable
                    placeholder="Product Name"
                    placeholderTextColor='#787170'
                    numberOfLines={3}
                    value={productName}
                    onChangeText={setProductName}
                    maxLength={100}
                    // onBlur={}
                    style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
                />
            </View>




            <View style={{}}>
                <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Price:</Text>
                <TextInput
                    editable
                    placeholder="Product Price"
                    placeholderTextColor='#787170'
                    numberOfLines={3}
                    value={productPrice}
                    keyboardType="numeric"
                    onChangeText={setProductPrice}
                    // onBlur={}
                    style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
                />
            </View>



            <View style={{}}>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10, fontSize: 25 }}>Product Category:</Text>
                    </View>

                </View>
                <Picker
                    selectedValue={productCategory}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        setProductCategory(itemValue);
                    }}
                    prompt="Select product category"

                >
                    <Picker.Item label="Select product category" value="" />
                    {/* <Picker.Item label="FOOD" value="FOOD" />
                    <Picker.Item label="TREATS" value="TREATS" />
                    <Picker.Item label="TOYS" value="TOYS" />
                    <Picker.Item label="COLLARS" value="COLLARS" /> */}


                    {categories.map((item) => {


                        return (

                            <Picker.Item key={item.id} label={item.name} value={item.id} />

                        )
                    })}
                </Picker>
            </View>




            <Text style={{ marginLeft: 10, fontSize: 25 }}>Add a product Image<Text style={{ fontSize: 17, color: '#1f1f1f' }}></Text> :</Text>
            <View style={{ flex: 4, borderRadius: 8, backgroundColor: '#c7bcbc', flexDirection: 'row', justifyContent: 'center', paddingBottom: 20, paddingTop: 20, alignItems: 'center' }}>



                {(productImageUrl) && (

                    <View style={{ borderRadius: 8, width: '12%', height: '100%', marginRight: 20, marginLeft: 20, backgroundColor: '#dddddd' }} deleteImage={deleteImage}>


                        <Image source={`${productImageUrl}`} style={{ flex: 1, width: null, height: null, borderRadius: 8 }} resizeMode='contain'></Image>



                        <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteImage}>
                            <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

                        </TouchableOpacity>

                    </View>

                )}



                {/* {(checkingNumberOfImages)?.console.log('dgdf')} */}


                {!(productImageUrl) && (
                    <View style={{ borderRadius: 8, width: '12%', height: '100%', marginRight: 20, marginLeft: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-around' }}>


                        {/* <Image source={require('../../assets/images/upload (5).png')} resizeMode='cover'></Image> */}
                        <View style={{ flex: 1, height: '60%', width: '100%' }}>
                            <Image source={require('../../assets/images/upload (3).png')} style={{ flex: 1, width: null, height: null }} resizeMode='contain'></Image>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '85%' }}>
                            <TouchableOpacity style={{ backgroundColor: "#133945", borderRadius: 8, padding: 10, marginVertical: 10, width: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
                                <Text style={styles.buttonText} adjustsFontSizeToFit>Upload Image</Text>
                            </TouchableOpacity>
                        </View>


                    </View>)}








                {/* 
                <View style={{ borderRadius: 8, width: '15%', height: '90%', marginRight: 20, marginLeft: 20 }}>


<Image source={require('../../assets/images/IMG_6559.jpg')} style={{ flex: 1, width: null, height: null }} resizeMode='cover'></Image>



<TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }}>
    <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

</TouchableOpacity>

</View> */}


















            </View>




            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>

                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: '70%', width: '80%' }} onPress={updateProductHandle}>
                    <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, padding: 17 }}>Update Product</Text>
                </TouchableOpacity>

            </View>



        </View>









    );
}


const styles = StyleSheet.create({
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },



    picker: {
        height: 40,
        marginTop: 10,
        marginHorizontal: 10,

        borderColor: 'black',
        borderWidth: 2, // Thicker border
        borderRadius: 5, // Rounded corners
        padding: 10, // Padding for a more spacious feel
        color: '#1D3D47', // Text color for visibility
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 4
    },
});






// {/* <Text style={styles.header}>
// Add Image:
// </Text>

// {/* Button to choose an image */}
// <TouchableOpacity style={styles.button}
// onPress={pickImage}>
// <Text style={styles.buttonText}>
//     Choose Image
// </Text>
// </TouchableOpacity>

// {/* Conditionally render the image
// or error message */}
// {file ? (
// // Display the selected image
// <View style={styles.imageContainer}>
//     <Image source={{ uri: file }}
//         style={styles.image} />
// </View>
// ) : (
// // Display an error message if there's
// // an error or no image selected
// <Text style={styles.errorText}>{error}</Text>
// )} 