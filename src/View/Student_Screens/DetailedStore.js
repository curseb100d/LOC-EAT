import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';

const DetailedStore = ({ route }) => {
  const { storeData } = route.params;
  const navigation = useNavigation();

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Retrieve menu items (adjust the Firebase reference accordingly)
    const menuRef = ref(db, 'foodmenu');
    onValue(menuRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          const menuArray = Object.entries(data).map(([id, menuItem]) => ({ id, ...menuItem }));
          setMenu(menuArray);
        }
      }
    });
  }, [storeData]);

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

  const removeFromCart = (foodName, quantity) => {
    const updatedCart = [...cart];
    const foodmenuIndex = updatedCart.findIndex((item) => item.id === foodName.id);

    if (foodmenuIndex !== -1) {
      if (updatedCart[foodmenuIndex].quantity >= quantity) {
        updatedCart[foodmenuIndex].quantity -= quantity;
        updatedCart[foodmenuIndex].totalPrice = updatedCart[foodmenuIndex].price * updatedCart[foodmenuIndex].quantity;
        if (updatedCart[foodmenuIndex].quantity <= 0) {
          // If quantity reaches 0 or less, remove the item from the cart
          updatedCart.splice(foodmenuIndex, 1);
        }
      }
    }

    setCart(updatedCart);

    // Update the cart data in Realtime Firebase
    const cartRef = ref(db, 'foodcart');
    set(cartRef, updatedCart);
  };

  const navigateToReviewScreen = () => {
    navigation.navigate('ReviewScreen', { storeData });
    // Here, you can implement the logic to send the cart data to the 'reviewedorder' in Firebase
    // and then navigate to the review screen with the cart data.
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Store Details</Text>
      <View style={styles.storeContainer}>
        <Text style={styles.storeName}>{storeData.storeName}</Text>
        <Text>{`Status: ${storeData.status}`}</Text>
        <Text>{`Time Open: ${storeData.timeOpen}`}</Text>
        <Text>{`Email: ${storeData.email}`}</Text>
        <Text>{`First Name: ${storeData.firstName}`}</Text>
        <Text>{`Last Name: ${storeData.lastName}`}</Text>
        <Text>{`Location: ${storeData.location}`}</Text>
        <Text>{`Schedule: ${storeData.schedule}`}</Text>
      </View>

      <Text style={styles.menuHeading}>Store Menu</Text>

      <FlatList
        data={menu}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuItemName}>{item.foodName}</Text>
            <Text style={styles.menuItemPrice}>{`Price: $${item.price}`}</Text>
            <Text style={styles.menuItemDescription}>{item.foodDescription}</Text>
            <View style={styles.addToCartContainer}>
              <TouchableOpacity
                onPress={() => removeFromCart(item, 1)} // Change the quantity as needed
              >
                <Text style={styles.adjustQuantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0}
              </Text>
              <TouchableOpacity
                onPress={() => addToCart(item, 1)} // Change the quantity as needed
              >
                <Text style={styles.adjustQuantityButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.reviewButton} onPress={navigateToReviewScreen}>
        <Text style={styles.reviewButtonText}>View Reviews</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  storeContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  menuHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  menuItem: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemPrice: {
    fontSize: 16,
    color: 'maroon',
  },
  menuItemDescription: {
    fontSize: 14,
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  adjustQuantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
  },
  reviewButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  reviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DetailedStore;
