import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../Components/config';
import { ref, set, push } from 'firebase/database';
import axios from 'axios';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import { getDownloadURL, ref as ref1, listAll } from 'firebase/storage';
import { storage } from '../../Components/config';

const StudentReviewOrder = () => {
  const [foodCart, setFoodCart] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Reservation');
  const [userEmail, setUserEmail] = useState(null);
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState({});

  const fetchImages = async (foodCart) => {
    for (let food of foodCart) {
      const listRef = ref1(storage, `food/${food.id}`);
      const imageList = await listAll(listRef);
      let downloadURLs = await Promise.all(imageList.items.map((imageRef) => getDownloadURL(imageRef)));
      if (downloadURLs.length > 0) {
        downloadURLs = downloadURLs.pop();
        setImages((prevImages) => ({
          ...prevImages,
          [food.id]: downloadURLs,
        }));
        setIsLoading(true);
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return unsubscribe;
  }, [auth]);

  const calculateSubTotal = () => {
    return foodCart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const fetchFoodCartData = () => {
    const firebaseURL = 'https://loc-eat-ddb73-default-rtdb.firebaseio.com/foodcart.json';

    axios.get(firebaseURL)
      .then((response) => {
        if (response.data) {
          const foodCartData = response.data;
          setFoodCart(foodCartData);
          fetchImages(foodCartData);
        } else {
          console.log('No data found in Firebase for foodcart.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  };

  useEffect(() => {
    fetchFoodCartData();
  }, []);

  const showOrderPrompt = () => {
    Alert.alert(
      'Order Details',
      `Total Cost: $${calculateSubTotal().toFixed(2)}`,
      [
        {
          text: 'Pick Up Now',
          onPress: () => handleOrder('Pick Up Now'),
        },
        {
          text: 'Pick Up Later',
          onPress: () => handleOrder('Pick Up Later'),
        },
      ],
      { cancelable: true }
    );
  };

  const handlePlaceOrder = () => {
    setModalVisible(true);
  };

  const handleOrder = (pickupOption) => {
    const firebaseURL = 'https://loc-eat-ddb73-default-rtdb.firebaseio.com/Users.json';
    if (foodCart.length === 0) {
      Alert.alert('Error', 'Your cart is empty. Add items to your cart before placing an order.');
      return;
    }

    const foodDetails = foodCart.map((item) => ({
      foodName: item.foodName,
      price: item.totalPrice,
      quantity: item.quantity,
      storeName: item.storeName,
      storeEmail: item.storeEmail
    }));

    const dataToSave = {
      pickUpTime: '',
      paymentMethod: paymentMethod,
      foodDetails: foodDetails,
      status: '',
      userEmail: userEmail,
      hasNotification: false,
    };

    const dbRef = ref(db, '/orderedFood');
    const newOrderRef = push(dbRef); // Generates a unique key for the order

    set(newOrderRef, dataToSave)
      .then(() => {
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error saving data: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reviewed Items</Text>
      <FlatList
        data={foodCart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.circularCard}>
              {isLoading && (
                <Image source={{ uri: images[item.id] }} style={{ width: 120, height: 120, borderRadius: 60 }} />
              )}
            </View>
            <Text style={styles.itemName}>{item.foodName}</Text>
            <Text style={styles.itemPrice}>Price: ₱{item.totalPrice}</Text>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total Cost: ₱{calculateSubTotal().toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.buttonOrder}>Place Order</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Payment Method</Text>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Dine in" value="Dine in" />
              <Picker.Item label="Take out" value="Take out" />
            </Picker>
            <TouchableOpacity
              style={styles.buttonOrder}
              onPress={handleOrder}
            >
              <Text style={styles.buttonOrderText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 18,
    backgroundColor: '#FFA500',
    width: '90%',
    left: 18,
    marginTop: 18,
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  quantity: {
    fontSize: 16,
    color: 'black',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  modalInput: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  modalContent: {
    backgroundColor: '#FFEC64',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  buttonOrder: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'green', // Background color
    padding: 10, // Padding around the text
    borderRadius: 30, // Border radius for rounded corners
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
  },
  buttonOrderText: {
    color: 'white',
    fontWeight: 'bold'
  },
  picker: {
    backgroundColor: 'white', // Set the background color to white
    marginTop: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  circularCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white', // Customize the color of the circular card
    margin: 10,
  },
});

export default StudentReviewOrder;