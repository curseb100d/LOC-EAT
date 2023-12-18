import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, set, onValue, remove } from "firebase/database";
import { db } from '../../Components/config';

const StudentCartView = () => {
  const [foodCart, setFoodCart] = useState([]);
  const [foodmenus, setFoodMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const foodmenuRef = ref(db, 'foodmenu');
    const foodcartRef = ref(db, 'foodcart');

    const unsubscribeFoodmenu = onValue(foodmenuRef, (snapshot) => {
      if (snapshot.exists()) {
        const foodmenusData = snapshot.val();
        const foodmenusArray = Object.keys(foodmenusData).map((id) => ({
          id,
          ...foodmenusData[id],
          quantity: 0,
          totalPrice: 0,
        }));
        setFoodMenu(foodmenusArray);
      }
    });

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
      unsubscribeFoodmenu();
      unsubscribe();
    };
  }, []);

  const addToCart = (foodName, quantity) => {
    const updatedCart = [...foodCart];
    const foodmenuIndex = updatedCart.findIndex((item) => item.id === foodName.id);

    if (foodmenuIndex !== -1) {
      updatedCart[foodmenuIndex].quantity += quantity;
      if (updatedCart[foodmenuIndex].quantity <= 0) {
        // If quantity reaches 0, remove the item from the cart
        updatedCart.splice(foodmenuIndex, 1);
      } else {
        updatedCart[foodmenuIndex].totalPrice =
          updatedCart[foodmenuIndex].price * updatedCart[foodmenuIndex].quantity;
      }
    } else if (quantity > 0) {
      updatedCart.push({ ...foodName, quantity, totalPrice: foodName.price * quantity });
    }

    setFoodCart(updatedCart);

    // Update the cart data in Realtime Firebase
    const foodcartRef = ref(db, 'foodcart');
    set(foodcartRef, updatedCart);

    // Calculate the total quantity from the updatedCart and set it to the item.quantity
    const updatedFoodMenus = [...foodmenus];
    updatedFoodMenus.forEach((item) => {
      const cartItem = updatedCart.find((cartItem) => cartItem.id === item.id);
      item.quantity = cartItem ? cartItem.quantity : 0;
    });

    setFoodMenu(updatedFoodMenus);
  };

  const calculateTotal = () => {
    return foodCart.reduce((total, item) => total + item.price * item.quantity, 0);
    // return foodCart.reduce((total, item) => total + item.totalPrice, 0);
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
            <View
              style={[
                styles.itemContent
              ]}
            >
              <Text style={styles.itemName}>{item.foodName}</Text>
              <Text style={styles.itemPrice}>Price: ${item.totalPrice}</Text>
              <Text style={styles.itemLocation}>Location: {item.location}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            </View>
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: '#FFA500',
    marginTop:15,
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
    color: 'black',
  },
  itemQuantity: {
    fontSize: 18,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
    marginBottom: 10,
  },
  review: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'green', // Background color
    padding: 10, // Padding around the text
    borderRadius: 30, // Border radius for rounded corners
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StudentCartView;
