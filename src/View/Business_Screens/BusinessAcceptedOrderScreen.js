import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

function BusinessAcceptedOrderScreen({ route }) {
  const { acceptedOrders } = route.params;
  const [ordersWithStatus, setOrdersWithStatus] = useState(acceptedOrders);

  useEffect(() => {
    // Fetch the latest status for each order from Firebase (e.g., when the screen loads)
    fetchStatusFromFirebase();
  }, []);

  const fetchStatusFromFirebase = async () => {
    try {
      const response = await axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json');

      if (response.status === 200) {
        const statusData = response.data;

        // Update the status for each order
        const updatedOrders = ordersWithStatus.map((order) => {
          if (statusData[order.key]) {
            order.status = statusData[order.key].status;
          }
          return order;
        });

        setOrdersWithStatus(updatedOrders);
      }
    } catch (error) {
      console.error('Error fetching status data from Firebase:', error);
    }
  };

  const updateStatusOnFirebase = async (orderKey, newStatus) => {
    try {
      // Update the status for a specific order in Firebase
      await axios.patch(`https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood/${orderKey}.json`, {
        status: newStatus,
      });
  
      // Update the local state with the updated status
      const updatedOrders = ordersWithStatus.map((o) => (o.key === orderKey ? { ...o, status: newStatus } : o));
      setOrdersWithStatus(updatedOrders);
    } catch (error) {
      console.error('Error updating status on Firebase:', error);
    }
  };
  
  const handleStatusChange = (order, newStatus) => {
    // Update the status locally first
    const updatedOrder = { ...order, status: newStatus };
    const updatedOrders = ordersWithStatus.map((o) => (o.key === order.key ? updatedOrder : o));
    setOrdersWithStatus(updatedOrders);
  
    // Update the status on Firebase
    updateStatusOnFirebase(order.key, newStatus);
  };

  const handleDeleteItem = (itemToDelete) => {
    // Create a new array of items excluding the item to delete
    const updatedOrders = ordersWithStatus.filter((item) => item.key !== itemToDelete.key);
  
    // Update the state with the new array
    setOrdersWithStatus(updatedOrders);
  
    // Delete the item from Firebase
    deleteItemFromFirebase(itemToDelete.key);
  };
  
  const deleteItemFromFirebase = async (itemKey) => {
    try {
      // Send a DELETE request to remove the item from Firebase
      await axios.delete(`https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood/${itemKey}.json`);
    } catch (error) {
      console.error('Error deleting item from Firebase:', error);
    }
  };

  const handleOrder = (pickupOption) => {
    if (foodCart.length === 0) {
      Alert.alert('Error', 'Your cart is empty. Add items to your cart before placing an order.');
      return;
    }

    const foodDetails = foodCart.map((item) => ({
      foodName: item.foodName,
      price: item.totalPrice,
      quantity: item.quantity,
    }));

    const dataToSave = {
      foodDetails: foodDetails,
      paymentMethod: paymentMethod,
      pickUpTime: pickUpTime,
      status: 'Preparing', // Set the initial status here
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
      <Text style={styles.sectionTitle}>Accepted Orders</Text>
      <FlatList
        data={ordersWithStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.acceptedOrderText}>Accepted Order Details:</Text>
            <Text style={styles.paymentLabel}>Payment Method:</Text>
            <Text style={styles.paymentMethodValue}>{item.paymentMethod}</Text>
            <Text style={styles.pickLabel}>Pick Up Time:</Text>
            <Text style={styles.pickValue}>{item.pickUpTime}</Text>  
            {item.foodDetails.map((foodItem, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <Text style={styles.foodName}>{foodItem.foodName}</Text>
                <Text style={styles.foodPrice}>Price: ${foodItem.price}</Text>
                <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
              </View>
            ))}
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Status:</Text>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: item.status === 'preparing' ? '#ed9121' : '#ffbf00' }]}
                onPress={() => handleStatusChange(item, 'preparing')}
              >
                <Text style={styles.statusButtonText}>Preparing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton2, { backgroundColor: item.status === 'finished' ? 'green' : '#ffbf00' }]}
                onPress={() => handleStatusChange(item, 'finished')}
              >
                <Text style={styles.statusButtonText}>Finished</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
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
    backgroundColor: 'maroon',
  },
  card: {
    backgroundColor: '#ffbf00',
    padding: 16,
    margin: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
    elevation: 2,
    height:470,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
    marginTop: 10,
  },
  foodItem: {
    marginVertical: 10,
    bottom:35,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:20,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
  },
  foodPrice: {
    fontSize: 16,
    color: 'maroon',
  },
  foodQuantity: {
    fontSize: 16,
    color: 'maroon',
  },
  acceptedOrderText: {
    fontSize: 24,
    color: 'maroon',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    textAlign:'center',
    marginBottom:35,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom:35,
    left:25,
  },
  statusButton: {
    fontSize: 14,
    right:15,
    bottom:18,
    borderRadius:15,
    padding:6,
    width:100,
    justifyContent:'center',
    alignItems:'center',
  },
  statusButton2: {
    fontSize: 14,
    right:25,
    bottom:18,
    borderRadius:15,
    padding:6,
    width:100,
    justifyContent:'center',
    alignItems:'center',
  },
  statusButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight:'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 8,
    width:150,
    justifyContent:'center',
    alignItems:'center',
    left:80,
    bottom:40
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight:'bold',
  },
  paymentMethodValue: {
    fontSize: 18,
    color: 'maroon',
    bottom:25,
    left:175,
  },
  paymentLabel: {
    fontSize: 18,
    color: 'maroon',
    fontWeight:'bold',
    left:25,
  },
  pickLabel: {
    fontSize: 18,
    color: 'maroon',
    fontWeight:'bold',
    left:25,
    bottom:20,
  },
  pickValue: {
    fontSize: 18,
    color: 'maroon',
    bottom:44,
    left:150,
  },
  statusText: {
    fontSize: 18,
    color: 'maroon',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    textAlign:'center',
    marginBottom:35,
  }
});

export default BusinessAcceptedOrderScreen;
