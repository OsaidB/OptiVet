import { useState, useEffect } from "react";
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ImageBackground, TextInput, ScrollView, Platform, SafeAreaView
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
    }, [selectedCategory, products]);


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



        <SafeAreaView style={styles.container}>
            <View

                style={styles.containerPart}>

                <Text style={styles.titleText}>Store</Text>


                <View
                    style={styles.STextStyle}>
                    <View style={styles.STextStyling}>
                        <TextInput
                            placeholder="Search Product"
                            style={styles.textInputStyle}
                            value={searchText}
                            onChangeText={SearchProduct}
                        />
                    </View>
                </View>

                <View
                    style={styles.scrollStyle}>
                    <View
                        style={styles.scrollStyling}>
                        <ScrollView
                            horizontal={true}
                            contentContainerStyle={styles.categoriesScrollStyle}
                            style={styles.categoriesScrollStyling}
                            showsHorizontalScrollIndicator={
                                Platform.OS == 'web' ? true : false
                            }>
                            {categories.map((item) => {
                                return (
                                    <View key={item.id} style={{ marginHorizontal: 30 }}>
                                        <TouchableOpacity
                                            style={
                                                selectedCategory === item.name
                                                    ? {
                                                        backgroundColor: '#c5e0fa',
                                                        borderRadius: 8,
                                                        padding: 5,
                                                    }
                                                    : {
                                                        backgroundColor: '#133945',
                                                        borderRadius: 8,
                                                        padding: 5,
                                                    }
                                            }
                                            onPress={() => setSelectedCategory(item.name)}>
                                            <Text style={
                                                selectedCategory === item.name
                                                    ? {
                                                        color: '#133945'
                                                    }
                                                    : {
                                                        color: 'white',

                                                    }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    style={styles.contentStyle}>
                    {searchedProducts.map((item) => {
                        return (
                            <View key={item.id} style={styles.productElement}>
                                <View style={styles.productImageStyle}>
                                    <Image
                                        source={
                                            item.productImageUrl
                                                ? {
                                                    uri: `${BASE_URL_IMAGES}${item.productImageUrl}`,
                                                }
                                                : require('../../assets/images/box.png')
                                        }
                                        style={styles.productImageStyling}
                                        resizeMode="cover"></Image>
                                </View>

                                <Text
                                    style={styles.nameText}
                                    numberOfLines={Platform.OS == 'web' ? 1 : 2}>
                                    {item.name}
                                </Text>

                                <Text
                                    style={styles.nameText}
                                    numberOfLines={Platform.OS == 'web' ? 1 : 2}>
                                    {item.price + '₪'}
                                </Text>

                                <Text numberOfLines={3} style={styles.categoryText}>
                                    {item.productCategory}
                                </Text>

                                <View
                                    style={styles.productElementButtons}>
                                    <Link
                                        style={styles.productElementEditButton}
                                        href={{
                                            pathname: '../SecretaryStack/UpdateProduct',
                                            params: { productId },
                                        }}
                                        onPress={() => {
                                            setProductId(item.id);
                                        }}
                                        asChild>
                                        <TouchableOpacity>
                                            <Image
                                                source={require('../../assets/images/pencil (2).png')}
                                                style={styles.productElementButtonImage}
                                                resizeMode="contain"></Image>
                                        </TouchableOpacity>
                                    </Link>

                                    <TouchableOpacity
                                        style={styles.productElementRemoveButton}
                                        onPress={() => deleteProductHandle(item.id)}>
                                        <Image
                                            source={require('../../assets/images/trash.png')}
                                            style={styles.productElementButtonImage}
                                            resizeMode="contain"></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                <Link href={{ pathname: '/SecretaryStack/AddProduct' }} asChild>
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkButtonText}>Add New Product</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    containerPart: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginVertical: Platform.OS == 'web' ? 0 : 30
    },

    titleText: {
        fontSize: 40
    },

    STextStyle: {
        marginVertical: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'black',
        width: '90%',
        padding: 10,
    },
    STextStyling: {
        width: '90%',
        padding: 10
    },

    textInputStyle: {
        outlineStyle: 'none'
    },

    scrollStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    scrollStyling: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#8d95d6',
    },

    categoriesScrollStyle: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },

    categoriesScrollStyling: {
        width: '100%'
    },



    title: {
        fontSize: 40,
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    contentStyle: {
        alignSelf: 'center',
        width: '90%',
        marginVertical: 10,
    },
    productElement: {
        flexShrink: 1,
        paddingTop: 12,
        width: Platform.OS == 'web' ? '20%' : '40%',
        backgroundColor: '#133945',
        height: 280,
        margin: 12,
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    productImageStyle: {
        borderRadius: 100,
        width: '90%',
        height: '40%',
        maxHeight: 120,
        maxWidth: 120,
        marginBottom: 4,
    },

    productImageStyling: {
        borderRadius: 100,
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: 'white',
    },
    nameText: {
        fontSize: 20,
        color: 'white',
        marginBottom: 4,
    },

    typeBreedText: {
        fontSize: 20,
        color: '#97989c',
        marginBottom: 20,
    },

    productElementButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: '12%',
    },
    productElementEditButton: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        width: 44,
        backgroundColor: 'white',
        borderRadius: 100,
        marginHorizontal: 10,
    },

    productElementRemoveButton: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 100,
        marginHorizontal: 10,
    },

    productElementButtonImage: {
        width: '80%',
        height: 30,
    },
    petElementViewDButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 18,
        height: 24,
        width: '90%',
        marginVertical: 10,
    },
    linkButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#133945',
        borderRadius: 18,
        height: 50,
        width: '50%',
        marginVertical: 10,
        padding: 12,
    },
    linkButtonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    categoryText: {
        fontSize: 20,
        color: '#dddd',
        fontFamily: 'bold',
        marginBottom: 12,
    },
});
