// import { useState, useEffect } from "react";
// import {
//     View, Text, Image, TouchableOpacity,
//     StyleSheet, Alert, ImageBackground, TextInput,
//     Modal, ScrollView
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Dimensions } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// // import { ImageBackground } from "react-native-web";
// import { Ionicons } from '@expo/vector-icons';
// import baseURL from '../../Services/config'; // Adjust the path as necessary
// const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
// const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;
// import ProductService from '../../Services/ProductService';
// import { WINDOWS } from "nativewind/dist/utils/selector";
// import { useRouter, Link, useLocalSearchParams, usePathname } from 'expo-router';
// import CategoryService from '../../Services/CategoryService';



// export default function AddProduct() {
//     const [countKey, setCountKey] = useState(0);
//     const [product, setProduct] = useState(null);
//     const [numOfImages, setNumOfImages] = useState(0);
//     const [productImage, setProductImage] = useState(null);
//     const [productName, setProductName] = useState('');
//     const [productPrice, setProductPrice] = useState('');
//     const [productCategory, setProductCategory] = useState('');
//     const [productImageUrl, setProductImageUrl] = useState('');
//     const windowDimensions = Dimensions.get('window');
//     const screenDimensions = Dimensions.get('screen');
//     const [nannam, setNannam] = useState('');
//     // Stores the selected image URI
//     const [file, setFile] = useState(null);
//     const [categories, setCategories] = useState([{ id: 1, name: 'ddd' }, { id: 2, name: 'ddd' }, { id: 3, name: 'ddd' }, { id: 4, name: 'ddd' }, { id: 5, name: 'ddd' }, { id: 6, name: 'ddd' }, { id: 7, name: 'ddd' }, { id: 8, name: 'ddd' }, { id: 9, name: 'ddd' }, { id: 10, name: 'ddd' }, { id: 11, name: 'ddd' }, { id: 12, name: 'ddd' }, { id: 13, name: 'ddd' }, { id: 14, name: 'ddd' }, { id: 15, name: 'ddd' }, { id: 16, name: 'ddd' }, { id: 17, name: 'ddd' }, { id: 18, name: 'ddd' },])

//     // Stores any error message
//     const [error, setError] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     // const windowWidth = Dimensions.get('window').width;
//     // const windowHeight = Dimensions.get('window').height;
//     // Function to pick an image from 
//     //the device's media library
//     const { productId } = useLocalSearchParams(); 


//     // const [dimensions, setDimensions] = useState({
//     //     window: windowDimensions,
//     //     screen: screenDimensions,
//     // });

//     // useEffect(() => {
//     //     const subscription = Dimensions.addEventListener(
//     //         'change',
//     //         ({ window, screen }) => {
//     //             setDimensions({ window, screen });
//     //         },
//     //     );
//     //     return () => subscription?.remove();
//     // });




//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const fetchCategories = await CategoryService.getCategories();
//                 setCategories(fetchCategories);
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//                 Alert.alert('Error', 'Failed to load categories.');
//             }
//         };

//         fetchCategories();

//     }, []);






//     // useEffect(() => {
//     //     const fetchProduct = async () => {
//     //         try {
//     //             const fetchProduct = await ProductService.getProductById(productId);

//     //             setProduct(fetchProduct);
//     //             setProductName(fetchProduct.name);
//     //             setProductPrice(fetchProduct.price);
//     //             setProductCategory('T');

//     //             //setProductCategory(fetchProduct.productCategory);


//     //             //console.log(BASE_URL_IMAGES+fetchProduct.productImageUrl);
//     //             //console.log('heyyy');
//     //             setProductImageUrl(BASE_URL_IMAGES + fetchProduct.productImageUrl);
//     //             //console.log(productImageUrl+'heyyy');
//     //         } catch (error) {
//     //             console.error("Error fetching products:", error);
//     //             Alert.alert('Error', 'Failed to load products.');
//     //         }
//     //     };

//     //     fetchProduct();

//     // }, []);







//     const pickImage = async () => {
//         const { status } = await ImagePicker.
//             requestMediaLibraryPermissionsAsync();

//         if (status !== "granted") {

//             // If permission is denied, show an alert
//             Alert.alert(
//                 "Permission Denied",
//                 `Sorry, we need camera 
//                  roll permission to upload images.`
//             );
//         } else {

//             // Launch the image library and get
//             // the selected image
//             const result =
//                 await ImagePicker.launchImageLibraryAsync();

