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
      <Text style={styles.header}>Your Orders</Text>
      <FlatList
        data={ordersWithStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderDetails}>Order Details</Text>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>{item.paymentMethod}</Text>
            <Text style={styles.label}>Pick Up Time:</Text>
            <Text style={styles.value}>{item.pickUpTime}</Text>
            {item.foodDetails && item.foodDetails.map((foodItem, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <Text style={styles.foodName}>{foodItem.foodName}</Text>
                <Text style={styles.foodPrice}>Price: ₱{foodItem.price}</Text>
                <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
              </View>
            ))}
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Estimated Time: {item.pickUpTime}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Status: {item.status}</Text>
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
    padding: 10,
    backgroundColor: 'maroon', // Attractive color
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF', // White text
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFD700', // Golden color
    padding: 16,
    margin: 10,
    borderRadius: 15,
    elevation: 2,
    height: 500,
  },
  orderDetails: {
    fontSize: 24,
    color: 'black', // Dark text
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  value: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  foodItem: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  foodPrice: {
    fontSize: 16,
    color: 'black',
  },
  foodQuantity: {
    fontSize: 16,
    color: 'black',
  },
  foodCarouselContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 35,
    left: 25,
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
});

export default StudentOrderedList;
