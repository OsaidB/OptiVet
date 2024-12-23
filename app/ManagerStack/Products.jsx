import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput, ScrollView, Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from "@rneui/themed";
import { createFilter } from "react-native-search-filter";
import ProductService from "../../Services/ProductService";
import baseURL from '../../Services/config'; // Adjust the path as necessary
const BASE_URL = `${baseURL.USED_BASE_URL}/api/products`;






export default function Products() {
    // const [products, setProducts] = useState([{ name: '1876', id: 1 }, { name: '223e333', id: 2 }, { name: '3343', id: 3 }, { name: '223244', id: 4 }, { name: '2345', id: 5 }, { name: '6', id: 6 }, { name: '7', id: 7 }]);
    const [products, setProducts] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([...products]);
    const [widthRatio, setWidthRatio] = useState('17%');
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState([{ id: 0, name: 'ALL' },{ id: 1, name: 'TOYS' }, { id: 2, name: 'COLLARS' }, { id: 3, name: 'TREATS' }]);
    //toystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoystoys
    const [selectedCategory, setSelectedCategory] = useState(0);
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






    const catagorizaHandle = (category) => {


        setSelectedCategory(category);



    };




    const SearchProduct = (searchString) => {



        // if(searchString === undefined){
        // searchString = '1';
        // }

        // const filteredProducts = products.filter(createFilter(searchString, toFilt));
        // setProducts(filteredProducts);



        setSearchText(searchString);




        //console.log(textValue);
        // console.log(productName);
        //console.log(''.toLowerCase().indexOf('1'.toLowerCase()) > -1);

        // const filteredProducts = products.filter(product => product.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1);

        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchString.toLowerCase()));

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


        console.log(searchText);
        console.log(products);
        //setProducts([{ name: '1', id: 1 }, { name: '2', id: 2 }]);
    };




    return (



        
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ alignSelf: 'center' }}><Text style={{ fontSize: 40 }}>Products</Text></View>


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





















<View style={{flexDirection:'row', justifyContent:'center', width:'60%'}}>
<View style={{flexDirection:'row', justifyContent:'center', width:'100%', backgroundColor:'#8d95d6', borderRadius:15}}>
    
        <ScrollView horizontal={true} contentContainerStyle={{flexGrow:1, justifyContent:'center',alignItems:'center', marginVertical:10}} style={{width:'100%'}}>
        {
                    categories.map((item) => {

                        return (

                            <View key={item.id} style={{ marginHorizontal: 30}}>
                                <TouchableOpacity style={selectedCategory === item.id ? { backgroundColor: '#c5e0fa', borderRadius: 8 ,padding:5} : { backgroundColor: '#133945', borderRadius: 8, padding:5 }} onPress={() => catagorizaHandle(item.id)}>
                                    <Text style = {{color:'white'}}>{item.name}</Text>
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

                        // <View key={item.id} style={{ width: widthRatio, flexDirection: 'row', backgroundColor: 'brown', height: 300, margin: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }} SearchProduct = {SearchProduct} setProducts = {setProducts}>
                        //     <Text style={{ fontSize: 20, color: 'white' }}>{item.name}</Text>
                        // </View>


                        // <Image source={{ uri: PetService.serveImage(item.productImageUrl)}}  style={{width:80, height:80}}></Image>



                        // <View key={item.id} style={{ width: '100%', backgroundColor: 'brown', height: 300, margin: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }} SearchProduct={SearchProduct} setProducts={setProducts}>


                        //     <Image source={`${BASE_URL}${item.productImageUrl}`} style={{ width: 80, height: 80 }}></Image>


                        //     <Text style={{ fontSize: 20, color: 'white' }}>{item.productImageUrl}</Text>
                        // </View>




                        <View key={item.id} style={{ width: widthRatio, backgroundColor: '#133945', height: 300, margin: 20, justifyContent: 'space-between', alignItems: 'center' }} SearchProduct={SearchProduct} setSearchText={setSearchText}>

                            <View style={{ width: '60%', height: '60%', marginVertical: 10 }}>
                                <Image source={`${BASE_URL}${item.productImageUrl}`} style={{ width: '100%', height: '100%' }} resizeMode="contain"></Image>
                            </View>


                            <Text style={{ fontSize: 20, color: 'white' }}>{item.name}</Text>






                            <Text style={{ fontSize: 20, color: 'white' }}>{item.price + '₪'}</Text>







                            <Text style={{ fontSize: 20, color: '#dddd', fontFamily: 'bold' }}>{item.productCategory}</Text>

                        </View>


                    )
                })}


                {/* <Image source={{ uri: products[0].productImageUrl }}  style={{width:80, height:80}}></Image> */}

            </ScrollView>


        </View>

        


    );

}