//             if (!result.canceled) {

//                 // If an image is selected (not cancelled), 
//                 // update the file state variable
//                 setProductImage(result.assets[0].uri);
//                 setNumOfImages(a => a + 1);
//                 setCountKey(b => b + 1);
//                 // Clear any previous errors
//                 setError(null);
//                 //console.log(imageUris[imageUris.length - 1]);
//                 // console.log(numOfImages);
//                 console.log(result.assets[0].uri);
//                 // Alert.alert(result.uri);
//                 // console.log(result.assets[0].uri);



//             }
//         }
//     };





//     const deleteImage = () => {
//         setProductImageUrl(null);



//     };








//     const updateProductHandle = async () => {

//         if (!productName) {
//             Alert.alert('entering the name of the product in mandatory');
//             console.log('entering the name of the product in mandatory');
//         }

//         else if (!productPrice && !checkValueIsNumberOrNot()) {
//             Alert.alert('entering the price prperly of the product is mandatory');
//             console.log('entering the price prperly of the product in mandatory');
//         }

//         else if (!productCategory) {
//             Alert.alert('entering the category of the product in mandatory');
//             console.log('entering the category of the product in mandatory');
//         }


//         // else if (!productImageUrl) {
//         //     Alert.alert('entering product image in mandatory');
//         //     console.log('entering product image in mandatory');
//         // }
//         else {

//             try {

//             if(productImage){
//                 const imageUrl = await ProductService.uploadProductImages(productImage);
//                 const product = await ProductService.updateProductById(productId, {

//                     name: productName,
//                     productImageUrl: imageUrl,
//                     price: productPrice,
//                     productCategory: productCategory
//                 });

//             }

//             else{
//                 const product = await ProductService.updateProductById(productId, {

//                     name: productName,
//                     productImageUrl: productImageUrl,
//                     price: productPrice,
//                     productCategory: productCategory
//                 });
//             }
//                 // setConditions([...conditions, newChronicCondition]);
//                 // setConditionText('');
//                 router.back({
//                     pathname: '/ManagerStack/Products',

//                 });

//             } catch (error) {
//                 Alert.alert('error creating a new product', error);
//             }





//         }


//     };





//     return (




//         <View style={{ flex: 1, justifyContent: 'space-evenly' }}>




//             <Text style={styles.title}>Update product :</Text>



//             <View style={{}}>
//                 <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Name:</Text>
//                 <TextInput
//                     editable
//                     placeholder="Product Name"
//                     placeholderTextColor='#787170'
//                     numberOfLines={3}
//                     value={productName}
//                     onChangeText={setProductName}
//                     maxLength={100}
//                     // onBlur={}
//                     style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
//                 />
//             </View>




//             <View style={{}}>
//                 <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Price:</Text>
//                 <TextInput
//                     editable
//                     placeholder="Product Price"
//                     placeholderTextColor='#787170'
//                     numberOfLines={3}
//                     value={productPrice}
//                     keyboardType="numeric"
//                     onChangeText={setProductPrice}
//                     // onBlur={}
//                     style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
//                 />
//             </View>



//             <View style={{}}>

//                 <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
//                     <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//                         <Text style={{ marginLeft: 10, fontSize: 25 }}>Product Category:</Text>
//                     </View>

//                 </View>
//                 <Picker
//                     selectedValue={productCategory}
//                     style={styles.picker}
//                     onValueChange={(itemValue) => {
//                         setProductCategory(itemValue);
//                     }}
//                     prompt="Select product category"

//                 >
//                     <Picker.Item label="Select product category" value="" />
//                     {/* <Picker.Item label="FOOD" value="FOOD" />
//                     <Picker.Item label="TREATS" value="TREATS" />
//                     <Picker.Item label="TOYS" value="TOYS" />
//                     <Picker.Item label="COLLARS" value="COLLARS" /> */}


//                     {categories.map((item) => {


//                         return (

//                             <Picker.Item key={item.id} label={item.name} value={item.id} />

//                         )
//                     })}
//                 </Picker>
//             </View>




//             <Text style={{ marginLeft: 10, fontSize: 25 }}>Add a product Image<Text style={{ fontSize: 17, color: '#1f1f1f' }}></Text> :</Text>
//             <View style={{ flex: 4, borderRadius: 8, backgroundColor: '#c7bcbc', flexDirection: 'row', justifyContent: 'center', paddingBottom: 20, paddingTop: 20, alignItems: 'center' }}>



