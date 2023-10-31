import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import BusinessPromotionController from '../../Controller/Business_Controller/BusinessPromotionController';
import { ref, set } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';

function BusinessCreatePromotionAdd() {
    const navigation = useNavigation();
    // const [foodName, setFoodName] = useState('');
    const [foodDiscountDescription, setFoodDiscountDescription] = useState('');
    // const [originalPrice, setOriginalPrice] = useState(0);
    // const [discountPercentage, setDiscountPercentage] = useState('');
    // const [discounts, setDiscounts] = useState([]);
    const [businessOwnerName, setBusinessOwnerName] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [daysDifference, setDaysDifference] = useState(null);
    
    const handleAddDiscount = () => {
        if (
            // discountPercentage !== '' &&
            // !isNaN(discountPercentage) &&
            // foodName !== '' &&
            foodDiscountDescription !== '' &&
            businessOwnerName !== '' &&
            location !== ''
        ) {
            const newDiscount = BusinessPromotionController.calculateDiscount(
                // foodName,
                foodDiscountDescription,
                // originalPrice,
                // parseFloat(discountPercentage),
                businessOwnerName,
                location
            );

            setDiscounts([...discounts, newDiscount]);

            setFoodName('');
            setFoodDiscountDescription('');
            // setDiscountPercentage('');
            setBusinessOwnerName('');
            setLocation('');

            const databaseRef = ref(db, 'promotion');
            set(databaseRef, discounts)
                .then(() => {
                    // Data saved successfully!
                    alert('Food added');
                    navigation.goBack();
                })
                .catch((error) => {
                    // The write failed...
                    alert(error);
                });
        }
    };

    const handleCalculateDaysDifference = () => {
        if (startDate && endDate) {
            const daysDifference = BusinessPromotionController.calculateDaysDifference(
                startDate,
                endDate
            );
            setDaysDifference(daysDifference);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.inputContainer}>
                {/* <TextInput
                    style={styles.input}
                    placeholder="Food Name"
                    value={foodName}
                    onChangeText={(text) => setFoodName(text)}
                /> */}
                <TextInput
                    style={styles.input}
                    placeholder="Food Discount Description"
                    value={foodDiscountDescription}
                    onChangeText={(text) => setFoodDiscountDescription(text)}
                />
                {/* <TextInput
                    style={styles.input}
                    placeholder="Enter Price"
                    onChangeText={(text) => setOriginalPrice(parseFloat(text))}
                /> */}
                {/* <TextInput
                    style={styles.input}
                    placeholder="Enter Discount Percentage"
                    value={discountPercentage}
                    onChangeText={(text) => setDiscountPercentage(text)}
                /> */}
                <TextInput
                    style={styles.input}
                    placeholder="Owner Name"
                    value={businessOwnerName}
                    onChangeText={(text) => setBusinessOwnerName(text)}
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

                <View>
                    <TouchableOpacity style={styles.button} onPress={handleAddDiscount}>
                        <Text style={styles.buttonText}>Add Discount</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleCalculateDaysDifference}
                    >
                        <Text style={styles.buttonText}>Total Days Left</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={discounts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.discountItem}>
                        <View style={styles.discountItemContent}>
                            <Text style={styles.discountItemText}>Name: {item.foodName}</Text>
                            <Text style={styles.discountItemText}>
                                Description: {item.foodDiscountDescription}
                            </Text>
                        </View>
                        <Text style={styles.discountItemPrice}>{item.percentage}% off</Text>
                        <Text style={styles.discountItemPrice}>Discount: {item.discountedPrice}</Text>
                        <Text style={styles.discountItemPrice}>Owner Name: {item.businessOwnerName}</Text>
                        <Text style={styles.discountItemPrice}>Location: {item.location}</Text>
                    </View>
                )}
            />
            {daysDifference !== null && (
                <View>
                    <Text style={styles.discountItemPrice}>
                        Days Left: {daysDifference}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

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
    discountItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    discountItemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
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
});

export default BusinessCreatePromotionAdd;