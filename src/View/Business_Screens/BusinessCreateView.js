import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, set, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';


export default function BusinessCreateView({ navigation }) {
  const [foodItems, setFoodItems] = useState(BusinessCreateController.getAllFoodItems());
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState(''); 
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  //Uploading
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant permission to access your gallery.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Adjust image quality as needed
    });

    if (!result.cancelled) {
      const source = { uri: result.uri };
      setImage(source);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
      return;
    }

    setUploading(true);

    try {
      const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const storageRef = firebase.storage().ref().child('images/' + filename);
      const uploadTask = storageRef.put(blob);

      await uploadTask;

      const downloadURL = await storageRef.getDownloadURL();

      // Store the download URL in Firebase Realtime Database
      const databaseRef = firebase.database().ref('images');
      const newImageRef = databaseRef.push();
      newImageRef.set(downloadURL);

      setUploading(false);
      Alert.alert('Photo Uploaded', 'Your photo has been successfully uploaded.');
      setImage(null);
    } catch (e) {
      console.error(e);
      setUploading(false);
      Alert.alert('Error', 'An error occurred while uploading the photo.');
    }
  };

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
      type : type
    }).then(() => {
      //Data saved successfully!
      alert('Food added');
    })
      .catch((error) => {
        //The write failed...
        alert(error);
      });
  };

  const handleEdit = (item) => {
    setEditItemId(item.id);
    setName(item.name);
    setPrice(item.price);
    setType(item.type);
    setEditMode(true);
  };

  const handleUpdate = () => {
    BusinessCreateController.updateFoodItem(editItemId, name, price, type);
    setFoodItems(BusinessCreateController.getAllFoodItems());
    setEditMode(false);
    setEditItemId(null);
    setName('');
    setPrice('');
    setType('');

    update(ref(db, 'foodmenu/' + name), {
      name: name,
      price: price,
      type : type
    }).then(() => {
      //Data saved successfully!
      alert('Food Updated');
    })
      .catch((error) => {
        //The write failed...
        alert(error);
      });
  };

  const handleDelete = (id) => {
    BusinessCreateController.deleteFoodItem(id);
    setFoodItems(BusinessCreateController.getAllFoodItems());

    remove(ref(db, 'foodmenu/' + name));
    alert('Food Deleted');
  };
  
  const renderEditForm = () => {
    if (!editMode) return null;

    return (
      <View style={styles.editForm}>
        <Text style={styles.editFormTitle}>Edit Food Item</Text>
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
        <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditMode(false)} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetail}>Price: {item.price}</Text>
      <Text style={styles.itemDetail}>Type: {item.type}</Text>
      <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
      <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Pick an Image</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {image && (
                <Image source={{ uri: image.uri }} style={{ width: 300, height: 300 }} />
               )}
               <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                <Text style={styles.buttonText}>
                  Upload Image
                </Text>
               </TouchableOpacity>
          </View>
      </SafeAreaView>


      <TouchableOpacity onPress={handleAddFood} style={styles.addButton}>
        <Text style={styles.buttonText}>Add Food</Text>
      </TouchableOpacity>
      {renderEditForm()}
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
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
    pickButton:{
      backgroundColor: 'green',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    uploadButton:{
      backgroundColor: 'green',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
    }
  });