//                 {(productImageUrl) && (

//                     <View style={{ borderRadius: 8, width: '12%', height: '100%', marginRight: 20, marginLeft: 20, backgroundColor: '#dddddd' }} deleteImage={deleteImage}>


//                         <Image source={`${productImageUrl}`} style={{ flex: 1, width: null, height: null, borderRadius: 8 }} resizeMode='contain'></Image>



//                         <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteImage}>
//                             <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

//                         </TouchableOpacity>

//                     </View>

//                 )}



//                 {/* {(checkingNumberOfImages)?.console.log('dgdf')} */}


//                 {!(productImageUrl) && (
//                     <View style={{ borderRadius: 8, width: '12%', height: '100%', marginRight: 20, marginLeft: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-around' }}>


//                         {/* <Image source={require('../../assets/images/upload (5).png')} resizeMode='cover'></Image> */}
//                         <View style={{ flex: 1, height: '60%', width: '100%' }}>
//                             <Image source={require('../../assets/images/upload (3).png')} style={{ flex: 1, width: null, height: null }} resizeMode='contain'></Image>
//                         </View>
//                         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '85%' }}>
//                             <TouchableOpacity style={{ backgroundColor: "#133945", borderRadius: 8, padding: 10, marginVertical: 10, width: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
//                                 <Text style={styles.buttonText} adjustsFontSizeToFit>Upload Image</Text>
//                             </TouchableOpacity>
//                         </View>


//                     </View>)}








//                 {/* 
//                 <View style={{ borderRadius: 8, width: '15%', height: '90%', marginRight: 20, marginLeft: 20 }}>


// <Image source={require('../../assets/images/IMG_6559.jpg')} style={{ flex: 1, width: null, height: null }} resizeMode='cover'></Image>



// <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }}>
//     <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

// </TouchableOpacity>

// </View> */}


















//             </View>




//             <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>

//                 <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: '70%', width: '80%' }} onPress={updateProductHandle}>
//                     <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, padding: 17 }}>Update Product</Text>
//                 </TouchableOpacity>

//             </View>



//         </View>









//     );
// }


// const styles = StyleSheet.create({
//     buttonText: {
//         color: "#FFFFFF",
//         fontSize: 16,
//         fontWeight: "bold",
//     },



//     picker: {
//         height: 40,
//         marginTop: 10,
//         marginHorizontal: 10,

//         borderColor: 'black',
//         borderWidth: 2, // Thicker border
//         borderRadius: 5, // Rounded corners
//         padding: 10, // Padding for a more spacious feel
//         color: '#1D3D47', // Text color for visibility
//     },

//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         flex: 4
//     },
// });






// // {/* <Text style={styles.header}>
// // Add Image:
// // </Text>

// // {/* Button to choose an image */}
// // <TouchableOpacity style={styles.button}
// // onPress={pickImage}>
// // <Text style={styles.buttonText}>
// //     Choose Image
// // </Text>
// // </TouchableOpacity>

// // {/* Conditionally render the image
// // or error message */}
// // {file ? (
// // // Display the selected image
// // <View style={styles.imageContainer}>
// //     <Image source={{ uri: file }}
// //         style={styles.image} />
// // </View>
// // ) : (
// // // Display an error message if there's
// // // an error or no image selected
// // <Text style={styles.errorText}>{error}</Text>
// // )} 


















// {import { useState, useEffect } from "react";
// import {
//     View, Text, Image, TouchableOpacity,
//     StyleSheet, Alert, ImageBackground, TextInput,
//     Modal, ScrollView,
//     Platform
// } from "react-native";
// import { useNavigation } from "expo-router";
// import Slider from "@react-native-community/slider";
// import * as ImagePicker from "expo-image-picker";
// import { Dimensions } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// // import { ImageBackground } from "react-native-web";
// import { Ionicons } from '@expo/vector-icons';
// import baseURL from '../../Services/config'; // Adjust the path as necessary
// const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
// const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;
// import ProductService from '../../Services/ProductService';
// import CategoryService from '../../Services/CategoryService';
// import { WINDOWS } from "nativewind/dist/utils/selector";
// import axios from "axios";
// import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams










// export default function EditPetForAdoption() {
//         //const navigation = useNavigation();


