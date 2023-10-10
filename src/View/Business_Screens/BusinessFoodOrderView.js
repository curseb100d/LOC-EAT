import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCart } from '../../Context/CartContext';

export default function BusinessFoodOrderView() {
  const { cart, removeFromCart } = useCart();

  const handleCancelOrder = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cart.length > 0 ? (
        cart.map((item) => (
          <View style={styles.cartItem} key={item.id}>
            <Text style={styles.itemName}>Name: {item.name}</Text>
            <Text style={styles.itemPrice}>Price: ${item.price}</Text>
            <Text style={styles.itemType}>Type: {item.type}</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelOrder(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.emptyCart}>No items in the order.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  cartItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
  },
  itemType: {
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyCart: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
