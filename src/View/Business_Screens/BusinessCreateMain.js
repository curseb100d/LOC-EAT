import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, onValue, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../../Components/config';
import { getDownloadURL, uploadBytes, ref as ref1, listAll } from 'firebase/storage';
import Modal from 'react-native-modal';

export default function BusinessCreateMain() {
  const [foodmenus, setFoodMenu] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [foodName, setFoodName] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Front Gate');

  const [images, setImages] = useState({});

  const pickImage = async (item) => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uploadURL = await uploadImageAsync(result.assets[0].uri, item.id);
      setImages((prevImages) => ({ ...prevImages, [item.id]: uploadURL }));
      setCurrentImageIndex(item.id);
    }

    setIsLoading(false);
  };

  const uploadImageAsync = async (uri, itemId) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    try {
      const imageName = `image-${Date.now()}`;
      const storageRef = ref1(storage, `food/${itemId}/${imageName}`);
      await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
      return null;
    }
  };

  const changeImage = () => {
    // When the "Change Image" button is pressed, allow the user to select a new image.
    pickImage();
  };

  const fetchImages = async (foodmenus) => {
    for (let food of foodmenus) {
      const listRef = ref1(storage, `food/${food.id}`);
      const imageList = await listAll(listRef);
      let downloadURLs = await Promise.all(imageList.items.map((imageRef) => getDownloadURL(imageRef)));
      if (downloadURLs.length > 0) {
        downloadURLs = downloadURLs.pop();
        setImages((prevImages) => ({
          ...prevImages,
          [food.id]: downloadURLs,
        }));
        setIsLoading(true);
      }

    }
  }

  const toggleLocation = () => {
    setSelectedLocation((prevLocation) =>
      prevLocation === 'Front Gate' ? 'Back Gate' : 'Front Gate'
    );
  };

  function handleEditFoodItem(item) {
    setSelectedItemId(item.id);
    setFoodName(item.foodName);
    setPrice(item.price);
    setDiscountPercentage(item.discountPercentage.toString());
    setStoreName(item.storeName);
    setLocation(item.location);
  }

  const handleEditFoodClick = () => {
    navigation.navigate('BusinessCreateAdd');
  }

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
        fetchImages(foodmenusArray);
      }
    });
    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const updateDiscount = async () => {
    if (selectedItemId) {
      const databaseRef = ref(db, `foodmenu/${selectedItemId}`);
  
      try {
        if (
          foodName !== '' &&
          !isNaN(price) &&
          price !== 0 &&
          storeName !== '' &&
          location !== ''
        ) {
          const updatedDiscount = {
            foodName,
            price,
            discountPercentage: parseFloat(discountPercentage),
            storeName,
            location,
            discountedPrice: BusinessCreateController.calculateDiscount(
              foodName,
              price,
              parseFloat(discountPercentage),
              storeName,
              location
            ).discountedPrice,
          };
  
          await update(databaseRef, updatedDiscount);
          alert('Discount updated');
          setSelectedItemId(null);
          setFoodName('');
          setPrice(0);
          setDiscountPercentage('');
          setStoreName('');
          setLocation('');
        } else {
          alert('Please fill in all required fields');
        }
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };
  

  const handleDeleteItem = (itemId) => {
    // Remove the item from Realtime Firebase and update the local state
    const cartRef = ref(db, 'foodmenu/' + itemId);
    remove(cartRef).then(() => {
      // Remove the item from the local state
      setFoodCart((prevFoodCart) => prevFoodCart.filter((item) => item.id !== itemId));
      // Deselect the item
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((id) => id !== itemId));
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Menu</Text>
      <FlatList
        data={foodmenus}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => pickImage(item)}>
              <View style={styles.circularCard}>
                {isLoading && (
                  <Image source={{ uri: images[item.id] }} style={{ width: 120, height: 120, borderRadius: 60 }} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.itemName}>{item.foodName}</Text>
            <Text style={styles.itemPrice}>Price: ₱{item.price}</Text>
            <Text style={styles.itemPrice}>Location: {item.location}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleEditFoodItem(item)}>
                <Text style={styles.Edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>

            <Modal isVisible={selectedItemId === item.id}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Food Name"
                  value={foodName}
                  onChangeText={(text) => setFoodName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  onChangeText={(text) => setPrice(parseFloat(text))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Discount Percentage"
                  value={discountPercentage}
                  onChangeText={(text) => setDiscountPercentage(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Store Name"
                  value={storeName}
                  onChangeText={(text) => setStoreName(text)}
                />
                <TouchableOpacity
                  style={styles.toggleContainer}
                  onPress={toggleLocation}
                >
                  <Text style={styles.toggleLabel}>{selectedLocation}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={updateDiscount}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedItemId(null)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleEditFoodClick}>
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'maroon',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ffbf00',
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
  },
  deleteButtonText: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'red', // Background color
    padding: 8, // Padding around the text
    borderRadius: 18, // Border radius for rounded corners
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
    width: 80,
    left: 10
  },
  updateForm: {
    marginTop: 10,
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
  button: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'green', // Background color
    padding: 10, // Padding around the text
    borderRadius: 15, // Border radius for rounded corners
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
  },
  buttonText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: 'green',
    borderRadius: 25,
    width: 180,
    height: 50,
    marginTop: 10,
    marginLeft: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    backgroundColor: '#ffbf00',
    padding: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'red', // Background color
    padding: 10, // Padding around the text
    borderRadius: 15, // Border radius for rounded corners
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  Edit: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'green', // Background color
    padding: 8, // Padding around the text
    borderRadius: 18, // Border radius for rounded corners
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
    width: 80,
    right: 5,
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
  circularCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white', // Customize the color of the circular card
    margin: 10,
  },
});