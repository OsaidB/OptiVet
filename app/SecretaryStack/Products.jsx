import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput, ScrollView, Platform
} from "react-native";
import { useRouter, Link, useLocalSearchParams, usePathname } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from "@rneui/themed";
import { createFilter } from "react-native-search-filter";
import ProductService from "../../Services/ProductService";
import baseURL from '../../Services/config'; // Adjust the path as necessary
//import { useRouter, useLocalSearchParams, Link } from 'expo-router'; // Import useLocalSearchParams
//import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams

const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;







export default function Products() {
    const router = useRouter();

    // const [products, setProducts] = useState([{ name: '1876', id: 1 }, { name: '223e333', id: 2 }, { name: '3343', id: 3 }, { name: '223244', id: 4 }, { name: '2345', id: 5 }, { name: '6', id: 6 }, { name: '7', id: 7 }]);
    const [products, setProducts] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([...products]);
    const [categorizedProducts, setCategorizedProducts] = useState([...products]);

    const [widthRatio, setWidthRatio] = useState('17%');
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState([{ id: 0, name: 'ALL' }, { id: 1, name: 'TOYS' }, { id: 2, name: 'FOOD' }, { id: 3, name: 'TREATS' }]);
    //toystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoys
    //const { productId } = useLocalSearchParams(); // Retrieve clientId dynamically
    const [productId, setProductId] = useState();

    const [selectedCategory, setSelectedCategory] = useState('ALL');
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchProducts = await ProductService.getProducts();
                setProducts(fetchProducts);
                setSearchedProducts(fetchProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
                Alert.alert('Error', 'Failed to load products.');
            }
        };

        fetchProducts();

    }, []);





    useEffect(() => {

        SearchProduct();
    }, [selectedCategory,products]);




    // useEffect(() => {


    // }, [searchText]);


    // const deleteVaccinationHandle = (id) => {
    //     MedicalHistoryService.deleteVaccinationById(id);
    //     const newVaccinations = vaccinations.filter(vaccination => vaccination.id !== id);
    //     setVaccinations(newVaccinations);
    // };


    const deleteProductHandle = (id) => {
        ProductService.deleteProduct(id);
        const newProducts = products.filter(product => product.id !== id);
        setProducts(newProducts);
    };




    const SearchProduct = (searchString) => {

        //console.log(selectedCategory);

        //console.log(searchText);
        // if(searchString === undefined){
        // searchString = '1';
        // }

        // const filteredProducts = products.filter(createFilter(searchString, toFilt));
        // setProducts(filteredProducts);

        if (selectedCategory !== 'ALL') {
            //console.log(selectedCategory);
            const categorized = products.filter(product => product.productCategory.toLowerCase().includes(selectedCategory.toLowerCase()));

            // const productName = product.name.toLowerCase();
            // const textValue =  searchText.toLowerCase();

            //setSearchedProducts(products);
            //console.log(product.name);     
            if (categorized.length !== 0) {
                setCategorizedProducts(categorized);
                setSearchedProducts(categorized);
            }
            else {
                console.log('heyy');
                setCategorizedProducts([]);
                setSearchedProducts([]);

            }
        }




        if (selectedCategory === 'ALL') {
            setCategorizedProducts(products);
            setSearchedProducts(products);

        }


        if (searchString != null) {

            setSearchText(searchString);




            //console.log(textValue);
            // console.log(productName);
            //console.log(''.toLowerCase().indexOf('1'.toLowerCase()) > -1);

            // const filteredProducts = products.filter(product => product.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1);

            const filteredProducts = categorizedProducts.filter(product => product.name.toLowerCase().includes(searchString.toLowerCase()));

            // const productName = product.name.toLowerCase();
            // const textValue =  searchText.toLowerCase();

            //setSearchedProducts(products);
            //console.log(product.name);     
            if (filteredProducts.length !== 0) {
                setSearchedProducts(filteredProducts);
            }
            else {
                setSearchedProducts([]);
            }

            // if(filteredProducts.length === 0){

            // }


            // console.log(searchText);
            // console.log(products);
        }

        //setProducts([{ name: '1', id: 1 }, { name: '2', id: 2 }]);
    };




    return (




        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ alignSelf: 'center' }}><Text style={{ fontSize: 40 }}>Store</Text></View>


            <View style={{ marginVertical: 10, marginHorizontal: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderWidth: 1, borderRadius: 8, borderColor: 'black', width: '90%', padding: 10 }}>

                <View style={{ width: '90%', padding: 10 }}>
                    <TextInput placeholder="Search Product" style={{ outlineStyle: 'none' }} value={searchText} onChangeText={SearchProduct} />

                </View>


                {/* <View style={{ backgroundColor: 'brown', width: '10%', height: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 7 }} setProducts={setProducts} setSearchText={setSearchText} searchText = {searchText} SearchProduct = {SearchProduct}>
                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={SearchProduct} setProducts={setProducts} setSearchText={setSearchText} searchText = {searchText} SearchProduct = {SearchProduct}>
                        <Image source={require('../../assets/images/search (1).png')} style={{ alignItems: 'center', resizeMode: 'stretch' }}></Image>
                    </TouchableOpacity>
                </View> */}

            </View>




            {/* <ScrollView contentContainerStyle={{ flexDirection: 'row', justifyContent:'flex-start',alignItems: 'center' , backgroundColor:'brown',paddingHorizontal:10,borderRadius:8, height:'20%'}} horizontal={true}>
                        {categories.map((item) => {
                            return (

                                <View key={item.id} style={{ backgroundColor: 'white', borderRadius: 5, marginHorizontal:20 }}>

                                    <TouchableOpacity style = {{padding:10}}>
                                        <Text>{item.name}</Text>

                                    </TouchableOpacity>
                                </View>

                            )
                        })}
                    </ScrollView> */}

            {/* <View style={{ height: '20%', backgroundColor: 'brown', justifyContent: 'center', alignItems: 'center' }} >
                
                    <ScrollView horizontal={true}>
                        {
                            categories.map((item) => {

                                return (

                                    <View key={item.id} style={{ backgroundColor: 'white', padding: 5, marginHorizontal: 30, borderRadius: 8 }}>
                                        <TouchableOpacity>
                                            <Text>{item.name}</Text>
                                        </TouchableOpacity>
                                    </View>

                                )
                            })
                        }

                    </ScrollView>

                
            </View> */}



            {/* <ScrollView horizontal={true} contentContainerStyle={{ backgroundColor: 'brown', height: '10%', width:'60%', justifyContent:'center', alignItems:'center' }}>


                {
                    categories.map((item) => {

                        return (

                            <View key={item.id} style={{ backgroundColor: 'white', padding: 5, marginHorizontal: 30, borderRadius: 8 }}>
                                <TouchableOpacity>
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            </View>

                        )
                    })
                }


            </ScrollView> */}



            {/* <View style={{ height: '15%',width:'60%', backgroundColor: 'brown', borderRadius: 15 }}>

                <ScrollView horizontal={true} contentContainerStyle={{}}>
                    {
                        categories.map((item) => {

                            return (

                                <View key={item.id} style={{ backgroundColor: 'white', padding: 5, marginHorizontal: 30, borderRadius: 8 }}>
                                    <TouchableOpacity>
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>

                            )
                        })
                    }

                </ScrollView>
            
            </View> */}





















            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '60%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', backgroundColor: '#8d95d6', borderRadius: 15 }}>

                    <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} style={{ width: '100%' }}>
                        {
                            categories.map((item) => {

                                return (

                                    <View key={item.id} style={{ marginHorizontal: 30 }} >
                                        <TouchableOpacity style={selectedCategory === item.name ? { backgroundColor: '#c5e0fa', borderRadius: 8, padding: 5 } : { backgroundColor: '#133945', borderRadius: 8, padding: 5 }} onPress={() => setSelectedCategory(item.name)}>
                                            <Text style={{ color: 'white' }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    </View>

                                )
                            })
                        }

                    </ScrollView>

                </View>
            </View>












            <ScrollView
                contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }} style={{ alignSelf: 'center', width: '90%', marginVertical: 10 }}>




                {searchedProducts.map((item) => {

                    return (

                        <View key={item.id} style={{ flexShrink: 1, width: (Platform.OS == 'web' ? '20%' : '40%'), backgroundColor: '#133945', height: 300, margin: 20, borderRadius: 15, justifyContent: 'flex-start', alignItems: 'center', paddingTop:12 }} >


                            <View style={{ borderRadius: '100%', width: '90%', height: '40%', maxHeight: 120, maxWidth: 120, marginTop: 5, marginBottom: 4 }}>
                                <Image source={{ uri: `${BASE_URL_IMAGES}${item.productImageUrl}` }} style={{ borderRadius: '100%', width: '100%', height: '100%' }} resizeMode="stretch"></Image>
                            </View>


                            <Text style={{  fontSize: 20, color: 'white' }} numberOfLines={1} >{item.name}</Text>



                            <Text numberOfLines={1} style={{ fontSize: 20, color: 'white' }}>{item.price + '₪'}</Text>







                            <Text numberOfLines={1} style={{ fontSize: 20, color: '#dddd', fontFamily: 'bold',marginBottom:12 }}>{item.productCategory}</Text>











                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '12%' }}>


                                <Link style={{ flexShrink: 1, justifyContent: 'center', alignItems: 'center', height: 44, width: 44, backgroundColor: 'white', borderRadius: '100%', marginHorizontal: 10 }} href={{ pathname: '../SecretaryStack/UpdateProduct', params: {productId}}} onPress={() => {setProductId(item.id)}} asChild>
                                    <TouchableOpacity>

                                        <Image source={require('../../assets/images/pencil (2).png')} style={{ width: '80%', height: 30 }} resizeMode='contain'></Image>

                                    </TouchableOpacity>
                                </Link>



                                <TouchableOpacity style={{ flexShrink: 1, alignItems: 'center', justifyContent: 'center', height: 40, width: 40, backgroundColor: 'white', borderRadius: '100%', marginHorizontal: 10 }} onPress={() => deleteProductHandle(item.id)} >

                                    <Image source={require('../../assets/images/trash.png')} style={{ width: '80%', height: 30 }} resizeMode='contain'></Image>

                                </TouchableOpacity>



                            </View>



                        </View>

                    )


                })}





            </ScrollView>









            {/* <ScrollView
                contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }} style={{ alignSelf: 'center', width: '90%', marginVertical: 10 }}>



                {searchedProducts.map((item) => {
                    return ( */}

                        {/* // <View key={item.id} style={{ width: widthRatio, flexDirection: 'row', backgroundColor: 'brown', height: 300, margin: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }} SearchProduct = {SearchProduct} setProducts = {setProducts}>
                        //     <Text style={{ fontSize: 20, color: 'white' }}>{item.name}</Text>
                        // </View>


                        // <Image source={{ uri: PetService.serveImage(item.productImageUrl)}}  style={{width:80, height:80}}></Image>



                        // <View key={item.id} style={{ width: '100%', backgroundColor: 'brown', height: 300, margin: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }} SearchProduct={SearchProduct} setProducts={setProducts}>


                        //     <Image source={`${BASE_URL}${item.productImageUrl}`} style={{ width: 80, height: 80 }}></Image>


                        //     <Text style={{ fontSize: 20, color: 'white' }}>{item.productImageUrl}</Text>
                        // </View> */}




                        {/* <View key={item.id} style={{ width: widthRatio, backgroundColor: '#133945', height: 300, margin: 20, justifyContent: 'space-between', alignItems: 'center', borderRadius: 15 }} SearchProduct={SearchProduct} setSearchText={setSearchText}>

                            <View style={{ width: '90%', height: '50%', marginTop: 5 }}>
                                <Image source={{ uri: `${BASE_URL_IMAGES}${item.productImageUrl}` }} style={{ width: '100%', height: '100%' }} resizeMode="contain"></Image>
                            </View>


                            <Text style={{ fontSize: 20, color: 'white' }}>{item.name}</Text> */}


                            {/* source={`${BASE_URL}${item.productImageUrl}`} */}



                            {/* <Text style={{ fontSize: 20, color: 'white' }}>{item.price + '₪'}</Text>







                            <Text style={{ fontSize: 20, color: '#dddd', fontFamily: 'bold' }}>{item.productCategory}</Text>


                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '30%', height: '30%' }}>
 */}

                                {/* <View style={{ backgroundColor: 'white', borderRadius: '100%', width:40, height:40 }}>



                                        <Image source={require('../../assets/images/pencil (2).png')} style={{ width: 30, height: 30, borderRadius: 8 }} resizeMode='stretch'></Image>


                                    </View> */}

                                {/* <View style={{ alignItems: 'center', height: '60%', width: '100%', backgroundColor: 'white', borderRadius: '100%', marginBottom: 10, marginHorizontal: 10 }}> */}
                                {/* <Link href={{ pathname: '../ManagerStack/UpdateProduct', params: { productId } }} onPress={() => { setProductId(item.id) }} asChild>
                                    <TouchableOpacity style={{ alignItems: 'center', height: '60%', width: '100%', backgroundColor: 'white', borderRadius: '100%', marginBottom: 20, marginHorizontal: 10 }}>

                                        <Image source={require('../../assets/images/pencil (2).png')} style={{ flex: 1, width: 30, height: 30 }} resizeMode='contain'></Image>

                                    </TouchableOpacity>
                                </Link>





                                <TouchableOpacity style={{ alignItems: 'center', height: '60%', width: '100%', backgroundColor: 'white', borderRadius: '100%', marginBottom: 20, marginHorizontal: 10 }} onPress={() => deleteProductHandle(item.id)}>

                                    <Image source={require('../../assets/images/trash.png')} style={{ flex: 1, width: 30, height: 30 }} resizeMode='contain'></Image>

                                </TouchableOpacity> */}




                                {/* <Link href= {{pathname:'../ManagerStack/UpdateProduct', params:{productId}}} asChild>
                                    <TouchableOpacity style={{ alignItems: 'center', height: '60%', width: '100%', backgroundColor: 'white', borderRadius: '100%', marginBottom: 20, marginHorizontal: 10 }} onPress={setProductId(item.id)}>

                                        <Image source={require('../../assets/images/trash.png')} style={{ flex: 1, width: 30, height: 30 }} resizeMode='contain'></Image>

                                    </TouchableOpacity>
                                </Link> */}


{/* 

                            </View>
                        </View>


                    )
                })} */}


                {/* <Image source={{ uri: products[0].productImageUrl }}  style={{width:80, height:80}}></Image> */}
{/* 
            </ScrollView> */}








            <Link href={{ pathname: "/SecretaryStack/AddProduct" }} asChild>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: 50, width: '50%', marginVertical: 10 }}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Add New Product</Text>
                </TouchableOpacity>
            </Link>

        </View>




    );

}
