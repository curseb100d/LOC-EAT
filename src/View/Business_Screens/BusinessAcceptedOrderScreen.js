import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
            order.status = statusData[order.key];
          }
          return order;
        });

        setOrdersWithStatus(updatedOrders);
      }
    } catch (error) {
      console.error('Error fetching status data from Firebase:', error);
    }
  };

  const updateStatusOnFirebase = async (order) => {
    try {
      // Update the status for a specific order in Firebase
      await axios.patch(`https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json`, {
        status: order.status,
      });

      // Update the local state with the updated status
      const updatedOrders = ordersWithStatus.map((o) => (o.key === order.key ? order : o));
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
    updateStatusOnFirebase(updatedOrder);
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
      await axios.delete(`https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json`);
    } catch (error) {
      console.error('Error deleting item from Firebase:', error);
    }
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
            <Text style={styles.acceptedOrderText}>{`Payment Method: ${item.paymentMethod}`}</Text>
            <Text style={styles.acceptedOrderText}>{`Pick Up Time: ${item.pickUpTime}`}</Text>
            {item.foodDetails.map((foodItem, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <Text style={styles.foodName}>{foodItem.foodName}</Text>
                <Text style={styles.foodPrice}>Price: ${foodItem.price}</Text>
                <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
              </View>
            ))}
            <View style={styles.statusContainer}>
              <Text style={styles.acceptedOrderText}>Status:</Text>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: item.status === 'preparing' ? 'red' : 'lightgray' }]}
                onPress={() => handleStatusChange(item, 'preparing')}
              >
                <Text style={styles.statusButtonText}>Preparing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: item.status === 'finished' ? 'green' : 'lightgray' }]}
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
    backgroundColor: 'lightgray',
    padding: 16,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
    marginTop: 10,
  },
  foodItem: {
    marginVertical: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'maroon',
  },
  foodPrice: {
    fontSize: 14,
    color: 'maroon',
  },
  foodQuantity: {
    fontSize: 14,
    color: 'maroon',
  },
  acceptedOrderText: {
    fontSize: 16,
    color: 'maroon',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusButton: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    color: 'white',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: 'white',
  },
});

export default BusinessAcceptedOrderScreen;
