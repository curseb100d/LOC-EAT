import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, push, set } from "firebase/database";
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

function BusinessCreateAdd() {
    const navigation = useNavigation();
    const [foodName, setFoodName] = useState('');
    const [foodDescription, setFoodDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [storeName, setStoreName] = useState('');
    const [location, setLocation] = useState('Front Gate'); // Default to Front Gate

    const handleAddFoodMenu = () => {
        if (
            discountPercentage !== '' &&
            !isNaN(discountPercentage) &&
            foodName !== '' &&
            foodDescription !== '' &&
            price !== 0 &&
            storeName !== '' &&
            location !== ''
        ) {
            const newDiscount = BusinessCreateController.calculateDiscount(
                foodName,
                foodDescription,
                price,
                parseFloat(discountPercentage),
                storeName,
                location
            );

            // Push the new discount object to Firebase with a unique key
            const databaseRef = ref(db, 'foodmenu');
            const newDiscountRef = push(databaseRef); // Create a new reference with a unique key
            set(newDiscountRef, newDiscount)
                .then(() => {
                    // Data saved successfully!
                    alert('Food added');
                    navigation.goBack();
                })
                .catch((error) => {
                    // The write failed...
                    alert(error);
                });

            // Clear the form fields
            setFoodName('');
            setFoodDescription('');
            setDiscountPercentage('');
            setStoreName('');
            setLocation('');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Food Name"
                    value={foodName}
                    onChangeText={(text) => setFoodName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Food Description"
                    value={foodDescription}
                    onChangeText={(text) => setFoodDescription(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Price"
                    onChangeText={(text) => setPrice(parseFloat(text))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Discount Percentage"
                    value={discountPercentage}
                    onChangeText={(text) => setDiscountPercentage(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Owner Name"
                    value={storeName}
                    onChangeText={(text) => setStoreName(text)}
                />
                <Picker
                    selectedValue={location}
                    style={styles.input}
                    onValueChange={(itemValue) => setLocation(itemValue)}
                >
                    <Picker.Item label="Front Gate" value="Front Gate" />
                    <Picker.Item label="Back Gate" value="Back Gate" />
                </Picker>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleAddFoodMenu}
                    >
                        <Text style={styles.buttonText}>Add Discount</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

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

export default BusinessCreateAdd;
