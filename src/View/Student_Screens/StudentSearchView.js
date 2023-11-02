import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ref, set, onValue, remove } from "firebase/database";
import { db } from '../../Components/config';

const StudentSearchView = () => {
  const [cart, setCart] = useState([]);
  const [foodmenus, setFoodMenu] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedLocation, setSelectedLocation] = useState(''); // State for selected location

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

  const addToCart = (foodName, quantity) => {
    const updatedCart = [...cart];
    const foodmenuIndex = updatedCart.findIndex((item) => item.id === foodName.id);

    if (foodmenuIndex !== -1) {
      updatedCart[foodmenuIndex].quantity += quantity;
      updatedCart[foodmenuIndex].totalPrice = updatedCart[foodmenuIndex].price * updatedCart[foodmenuIndex].quantity;
      if (updatedCart[foodmenuIndex].quantity <= 0) {
        // If quantity reaches 0 or less, remove the item from the cart
        updatedCart.splice(foodmenuIndex, 1);
      }
    } else {
      updatedCart.push({ ...foodName, quantity, totalPrice: foodName.price * quantity });
    }

    setCart(updatedCart);

    // Update the cart data in Realtime Firebase
    const cartRef = ref(db, 'foodcart');
    set(cartRef, updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateTotalQuantity = () => {
    return cart.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
  };

  const filteredFoodMenus = foodmenus.filter((item) =>
    (item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.price.toString().includes(searchQuery)) &&
    (!selectedLocation || item.location === selectedLocation)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Menu</Text>
      <FlatList
        data={[
          { title: 'Front Gate', action: () => setSelectedLocation('Front Gate') },
          { title: 'Back Gate', action: () => setSelectedLocation('Back Gate') },
          { title: 'Canteen', action: () => setSelectedLocation('Canteen') },
          { title: 'C', action: () => setSelectedLocation('') }, // Clear button
        ]}
        numColumns={2} // Organize in 2 columns
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.button} onPress={item.action}>
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <FlatList
        data={filteredFoodMenus}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.foodName}</Text>
            <Text style={styles.itemPrice}>Price: P{item.price}</Text>
            <Text style={styles.itemLocation}>Location: {item.location}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => addToCart(item, -1)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => addToCart(item, 1)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>{calculateTotalQuantity()}x Total Calculated: P{calculateTotal()}</Text>
      {/* <Text style={styles.totalQuantity}>Total Quantity: {calculateTotalQuantity()} items</Text> */}
    </View>
  );
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
    textAlign: 'center',
  },
  locationButtons: {
    flexDirection: 'column', // Arrange buttons in a column
  },
  button: {
    flex: 1,
    margin: 5,
    backgroundColor: 'lightblue',
    borderRadius: 50, // Make the buttons circular
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    textAlign: 'right',
  },
  totalQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default StudentSearchView;
