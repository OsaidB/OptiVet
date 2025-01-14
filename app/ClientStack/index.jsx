import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Image, ScrollView, Alert, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClientService from '../../Services/ClientService';
import PetService from '../../Services/PetService';
import DefaultFemaleImage from '../../assets/images/default_female.jpg';

const ClientStack = () => {
    const [clientInfo, setClientInfo] = useState(null);
    const [email, setEmail] = useState(null);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setEmail(storedEmail);
                } else {
                    console.error("No email found in AsyncStorage");
                    alert('Error: No email found. Please log in again.');
                }
            } catch (error) {
                console.error("Error fetching email from AsyncStorage:", error);
                alert('Error: Failed to retrieve email.');
            }
        };

        const fetchClientInfo = async () => {
            if (!email) return;
            try {
                const data = await ClientService.getClientByEmail(email);
                setClientInfo(data);

                // Fetch pets using client ID
                if (data && data.id) {
                    const fetchedPets = await PetService.getPetsByOwnerId(data.id);

                    // Map pets to ensure the image URL is constructed properly
                    const petsWithImages = fetchedPets.map((pet) => ({
                        ...pet,
                        imageUrl: PetService.serveImage(pet.imageUrl || pet.imageFileName),
                    }));
                    setPets(petsWithImages);
                }
            } catch (error) {
                console.error("Error fetching client info or pets:", error);
                Alert.alert('Error', 'Failed to load client information or pet profiles.');
            }
        };

        fetchEmail();
        fetchClientInfo();
    }, [email]);

    return (
        <ImageBackground
            source={require("../../assets/images/dog-and-cat.jpeg")} // Add your background image
            resizeMode="cover" // Adjust how the image fits
            style={styles.backgroundImage}
        >
        <ScrollView contentContainerStyle={styles.container}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.greetingText}>Welcome Back,</Text>
                <Text style={styles.clientName}>{clientInfo?.firstName} {clientInfo?.lastName}</Text>
                <Image
                    source={clientInfo?.profileImageUrl ? { uri: clientInfo.profileImageUrl } : DefaultFemaleImage}
                    style={styles.profileImage}
                />
            </View>

            {/* Statistics Section */}
            <View style={styles.statsSection}>
                <View style={styles.statsCard}>
                    <Text style={styles.statsValue}>{4}</Text>
                    <Text style={styles.statsLabel}>My Pets</Text>
                </View>
                <View style={styles.statsCard}>
                    <Text style={styles.statsValue}>{clientInfo?.appointments?.length || 2}</Text>
                    <Text style={styles.statsLabel}>Appointments</Text>
                </View>
            </View>

            {/* Highlights Section */}
            <View style={styles.highlightsSection}>
                <Text style={styles.sectionTitle}>Pet Highlights</Text>
                {pets.slice(-4).map((pet) => (
                    <View key={pet.id} style={styles.petCard}>
                        <Image
                            source={{ uri: pet.imageUrl || 'https://cdn.example.com/path-to-placeholder.png' }}
                            style={styles.petImage}
                        />
                        <View style={styles.petDetails}>
                            <Text style={styles.petName}>{pet.name}</Text>
                            <Text style={styles.petType}>{pet.type}</Text>
                            <Text style={styles.petActivity}>Last checkup: {pet.lastCheckupDate || '14-Jan'}</Text>
                        </View>
                    </View>
                ))}
            </View>

        </ScrollView>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    greetingText: {
        fontSize: 24,
        color: '#1D3D47',
        fontWeight: '600',
    },
    clientName: {
        fontSize: 28,
        color: '#7F8C8D',
        fontWeight: 'bold',
        marginVertical: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#7F8C8D',
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statsCard: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        margin: 5,
        padding: 15,
        alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    statsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7F8C8D',
    },
    statsLabel: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    highlightsSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1D3D47',
        marginBottom: 15,
    },
    petCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    petDetails: {
        flex: 1,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    petType: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 5,
    },
    petActivity: {
        fontSize: 12,
        color: '#95A5A6',
    },
});

export default ClientStack;
