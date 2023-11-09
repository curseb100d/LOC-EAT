import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const StudentDetailedStore = ({ route }) => {
  const { storeData } = route.params;
  const [foodmenus, setFoodMenu] = useState([]);
  const navigation = useNavigation();

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products from the database
  useEffect(() => {
    const foodmenuRef = ref(db, 'foodmenu');
    const cartRef = ref(db, 'foodcart');

    // Listen for changes in the database and update the state
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

    const unsubscribeCart = onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const cartData = snapshot.val();
        setCart(cartData || []);
      }
    });

    // Clean up the listeners when the component unmounts
    return () => {
      unsubscribeFoodmenu();
      unsubscribeCart();
    };
  }, []);

  const addToCart = (foodName, quantity) => {
    const updatedCart = [...cart];
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

    setCart(updatedCart);

    // Update the cart data in Realtime Firebase
    const cartRef = ref(db, 'foodcart');
    set(cartRef, updatedCart);

    // Calculate the total quantity from the updatedCart and set it to the item.quantity
    const updatedFoodMenus = [...foodmenus];
    updatedFoodMenus.forEach((item) => {
      const cartItem = updatedCart.find((cartItem) => cartItem.id === item.id);
      item.quantity = cartItem ? cartItem.quantity : 0;
    });

    setFoodMenu(updatedFoodMenus);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateTotalQuantity = () => {
    return cart.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
  };

  const navigateToReviewScreen = () => {
    // Here, you can implement the logic to send the cart data to the 'reviewedorder' in Firebase
    // and then navigate to the review screen with the cart data.
    navigation.navigate('StudentReviewScreen', { storeData });
  };

  const navigateToCartScreen = () => {
    // Here, you can implement the logic to send the cart data to the 'reviewedorder' in Firebase
    // and then navigate to the review screen with the cart data.
    navigation.navigate('StudentCartView');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Store Details</Text>
      <View style={styles.storeContainer}>
        <Text style={styles.storeName}>{storeData.storeName}</Text>
        <Text>{`Status: ${storeData.status}`}</Text>
        <Text>{`Time Open: ${storeData.timeOpen}`}</Text>
        <Text>{`Location: ${storeData.location}`}</Text>
        <Text>{`Schedule: ${storeData.schedule}`}</Text>
      </View>

      <Text style={styles.menuHeading}>Store Menu</Text>

      <ScrollView style={{ padding: 15 }}>
        <FlatList
          data={foodmenus}
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
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={navigateToCartScreen}>
          <Text style={styles.cartButtonText}>CART</Text>
        </TouchableOpacity>
        <Text style={styles.total}>{calculateTotalQuantity()}x Total Calculated: P{calculateTotal()}</Text>
      </View>
      <TouchableOpacity style={styles.reviewButton} onPress={navigateToReviewScreen}>
        <Text style={styles.reviewButtonText}>View Reviews</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#800000',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  storeContainer: {
    backgroundColor: '#FFA500',
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
    color: 'white',
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
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  cartButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 16,
  },
  reviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
    cartButtonText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'right',
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    marginVertical: 8,
    borderRadius: 30,
    backgroundColor: '#FFA500',
    elevation: 2,
    marginBottom: 10,
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
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default StudentDetailedStore;
