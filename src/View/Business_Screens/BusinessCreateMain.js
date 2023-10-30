import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, set, onValue, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import { firebase } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../../Components/config';
import { getDownloadURL, uploadBytes, deleteObject, listAll } from 'firebase/storage';

export default function BusinessCreateMain() {
  const [foodmenus, setFoodMenu] = useState([]);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleEditFoodClick() {
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

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Menu</Text>
      <FlatList
        data={foodmenus}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.foodName}</Text>
            <Text style={styles.itemPrice}>P{item.price}</Text>
            <View style={styles.quantityContainer}>
            </View>
          </View>
        )}
      />
      <TouchableOpacity onPress={handleEditFoodClick}>
        <Text>Add Food</Text>
      </TouchableOpacity>
    </View>
  )
};

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
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
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  totalQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
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

