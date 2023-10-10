import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../../Context/CartContext'; // Adjust the relative path as needed

export default function StudentCartView() {
  const { cart, removeFromCart } = useCart(); // Get the cart data and removeFromCart function from CartContext

  const handleRemoveItem = (itemIndex) => {
    removeFromCart(itemIndex);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cartHeader}>Your Cart:</Text>
      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.itemContainer, {borderColor: 'rgba(0, 0, 0, 0.5)' }]}>
            <Text style={styles.itemName}>Name: {item.name}</Text>
            <Text style={styles.itemPrice}>Price: ${item.price}</Text>
            <Text style={styles.itemType}>Type: {item.type}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(index)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            {/* Add more details if needed */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  cartHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 5,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#BC3648',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
