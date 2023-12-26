import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, push, set } from "firebase/database";
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

function BusinessCreateAdd() {
    const navigation = useNavigation();
    const [foodName, setFoodName] = useState('');
    const [price, setPrice] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [storeName, setStoreName] = useState('');
    const [location, setLocation] = useState('Front Gate');

    const toggleLocation = () => {
        setLocation((prevLocation) =>
            prevLocation === 'Front Gate' ? 'Back Gate' : 'Front Gate'
        );
    };    

    const handleAddFoodMenu = async () => {
        if (
            discountPercentage !== '' &&
            !isNaN(discountPercentage) &&
            foodName !== '' &&
            price !== 0 &&
            storeName !== '' &&
            location !== ''
        ) {
            const newDiscount = BusinessCreateController.calculateDiscount(
                foodName,
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
                    placeholder="Enter Price"
                    onChangeText={(text) => setPrice(parseFloat(text))}
                />
                <Text>Note: You can put "0" for non-discount</Text>
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
                {/* <Picker
                    selectedValue={location}
                    style={styles.input}
                    onValueChange={(itemValue) => setLocation(itemValue)}
                >
                    <Picker.Item label="Front Gate" value="Front Gate" />
                    <Picker.Item label="Back Gate" value="Back Gate" />
                    <Picker.Item label="Canteen" value="Canteen" />
    </Picker> */}
                <View>
                    <TouchableOpacity
                        style={styles.toggleContainer}
                        onPress={toggleLocation}
                    >
                        <Text style={styles.toggleLabel}>{location}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleAddFoodMenu}>
                    <Text style={styles.buttonText}>Add Food</Text>
                </TouchableOpacity>
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
        backgroundColor: '#ffbf00',
        borderRadius: 30,
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
        borderRadius: 30,
        padding: 10,
        marginBottom: 10,
        marginTop: 5,
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

export default BusinessCreateAdd;
