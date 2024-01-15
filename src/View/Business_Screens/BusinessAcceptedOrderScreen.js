import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

function BusinessAcceptedOrderScreen({ route }) {
  const { acceptedOrders } = route.params;
  const [ordersWithStatus, setOrdersWithStatus] = useState(acceptedOrders);
  const [orderId, setOrderId] = useState('');

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
            order.pickUpTime = statusData[order.key].pickUpTime; // Update pickUpTime
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
        hasNotification: true
      });

      // Update the local state with the updated status
      const updatedOrders = ordersWithStatus.map((o) => (o.key === orderKey ? { ...o, status: newStatus } : o));
      setOrdersWithStatus(updatedOrders);
    } catch (error) {
      console.error('Error updating status on Firebase:', error);
    }
  };

  const handlePickerChange = async (selectedItem, selectedValue) => {
    try {
      // Update the pickUpTime for a specific order in Firebase
      await axios.patch(`https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood/${selectedItem.key}.json`, {
        pickUpTime: selectedValue,
      });

      // Update the local state with the updated pickUpTime
      const updatedOrders = ordersWithStatus.map((o) => (o.key === selectedItem.key ? { ...o, pickUpTime: selectedValue } : o));
      setOrdersWithStatus(updatedOrders);
    } catch (error) {
      console.error('Error updating pickUpTime on Firebase:', error);
    }
  };

  const handleStatusChange = (order, newStatus) => {
    // Update the status locally first
    order.foodDetails.forEach((foodItem) => {
      setOrderId(foodItem.key);
    });
    const updatedOrder = { ...order, status: newStatus, hasNotification: true };
    const updatedOrders = ordersWithStatus.map((o) => (o.key === orderId ? updatedOrder : o));

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

  const renderPicker = (selectedItem) => {
    return (
      <Picker
        selectedValue={selectedItem.pickUpTime}
        style={styles.input}
        onValueChange={(itemValue) => handlePickerChange(selectedItem, itemValue)}
      >
        <Picker.Item label="Select Prepartion Time" value="" enabled={false} />
        <Picker.Item label="1 minute" value="1 minute" />
        <Picker.Item label="2 minutes" value="2 minutes" />
        <Picker.Item label="5 minutes" value="5 minutes" />
        <Picker.Item label="10 minutes" value="10 minutes" />
        <Picker.Item label="30 minutes" value="30 minutes" />
        <Picker.Item label="1 hour" value="1 hour" />
      </Picker>
    );
  };
  console.log(ordersWithStatus[0].foodDetails)
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Accepted Orders</Text>
      <FlatList
        data={ordersWithStatus}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.acceptedOrderText}>Accepted Order Details:</Text>
            <Text style={styles.paymentLabel}>Payment Method:</Text>
            <Text style={styles.paymentMethodValue}>{item.paymentMethod}</Text>
            <Text style={styles.pickLabel}>Pick Up Time:</Text>
            <Text style={styles.pickValue}>{item.pickUpTime}</Text>
            {item.foodDetails.map((foodItem) => (
              <View key={foodItem} style={styles.foodItem}>
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
              <TouchableOpacity
                style={[styles.statusButton3, { backgroundColor: item.status === 'claimed' ? 'red' : '#ffbf00' }]}
                onPress={() => handleStatusChange(item, 'claimed')}
              >
                <Text style={styles.statusButtonText}>Claimed</Text>
              </TouchableOpacity>
            </View>
            {renderPicker(item)}
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
    height: 380,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
    marginTop: 10,
  },
  foodItem: {
    marginVertical: 10,
    bottom: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 35,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    bottom: 35,
    left: 32,
    marginBottom: 20,
  },
  statusButton: {
    fontSize: 14,
    right: 25,
    bottom: 17,
    borderRadius: 15,
    padding: 6,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButton2: {
    fontSize: 14,
    right: 25,
    bottom: 17,
    borderRadius: 15,
    padding: 6,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButton3: {
    fontSize: 14,
    right: 25,
    bottom: 17,
    borderRadius: 15,
    padding: 6,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 35,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    left: 80,
    bottom: 40
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  paymentMethodValue: {
    fontSize: 18,
    color: 'maroon',
    bottom: 39,
    left: 160,
  },
  paymentLabel: {
    fontSize: 18,
    color: 'maroon',
    fontWeight: 'bold',
    left: 4,
    marginBottom: 15,
  },
  pickLabel: {
    fontSize: 18,
    color: 'maroon',
    fontWeight: 'bold',
    left: 4,
    bottom: 20,
    marginBottom: 15,
  },
  pickValue: {
    fontSize: 18,
    color: 'maroon',
    bottom: 60,
    left: 130,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 10,
    marginBottom: 35,
    marginTop: -60,
  },
  statusText: {
    fontSize: 18,
    color: 'maroon',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 35,
    right: 30,
  }
});

export default BusinessAcceptedOrderScreen;