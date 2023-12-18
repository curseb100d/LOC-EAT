import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../Components/config';
import BusinessPromotionController from '../../Controller/Business_Controller/BusinessPromotionController';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel'; // Import the Carousel component
import DateTimePicker from '@react-native-community/datetimepicker'; // Import the DateTimePicker component

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
    const [selectedLocation, setSelectedLocation] = useState('Front Gate');
    const [promotions, setPromotions] = useState([]);
    const [startDate, setStartDate] = useState(new Date()); // Updated to use Date object
    const [endDate, setEndDate] = useState(new Date()); // Updated to use Date object
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const toggleLocation = () => {
        setSelectedLocation((prevLocation) =>
            prevLocation === 'Front Gate' ? 'Back Gate' : 'Front Gate'
        );
    };

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

    const renderCarouselItem = ({ item }) => {
        return (
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
        );
    };

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
                    value={discount.toString()} // Convert the number to a string
                    onChangeText={(text) => setDiscount(Number(text))} // Convert the input to a number
                />

                <TextInput
                    style={styles.input}
                    placeholder="Store Name"
                    value={storeName}
                    onChangeText={(text) => setStoreName(text)}
                />

                <View>
                    <TouchableOpacity
                        style={styles.toggleContainer}
                        onPress={toggleLocation}
                    >
                        <Text style={styles.toggleLabel}>{selectedLocation}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowStartDatePicker(true)}
                    >
                        <Text>{'Start Date: ' + startDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    setShowStartDatePicker(false);
                                    setStartDate(selectedDate);
                                }
                            }}
                        />
                    )}
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowEndDatePicker(true)}
                    >
                        <Text>{'End Date: ' + endDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    setShowEndDatePicker(false);
                                    setEndDate(selectedDate);
                                }
                            }}
                        />
                    )}
                </View>
                <Carousel
                    data={foodmenus}
                    renderItem={renderCarouselItem}
                    sliderWidth={320} // Customize the slider width
                    itemWidth={320} // Customize the item width
                    left={5}
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
        backgroundColor: '#ffbf00',
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
        borderRadius: 18,
        padding: 10,
        marginBottom: 10,
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
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
        color: 'white', // Text color
        fontSize: 20, // Text font size
        fontWeight: 'bold', // Text font weight
        backgroundColor: 'green', // Background color
        padding: 10, // Padding around the text
        borderRadius: 30, // Border radius for rounded corners
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', // Center text horizontally
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
        backgroundColor: 'orange',
        elevation: 2,
        marginBottom: 10,
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    itemPrice: {
        fontSize: 18,
        color: 'black',
    },
    itemLocation: {
        fontSize: 18,
        color: 'black',
    },
    selectedItem: {
        backgroundColor: '#e0f7fa',
    },
    itemContent: {
        flex: 1,
    },
    toggleContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 18,
        padding: 10,
        marginBottom: 10,
        marginTop: 5,
    },
});

export default BusinessCreatePromotionAdd;
