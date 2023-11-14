import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

function StudentOrderedList() {
  const [ordersWithStatus, setOrdersWithStatus] = useState([]);

  useEffect(() => {
    // Fetch the latest status for each order from Firebase (e.g., when the screen loads)
    fetchStatusFromFirebase();
  }, []);

  const fetchStatusFromFirebase = async () => {
    try {
      // Fetch data from your Realtime Firebase database using axios
      const response = await axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json');

      if (response.status === 200) {
        const data = response.data;

        // Convert the data object into an array of order items
        const orders = Object.values(data);

        // Update the local state with the fetched orders
        setOrdersWithStatus(orders);
      }
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ordered List</Text>
      <Text style={styles.sectionTitle}>Accepted Orders</Text>
      <FlatList
        data={ordersWithStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.acceptedOrderText}>Accepted Order Details</Text>
            <Text style={styles.paymentLabel}>Payment Method:</Text>
            <Text style={styles.paymentMethodValue}>{item.paymentMethod}</Text>
            <Text style={styles.pickLabel}>Pick Up Time:</Text>
            <Text style={styles.pickValue}>{item.pickUpTime}</Text>      
            {item.foodDetails && item.foodDetails.map((foodItem, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <Text style={styles.foodName}>{foodItem.foodName}</Text>
                <Text style={styles.foodPrice}>Price: ${foodItem.price}</Text>
                <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
              </View>
            ))}
            <View style={styles.statusContainer}>
              <Text style={styles.acceptedOrderText}>Status: {item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'maroon',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  card: {
    backgroundColor: '#ffbf00',
    padding: 16,
    margin: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
    elevation: 2,
    height:390,
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
});

export default StudentOrderedList;