//         //const petForEdit = useLocalSearchParams(); // Retrieve clientId dynamically


//     const { petId,nameOfPet,descriptionOfPet,ageOfPet } = useLocalSearchParams(); // Retrieve clientId dynamically
//     const [petName, setPetName] = useState('');
//     const [petAge, setPetAge] = useState(parseInt(ageOfPet));
//     const [applyImage, setApplyImage] = useState(false);
//     const [petImage, setPetImage] = useState(null);
//     const [error, setError] = useState(null);
//     const [typeOfPet, setTypeOfPet] = useState('');
//     const [breedOfPet, setBreedOfPet] = useState('');
//     const [petDescription, setPetDescription] = useState('');


//     const ageYears = Math.floor(petAge / 12);
//     const remainingMonths = petAge % 12;
//     const petsTypes = {
//         Dog: [
//             { label: 'Golden Retriever', value: 'Golden Retriever' },
//             { label: 'Bulldog', value: 'Bulldog' },
//             { label: 'Beagle', value: 'Beagle' },
//             { label: 'Poodle', value: 'Poodle' }
//         ],
//         Cat: [
//             { label: 'Persian', value: 'Persian' },
//             { label: 'Siamese', value: 'Siamese' },
//             { label: 'Maine Coon', value: 'Maine Coon' },
//             { label: 'Bengal', value: 'Bengal' }],
//         Bird: [
//             { label: 'Parakeet', value: 'Parakeet' },
//             { label: 'Canary', value: 'Canary' },
//             { label: 'Cockatiel', value: 'Cockatiel' }]

//     };







//     // useEffect(() => {
//     //     const subscription = Dimensions.addEventListener(
//     //         'change',
//     //         ({ window, screen }) => {
//     //             setDimensions({ window, screen });
//     //         },
//     //     );
//     //     return () => subscription?.remove();
//     // });


//     const pickImage = async () => {
//         const { status } = await ImagePicker.
//             requestMediaLibraryPermissionsAsync();

//         if (status !== "granted") {

//             // If permission is denied, show an alert
//             Alert.alert(
//                 "Permission Denied",
//                 `Sorry, we need camera 
//                  roll permission to upload images.`
//             );
//         } else {

//             // Launch the image library and get
//             // the selected image
//             const result =
//                 await ImagePicker.launchImageLibraryAsync();

//             if (!result.canceled) {

//                 setPetImage(result.assets[0].uri);
//                 setApplyImage(true);
//                 setError(null);




//             }
//         }
//     };



//     const deleteImage = () => {
//         setPetImage(null);
//         setApplyImage(false);


//     };



//     //console.log(typeof ageOfPet);

//     // const checkValueIsNumberOrNot = () => {

//     //     if (isNaN(priceValue)) {

//     //         return false;
//     //     } else {


//     //         setPriceValue(parseFloat(priceValue));
//     //         return true;
//     //     }
//     // };


//     const addProductHandle = async () => {



//         if (!productName) {
//             Alert.alert('entering the name of the product in mandatory');
//             console.log('entering the name of the product in mandatory');
//         }

//         else if (!priceValue && !checkValueIsNumberOrNot()) {
//             Alert.alert('entering the price properly of the product is mandatory');
//             console.log('entering the price properly of the product in mandatory');
//         }

//         else if (!productCategory) {
//             Alert.alert('entering the category of the product in mandatory');
//             console.log('entering the category of the product in mandatory');
//         }




//         else {


//             try {
//                 const categoryByCategoryId = await CategoryService.getCategoryById(selectedCategoryId);


//                 if (!productImage) {

//                     if (!categoryByCategoryId.categoryImageUrl) {

//                         const getFile = {
//                             uri: '../../assets/images/box.png',
//                             name: 'box.png',
//                             type: 'image/png',

//                         };
//                         setProductImage(getFile);


//                     }
//                     else {
//                         const image = await ProductService.handleUpload(categoryByCategoryId.categoryImageUrl);
//                         console.log(image);

//                         //console.log(productImage);

//                         const product = await ProductService.createProduct({

//                             name: productName,
//                             productImageUrl: image,
//                             price: priceValue,
//                             productCategory: categoryByCategoryId.name
//                         });


//                     }
//                 }


//                 else {
//                     console.log('heyyyyyy');
//                     console.log(productImage);
//                     const image = await ProductService.uploadProductImages(productImage);
//                     console.log(image);



