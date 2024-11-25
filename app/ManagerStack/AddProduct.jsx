import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// import { ImageBackground } from "react-native-web";
import { Ionicons } from '@expo/vector-icons';
import baseURL from '../../Services/config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
import ProductService from '../../Services/ProductService';



export default function AddProducttt() {
    const [countKey, setCountKey] = useState(0);
    const [numOfImages, setNumOfImages] = useState(0);
    const [numCounter, setNumCounter] = useState(0);
    const [productName, setProductName] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImage, setProductImage] = useState(null);
    const windowDimensions = Dimensions.get('window');
    const screenDimensions = Dimensions.get('screen');
    const [nannam, setNannam] = useState('');
    // Stores the selected image URI
    const [file, setFile] = useState(null);

    // Stores any error message
    const [error, setError] = useState(null);

    // const windowWidth = Dimensions.get('window').width;
    // const windowHeight = Dimensions.get('window').height;
    // Function to pick an image from 
    //the device's media library


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


    // const pickImage = async () => {
    //     const { status } = await ImagePicker.
    //         requestMediaLibraryPermissionsAsync();

    //     if (status !== "granted") {

    //         // If permission is denied, show an alert
    //         Alert.alert(
    //             "Permission Denied",
    //             `Sorry, we need camera 
    //              roll permission to upload images.`
    //         );
    //     } else {

    //         // Launch the image library and get
    //         // the selected image
    //         const result =
    //             await ImagePicker.launchImageLibraryAsync();

    //         if (!result.canceled) {

    //             // If an image is selected (not cancelled), 
    //             // update the file state variable
    //             setImageUris([{ ImageUri: result.assets[0].uri, id: countKey }]);
    //             setNumOfImages(a => a + 1);
    //             setCountKey(b => b + 1);
    //             // Clear any previous errors
    //             setError(null);
    //             //console.log(imageUris[imageUris.length - 1]);
    //             console.log(numOfImages);
    //             console.log(imageUris);
    //             // Alert.alert(result.uri);
    //             // console.log(result.assets[0].uri);



    //         }
    //     }
    // };








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








    // const deleteImage = (id) => {

    //     const newImages = imageUris.filter(image => image.id !== id);
    //     setImageUris(newImages);
    //     // setNumOfImages(numOfImages-10);
    //     setNumOfImages(a => a - 1);
    //     //console.log(numOfImages);



    // };




    const deleteImage = () => {
        setProductImage(null);



    };








    // const checkingNumberOfImages = () => {

    //     if (numOfImages < 5) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }

    // }




    const checkingNumberOfImages = () => {

        if (numOfImages < 1) {
            return true;
        }
        else {
            return false;
        }

    }




    const checkValueIsNumberOrNot = () => {
        //Handler called on button click
        if (isNaN(priceValue)) {
            //if input is not a number then here
            return false;
        } else {
            //if input is number then here

            setPriceValue(parseFloat(priceValue));
            return true;
        }
    };





    const addProductHandle = async () => {

        // if (isNaN(priceValue)) {
        //     //if input is not a number then here
        //    // const newProduct = await ProductService.createProduct({})
        //   } else {
        //     //if input is number then here
        //     alert('It is a Number'.parse);
        //   }


        // console.log(imageUris);

        if (!productName) {
            Alert.alert('entering the name of the product in mandatory');
            console.log('entering the name of the product in mandatory');
        }

        else if (!priceValue && !checkValueIsNumberOrNot()) {
            Alert.alert('entering the price prperly of the product is mandatory');
            console.log('entering the price prperly of the product in mandatory');
        }

        else if (!productCategory) {
            Alert.alert('entering the category of the product in mandatory');
            console.log('entering the category of the product in mandatory');
        }

        else {
            if (productImage) {
                try {


                    const imageUrl = await ProductService.uploadProductImages(productImage);
                    const product = await ProductService.createProduct({

                        name: productName,
                        productImageUrl: imageUrl,
                        price: priceValue,
                        productCategory: productCategory
                    });
                    // setConditions([...conditions, newChronicCondition]);
                    // setConditionText('');

                } catch (error) {
                    Alert.alert('error creating a new product', error);
                }
            }

            // else{

            //     try{


            //     }catch{


            //     }


            // }

        }


    };


    // const handleSubmit = () => {
    //   //Handler called on button click
    //   if (isNaN(priceValue)) {
    //     //if input is not a number then here
    //     ProductService.
    //   } else {
    //     //if input is number then here
    //     alert('It is a Number'.parse);
    //   }
    // };


    return (



        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>



            <View style={{ flex: 1 }}>
                <Text style={styles.title}>Add a new product:</Text>
            </View>


            <View style={{ flex: 2 }}>
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




            <View style={{ flex: 2 }}>
                <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Price:</Text>
                <TextInput
                    editable
                    placeholder="Product Price"
                    placeholderTextColor='#787170'
                    numberOfLines={3}
                    value={priceValue}
                    keyboardType="numeric"
                    onChangeText={setPriceValue}
                    // onBlur={}
                    style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
                />
            </View>



            <View style={{ flex: 2 }}>
                <Text style={{ marginLeft: 10, fontSize: 25 }}>Product Category:</Text>
                <Picker
                    selectedValue={productCategory}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        setProductCategory(itemValue);
                    }}
                    prompt="Select product category"

                >
                    <Picker.Item label="Select product category" value="" />
                    <Picker.Item label="FOOD" value="FOOD" />
                    <Picker.Item label="TREATS" value="TREATS" />
                    <Picker.Item label="TOYS" value="TOYS" />
                    <Picker.Item label="COLLARS" value="COLLARS" />
                </Picker>
            </View>


            {/* <Image source={require('../../assets/images/upload (1).png')}></Image> */}


















            {/* {console.log('sd'+windowHeight)} */}


            {/* {checkingNumberOfImages()} */}

            <Text style={{ marginLeft: 10, fontSize: 25 }}>Add product Images<Text style={{ fontSize: 17, color: '#1f1f1f' }}> (5 images Max)   {numOfImages}</Text> :</Text>
            <View style={{ flex: 4, borderRadius: 8, backgroundColor: '#c7bcbc', flexDirection: 'row', justifyContent: 'center', paddingBottom: 20, paddingTop: 20, alignItems: 'center' }}>



















                {/* <View style={{ borderRadius: 8, width: 150, height: 270, marginRight: 20, marginLeft: 20, backgroundColor: '#dddddd' }} deleteImage={deleteImage}>


                    <Image source={require('../../assets/images/IMG_6559.jpg')} style={{ flex: 1, width: null, height: null, borderRadius: 8 }} resizeMode='contain'></Image>



                    <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={() => {
                        setNumOfImages(2);
                        console.log(numOfImages)
                    }}>
                        <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

                    </TouchableOpacity>

                </View> */}











                {/* {imageUris.map((item) => {
                    return (
                        <View key={item.id} style={{ borderRadius: 8, width: '12%', height: '100%', marginRight: 20, marginLeft: 20, backgroundColor: '#dddddd' }} deleteImage={deleteImage}>


                            <Image source={{ uri: item.ImageUri }} style={{ flex: 1, width: null, height: null, borderRadius: 8 }} resizeMode='contain'></Image>


                            
                            <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={() => { deleteImage(item.id) }}>
                                <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

                            </TouchableOpacity>

                        </View>
                    )
                })} */}


                {/* <View key={imgUri.id} style={{ margin: 10, backgroundColor: '#201E43', borderRadius: 8 }} deleteChronicConditionHandle={deleteChronicConditionHandle}>
                                    <View>
                                        <Text style={{ borderTopEndRadius: 8, borderTopStartRadius: 8, margin: 5, color: 'white' }}>{item.chronicCondition}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                                        <TouchableOpacity style={{ backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8, flex: 1 }}>
                                            <Text style={{ color: 'black', alignSelf: 'center' }} onPress={() => deleteChronicConditionHandle(item.id)}>Delete Condition</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View> */}















































                {(productImage) && (

                    <View style={{ borderRadius: 8, width: '12%', height: '100%', marginRight: 20, marginLeft: 20, backgroundColor: '#dddddd' }} deleteImage={deleteImage}>


                        <Image source={productImage} style={{ flex: 1, width: null, height: null, borderRadius: 8 }} resizeMode='contain'></Image>



                        <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteImage}>
                            <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

                        </TouchableOpacity>

                    </View>

                )}



                {/* {(checkingNumberOfImages)?.console.log('dgdf')} */}


                {!(productImage) && (
                    <View style={{ borderRadius: 8, width: '12%', height: '100%', marginRight: 20, marginLeft: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-around' }}>


                        {/* <Image source={require('../../assets/images/upload (5).png')} resizeMode='cover'></Image> */}
                        <View style={{ height: '60%', width: '100%' }}>
                            <Image source={require('../../assets/images/upload (3).png')} style={{ flex: 1, width: null, height: null }} resizeMode='contain'></Image>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: "#133945", borderRadius: 8, padding: 10, marginVertical: 10 }} onPress={pickImage}>
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

                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: '70%', width: '80%' }} onPress={addProductHandle}>
                    <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, padding: 17 }}>Add Product</Text>
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
        height: 50,
        margin: 20,


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