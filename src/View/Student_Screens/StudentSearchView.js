import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, set, onValue, remove } from "firebase/database";
import { db } from '../../Components/config';

const StudentSearchView = () => {
  const [cart, setCart] = useState([]);
  const [foodmenus, setFoodMenu] = useState([]);

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

      <Text style={styles.total}>Total Calculated: P{calculateTotal()}</Text>
      <Text style={styles.totalQuantity}>Total Quantity: {calculateTotalQuantity()}x</Text>
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

export default StudentSearchView;
