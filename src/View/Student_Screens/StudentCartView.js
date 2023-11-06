import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, set, onValue, remove } from "firebase/database";
import { db } from '../../Components/config';

const StudentCartView = () => {
  const [foodCart, setFoodCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const foodcartRef = ref(db, 'foodcart');

    const unsubscribe = onValue(foodcartRef, (snapshot) => {
      if (snapshot.exists()) {
        const foodcartData = snapshot.val();
        const foodcartArray = Object.keys(foodcartData).map((id) => ({
          id,
          ...foodcartData[id],
        }));
        setFoodCart(foodcartArray);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const calculateTotal = () => {
    return foodCart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // const toggleItemSelection = (itemId) => {
  //   setSelectedItems((prevSelectedItems) => {
  //     if (prevSelectedItems.includes(itemId)) {
  //       return prevSelectedItems.filter((id) => id !== itemId);
  //     } else {
  //       return [...prevSelectedItems, itemId];
  //     }
  //   });
  // };

  const handleDeleteItem = (itemId) => {
    // Remove the item from Realtime Firebase and update the local state
    const cartRef = ref(db, 'foodcart/');
    remove(cartRef).then(() => {
      // Remove the item from the local state
      setFoodCart((prevFoodCart) => prevFoodCart.filter((item) => item.id !== itemId));
      // Deselect the item
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((id) => id !== itemId));
    });
  };

  const handleReviewButtonPress = () => {
    navigation.navigate('StudentReviewOrder');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={foodCart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {/* <TouchableOpacity
              style={[
                styles.itemContent,
                selectedItems.includes(item.id) ? styles.selectedItem : null
              ]}
              onPress={() => toggleItemSelection(item.id)}
            > */}
              <Text style={styles.itemName}>{item.foodName}</Text>
              <Text style={styles.itemPrice}>Price: ${item.totalPrice}</Text>
              <Text style={styles.itemLocation}>Location: {item.location}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            {/* </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Text style={[styles.deleteButtonText, { fontSize: 16 }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>Total: P{calculateTotal().toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={handleReviewButtonPress}>
        <Text style={styles.review}>Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#800000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 18,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#FFA500',
  },
  selectedItem: {
    backgroundColor: 'white',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  itemPrice: {
    fontSize: 18,
    color: '#555',
    color: 'black',
  },
  itemLocation: {
    fontSize: 18,
    color: '#555',
    color: 'black',
  },
  itemQuantity: {
    fontSize: 18,
    color: '#555',
    color: 'black',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
  review: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'green', // Background color
    padding: 10, // Padding around the text
    borderRadius: 15, // Border radius for rounded corners
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
  }
});

export default StudentCartView;
