import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ref, set, onValue, remove } from 'firebase/database';
import { db } from '../../Components/config';
import BusinessPromotionController from '../../Controller/Business_Controller/BusinessPromotionController';
import { useNavigation } from '@react-navigation/native';

// Define the BusinessCreatePromotionAdd component
const BusinessCreatePromotionAdd = () => {
    // State variables for input fields and promotions
    const navigation = useNavigation();
    const [foodmenus, setFoodMenu] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const [foodDiscountDescription, setFoodDiscountDescription] = useState('');
    const [discount, setDiscount] = useState(0);
    const [storeName, setStoreName] = useState('');
    const [location, setLocation] = useState('');
    const [promotions, setPromotions] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Function to add a promotion
    const handleAddPromotion = () => {
        if (
            discount !== '' &&
            foodDiscountDescription !== '' &&
            storeName !== '' &&
            location !== ''
        ) {
            // Calculate the promotion and add it to the promotions list
            const newPromotion = BusinessPromotionController.calculatePromotion(
                foodDiscountDescription,
                discount,
                storeName,
                location,
                startDate,
                endDate
            );

            // Create a new array with the updated promotions
            const updatedPromotions = [...promotions, newPromotion];

            // Update the Firebase database with the updated promotions
            const databaseRef = ref(db, 'promotions');
            set(databaseRef, updatedPromotions)
                .then(() => {
                    // Data saved successfully!
                    alert('Promotion added');
                })
                .catch((error) => {
                    // The write failed...
                    alert(error);
                });

            // Clear input fields
            setFoodDiscountDescription('');
            setDiscount('');
            setStoreName('');
            setLocation('');
        }
    };

    // Fetch products from the database
    useEffect(() => {
        const foodmenuRef = ref(db, 'foodmenu');

        // Listen for changes in the database and update the state
        const unsubscribe = onValue(foodmenuRef, (snapshot) => {
            if (snapshot.exists()) {
                const foodmenusData = snapshot.val();
                const foodmenusArray = Object.keys(foodmenusData).map((id) => ({
                    id,
                    ...foodmenusData[id],
                    quantity: 0,
                    totalPrice: 0, // Initialize total price for each item
                }));
                setFoodMenu(foodmenusArray);
            }
        });

        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    const toggleItemSelection = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(itemId)) {
                return prevSelectedItems.filter((id) => id !== itemId);
            } else {
                return [...prevSelectedItems, itemId];
            }
        });
    };

    const handleMainButtonPress = () => {
        const mainItems = foodmenus.filter((item) => selectedItems.includes(item.id));
        const mainRef = ref(db, 'selectFoodPromotion');
        set(mainRef, mainItems).then(() => {
            navigation.goBack('BusinessCreatePromotionMain', { reviewedMain: mainItems });
        });
    };

    // Define a new function to call both handleAddPromotion and handleMainButtonPress
    const handleAddPromotionAndMainButton = () => {
        handleAddPromotion(); // Call the handleAddPromotion function
        handleMainButtonPress(); // Call the handleMainButtonPress function
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Input fields */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Food Discount Description"
                    value={foodDiscountDescription}
                    onChangeText={(text) => setFoodDiscountDescription(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Discount"
                    value={discount}
                    onChangeText={(text) => setDiscount(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Store Name"
                    value={storeName}
                    onChangeText={(text) => setStoreName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Start Date (YYYY-MM-DD)"
                    value={startDate}
                    onChangeText={(text) => setStartDate(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="End Date (YYYY-MM-DD)"
                    value={endDate}
                    onChangeText={(text) => setEndDate(text)}
                />

                <FlatList
                    data={foodmenus}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.itemContent,
                                    selectedItems.includes(item.id) ? styles.selectedItem : null
                                ]}
                                onPress={() => toggleItemSelection(item.id)}
                            >
                                <Text style={styles.itemName}>{item.foodName}</Text>
                                <Text style={styles.itemPrice}>Price: P{item.price}</Text>
                                <Text style={styles.itemLocation}>Location: {item.location}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View>
                    <TouchableOpacity style={styles.button} onPress={handleAddPromotionAndMainButton}>
                        <Text style={styles.buttonText}>Add Promotion</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: 'maroon',
    },
    inputContainer: {
        backgroundColor: '#FFD68A',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    discountItem: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    discountItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    button: {
        width: 180,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'green',
        marginTop: 10,
        marginBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        marginLeft: 80,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    itemContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 16,
        marginVertical: 8,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 2,
        marginBottom: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 16,
        color: '#555',
    },
    itemLocation: {
        fontSize: 16,
        color: '#555',
    },
    selectedItem: {
        backgroundColor: '#e0f7fa',
    },
    itemContent: {
        flex: 1,
    },
});

export default BusinessCreatePromotionAdd;
