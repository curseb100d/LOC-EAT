import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, set, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import { firebase } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

export default function BusinessCreateAdd() {
    const [foodItems, setFoodItems] = useState(BusinessCreateController.getAllFoodItems());
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        setFoodItems(BusinessCreateController.getAllFoodItems());
    }, []);

    const handleAddFood = () => {
        BusinessCreateController.addFoodItem(name, price, type);
        setFoodItems(BusinessCreateController.getAllFoodItems());
        setName('');
        setPrice('');
        setType('');

        set(ref(db, 'foodmenu/' + name), {
            name: name,
            price: price,
            type: type
        }).then(() => {
            //Data saved successfully!
            alert('Food added');
        })
            .catch((error) => {
                //The write failed...
                alert(error);
            });
        navigation.navigate('BusinessCreateMain');
    }

    const pickAndUploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1, // Adjust image quality as needed
        });
      
        if (!result.canceled) {
          setImage(result.assets[0].uri);
      
          try {
            const { uri } = await FileSystem.getInfoAsync(result.assets[0].uri);
            const blob = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = () => {
                resolve(xhr.response);
              };
              xhr.onerror = (e) => {
                reject(new TypeError('Network request failed'));
              };
              xhr.responseType = 'blob';
              xhr.open('GET', uri, true);
              xhr.send(null);
            });
      
            const filename = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf('/') + 1);
            const ref = firebase.storage().ref().child(filename);
      
            await ref.put(blob);
            setUploading(false);
            Alert.alert('Picture Uploaded!');
            setImage(null);
          } catch (error) {
            console.error(error);
            setUploading(false);
          }
        }
      };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Food Menu</Text>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Price"
                value={price}
                onChangeText={(text) => setPrice(text)}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Type"
                value={type}
                onChangeText={(text) => setType(text)}
                style={styles.input}
            />
            <TouchableOpacity onPress={handleAddFood} style={styles.addButton}>
                <Text style={styles.buttonText}>Add Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickButton} onPress={pickAndUploadImage}>
                <Text style={styles.buttonText}>Pick an Image</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                {image && <Image
                    source={{ uri: image }}
                    style={{ width: 300, height: 300 }}
                />}
                {/* <TouchableOpacity style={styles.uploadButton} onPress={uploadMedia}>
                    <Text style={styles.buttonText}>Upload Image</Text>
                </TouchableOpacity> */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    addButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    pickButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    uploadButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 16,
        borderRadius: 5,
        marginBottom: 12,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itemDetail: {
        fontSize: 16,
        marginBottom: 4,
    },
    editButton: {
        backgroundColor: 'blue',
        padding: 8,
        borderRadius: 5,
        marginTop: 8,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
        marginTop: 8,
        alignItems: 'center',
    },
    editForm: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 16,
    },
    editFormTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    updateButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 8,
    },
});