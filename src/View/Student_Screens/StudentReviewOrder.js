import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const StudentReviewOrder = ({ route }) => {
  const [reviewedCart, setReviewedCart] = useState([]);

  useEffect(() => {
    // Fetch the reviewed items from Firebase or use route.params.reviewedCart
    // You may need to adapt this part to your specific database structure
    // This example assumes the reviewed items are passed via route.params
    if (route.params && route.params.reviewedCart) {
      setReviewedCart(route.params.reviewedCart);
    }
  }, [route.params]);

  const calculateSubTotal = () => {
    return reviewedCart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reviewed Items</Text>
      <FlatList
        data={reviewedCart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.foodName}</Text>
            <Text style={styles.itemPrice}>Price: ${item.price}</Text>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total Cost: ${calculateSubTotal().toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'maroon',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'white',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: '#FFA500',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: 'black',
  },
  quantityContainer: {
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    color: 'black',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color:'white',
  },
});

export default StudentReviewOrder;
