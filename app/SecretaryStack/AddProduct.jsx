import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput,
    Modal, ScrollView, SafeAreaView, Platform
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
import CategoryService from '../../Services/CategoryService';
import { WINDOWS } from "nativewind/dist/utils/selector";
import axios from "axios";
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams









export default function AddProduct() {
    const router = useRouter();
    // const [countKey, setCountKey] = useState(0);
    // const [numOfImages, setNumOfImages] = useState(0);
    // const [numCounter, setNumCounter] = useState(0);
    const [productName, setProductName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);
    const [priceValue, setPriceValue] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImage, setProductImage] = useState(null);
    const windowDimensions = Dimensions.get('window');
    const screenDimensions = Dimensions.get('screen');
    // const [nannam, setNannam] = useState('');
    const [applyImage, setApplyImage] = useState(false);
    // const [imageUrl, setImageUrl] = useState('');
    // Stores the selected image URI
    const [file, setFile] = useState(null);
    // const [categories, setCategories] = useState([{ name: 'ddd', id: 1 }, { name: 'ddd', id: 2 }, { name: 'ddd', id: 3 }, { name: 'ddd', id: 4 }, { name: 'ddd', id: 5 }, { name: 'ddd', id: 6 }, { name: 'ddd', id: 7 }]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');

    // Stores any error message
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);



    const [dimensions, setDimensions] = useState({
        window: windowDimensions,
        screen: screenDimensions,
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
        const subscription = Dimensions.addEventListener(
            'change',
            ({ window, screen }) => {
                setDimensions({ window, screen });
            },
        );
        return () => subscription?.remove();
    });



    const reset = () => {
        setProductName('');
        setPriceValue('');
        setProductCategory('');
        setProductImage(null);

    };

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

                setProductImage(result.assets[0].uri);
                setApplyImage(true);
                setError(null);




            }
        }
    };



    const addCategoryHandle = async () => {
        if (!category) {
            Alert.alert('entering the name of the product in mandatory');
            console.log('entering the name of the product in mandatory');
        }



        else {
            if (categoryImage) {
                try {


                    const imageUrl = await CategoryService.uploadCategoryImage(categoryImage);
                    const Addedcategory = await CategoryService.createCategory({

                        name: category,
                        categoryImageUrl: imageUrl,

                    });

                    setCategories([...categories, Addedcategory]);
                    setCategory('');
                    setCategoryImage(null);

                } catch (error) {
                    Alert.alert('error creating a new category', error);
                }
            }


            else {
                try {

                    const Addedcategory = await CategoryService.createCategory({

                        name: category,
                        categoryImageUrl: null,

                    });

                    setCategories([...categories, Addedcategory]);
                    setCategory('');
                    setCategoryImage(null);

                } catch (error) {
                    Alert.alert('error creating a new category', error);
                }
            }

        }
    };



    const deleteImage = () => {
        setProductImage(null);
        setApplyImage(false);


    };

    const deleteCategoryHandle = (id) => {
        CategoryService.deleteCategory(id);
        const newCategories = categories.filter(categoryy => categoryy.id !== id);
        setCategories(newCategories);
    };



    const pickCategoryImage = async () => {
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


                setCategoryImage(result.assets[0].uri);

                setError(null);




            }
        }
    };




    const deleteCategoryImage = () => {
        setCategoryImage(null);



    };




    const checkValueIsNumberOrNot = () => {

        if (isNaN(priceValue)) {

            return false;
        } else {


            setPriceValue(parseFloat(priceValue));
            return true;
        }
    };


    const addProductHandle = async () => {

        if (!productName) {
            Alert.alert('entering the name of the product in mandatory');
            console.log('entering the name of the product in mandatory');
        }

        else if (!priceValue && !checkValueIsNumberOrNot()) {
            Alert.alert('entering the price properly of the product is mandatory');
            console.log('entering the price properly of the product in mandatory');
        }

        else if (!productCategory) {
            Alert.alert('entering the category of the product in mandatory');
            console.log('entering the category of the product in mandatory');
        }




        else {


            try {
                const categoryByCategoryId = await CategoryService.getCategoryById(selectedCategoryId);


                if (!productImage) {

                    if (!categoryByCategoryId.categoryImageUrl) {

                        // const getFile = {
                        //     uri: '../../assets/images/box.png',
                        //     name: 'box.png',
                        //     type: 'image/png',

                        // };
                        // setProductImage(getFile);


                        const product = await ProductService.createProduct({

                            name: productName,
                            productImageUrl: '',
                            price: priceValue,
                            productCategory: categoryByCategoryId.name
                        });

                        reset();
                        router.push({
                            pathname: '/SecretaryStack/Products',

                        });
                    }
                    else {
                        const image = await ProductService.handleUpload(categoryByCategoryId.categoryImageUrl);
                        //console.log(image);

                        //console.log(productImage);

                        const product = await ProductService.createProduct({

                            name: productName,
                            productImageUrl: image,
                            price: priceValue,
                            productCategory: categoryByCategoryId.name
                        });
                        reset();
                        router.push({
                            pathname: '/SecretaryStack/Products',

                        });

                    }
                }


                else {


                    const image = await ProductService.uploadProductImages(productImage);




                    const product = await ProductService.createProduct({

                        name: productName,
                        productImageUrl: image,
                        price: priceValue,
                        productCategory: categoryByCategoryId.name
                    });

                    reset();
                    router.push({
                        pathname: '/SecretaryStack/Products',

                    });
                }

            } catch (error) {
                Alert.alert('error creating a new product', error);
            }



        }


    };




    return (

        // <ScrollView>

        //     <View style={{ justifyContent: 'space-evenly' }}>

        //         <Modal animationType="none" transparent={true} visible={showModal} onRequestClose={() => { setShowModal(false) }}>

        //             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>



        //                 <View style={{ justifyContent: 'flex-start', backgroundColor: 'white', borderWidth: 4, width: '50%', height: '80%', borderRadius: 15, borderColor: '#201E43' }}>





        //                     {/* <View style={{  flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 10 }}>


        //                         <TextInput editable placeholder="Category Name" placeholderTextColor='#787170' value={category} onChangeText={setCategory} style={{ borderWidth: 2, marginHorizontal: 10, marginVertical: 10,height: '80%', paddingLeft: 10, backgroundColor: 'white', borderRadius: 8 }} />

        //                             <TouchableOpacity style={{ backgroundColor: '#508C9B', borderRadius: 8, borderWidth: 3 }}>
        //                                 <Text style={{ color: 'black', margin: 5, color: 'white', fontWeight: 'bold' }} onPress={() => addCategoryHandle()}>Add Category</Text>
        //                             </TouchableOpacity>

        //                     </View> */}

        //                     <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

        //                         <TextInput editable placeholder="Category Name" placeholderTextColor='#787170' value={category} onChangeText={setCategory} style={{ paddingLeft: 10, paddingTop: 'auto', height: 40, marginHorizontal: 10, borderWidth: 2, borderRadius: 8, width: '100%' }} ></TextInput>


        //                         {/* <TouchableOpacity style={{ width: '30%', backgroundColor: '#A1CEDC', borderRadius: 10, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        //                                                 <Text style={{ alignSelf: 'center' }} onPress={() => addChronicConditionHandle()}>Add Condition</Text>
        //                                             </TouchableOpacity> */}
        //                         <TouchableOpacity style={{ backgroundColor: "#A1CEDC", borderRadius: 8, padding: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
        //                             <Text style={{ fontWeight: 12 }} adjustsFontSizeToFit onPress={() => addCategoryHandle()}>Add Category</Text>
        //                         </TouchableOpacity>
        //                     </View>
        //                     <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 20, paddingTop: 20 }}>


        //                         {(categoryImage) && (


        //                             // <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 10 }} deleteCategoryImage={deleteCategoryImage}>


        //                             //     <Image source={categoryImage} style={{ width: 40, height: 40, borderRadius: 8 }} resizeMode='contain'></Image>



        //                             //     <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteCategoryImage}>
        //                             //         <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

        //                             //     </TouchableOpacity>




        //                             // </View>



        //                             //     <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }} deleteCategoryImage={deleteCategoryImage}>


        //                             //     <Image source={categoryImage} style={{ width: 100, height: 100, borderRadius: 8 }} resizeMode='contain'></Image>



        //                             //     <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: 100, top: -10 }} onPress={deleteCategoryImage}>
        //                             //         <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

        //                             //     </TouchableOpacity>

        //                             // </View>



        //                             <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }} deleteCategoryImage={deleteCategoryImage}>


        //                                 <Image source={categoryImage} style={{ width: 150, height: 150, borderRadius: 8, borderWidth: 2 }} resizeMode='contain'></Image>



        //                                 <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteCategoryImage}>
        //                                     <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

        //                                 </TouchableOpacity>

        //                             </View>


        //                         )}




        //                         {!(categoryImage) && (
        //                             <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white', borderWidth: 2 }}>

        //                                 <Image source={require('../../assets/images/upload (3).png')} style={{ width: 100, height: 100, marginTop: 10 }} resizeMode='contain'></Image>

        //                                 <TouchableOpacity style={{ backgroundColor: "#133945", borderRadius: 8, padding: 10, margin: 10, justifyContent: 'center', alignItems: 'center' }} onPress={pickCategoryImage}>
        //                                     <Text style={styles.buttonText} adjustsFontSizeToFit>Upload Image</Text>
        //                                 </TouchableOpacity>

        //                             </View>)}


        //                     </View>









        //                     <View style={{ flex: 2, marginHorizontal: 10, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#201E43', marginVertical: 10, borderWidth: 4, borderTopEndRadius: 12, borderTopStartRadius: 12 }}>
        //                         <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginVertical: 5 }}>
        //                             <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Current Categories</Text>
        //                         </View>
        //                         <ScrollView style={{ backgroundColor: '#508C9B', borderWidth: 5, width: '100%' }} showsVerticalScrollIndicator={true}>
        //                             {categories.map((item) => {
        //                                 return (
        //                                     <View key={item.id} style={{ margin: 10, backgroundColor: '#201E43', borderRadius: 8 }}>
        //                                         <View style={{ flexDirection: 'row', justifyContent:'space-evenly', alignItems: 'center',padding:15 }}>

        //                                             <Text numberOfLines={1} style={{ borderTopEndRadius: 8, borderTopStartRadius: 8, color: 'white', fontSize: 20 }}>{item.name}</Text>

        //                                             {!(item.categoryImageUrl) && (


        //                                                 <Text style={{marginHorizontal:15}}>No Default Image</Text>
        //                                             )


        //                                             }

        //                                             {(item.categoryImageUrl) && (


        //                                                     <Image source={{ uri: `${BASE_URL_IMAGES}${item.categoryImageUrl}` }} style={{ width: 100, height: 100 ,borderWidth:2,borderColor:'white',borderRadius:15}} resizeMode='contain'></Image>


        //                                             )}


        //                                         </View>
        //                                         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'yellow', borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
        //                                             <TouchableOpacity style={{ backgroundColor: 'red', borderBottomEndRadius: 8, borderBottomStartRadius: 8, flex: 1 }}>
        //                                                 <Text style={{ color: 'white', alignSelf: 'center' }} onPress={() => deleteCategoryHandle(item.id)}>Delete Category</Text>
        //                                             </TouchableOpacity>
        //                                         </View>
        //                                     </View>

        //                                 )
        //                             })}
        //                         </ScrollView>
        //                     </View>




        //                     <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>

        //                         <TouchableOpacity>
        //                             <Text style={{ color: 'brown', fontWeight: 'bold', fontSize: 25 }} onPress={() => { setShowModal(!showModal); setCategoryImage(null); setCategory('') }}>Close</Text>
        //                         </TouchableOpacity>

        //                     </View>



        //                 </View>
        //             </View>

        //         </Modal>


        //         <View style={{}}>
        //             <Text style={styles.title}>Add a new product</Text>

        //             <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Name:</Text>
        //             <TextInput
        //                 editable
        //                 placeholder="Product Name"
        //                 placeholderTextColor='#787170'
        //                 numberOfLines={3}
        //                 value={productName}
        //                 onChangeText={setProductName}
        //                 maxLength={100}
        //                 // onBlur={}
        //                 style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
        //             />
        //         </View>




        //         <View style={{}}>
        //             <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Product Price:</Text>
        //             <TextInput
        //                 editable
        //                 placeholder="Product Price"
        //                 placeholderTextColor='#787170'
        //                 numberOfLines={3}
        //                 value={priceValue}
        //                 keyboardType="numeric"
        //                 onChangeText={setPriceValue}
        //                 // onBlur={}
        //                 style={{ borderWidth: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, height: 40, paddingLeft: 20, backgroundColor: 'white' }}
        //             />
        //         </View>



        //         <View style={{}}>

        //             <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
        //                 <Text style={{ marginLeft: 10, fontSize: 25 }}>Product Category:</Text>

        //                 <TouchableOpacity style={{ backgroundColor: "#133945", borderRadius: 25, padding: 5, marginHorizontal: 20 }} onPress={() => { setShowModal(true) }}>
        //                     <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }} adjustsFontSizeToFit>Add a new category</Text>
        //                 </TouchableOpacity>

        //             </View>
        //             <Picker
        //                 selectedValue={productCategory}
        //                 style={styles.picker}
        //                 onValueChange={(itemValue) => {
        //                     setProductCategory(itemValue);
        //                     setSelectedCategoryId(itemValue);
        //                 }}
        //                 prompt="Select product category"

        //             >

        //                 <Picker.Item label="Select product category" value="" />


        //                 {categories.map((item) => {


        //                     return (

        //                         <Picker.Item key={item.id} label={item.name} value={item.id} />

        //                     )
        //                 })}

        //             </Picker>
        //         </View>


        //         <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25 }}>Add a product Image:</Text>
        //         <View style={{ backgroundColor: '#c7bcbc', justifyContent: 'center', alignItems: 'center', paddingBottom: 20, paddingTop: 20 }}>



        //             {!(productImage) && (
        //                 <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }}>

        //                     <Image source={require('../../assets/images/upload (3).png')} style={{ width: 100, height: 100, marginTop: 10 }} resizeMode='contain'></Image>

        //                     <TouchableOpacity style={{ backgroundColor: "#133945", borderRadius: 8, padding: 10, margin: 10, justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
        //                         <Text style={styles.buttonText} adjustsFontSizeToFit>Upload Image</Text>
        //                     </TouchableOpacity>

        //                 </View>)}


        //             {(applyImage && productImage) && (

        //                 <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }} deleteImage={deleteImage}>


        //                     <Image source={productImage} style={{ width: 100, height: 100, borderRadius: 8 }} resizeMode='contain'></Image>



        //                     <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteImage}>
        //                         <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

        //                     </TouchableOpacity>

        //                 </View>

        //             )}

        //         </View>

        //         <View style={{ justifyContent: 'center', alignItems: 'center' }}>

        //             <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: '70%', width: '80%' }} onPress={addProductHandle}>
        //                 <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, padding: 17 }}>Add Product</Text>
        //             </TouchableOpacity>

        //         </View>



        //     </View>

        // </ScrollView>

        <SafeAreaView
            style={styles.container}>
            <ScrollView style={styles.scroll}>
                <View style={styles.main}>
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={showModal}
                        onRequestClose={() => {
                            setShowModal(false);
                        }}>
                        <View
                            style={styles.modal}>
                            <View
                                style={styles.modalStyle}>
                                {/* <View style={{  flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 10 }}>
  
  
                                  <TextInput editable placeholder="Category Name" placeholderTextColor='#787170' value={category} onChangeText={setCategory} style={{ borderWidth: 2, marginHorizontal: 10, marginVertical: 10,height: '80%', paddingLeft: 10, backgroundColor: 'white', borderRadius: 8 }} />
                                  
                                      <TouchableOpacity style={{ backgroundColor: '#508C9B', borderRadius: 8, borderWidth: 3 }}>
                                          <Text style={{ color: 'black', margin: 5, color: 'white', fontWeight: 'bold' }} onPress={() => addCategoryHandle()}>Add Category</Text>
                                      </TouchableOpacity>
                                  
                              </View> */}

                                <View
                                    style={styles.modalFirstPart}>
                                    <TextInput
                                        editable
                                        placeholder="Category Name"
                                        placeholderTextColor="#787170"
                                        value={category}
                                        onChangeText={setCategory}
                                        style={styles.modalText}></TextInput>

                                    {/* <TouchableOpacity style={{ width: '30%', backgroundColor: '#A1CEDC', borderRadius: 10, borderWidth: 2, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                                                          <Text style={{ alignSelf: 'center' }} onPress={() => addChronicConditionHandle()}>Add Condition</Text>
                                                      </TouchableOpacity> */}
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        //pickImage
                                        onPress={pickImage}>
                                        <Text
                                            style={styles.modalButtonText}
                                            adjustsFontSizeToFit
                                            onPress={() => addCategoryHandle()}>
                                            Add Category
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={styles.modalImagePart}>
                                    {categoryImage && (
                                        // <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 10 }} deleteCategoryImage={deleteCategoryImage}>

                                        //     <Image source={categoryImage} style={{ width: 40, height: 40, borderRadius: 8 }} resizeMode='contain'></Image>

                                        //     <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: -10, top: -10 }} onPress={deleteCategoryImage}>
                                        //         <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

                                        //     </TouchableOpacity>

                                        // </View>

                                        //     <View style={{ justifyContent: 'flex-start', alignItems: 'center', borderRadius: 8, marginRight: 20, marginLeft: 20, backgroundColor: 'white' }} deleteCategoryImage={deleteCategoryImage}>

                                        //     <Image source={categoryImage} style={{ width: 100, height: 100, borderRadius: 8 }} resizeMode='contain'></Image>

                                        //     <TouchableOpacity style={{ borderRadius: '100%', backgroundColor: 'brown', width: 30, height: 30, justifyContent: 'center', position: 'absolute', left: 100, top: -10 }} onPress={deleteCategoryImage}>
                                        //         <Text style={{ alignSelf: 'center', fontSize: '100%' }}>X</Text>

                                        //     </TouchableOpacity>

                                        // </View>

                                        <View
                                            style={styles.modalImageStyle}
                                            deleteCategoryImage={deleteCategoryImage}
                                        >
                                            <Image
                                                source={categoryImage}
                                                style={styles.modalImageStyling}
                                                resizeMode="contain"></Image>

                                            <TouchableOpacity
                                                style={styles.deleteImageButton}
                                                //deleteCategoryImage
                                                onPress={deleteCategoryImage}>
                                                <Text style={styles.deleteImageButtonStyling}>
                                                    X
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {!categoryImage && (
                                        <View
                                            style={styles.modalUploadButtonStyle}>
                                            <Image
                                                source={require('../../assets/images/upload (3).png')}
                                                style={styles.modalUploadButtonStyling}
                                                resizeMode="contain"></Image>

                                            <TouchableOpacity
                                                style={styles.imageButton}
                                                //pickCategoryImage
                                                onPress={pickCategoryImage}>
                                                <Text style={styles.buttonText} adjustsFontSizeToFit>
                                                    Upload Image
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                <View
                                    style={styles.modalCategoriesPart}>
                                    <View
                                        style={styles.modalCategoriesScroll}>
                                        <Text
                                            style={styles.modalCategoryElementText}>
                                            Current Categories
                                        </Text>
                                    </View>
                                    <ScrollView
                                        style={styles.modalScroll}
                                        showsVerticalScrollIndicator={true}>
                                        {categories.map((item) => {
                                            return (
                                                <View
                                                    key={item.id}
                                                    style={styles.categoryElement}>
                                                    <View
                                                        style={styles.categoryElementPart}>
                                                        <Text
                                                            numberOfLines={1}
                                                            style={styles.categoryElementText}>
                                                            {item.name}
                                                        </Text>

                                                        {!item.categoryImageUrl && (
                                                            <Text style={styles.categoryElementTextImage}>
                                                                No Default Image
                                                            </Text>
                                                        )}

                                                        {item.categoryImageUrl && (
                                                            <Image
                                                                //{uri: `${BASE_URL_IMAGES}${item.categoryImageUrl}`,}
                                                                source={{ uri: `${BASE_URL_IMAGES}${item.categoryImageUrl}`, }}
                                                                style={styles.categoryImageStyle}
                                                                resizeMode="contain"></Image>
                                                        )}
                                                    </View>
                                                    <View
                                                        style={styles.categoryDeleteButtonStyle}>
                                                        <TouchableOpacity
                                                            style={styles.categoryDeleteButtonStyling}>
                                                            <Text
                                                                style={{ color: 'white', alignSelf: 'center' }}
                                                                onPress={() => deleteCategoryHandle(item.id)}>
                                                                Delete Category
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </View>

                                <View
                                    style={styles.modalButtonClose}>
                                    <TouchableOpacity>
                                        <Text
                                            style={styles.modalButtonCloseText}
                                            onPress={() => {
                                                setShowModal(!showModal);
                                                setCategoryImage(null);
                                                setCategory('');
                                            }}>
                                            Close
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <View>
                        <Text style={styles.title}>Add a new product</Text>

                        <Text style={styles.elementText}>
                            Product Name:
                        </Text>
                        <TextInput
                            editable
                            placeholder="Product Name"
                            placeholderTextColor="#787170"
                            numberOfLines={3}
                            value={productName}
                            onChangeText={setProductName}
                            maxLength={100}
                            // onBlur={}
                            style={styles.elementTextInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.elementText}>
                            Product Price:
                        </Text>
                        <TextInput
                            editable
                            placeholder="Product Price"
                            placeholderTextColor="#787170"
                            numberOfLines={3}
                            value={priceValue}
                            keyboardType="numeric"
                            onChangeText={setPriceValue}
                            // onBlur={}
                            style={styles.elementTextInput}
                        />
                    </View>

                    <View>
                        <View
                            style={styles.categoriesPart}>
                            <Text style={styles.elementText}>
                                Product Category:
                            </Text>

                            <TouchableOpacity
                                style={styles.categoriesPartButton}
                                onPress={() => {
                                    setShowModal(true);
                                }}>
                                <Text
                                    style={styles.categoriesPartButtonText}
                                    adjustsFontSizeToFit>
                                    Add a new category
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Picker
                            selectedValue={productCategory}
                            style={
                                Platform.OS == ('web' || 'android')
                                    ? styles.picker
                                    : styles.pickerIos
                            }
                            onValueChange={(itemValue) => {
                                setProductCategory(itemValue);
                                setSelectedCategoryId(itemValue);
                            }}
                            prompt="Select product category">
                            <Picker.Item label="Select product category" value="" />

                            {categories.map((item) => {
                                return (
                                    <Picker.Item
                                        key={item.id}
                                        label={item.name}
                                        // value={item.id}
                                        value={item.id}
                                    />
                                );
                            })}
                        </Picker>
                    </View>

                    <Text style={styles.elementText}>
                        Add a product Image:
                    </Text>
                    <View
                        style={styles.productImagePart}>
                        {!productImage && (
                            <View
                                style={styles.modalUploadButtonStyle}>
                                <Image
                                    source={require('../../assets/images/upload (3).png')}
                                    style={styles.modalUploadButtonStyling}
                                    resizeMode="contain"></Image>

                                <TouchableOpacity
                                    style={styles.imageButton}
                                    //pickImage
                                    onPress={pickImage}>
                                    <Text style={styles.buttonText} adjustsFontSizeToFit>
                                        Upload Image
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {applyImage && productImage && (
                            <View
                                style={styles.productImageStyle}
                                deleteImage={deleteImage}>
                                <Image
                                    source={productImage}
                                    style={styles.productImageStyling}
                                    resizeMode="contain"></Image>

                                <TouchableOpacity
                                    style={styles.deleteImageButton}
                                    onPress={deleteImage}>
                                    <Text style={styles.deleteImageButtonStyling}>
                                        X
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.linkButtonStyle}>
                        <TouchableOpacity style={styles.linkButton} onPress={addProductHandle}>
                            <Text style={styles.linkButtonText}>Add New Product</Text>
                        </TouchableOpacity>
                        {/* addProductHandle */}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: Platform.OS == 'web' ? 0 : 30,
    },
    scroll: {
        width: '100%'
    },
    main: {
        justifyContent: 'space-evenly'

    },

    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalStyle: {
        backgroundColor: 'white',
        borderWidth: 4,
        width: Platform.OS == 'web' ? '60%' : '84%',
        height: Platform.OS == 'web' ? 650 : '80%',
        borderRadius: 15,
        borderColor: '#201E43',
    },
    modalFirstPart: {
        margin: 10,
        justifyContent: 'space-between',
        height: '12%',
    },

    modalText: {
        paddingLeft: 10,
        paddingTop: 'auto',
        height: 40,
        marginHorizontal: 12,
        borderWidth: 2,
        borderRadius: 8,
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A1CEDC',
        height: 30,
        marginHorizontal: 12,
        borderWidth: 2,
        borderRadius: 8,
    },
    modalButtonText: {
        fontWeight: 12

    },
    modalImagePart: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20,
    },
    modalImageStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'white',
    },
    modalImageStyling: {
        width: 150,
        height: 150,
        borderRadius: 8,
        borderWidth: 2,
    },
    modalDeleteButton: {
        borderRadius: 100,
        backgroundColor: 'brown',
        width: 30,
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        left: -10,
        top: -10,
    },

    modalDeleteButtonText: {
        alignSelf: 'center',
        fontSize: 20

    },
    modalUploadButtonStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'white',
        borderWidth: 2,
    },

    modalUploadButtonStyling: {
        width: 100,
        height: 100,
        marginTop: 10
    },
    imageButton: {
        backgroundColor: '#133945',
        borderRadius: 8,
        padding: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },


    modalCategoriesPart: {
        flex: 2,
        marginHorizontal: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#201E43',
        marginVertical: 10,
        borderWidth: 4,
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
    },

    modalCategoriesScroll: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 5,
    },
    modalCategoryElementText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    modalScroll: {
        backgroundColor: '#508C9B',
        borderWidth: 5,
        width: '100%',
    },
    categoryElement: {
        margin: 10,
        backgroundColor: '#201E43',
        borderRadius: 8,
    },
    categoryElementPart: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 15,
    },
    categoryElementText: {
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
        color: 'white',
        fontSize: 20,
    },
    categoryElementTextImage: {
        marginHorizontal: 15

    },
    categoryImageStyle: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 15,
    },

    categoryDeleteButtonStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'yellow',
        borderBottomEndRadius: 8,
        borderBottomStartRadius: 8,
    },
    categoryDeleteButtonStyling: {
        backgroundColor: 'red',
        borderBottomEndRadius: 8,
        borderBottomStartRadius: 8,
        flex: 1,
    },
    modalButtonClose: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonCloseText: {
        color: 'brown',
        fontWeight: 'bold',
        fontSize: 25,
    },

    elementText: {
        marginLeft: 10,
        marginBottom: 12,
        fontSize: 25

    },
    elementTextInput: {
        borderWidth: 2,
        marginLeft: 10,
        borderRadius: 4,
        marginRight: 10,
        marginBottom: 30,
        height: 40,
        paddingLeft: 20,
        backgroundColor: 'white',
    },
    categoriesPart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    categoriesPartButton: {
        backgroundColor: '#133945',
        borderRadius: 25,
        padding: 5,
        marginHorizontal: 20,
    },
    categoriesPartButtonText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold'
    },
    productImagePart: {
        backgroundColor: '#c7bcbc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
        paddingTop: 20,
        marginBottom: 30,
    },
    productImageStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'white',
    },
    productImageStyling: {
        width: 100,
        height: 100,
        borderRadius: 8
    },
    linkButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center'

    },



    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    picker: {
        height: 40,
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 30,
        borderColor: 'black',
        borderWidth: 2, // Thicker border
        borderRadius: 5, // Rounded corners
        padding: 10, // Padding for a more spacious feel
        color: '#1D3D47', // Text color for visibility
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
        alignSelf: 'center',
    },
    linkButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#133945',
        borderRadius: 18,
        height: 50,
        width: '60%',
        marginBottom: 20,
    },
    linkButtonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    pickerIos: {
        borderWidth: 4,
        borderColor: '#f5f5f5',
        marginBottom: 30,
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
        marginTop: 10,
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
        fontSize: 20,
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