//                     const product = await ProductService.createProduct({

//                         name: productName,
//                         productImageUrl: image,
//                         price: priceValue,
//                         productCategory: categoryByCategoryId.name
//                     });

//                 }

//                 router.push({
//                     pathname: '/ManagerStack/Products',

//                 });
//             } catch (error) {
//                 Alert.alert('error creating a new product', error);
//             }



//         }


//     };




//     return (

//         <ScrollView>

//             <View style={{ justifyContent: 'space-evenly' }}>

//                 <View style={{}}>
//                     <Text style={styles.title}>Add a new pet for adoption {petId} {nameOfPet}  {descriptionOfPet} {ageOfPet}hey</Text>

//                     <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Pet Name:</Text>
//                     <TextInput
//                         editable
//                         placeholder="Product Name"
//                         placeholderTextColor='#787170'
//                         numberOfLines={3}
//                         value={petName}
//                         onChangeText={setPetName}
//                         maxLength={100}
//                         // onBlur={}
//                         style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 24, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
//                     />
//                 </View>




//                 {/* <View style={{}}>
//                     <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Price:</Text>
//                     <TextInput
//                         editable
//                         placeholder="Product Price"
//                         placeholderTextColor='#787170'
//                         numberOfLines={3}
//                         value={priceValue}
//                         keyboardType="numeric"
//                         onChangeText={setPriceValue}
//                         // onBlur={}
//                         style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
//                     />
//                 </View> */}




//                 <View style={{}}>
//                     <Text style={{ marginLeft: 10, fontSize: 25 }}>Pet Age: {petAge} month{petAge !== 1 ? 's' : ''} (
//                         {ageYears} year{ageYears !== 1 ? 's' : ''} {remainingMonths} month {remainingMonths !== 1 ? 's' : ''} )</Text>

//                     <Slider
//                         style={styles.slider}
//                         minimumValue={0}
//                         maximumValue={240}
//                         step={1}
//                         value={petAge}
//                         onValueChange={setPetAge}
//                         minimumTrackTintColor={Platform.OS === 'android' ? '#FFD700' : '#1D3D47'}
//                         maximumTrackTintColor="#ccc"
//                         thumbTintColor={Platform.OS === 'android' ? '#FFD700' : '#1D3D47'}

//                     />

//                 </View>






//                 <View style={{}}>
//                     <Text style={{ marginLeft: 10, fontSize: 25 }}>Pet Type:</Text>

//                     <Picker selectedValue={typeOfPet}
//                         style={styles.picker}
//                         onValueChange={(value) => {
//                             setTypeOfPet(value);
//                             setBreedOfPet('');
//                         }}
//                         prompt="Select Pet Type">

//                         <Picker.Item label="Select pet type" value="" />
//                         <Picker.Item label="Dog" value="Dog" />
//                         <Picker.Item label="Cat" value="Cat" />
//                         <Picker.Item label="Bird" value="Bird" />


//                     </Picker>

//                 </View>





//                 <View style={{}}>
//                     <Text style={{ marginLeft: 10, fontSize: 25 }}>Pet Breed:</Text>

//                     <Picker selectedValue={breedOfPet}
//                         style={styles.picker}
//                         onValueChange={(value) => {
//                             setBreedOfPet(value);
//                         }}
//                         enabled={!!typeOfPet}
//                         prompt="Select Pet Breed">

//                         <Picker.Item label="Select pet breed" value="" />

//                         {petsTypes[typeOfPet]?.map((breed, index) => (
//                             <Picker.Item key={index} label={breed.label} value={breed.value || ''} />
//                         ))}



//                     </Picker>

//                 </View>






//                 <View style={{}}>
//                     <Text style={{ marginLeft: 10, fontSize: 25, marginBottom: 12 }}>Pet Description:</Text>

//                     <TextInput
//                         editable
//                         multiline
//                         numberOfLines={3}
//                         value={petDescription}
//                         onChangeText={setPetDescription}
//                         placeholder="Pet Description (Talk more abbout the pet, why does this pet need adoption, etc.) "
//                         placeholderTextColor="#bfc1ca"
//                         style={{ paddingLeft: 15, paddingTop: 15, borderWidth: 2, marginHorizontal: 10, marginBottom: 10, borderRadius: 12 }}
//                     />

//                 </View>






//                 {/* <View style={{}}>

//                     <Text style={{ marginLeft: 10, fontSize: 25 }}>Product Category:</Text>


