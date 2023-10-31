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

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

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
    const reviewedItems = foodCart.filter((item) => selectedItems.includes(item.id));
    const cartRef = ref(db, 'reviewedorder');
    set(cartRef, reviewedItems).then(() => {
      navigation.navigate('StudentReviewOrder', { reviewedCart: reviewedItems });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={foodCart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={[
                styles.itemContent,
                selectedItems.includes(item.id) ? styles.selectedItem : null
              ]}
              onPress={() => toggleItemSelection(item.id)}
            >
              <Text style={styles.itemName}>{item.foodName}</Text>
              <Text style={styles.itemPrice}>Price: ${item.price}</Text>
              <Text style={styles.itemLocation}>Location: {item.location}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>Total: P{calculateTotal().toFixed(2)}</Text>
      <Button title="Review" onPress={handleReviewButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  selectedItem: {
    backgroundColor: '#e0f7fa',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#555',
  },
  itemLocation: {
    fontSize: 14,
    color: '#777',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#777',
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
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default StudentCartView;
