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

const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;
const BASE_URL_IMAGES = `${baseURL.USED_BASE_URL}/api/pets`;


export default function Products() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([...products]);
    const [categorizedProducts, setCategorizedProducts] = useState([...products]);
    const [widthRatio, setWidthRatio] = useState('17%');
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState([{ id: 0, name: 'ALL' }, { id: 1, name: 'TOYS' }, { id: 2, name: 'FOOD' }, { id: 3, name: 'TREATS' }]);
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


    const deleteProductHandle = (id) => {
        ProductService.deleteProduct(id);
        const newProducts = products.filter(product => product.id !== id);
        setProducts(newProducts);
    };



    const SearchProduct = (searchString) => {
        if (selectedCategory !== 'ALL') {
            const categorized = products.filter(product => product.productCategory.toLowerCase().includes(selectedCategory.toLowerCase()));
    
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

            const filteredProducts = categorizedProducts.filter(product => product.name.toLowerCase().includes(searchString.toLowerCase()));
     
            if (filteredProducts.length !== 0) {
                setSearchedProducts(filteredProducts);
            }
            else {
                setSearchedProducts([]);
            }

        }

    };


    return (

        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ alignSelf: 'center' }}><Text style={{ fontSize: 40 }}>Store</Text></View>


            <View style={{ marginVertical: 10, marginHorizontal: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderWidth: 1, borderRadius: 8, borderColor: 'black', width: '90%', padding: 10 }}>

                <View style={{ width: '90%', padding: 10 }}>
                    <TextInput placeholder="Search Product" style={{ outlineStyle: 'none' }} value={searchText} onChangeText={SearchProduct} />

                </View>


            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'center', width:'100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', backgroundColor: '#8d95d6' }}>

                    <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} style={{ width: '100%' }} showsHorizontalScrollIndicator = {(Platform.OS == 'web' ? true : false)}>
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

                            <Text style={{  fontSize: 20, color: 'white' }} numberOfLines={3} >{item.name}</Text>

                            <Text numberOfLines={1} style={{ fontSize: 20, color: 'white' }}>{item.price + '₪'}</Text>

                            <Text numberOfLines={3} style={{ fontSize: 20, color: '#dddd', fontFamily: 'bold',marginBottom:12 }}>{item.productCategory}</Text>


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

            <Link href={{ pathname: "/SecretaryStack/AddProduct" }} asChild>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#133945', borderRadius: 18, height: 50, width: '50%', marginVertical: 10 }}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Add New Product</Text>
                </TouchableOpacity>
            </Link>

        </View>

    );

}
