import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../Components/config';
import { ref, set } from 'firebase/database';

const StudentReviewOrder = () => {
  const route = useRoute();
  const foodCart = route.params?.cartData || [];
  const [isModalVisible, setModalVisible] = useState(false);
  const [pickUpTime, setPickUpTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Reservation');

  const calculateSubTotal = () => {
    return foodCart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

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
    // Data to be saved
    const dataToSave = {
      pickUpTime: pickUpTime,
      paymentMethod: paymentMethod,
    };

    // Database reference
    const dbRef = ref(db, '/review');

    set(dbRef, dataToSave)
      .then(() => {
        // Data saved successfully
        setModalVisible(false); // Close the modal or navigate to a success screen
      })
      .catch((error) => {
        console.error('Error saving data: ', error);
        // Handle error as needed
      });
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reviewed Items</Text>
      <FlatList
        data={foodCart} // Use the retrieved foodCart data
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
      <Text style={styles.modalLabel}>Choose Pick Up Time</Text>
      <TextInput
        style={styles.modalInput}
        placeholder="Time"
        value={pickUpTime}
        onChangeText={(text) => setPickUpTime(text)}
      />
      <Text style={styles.modalLabel}>Payment Method</Text>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Reservation" value="Reservation" />
      </Picker>
      <TouchableOpacity
        style={styles.buttonOrder}
        onPress={handleOrder}
        >
      <Text style={styles.buttonOrderText}>Place Order</Text>
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
    borderColor: '#ccc',
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
    borderColor:'black',
    borderWidth:1,
    borderRadius: 5,
    marginBottom: 10,
    marginTop:5,
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
    borderRadius: 15, // Border radius for rounded corners
    marginTop:15,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
  },
  buttonOrderText: {
    color:'white',
    fontWeight:'bold'
  },
  picker: {
    backgroundColor: 'white', // Set the background color to white
    marginTop:5,
    borderColor:'black',
    borderWidth:1,
  },
});

export default StudentReviewOrder;