//                     <Picker
//                         selectedValue={productCategory}
//                         style={styles.picker}
//                         onValueChange={(itemValue) => {
//                             setProductCategory(itemValue);
//                             setSelectedCategoryId(itemValue);
//                         }}
//                         prompt="Select product category"

//                     >

//                         <Picker.Item label="Select product category" value="" />


//                         {categories.map((item) => {


//                             return (

//                                 <Picker.Item key={item.id} label={item.name} value={item.id} />

//                             )
//                         })}

//                     </Picker>
//                 </View> */}


//                 <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Add a pet Image:</Text>
//                 <View style={{ backgroundColor: '#c7bcbc', justifyContent: 'center', alignItems: 'center', paddingBottom: 20, paddingTop: 20 }}>



//                     {!(petImage) && (
//                         <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }}>

//                             <Image source={require('../../assets/images/upload (3).png')} style={{ width: 100, height: 100, marginTop: 10 }} resizeMode='contain'></Image>

//                             <TouchableOpacity style={{ backgroundColor: "#133945", borderRadius: 8, padding: 10, margin: 10, justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
//                                 <Text style={styles.buttonText} adjustsFontSizeToFit>Upload Image</Text>
//                             </TouchableOpacity>

//                         </View>)}


//                     {(applyImage && petImage) && (

//                         <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }} deleteImage={deleteImage}>


//                             <Image source={productImage} style={{ width: 100, height: 100, borderRadius: 8 }} resizeMode='contain'></Image>



//                             <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteImage}>
//                                 <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

//                             </TouchableOpacity>

//                         </View>

//                     )}

//                 </View>






//                 <View style={{ justifyContent: 'center', alignItems: 'center' }}>

//                     <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: '70%', width: '80%' }} onPress={addProductHandle}>
//                         <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, padding: 17 }}>Add Product</Text>
//                     </TouchableOpacity>

//                 </View>



//             </View>

//         </ScrollView>



//     );
// }


// const styles = StyleSheet.create({
//     buttonText: {
//         color: "#FFFFFF",
//         fontSize: 16,
//         fontWeight: "bold",
//     },



//     picker: {
//         height: 40,
//         marginTop: 10,
//         marginHorizontal: 10,
//         marginBottom: 20,
//         borderColor: 'black',
//         borderWidth: 2, // Thicker border
//         borderRadius: 5, // Rounded corners
//         padding: 10, // Padding for a more spacious feel
//         color: '#1D3D47', // Text color for visibility
//     },

//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         margin: 10,
//         alignSelf: 'center'
//     },

//     slider: {
//         height: 40,
//         marginHorizontal: 10,
//         marginBottom: 12
//     }
// });
// }




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

// import { ImageBackground } from "react-native-web";
import { Ionicons } from '@expo/vector-icons';
import baseURL from '../../Services/config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/petsForAdoption`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;
import ProductService from '../../Services/ProductService';
import CategoryService from '../../Services/CategoryService';
import { WINDOWS } from "nativewind/dist/utils/selector";
import axios from "axios";
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
//import ProductService from "../../Services/ProductService";





export default function UpdateProduct() {
    const router = useRouter();
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [applyImage, setApplyImage] = useState(false);
    //const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [productImageUrl, setProductImageUrl] = useState(null);
    const [error, setError] = useState(null);
    //const [typeOfPet, setTypeOfPet] = useState('');
    //const [breedOfPet, setBreedOfPet] = useState('');
    //const [petDescription, setPetDescription] = useState('');
    //const [imageOfPet, setImageOfPet] = useState(null);
    const [product, setProduct] = useState(null);
    //const ageYears = Math.floor(petAge / 12);
    //const remainingMonths = petAge % 12;

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
                // const getFile = {
                //     uri: '../../assets/images/box.png',
                //     name: 'box.png',
                //     type: 'image/png',
                // };
                // setPetImage(getFile);

                //const imageOfPet = null;

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



                // const petForAdoption = await PetForAdoptionService.updatePetForAdoptionById({

                //     name: petName,
                //     birthDate: dateOfBirth,
                //     type: typeOfPet,
                //     breed: breedOfPet,
                //     petForAdoptionImageUrl: imageOfPet,
                //     petForAdoptionDescription: petDescription
                // }, petId);




                //console.log(petForAdoption);
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
        width: '100%'
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


















