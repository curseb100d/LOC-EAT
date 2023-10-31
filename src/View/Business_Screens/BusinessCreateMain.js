import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image, ActivityIndicator, Button } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, set, onValue, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../../Components/config';
import { getDownloadURL, uploadBytes, deleteObject, listAll } from 'firebase/storage';

export default function BusinessCreateMain() {
  const [foodmenus, setFoodMenu] = useState([]);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState('');

  function handleEditFoodItem(item) {
    setSelectedItemId(item.id);
    setFoodName(item.foodName);
    setFoodDescription(item.foodDescription);
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
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const pickImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uploadURL = await uploadImageAsync(result.assets[0].uri);
      setImage(uploadURL);
      setIsLoading(false);
    } else {
      setImage(null);
      setIsLoading(false);
    }
  };

  const uploadImageAsync = async (uri) => {
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
      const storageRef = ref(storage, `Images/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);

      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const deleteImage = async () => {
    setIsLoading(true);
    const deleteRef = ref(storage, image);
    try {
      deleteObject(deleteRef).then(() => {
        setImage(null);
        setIsLoading(false);
      });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    // Function to fetch an image from Firebase Storage
    const fetchImage = async () => {
      const listRef = ref(storage, 'Images'); // Change 'Images' to your folder name
      const images = await listAll(listRef);

      if (images.items.length > 0) {
        const imageRef = images.items[0]; // Fetch the first image, change as needed
        const downloadURL = await getDownloadURL(imageRef);
        setImage(downloadURL);
      }
    };

    fetchImage();
  }, []); // Fetch the image when the component mounts

  const updateDiscount = async () => {
    if (selectedItemId) {
      const databaseRef = ref(db, `foodmenu/${selectedItemId}`);

      // Calculate the discounted price based on the imported BusinessCreateController
      const updatedDiscount = {
        foodName,
        foodDescription,
        price,
        discountPercentage: parseFloat(discountPercentage),
        storeName,
        location,
        // Calculate the discounted price using BusinessCreateController
        discountedPrice: BusinessCreateController.calculateDiscount(
          foodName,
          foodDescription,
          price,
          parseFloat(discountPercentage),
          storeName,
          location
        ).discountedPrice,
      };

      try {
        await update(databaseRef, updatedDiscount);
        alert('Discount updated');
        setSelectedItemId(null); // Clear the selected item
        // Clear the form fields
        setFoodName('');
        setFoodDescription('');
        setPrice(0);
        setDiscountPercentage('');
        setStoreName('');
        setLocation('');
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
            {image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            )}
            <Text style={styles.itemName}>{item.foodName}</Text>
            <Text style={styles.itemPrice}>Price: P{item.price}</Text>
            <Text style={styles.itemPrice}>Discounted Price: P{item.discountedPrice}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleEditFoodItem(item)}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
            {selectedItemId === item.id && (
              <View style={styles.updateForm}>
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
                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={location}
                  onChangeText={(text) => setLocation(text)}
                />
                <TouchableOpacity style={styles.button} onPress={updateDiscount}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
            )}
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
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: 'white',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
  },
  updateForm: {
    marginTop: 10,
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
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
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
});



// import React, { Component, useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
// import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
// import { ref, set, update, remove } from "firebase/database";
// import { db } from '../../Components/config';
// import { firebase } from '../../Components/config';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';

// class BusinessCreateMain extends Component {
//   constructor() {
//     super();
//     this.state = {
//       foodName: '',
//       foodDescription: '',
//       price: 0,
//       discountPercentage: '',
//       discounts: [],
//       selectedIndex: null,
//       updatedDiscount: {},
//       storeName: '',
//       location: '',
//     };
//   }

//   handleAddDiscount = () => {
//     const { foodName, foodDescription, price, discountPercentage, discounts, storeName, location } = this.state;

//     if (
//       discountPercentage !== '' &&
//       !isNaN(discountPercentage) &&
//       foodName !== '' &&
//       foodDescription !== '' &&
//       price !== '' &&
//       storeName !== '' &&
//       location !== ''
//     ) {
//       const newDiscount = BusinessCreateController.calculateDiscount(
//         foodName,
//         foodDescription,
//         price,
//         parseFloat(discountPercentage),
//         storeName,
//         location
//       );

//       discounts.push(newDiscount);
//       this.setState({
//         foodName: '',
//         foodDescription: '',
//         discountPercentage: '',
//         discounts,
//         storeName: '',
//         location: '',
//       });
//     }

//     const databaseRef = ref(db, 'foodmenu');
//     set(databaseRef, discounts)
//       .then(() => {
//         // Data saved successfully!
//         alert('Food added');
//       })
//       .catch((error) => {
//         // The write failed...
//         alert(error);
//       });

//   }

//   render() {
//     return (
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Food Name"
//             value={this.state.foodName}
//             onChangeText={(text) => this.setState({ foodName: text })}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Food Description"
//             value={this.state.foodDescription}
//             onChangeText={(text) => this.setState({ foodDescription: text })}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Enter Price"
//             onChangeText={(text) => this.setState({ price: parseFloat(text) })}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Enter Discount Percentage"
//             value={this.state.discountPercentage}
//             onChangeText={(text) => this.setState({ discountPercentage: text })}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Owner Name"
//             value={this.state.storeName}
//             onChangeText={(text) => this.setState({ storeName: text })}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Location"
//             value={this.state.location}
//             onChangeText={(text) => this.setState({ location: text })}
//           />
//           <View>
//             <TouchableOpacity
//               onPress={this.handleAddDiscount}
//             >
//               <Text style={styles.butt}>Add Discount</Text>
//             </TouchableOpacity>
//           </View>

//         </View>
//         <FlatList
//           data={this.state.discounts}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.discountItem}>
//               <View style={styles.discountItemContent}>
//                 <Text style={styles.discountItemText}>Food Name: {item.foodName}</Text>
//                 <Text style={styles.discountItemText}>Description: {item.foodDescription}</Text>
//               </View>
//               <Text style={styles.discountItemPrice}>{item.percentage}% off</Text>
//               <Text style={styles.discountItemPrice}>Discount: {item.discountedPrice}</Text>
//               <Text style={styles.discountItemPrice}>Store Name: {item.storeName}</Text>
//               <Text style={styles.discountItemPrice}>Location: {item.location}</Text>
//             </View>
//           )}
//         />
//       </ScrollView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: 'maroon',
//   },
//   inputContainer: {
//     backgroundColor: '#FFD68A',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     elevation: 3, // Adds a slight shadow (Android)
//     shadowColor: 'black', // Adds a slight shadow (iOS)
//     shadowOffset: { width: 0, height: 2 }, // Adds a slight shadow (iOS)
//     shadowOpacity: 0.2, // Adds a slight shadow (iOS)
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     backgroundColor: 'white',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   discountItem: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//   },
//   discountItemContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   discountItemPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   butt: {
//     width: 180,
//     height: 50,
//     borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
//     backgroundColor: 'green', // Button background color
//     marginTop: 10,
//     marginBottom: 5,
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     textAlignVertical: 'center',
//     color: 'white',
//     marginLeft: 80
//   }
// });

// export default BusinessCreateMain;

